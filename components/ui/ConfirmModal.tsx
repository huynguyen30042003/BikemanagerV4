"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, Info, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isLoading, onClose]);

  if (!mounted || !open) return null;

  const variantConfig = {
    danger: {
      icon: Trash2,
      iconWrapper:
        "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      buttonVariant: "destructive" as const,
    },
    warning: {
      icon: AlertTriangle,
      iconWrapper:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      buttonVariant: "default" as const,
    },
    info: {
      icon: Info,
      iconWrapper:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      buttonVariant: "default" as const,
    },
  }[variant];

  const Icon = variantConfig.icon;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={isLoading ? undefined : onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Box */}
      <div
        role="alertdialog"
        aria-modal="true"
        className={cn(
          "relative z-50 w-full max-w-md rounded-2xl bg-card border border-border/80 p-6 shadow-2xl",
          "animate-in zoom-in-95 duration-200 ease-out space-y-4"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
              variantConfig.iconWrapper
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">{title}</h2>
          </div>
        </div>

        {description && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs h-9 px-4 cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variantConfig.buttonVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="text-xs h-9 px-4 cursor-pointer font-medium"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : null}
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
