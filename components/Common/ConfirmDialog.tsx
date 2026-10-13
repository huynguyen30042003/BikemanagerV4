"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Info,
} from "lucide-react";

type ConfirmDialogVariant =
  | "delete"
  | "warning"
  | "success"
  | "info";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;
  error?: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
  variant?: ConfirmDialogVariant;

  onConfirm: () => void;
}

const variantConfig = {
  delete: {
    icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    buttonVariant: "default" as const,
  },
  success: {
    icon: CheckCircle2,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    buttonVariant: "default" as const,
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonVariant: "default" as const,
  },
};

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  error,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  loading = false,
  variant = "warning",
  onConfirm,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${config.iconBg}`}
            >
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>

            <DialogTitle>{title}</DialogTitle>
          </div>

          {description && (
            <DialogDescription className="pt-2">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <p className="text-xs text-destructive">
          {error}
        </p>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {cancelText}
          </Button>

          <Button
            variant={config.buttonVariant}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Đang xử lý..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}