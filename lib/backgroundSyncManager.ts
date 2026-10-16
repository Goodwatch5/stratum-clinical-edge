/**
 * Stratum Clinical Edge - Sovereign Background Sync Manager
 * Manages Service Worker Background Sync, Periodic Background Sync,
 * and Persistent Non-Evictable Storage Quota.
 * 
 * Supports persistent execution:
 * 1. PWA Standalone Periodic Background Sync (runs even with app/browser closed).
 * 2. Background Sync on network reconnection (runs when offline mutations exist).
 * 3. Web Worker unthrottled background timer (keeps pulse active when tab is backgrounded).
 * 4. Persistent Storage Quota (prevents browser IndexedDB cache eviction).
 */

export interface BackgroundSyncStatus {
  isSupported: boolean;
  isRegistered: boolean;
  periodicSyncSupported: boolean;
  periodicSyncRegistered: boolean;
  isStoragePersisted: boolean;
  isStandalonePWA: boolean;
  lastBackgroundSyncTime: string | null;
  activeIntervalSeconds: number;
  message?: string;
}

const STORAGE_KEY_INTERVAL = "stratum_bg_sync_interval";
const STORAGE_KEY_LAST_SYNC = "stratum_bg_last_sync_time";

/**
 * Checks if the application is currently running as an installed standalone PWA.
 */
export function isRunningAsStandalonePWA(): boolean {
  if (typeof window === "undefined") return false;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
    document.referrer.includes("android-app://");
  return Boolean(isStandalone);
}

/**
 * Request persistent, non-evictable storage quota from browser.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.storage || !navigator.storage.persist) {
    return false;
  }
  try {
    const isPersisted = await navigator.storage.persisted();
    if (isPersisted) return true;
    const granted = await navigator.storage.persist();
    console.info("[Stratum Storage] Persistent storage quota granted:", granted);
    return granted;
  } catch {
    return false;
  }
}

/**
 * Register Background Sync and Periodic Sync safely without throwing InvalidAccessError.
 */
export async function registerBackgroundSync(intervalSeconds: number = 15): Promise<BackgroundSyncStatus> {
  const isPWA = isRunningAsStandalonePWA();
  const status: BackgroundSyncStatus = {
    isSupported: false,
    isRegistered: false,
    periodicSyncSupported: false,
    periodicSyncRegistered: false,
    isStoragePersisted: false,
    isStandalonePWA: isPWA,
    lastBackgroundSyncTime: null,
    activeIntervalSeconds: intervalSeconds,
  };

  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return status;
  }

  status.isSupported = true;

  try {
    // 1. Request persistent storage so the browser does not evict IndexedDB
    status.isStoragePersisted = await requestPersistentStorage();

    // 2. Ensure Service Worker is active
    const registration = await navigator.serviceWorker.ready;
    status.isRegistered = true;

    // Detect if running inside sandboxed iframe (like AI Studio Build preview)
    const isIframe = typeof window !== "undefined" && window.self !== window.top;

    // 3. Register standard Background Sync if supported (Chromium)
    // Runs when connectivity is restored even if user has navigated away or closed tab
    if ("sync" in registration && !isIframe) {
      try {
        await (registration as any).sync.register("stratum-sync");
        console.info("[Stratum Sync] One-shot background sync handler armed ('stratum-sync').");
      } catch (syncErr: any) {
        // Silently catch sandboxed window/invalid access errors
        console.debug("[Stratum Sync] Background sync registration notice:", syncErr?.message || syncErr);
      }
    }

    // 4. Register Periodic Background Sync (Runs periodically even when browser/app is closed)
    if ("periodicSync" in registration) {
      status.periodicSyncSupported = true;

      // In Chromium, periodicSync requires PWA standalone mode and explicit permission
      let hasPermission = false;
      if ("permissions" in navigator && !isIframe) {
        try {
          const perm = await (navigator.permissions as any).query({
            name: "periodic-background-sync",
          });
          hasPermission = perm && perm.state === "granted";
        } catch {
          // Some browsers throw on querying custom permission names
          hasPermission = isPWA;
        }
      } else if (isPWA) {
        hasPermission = true;
      }

      if (hasPermission && !isIframe) {
        try {
          const periodicSync = (registration as any).periodicSync;
          const tags = await periodicSync.getTags();
          if (!tags.includes("stratum-periodic-sync")) {
            // Chromium periodicSync minInterval is in milliseconds
            await periodicSync.register("stratum-periodic-sync", {
              minInterval: Math.max(intervalSeconds, 60) * 1000,
            });
            console.info("[Stratum Sync] Periodic Background Sync armed for closed-app execution.");
          }
          status.periodicSyncRegistered = true;
        } catch (periodicErr: any) {
          console.debug("[Stratum Sync] Periodic sync registration note:", periodicErr?.message || periodicErr);
        }
      }
    }

    // Save configuration
    localStorage.setItem(STORAGE_KEY_INTERVAL, intervalSeconds.toString());
    const storedLastTime = localStorage.getItem(STORAGE_KEY_LAST_SYNC);
    status.lastBackgroundSyncTime = storedLastTime || new Date().toLocaleTimeString();

    return status;
  } catch (err) {
    console.debug("[Stratum Sync] Background sync setup note:", err);
    return status;
  }
}

/**
 * Trigger immediate background sync execution in the Service Worker.
 */
export async function triggerImmediateServiceWorkerSync(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage({
        type: "TRIGGER_BACKGROUND_SYNC",
        timestamp: Date.now(),
      });
      return true;
    }
    return false;
  } catch (err) {
    console.debug("[Stratum Sync] Immediate SW sync trigger notice:", err);
    return false;
  }
}

/**
 * Listen for background sync completion events broadcast from the Service Worker.
 */
export function subscribeToServiceWorkerSyncEvents(
  onSyncCompleted: (data: { reconciledItems: number; timestamp: number }) => void
): () => void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return () => {};
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.data && event.data.type === "BACKGROUND_SYNC_EXECUTED") {
      const now = new Date().toLocaleTimeString();
      localStorage.setItem(STORAGE_KEY_LAST_SYNC, now);
      onSyncCompleted({
        reconciledItems: event.data.reconciledItems || 0,
        timestamp: event.data.timestamp || Date.now(),
      });
    }
  };

  navigator.serviceWorker.addEventListener("message", handleMessage);

  return () => {
    navigator.serviceWorker.removeEventListener("message", handleMessage);
  };
}

/**
 * Creates an unthrottled timer that continues firing every second
 * even when the tab is hidden, minimized, or in the background.
 * Uses an inline Web Worker to bypass Chromium's background tab timer clamping.
 */
export function createUnthrottledTimer(onTick: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  // Attempt Web Worker timer
  try {
    const code = `
      let timer = null;
      self.onmessage = function(e) {
        if (e.data === 'START') {
          if (!timer) {
            timer = setInterval(function() {
              self.postMessage('TICK');
            }, 1000);
          }
        } else if (e.data === 'STOP') {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }
      };
    `;
    const blob = new Blob([code], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      if (e.data === "TICK") {
        onTick();
      }
    };

    worker.postMessage("START");

    return () => {
      worker.postMessage("STOP");
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  } catch {
    // Fallback to standard window interval
    const interval = setInterval(onTick, 1000);
    return () => clearInterval(interval);
  }
}

/**
 * Screen Wake Lock Sentinel to keep the clinical screen active
 * and prevent sleep during patient telemetry or background sync.
 */
let wakeLockSentinel: any = null;

export async function requestScreenWakeLock(): Promise<boolean> {
  if (typeof window === "undefined" || !("wakeLock" in navigator)) {
    return false;
  }
  try {
    wakeLockSentinel = await (navigator as any).wakeLock.request("screen");
    wakeLockSentinel.addEventListener("release", () => {
      wakeLockSentinel = null;
    });
    console.info("[Stratum WakeLock] Screen wake lock acquired. Display will remain active.");
    return true;
  } catch (err: any) {
    console.debug("[Stratum WakeLock] Screen wake lock notice:", err?.message || err);
    return false;
  }
}

export async function releaseScreenWakeLock(): Promise<void> {
  if (wakeLockSentinel) {
    try {
      await wakeLockSentinel.release();
    } catch {
      // Ignore
    }
    wakeLockSentinel = null;
  }
}

/**
 * Native PWA Badging API to display pending records or active nodes
 * on the OS taskbar/dock icon even when the app is minimized or closed.
 */
export async function updateAppBadge(count?: number): Promise<void> {
  if (typeof window === "undefined" || !("setAppBadge" in navigator)) {
    return;
  }
  try {
    if (typeof count === "number" && count > 0) {
      await (navigator as any).setAppBadge(count);
    } else {
      await (navigator as any).clearAppBadge();
    }
  } catch {
    // Graceful fallback in environments without badging permission
  }
}

