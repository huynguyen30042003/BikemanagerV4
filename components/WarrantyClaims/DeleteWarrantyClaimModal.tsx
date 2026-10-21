"use client";

import React from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useDeletePhieuBaoHanh } from "@/hooks/BaoHanh/useBaoHanhApi";
import { BH_PhieuBaoHanh } from "@/types/baoHanh";

interface DeleteWarrantyClaimModalProps {
  open: boolean;
  item: BH_PhieuBaoHanh | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DeleteWarrantyClaimModal({
  open,
  item,
  onClose,
  onSuccess,
}: DeleteWarrantyClaimModalProps) {
  const deleteMutation = useDeletePhieuBaoHanh();

  const handleConfirm = async () => {
    if (!item?.phieuBaoHanhID) return;

    try {
      await deleteMutation.mutateAsync(item.phieuBaoHanhID);
      toast.success(`Đã xóa phiếu tiếp nhận bảo hành ${item.maPhieuBaoHanh}!`);
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể xóa phiếu bảo hành!";
      toast.error(message);
    }
  };

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={deleteMutation.isPending}
      title="Xóa Phiếu Tiếp Nhận Bảo Hành"
      description={`Bạn có chắc chắn muốn xóa phiếu bảo hành "${item?.maPhieuBaoHanh}" (${item?.tenKhachHang || "Khách hàng"})? Thao tác này không thể hoàn tác.`}
      confirmText="Xóa phiếu"
      cancelText="Đóng"
      variant="danger"
    />
  );
}
