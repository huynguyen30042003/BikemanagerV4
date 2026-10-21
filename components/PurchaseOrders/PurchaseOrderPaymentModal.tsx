"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { NH_DonNhapHang, ThanhToanDonNhapPayload } from "@/types/donNhapHang";
import { formatCurrency } from "./PurchaseOrdersKpiGrid";

export interface PurchaseOrderPaymentModalProps {
  open: boolean;
  onClose: () => void;
  selectedOrder: NH_DonNhapHang | null;
  paymentMethodOptions: SelectOption[];
  isLoadingPaymentMethods?: boolean;
  onSubmit: (data: ThanhToanDonNhapPayload) => Promise<void> | void;
  isPaying: boolean;
}

export const PurchaseOrderPaymentModal: React.FC<
  PurchaseOrderPaymentModalProps
> = ({
  open,
  onClose,
  selectedOrder,
  paymentMethodOptions,
  isLoadingPaymentMethods = false,
  onSubmit,
  isPaying,
}) => {
  const [dataPayment, setDataPayment] = useState<ThanhToanDonNhapPayload>({
    DonNhapHangID: "",
    MaGiaoDich: "",
    PhuongTucThanhToanID: 79,
    SoTien: 0,
    GhiChu: "",
  });

  useEffect(() => {
    if (open && selectedOrder) {
      setDataPayment({
        DonNhapHangID: selectedOrder.donNhapHangID,
        MaGiaoDich: `PAY-NCC-${Date.now().toString().slice(-6)}`,
        PhuongTucThanhToanID: Number(paymentMethodOptions[0]?.value) || 79,
        SoTien: selectedOrder.conNo || 0,
        GhiChu: `Thanh toán tiền hàng đơn ${selectedOrder.maDonNhap}`,
      });
    }
  }, [open, selectedOrder, paymentMethodOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(dataPayment);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Ghi Nhận Thanh Toán NCC"
      description={`Chi trả tiền hàng cho đơn nhập ${
        selectedOrder?.maDonNhap || ""
      }`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="p-3 bg-muted/40 rounded-lg border border-border/80 text-xs space-y-1">
          <div className="flex justify-between text-muted-foreground">
            <span>Tổng tiền đơn:</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(selectedOrder?.tongTien)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Đã thanh toán:</span>
            <span className="font-mono text-emerald-600 font-medium">
              {formatCurrency(selectedOrder?.daThanhToan)}
            </span>
          </div>
          <div className="flex justify-between font-bold pt-1 border-t border-border/60">
            <span>Còn nợ NCC:</span>
            <span className="font-mono text-rose-600 dark:text-rose-400">
              {formatCurrency(selectedOrder?.conNo)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Số tiền chi trả (đ) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            min={1}
            max={selectedOrder?.conNo || undefined}
            value={dataPayment.SoTien || 0}
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
            Phương thức thanh toán <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn phương thức..."
            options={paymentMethodOptions.map((opt) => ({
              value: String(opt.value),
              label: opt.label,
            }))}
            value={String(dataPayment.PhuongTucThanhToanID)}
            onChange={(val) =>
              setDataPayment((prev) => ({
                ...prev,
                PhuongTucThanhToanID: Number(val),
              }))
            }
            isLoading={isLoadingPaymentMethods}
            height={10}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Mã giao dịch / UNC / Biên lai
          </label>
          <Input
            type="text"
            placeholder="VD: UNC-VCB-883921"
            value={dataPayment.MaGiaoDich || ""}
            onChange={(e) =>
              setDataPayment((prev) => ({
                ...prev,
                MaGiaoDich: e.target.value,
              }))
            }
            className="text-xs font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú đợt thanh toán
          </label>
          <Textarea
            rows={2}
            placeholder="Nội dung chuyển khoản hoặc ghi chú thanh toán..."
            value={dataPayment.GhiChu || ""}
            onChange={(e) =>
              setDataPayment((prev) => ({
                ...prev,
                GhiChu: e.target.value,
              }))
            }
            className="text-xs"
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
            disabled={isPaying}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer font-medium"
          >
            {isPaying ? "Đang xử lý..." : "Xác nhận thanh toán"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
export default PurchaseOrderPaymentModal;
