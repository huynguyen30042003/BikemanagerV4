"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { DH_DonHang, ChuyenTrangThaiDonHangPayload } from "@/types/donHang";

export interface OrderStatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: DH_DonHang | null;
  orderStatusOptions: SelectOption[];
  isLoadingOrderStatuses: boolean;
  onSubmit: (data: ChuyenTrangThaiDonHangPayload) => Promise<void> | void;
  isChangingStatus: boolean;
}

export const OrderStatusChangeModal: React.FC<OrderStatusChangeModalProps> = ({
  open,
  onClose,
  selectedOrder,
  orderStatusOptions,
  isLoadingOrderStatuses,
  onSubmit,
  isChangingStatus,
}) => {
  const [dataStatusChange, setDataStatusChange] =
    useState<ChuyenTrangThaiDonHangPayload>({
      DonHangID: "",
      TrangThaiDonHangID: 71,
      GhiChu: "",
    });

  useEffect(() => {
    if (open && selectedOrder) {
      setDataStatusChange({
        DonHangID: selectedOrder.donHangID,
        TrangThaiDonHangID: selectedOrder.trangThaiDonHangID,
        GhiChu: "",
      });
    }
  }, [open, selectedOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(dataStatusChange);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chuyển Trạng Thái Đơn Hàng"
      description={`Cập nhật quy trình vận chuyển / xử lý của đơn ${selectedOrder?.maDonHang || "—"}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Trạng thái tiếp theo (Từ danh mục chi tiết)
          </label>
          <SearchSelect
            options={orderStatusOptions}
            value={Number(dataStatusChange.TrangThaiDonHangID)}
            onChange={(val) =>
              setDataStatusChange((prev) => ({
                ...prev,
                TrangThaiDonHangID: Number(val),
              }))
            }
            isLoading={isLoadingOrderStatuses}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú chuyển trạng thái
          </label>
          <Textarea
            placeholder="VD: Đã đóng gói xong và bàn giao cho đơn vị vận chuyển..."
            rows={3}
            value={dataStatusChange.GhiChu || ""}
            onChange={(e) =>
              setDataStatusChange((prev) => ({
                ...prev,
                GhiChu: e.target.value,
              }))
            }
            className="text-xs"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isChangingStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {isChangingStatus ? "Đang lưu..." : "Xác nhận chuyển"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
