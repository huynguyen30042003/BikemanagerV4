"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { DH_DonHang, AddLichSuThanhToanPayload } from "@/types/donHang";
import { toast } from "sonner";

export interface OrderPaymentModalProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: DH_DonHang | null;
  paymentMethodOptions: SelectOption[];
  isLoadingPaymentMethods: boolean;
  onSubmit: (data: AddLichSuThanhToanPayload) => Promise<void> | void;
  isPaying: boolean;
}

export const OrderPaymentModal: React.FC<OrderPaymentModalProps> = ({
  open,
  onClose,
  selectedOrder,
  paymentMethodOptions,
  isLoadingPaymentMethods,
  onSubmit,
  isPaying,
}) => {
  const [dataPayment, setDataPayment] = useState<AddLichSuThanhToanPayload>({
    DonHangID: "",
    MaGiaoDich: "",
    PhuongTucThanhToanID: 78,
    SoTien: 0,
    GhiChu: "",
  });

  useEffect(() => {
    if (open && selectedOrder) {
      setDataPayment({
        DonHangID: selectedOrder.donHangID,
        MaGiaoDich: `PAY-${Date.now().toString().slice(-6)}`,
        PhuongTucThanhToanID: 78,
        SoTien: Math.max(
          0,
          selectedOrder.conNo ||
            selectedOrder.tongTien - selectedOrder.daThanhToan
        ),
        GhiChu: "",
      });
    }
  }, [open, selectedOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dataPayment.SoTien <= 0) {
      toast.warning("Số tiền thanh toán phải lớn hơn 0!");
      return;
    }
    await onSubmit(dataPayment);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Ghi Nhận Thu Tiền / Thanh Toán"
      description={`Lập phiếu thu cho đơn hàng ${selectedOrder?.maDonHang || "—"}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Phương thức thanh toán (Từ danh mục chi tiết)
          </label>
          <SearchSelect
            options={paymentMethodOptions}
            value={String(dataPayment.PhuongTucThanhToanID)}
            onChange={(val) =>
              setDataPayment((prev) => ({
                ...prev,
                PhuongTucThanhToanID: Number(val),
              }))
            }
            isLoading={isLoadingPaymentMethods}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Số tiền thu (đ)
          </label>
          <Input
            type="number"
            min={1000}
            value={dataPayment.SoTien}
            onChange={(e) =>
              setDataPayment((prev) => ({
                ...prev,
                SoTien: parseInt(e.target.value) || 0,
              }))
            }
            className="text-xs font-mono font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Mã giao dịch / Biên lai ngân hàng
          </label>
          <Input
            type="text"
            value={dataPayment.MaGiaoDich}
            onChange={(e) =>
              setDataPayment((prev) => ({
                ...prev,
                MaGiaoDich: e.target.value,
              }))
            }
            className="text-xs font-mono"
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
            disabled={isPaying}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer font-medium"
          >
            {isPaying ? "Đang xử lý..." : "Xác nhận thu tiền"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
