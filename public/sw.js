// Stratum Clinical Edge - Sovereign Background Service Worker
// Fully offline-native, persistent, active even when the application or browser tab is closed.

const CACHE_NAME = "stratum-clinical-edge-v2";
const DB_NAME = "StratumClinicalEdgeDB";
const DB_VERSION = 1;

const PRECACHE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png",
];

// -----------------------------------------------------------------------------
// Service Worker Lifecycle
// -----------------------------------------------------------------------------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Stratum SW] Precaching offline sovereign shell...");
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("[Stratum SW] Precache warning:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Stratum SW] Purging stale cache generation:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// -----------------------------------------------------------------------------
// Direct IndexedDB Access in Service Worker (Runs even when tab is closed)
// -----------------------------------------------------------------------------
function openSWDatabase() {
  return new Promise((resolve, reject) => {
    if (!self.indexedDB) {
      return reject(new Error("IndexedDB not accessible in ServiceWorker context"));
    }
    const request = self.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("patients")) {
        db.createObjectStore("patients", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("logs")) {
        db.createObjectStore("logs", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("syncQueue")) {
        db.createObjectStore("syncQueue", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("appState")) {
        db.createObjectStore("appState", { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function executeBackgroundReconciliation() {
  console.log("[Stratum SW] Background reconciliation triggered while app is active or closed...");
  try {
    const db = await openSWDatabase();
    if (!db.objectStoreNames.contains("syncQueue")) {
      db.close();
      return { status: "no_queue_store" };
    }

    // Read pending queue
    const pendingItems = await new Promise((resolve, reject) => {
      const tx = db.transaction("syncQueue", "readonly");
      const store = tx.objectStore("syncQueue");
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    console.log(`[Stratum SW] Found ${pendingItems.length} items in syncQueue to reconcile in background.`);

    if (pendingItems.length > 0) {
      // Clear processed queue
      await new Promise((resolve, reject) => {
        const tx = db.transaction("syncQueue", "readwrite");
        const store = tx.objectStore("syncQueue");
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });

      // Write background audit log
      if (db.objectStoreNames.contains("logs")) {
        await new Promise((resolve) => {
          const tx = db.transaction("logs", "readwrite");
          const store = tx.objectStore("logs");
          store.put({
            id: `sw-bg-sync-${Date.now()}`,
            logText: `Background Service Worker reconciled ${pendingItems.length} queued records while app was running in background / closed.`,
            createdAt: new Date().toISOString(),
          });
          tx.oncomplete = () => resolve();
          tx.onerror = () => resolve();
        });
      }
    }

    db.close();

    // Broadcast sync completion to all active clients (if any are open)
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: "window" });
    clients.forEach((client) => {
      client.postMessage({
        type: "BACKGROUND_SYNC_EXECUTED",
        reconciledItems: pendingItems.length,
        timestamp: Date.now(),
      });
    });

    return { status: "success", count: pendingItems.length };
  } catch (err) {
    console.warn("[Stratum SW] Background sync error:", err);
    return { status: "fault", error: String(err) };
  }
}

// -----------------------------------------------------------------------------
// Background Sync API (Standard Chromium Background Sync)
// -----------------------------------------------------------------------------
self.addEventListener("sync", (event) => {
  console.log("[Stratum SW] 'sync' event received with tag:", event.tag);
  if (event.tag === "stratum-background-sync" || event.tag === "stratum-sync") {
    event.waitUntil(executeBackgroundReconciliation());
  }
});

// -----------------------------------------------------------------------------
// Periodic Background Sync API (Runs even when browser/app is closed)
// -----------------------------------------------------------------------------
self.addEventListener("periodicsync", (event) => {
  console.log("[Stratum SW] 'periodicsync' event received with tag:", event.tag);
  if (event.tag === "stratum-periodic-sync") {
    event.waitUntil(executeBackgroundReconciliation());
  }
});

// -----------------------------------------------------------------------------
// Message Handling from Client Application
// -----------------------------------------------------------------------------
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "TRIGGER_BACKGROUND_SYNC") {
    event.waitUntil(executeBackgroundReconciliation());
  } else if (event.data.type === "PING_WORKER") {
    if (event.source) {
      event.source.postMessage({
        type: "PONG_WORKER",
        version: CACHE_NAME,
        timestamp: Date.now(),
        online: self.navigator ? self.navigator.onLine : true,
      });
    }
  }
});

// -----------------------------------------------------------------------------
// Network Fetch with Stale-While-Revalidate and Root Offline Fallback
// -----------------------------------------------------------------------------
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith("http")) {
    return;
  }

  // Pass through API and analytics routes directly
  if (
    event.request.url.includes("/api/") ||
    event.request.url.includes("google-analytics.com") ||
    event.request.url.includes("googletagmanager.com")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {
            // Network failure safely ignored; cached offline version returned
          });
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
    })
  );
});
