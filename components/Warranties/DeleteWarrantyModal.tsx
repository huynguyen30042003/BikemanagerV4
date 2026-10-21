"use client";

import React from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useDeleteBaoHanh } from "@/hooks/BaoHanh/useBaoHanhApi";
import { BH_BaoHanh } from "@/types/baoHanh";

interface DeleteWarrantyModalProps {
  open: boolean;
  item: BH_BaoHanh | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteWarrantyModal({
  open,
  item,
  onClose,
  onSuccess,
}: DeleteWarrantyModalProps) {
  const deleteMutation = useDeleteBaoHanh();

  const handleConfirm = async () => {
    if (!item?.baoHanhID) return;

    try {
      await deleteMutation.mutateAsync(item.baoHanhID);
      toast.success(`Đã hủy sổ bảo hành ${item.maBaoHanh}!`);
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể hủy sổ bảo hành!";
      toast.error(message);
    }
  };

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={deleteMutation.isPending}
      title="Hủy Sổ Bảo Hành Điện Tử"
      description={`Bạn có chắc chắn muốn hủy sổ bảo hành "${item?.maBaoHanh}" (${item?.maSerial || "Chưa có serial"})? Thao tác này không thể hoàn tác.`}
      confirmText="Hủy sổ bảo hành"
      cancelText="Đóng"
      variant="danger"
    />
  );
}
