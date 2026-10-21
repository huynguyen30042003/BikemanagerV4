"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { NH_DonNhapHang, ChuyenTrangThaiDonNhapPayload } from "@/types/donNhapHang";

export interface PurchaseOrderStatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: NH_DonNhapHang | null;
  orderStatusOptions: SelectOption[];
  isLoadingStatuses?: boolean;
  isCompletedStatus: (statusId?: number | null) => boolean;
  onSubmit: (data: ChuyenTrangThaiDonNhapPayload) => Promise<void> | void;
  isChangingStatus: boolean;
}

export const PurchaseOrderStatusChangeModal: React.FC<
  PurchaseOrderStatusChangeModalProps
> = ({
  open,
  onClose,
  selectedOrder,
  orderStatusOptions,
  isLoadingStatuses = false,
  isCompletedStatus,
  onSubmit,
  isChangingStatus,
}) => {
  const [dataStatusChange, setDataStatusChange] =
    useState<ChuyenTrangThaiDonNhapPayload>({
      DonNhapHangID: "",
      TrangThaiID: 66,
      GhiChu: "",
    });

  useEffect(() => {
    if (open && selectedOrder) {
      setDataStatusChange({
        DonNhapHangID: selectedOrder.donNhapHangID,
        TrangThaiID: selectedOrder.trangThaiID,
        GhiChu: "",
      });
    }
  }, [open, selectedOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(dataStatusChange);
  };

  const isCompleted = isCompletedStatus(selectedOrder?.trangThaiID);

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Đổi Trạng Thái Đơn Nhập Hàng"
      description={`Cập nhật quy trình phê duyệt & nhập kho cho đơn ${
        selectedOrder?.maDonNhap || ""
      }`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {isCompleted && (
          <div className="p-3 text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-500/20">
            Lưu ý: Đơn hàng đã ở trạng thái hoàn thành (nhập kho thành công), không thể chuyển trạng thái khác!
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Trạng thái mới <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn trạng thái..."
            options={orderStatusOptions.map((opt) => ({
              value: String(opt.value),
              label: opt.label,
            }))}
            value={String(dataStatusChange.TrangThaiID)}
            onChange={(val) =>
              setDataStatusChange((prev) => ({
                ...prev,
                TrangThaiID: Number(val),
              }))
            }
            isLoading={isLoadingStatuses}
            disabled={isCompleted}
            height={10}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Lý do / Ghi chú chuyển trạng thái
          </label>
          <Textarea
            rows={3}
            placeholder="Nhập lý do phê duyệt, lý do từ chối hoặc hướng dẫn kiểm đếm..."
            value={dataStatusChange.GhiChu || ""}
            onChange={(e) =>
              setDataStatusChange((prev) => ({
                ...prev,
                GhiChu: e.target.value,
              }))
            }
            className="text-xs"
            disabled={isCompleted}
          />
        </div>

        <div className="pt-3 border-t border-border flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isChangingStatus || isCompleted}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {isChangingStatus ? "Đang lưu..." : "Xác nhận chuyển trạng thái"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
export default PurchaseOrderStatusChangeModal;
