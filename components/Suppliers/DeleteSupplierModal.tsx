"use client";

import React from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useDeleteNhaCungCap } from "@/hooks/NhaCungCap/useNhaCungCapApi";
import { NH_NhaCungCap } from "@/types/nhaCungCap";

interface DeleteSupplierModalProps {
  open: boolean;
  onClose: () => void;
  supplier: NH_NhaCungCap | null;
  onSuccess?: () => void;
}

export function DeleteSupplierModal({
  open,
  onClose,
  supplier,
  onSuccess,
}: DeleteSupplierModalProps) {
  const deleteMutation = useDeleteNhaCungCap();

  const handleConfirm = async () => {
    if (!supplier?.nhaCungCapID) return;
    try {
      await deleteMutation.mutateAsync(supplier.nhaCungCapID);
      toast.success("Xóa nhà cung cấp thành công!");
      onClose();
      onSuccess?.();
    } catch {
      toast.error(
        "Không thể xóa nhà cung cấp. Có thể đối tác này đã phát sinh đơn nhập hàng hoặc công nợ!",
      );
    }
  };

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={deleteMutation.isPending}
      title="Xóa Nhà Cung Cấp"
      description={`Bạn có chắc chắn muốn xóa đối tác "${
        supplier?.tenNhaCungCap || ""
      }"? Hành động này sẽ không thể khôi phục.`}
      confirmText="Xác nhận xóa"
      variant="danger"
    />
  );
}

export default DeleteSupplierModal;
