"use client";

import React, { useState, useEffect } from "react";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SC_PhieuSuaChua, ThanhToanSuaChuaPayload } from "@/types/suaChua";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface RepairTicketPaymentModalProps {
  open: boolean;
  onClose: () => void;
  ticket: SC_PhieuSuaChua | null;
  paymentMethodOptions: SelectOption[];
  isLoadingPaymentMethods?: boolean;
  onSubmit: (data: ThanhToanSuaChuaPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function RepairTicketPaymentModal({
  open,
  onClose,
  ticket,
  paymentMethodOptions,
  isLoadingPaymentMethods,
  onSubmit,
  isSubmitting = false,
}: RepairTicketPaymentModalProps) {
  const [formData, setFormData] = useState<ThanhToanSuaChuaPayload>({
    PhieuSuaChuaID: "",
    MaGiaoDich: "",
    PhuongTucThanhToanID: 78,
    SoTien: 0,
    GhiChu: "",
  });

  useEffect(() => {
    if (open && ticket) {
      const remaining = Math.max(
        0,
        ticket.conNo ?? ticket.tongTien - ticket.daThanhToan
      );
      setFormData({
        PhieuSuaChuaID: ticket.phieuSuaChuaID,
        MaGiaoDich: `REPAIR-PAY-${Date.now().toString().slice(-6)}`,
        PhuongTucThanhToanID: paymentMethodOptions[0]?.value
          ? Number(paymentMethodOptions[0].value)
          : 78,
        SoTien: remaining,
        GhiChu: "",
      });
    }
  }, [open, ticket, paymentMethodOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket) return;
    await onSubmit({
      ...formData,
      PhieuSuaChuaID: ticket.phieuSuaChuaID,
    });
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thu Tiền Dịch Vụ Sửa Chữa"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300">
          <Receipt className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div className="space-y-0.5">
            <span>
              Thu tiền cho phiếu{" "}
              <strong className="font-mono">{ticket?.maPhieuSuaChua}</strong> ({ticket?.tenKhachHang || "Khách lẻ"}).
            </span>
            <div className="text-[11px] font-mono text-foreground font-semibold">
              Tổng tiền: {formatCurrency(ticket?.tongTien)} | Còn nợ:{" "}
              <span className="text-rose-600 dark:text-rose-400 font-bold">
                {formatCurrency(ticket?.conNo)}
              </span>
            </div>
          </div>
        </div>

        {/* Hình thức thanh toán with height={10} */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Hình thức thu tiền (Từ DM chi tiết)
          </label>
          <SearchSelect
            options={paymentMethodOptions}
            value={String(formData.PhuongTucThanhToanID)}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                PhuongTucThanhToanID: Number(val),
              }))
            }
            isLoading={isLoadingPaymentMethods}
            height={10}
            placeholder="Chọn phương thức thanh toán..."
          />
        </div>

        {/* Số tiền thanh toán */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Số tiền thanh toán (VNĐ) <span className="text-rose-500">*</span>
          </label>
          <Input
            type="number"
            min={1000}
            step={1000}
            value={formData.SoTien}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoTien: parseInt(e.target.value, 10) || 0,
              }))
            }
            className="text-xs font-mono font-bold h-10"
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú giao dịch
          </label>
          <Input
            type="text"
            placeholder="VD: Khách chuyển khoản QR, Tiền mặt thu tại quầy..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs cursor-pointer font-medium"
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận thu tiền"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
