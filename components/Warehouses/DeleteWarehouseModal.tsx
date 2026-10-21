"use client";

import React from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useDeleteKho } from "@/hooks/Kho/useKhoApi";
import { KHO_Kho } from "@/types/kho";

interface DeleteWarehouseModalProps {
  open: boolean;
  onClose: () => void;
  warehouse: KHO_Kho | null;
  onSuccess?: () => void;
}

export function DeleteWarehouseModal({
  open,
  onClose,
  warehouse,
  onSuccess,
}: DeleteWarehouseModalProps) {
  const deleteMutation = useDeleteKho();

  const handleConfirm = async () => {
    if (!warehouse?.khoID) return;
    try {
      await deleteMutation.mutateAsync(warehouse.khoID);
      onClose();
      onSuccess?.();
    } catch {
      // Toast được xử lý tự động trong hook useDeleteKho
    }
  };

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={deleteMutation.isPending}
      title="Xóa Kho Hàng"
      description={`Bạn có chắc chắn muốn xóa kho "${
        warehouse?.tenKho || ""
      }"? Dữ liệu tồn kho liên kết có thể bị ảnh hưởng.`}
      confirmText="Xác nhận xóa"
      variant="danger"
    />
  );
}

export default DeleteWarehouseModal;
