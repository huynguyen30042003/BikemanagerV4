"use client";

import React from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { SP_ThuongHieu } from "@/types/thuongHieu";

interface BrandsDeleteModalProps {
  brand: SP_ThuongHieu | null;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isLoading: boolean;
}

export const BrandsDeleteModal: React.FC<BrandsDeleteModalProps> = ({
  brand,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <ConfirmModal
      open={Boolean(brand)}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Xác nhận xóa thương hiệu"
      description={
        <div className="space-y-2">
          <p>
            Bạn có chắc chắn muốn xóa thương hiệu &quot;
            <strong className="text-foreground">{brand?.tenThuongHieu}</strong>
            &quot; không?
          </p>
          <span className="text-xs text-rose-600 dark:text-rose-400 block bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
            Lưu ý: Không thể xóa nếu thương hiệu này đang chứa các sản phẩm xe điện hoặc linh kiện phụ tùng đang lưu hành.
          </span>
        </div>
      }
      confirmText="Xác nhận xóa"
      variant="danger"
      isLoading={isLoading}
    />
  );
};
