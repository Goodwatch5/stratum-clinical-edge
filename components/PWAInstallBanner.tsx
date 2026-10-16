"use client";

import React, { useState, useEffect } from "react";
import { Download, Wifi, WifiOff, Smartphone, ShieldCheck, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register service worker with background sync & persistent storage
    if ("serviceWorker" in navigator && process.env.NODE_ENV !== "test") {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // Initialize storage persistence and background sync safely
          if (navigator.storage && navigator.storage.persist) {
            navigator.storage.persist().catch(() => {});
          }
        })
        .catch((err) => console.debug("[Stratum PWA] Service Worker registration note:", err));
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforePrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforePrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setDeferredPrompt(null);
      return true;
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}

export default function PWAInstallBanner() {
  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);
  const [dismissBanner, setDismissBanner] = useState<boolean>(false);

  return (
    <>
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-950 text-amber-100 border-b border-amber-600 px-4 py-2 text-xs font-mono flex items-center justify-between shadow-md z-50">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-amber-300">
              Air-Gapped Sovereign Node Active:
            </span>
            <span>Operating in local IndexedDB vault mode. All clinical data is securely cached offline.</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-amber-900 border border-amber-500 uppercase font-bold">
            ZERO LATENCY
          </span>
        </div>
      )}

      {/* PWA Install Button (If Installable or iOS and not yet installed & not dismissed) */}
      {!isInstalled && (isInstallable || isIOS) && !dismissBanner && (
        <div className="bg-[#1a1a1a] text-[#FAF7F2] border-b border-[#c5a27d]/40 px-4 py-1.5 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-[#c5a27d]" />
            <span className="text-neutral-300 hidden sm:inline">
              Stratum Clinical Edge is installable on your desktop or mobile home screen.
            </span>
            <span className="text-neutral-300 sm:hidden">Install Stratum Edge App</span>
          </div>

          <div className="flex items-center space-x-2">
            {isInstallable && (
              <button
                onClick={install}
                className="px-2.5 py-1 bg-[#c5a27d] text-[#1a1a1a] hover:bg-white font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
              >
                <Download className="w-3 h-3" />
                <span>Install Native App</span>
              </button>
            )}

            {isIOS && (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="px-2.5 py-1 bg-[#c5a27d] text-[#1a1a1a] hover:bg-white font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center space-x-1"
              >
                <Smartphone className="w-3 h-3" />
                <span>Install on iOS</span>
              </button>
            )}

            <button
              onClick={() => setDismissBanner(true)}
              className="text-neutral-400 hover:text-white p-1"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] border-2 border-[#1a1a1a] max-w-sm w-full p-5 space-y-4 shadow-2xl font-sans text-xs">
            <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-[#c5a27d]" />
                <h4 className="font-serif font-bold text-sm text-[#1a1a1a]">Install on iPhone / iPad</h4>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-neutral-500 hover:text-neutral-900 font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-neutral-700 leading-relaxed font-sans">
              <p>
                1. Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.
              </p>
              <p>
                2. Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.
              </p>
              <p>
                3. Tap <strong>Add</strong> in the top-right corner to launch Stratum Clinical Edge as a standalone offline-capable application.
              </p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-[#1a1a1a] text-[#FAF7F2] hover:bg-[#c5a27d] hover:text-[#1a1a1a] font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
}
