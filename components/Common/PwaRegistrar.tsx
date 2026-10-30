"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaRegistrar() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  useEffect(() => {
    // 1. Kiểm tra nếu app đã chạy ở chế độ standalone (đã cài đặt)
    const isRunningStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // 2. Đăng ký Service Worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            // Kiểm tra cập nhật định kỳ
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (
                    installingWorker.state === "installed" &&
                    navigator.serviceWorker.controller
                  ) {
                    console.log("[PWA] Phiên bản mới đã sẵn sàng. Tải lại để cập nhật.");
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.error("[PWA] Service Worker đăng ký thất bại:", err);
          });
      });
    }

    // 3. Bắt sự kiện beforeinstallprompt (Chrome, Edge, Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Kiểm tra nếu người dùng chưa bấm từ chối trong vòng 7 ngày qua
      const dismissedTime = localStorage.getItem("pwa_install_dismissed");
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (!dismissedTime || Date.now() - parseInt(dismissedTime, 10) > sevenDays) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Bắt sự kiện khi app đã được cài đặt thành công
    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
      console.log("[PWA] Ứng dụng đã được cài đặt thành công.");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    localStorage.setItem("pwa_install_dismissed", Date.now().toString());
  };

  if (isStandalone || !showInstallBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-install-title"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-full mx-auto p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-3">
        <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-white p-1">
          <Image
            src="/icons/icon-192x192.png"
            alt="Bike Manager App Icon"
            width={48}
            height={48}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <h4
            id="pwa-install-title"
            className="text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            Cài đặt ứng dụng Bike Manager
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
            Cài về màn hình chính để mở nhanh, mượt mà và hoạt động toàn màn hình.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Cài đặt ngay
            </button>
            <button
              onClick={handleDismiss}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Để sau
            </button>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer shrink-0"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

