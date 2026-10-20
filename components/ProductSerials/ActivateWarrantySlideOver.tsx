"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useKichHoatBaoHanh } from "@/hooks/SoSerial/useSoSerialApi";
import { KichHoatBaoHanhPayload, SP_SoSerial } from "@/types/soSerial";

interface ActivateWarrantySlideOverProps {
  open: boolean;
  onClose: () => void;
  serial: SP_SoSerial | null;
  customerOptions: SelectOption[];
  isLoadingCustomers?: boolean;
  getSerialStatusBadge: (statusId?: number | null) => {
    bgClass: string;
    textClass: string;
    borderClass: string;
    label: string;
  };
  onSuccess?: () => void;
}

export const ActivateWarrantySlideOver: React.FC<
  ActivateWarrantySlideOverProps
> = ({
  open,
  onClose,
  serial,
  customerOptions,
  isLoadingCustomers = false,
  getSerialStatusBadge,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<KichHoatBaoHanhPayload>({
    SoSerialID: "",
    KhachHangID: "",
    DonHangID: null,
    TrangThaiDaBanID: 61,
    BienSoXe: "",
  });

  const warrantyMutation = useKichHoatBaoHanh();

  useEffect(() => {
    if (open && serial) {
      setFormData({
        SoSerialID: serial.soSerialID,
        KhachHangID: serial.khachHangID || "",
        DonHangID: null,
        TrangThaiDaBanID: 61,
        BienSoXe: serial.bienSoXe || "",
      });
    }
  }, [open, serial]);

  const handleSubmit = async () => {
    if (!formData.KhachHangID) {
      toast.error("Vui lòng chọn khách hàng để kích hoạt bảo hành!");
      return;
    }

    try {
      await warrantyMutation.mutateAsync(formData);
      onClose();
      onSuccess?.();
    } catch {
      // Handled in mutation
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Kích hoạt Bảo hành Điện tử"
      description="Gán chủ sở hữu phương tiện, cập nhật biển số xe và kích hoạt bảo hành theo quy định"
      icon={ShieldCheck}
      footer={
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={warrantyMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-semibold"
            onClick={handleSubmit}
            disabled={warrantyMutation.isPending}
          >
            {warrantyMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Kích hoạt bảo hành
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        {/* Card Serial đang chọn */}
        {serial && (
          <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">
                {serial.maSerial}
              </span>
              {(() => {
                const badge = getSerialStatusBadge(serial.trangThaiID);
                return (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                  >
                    {badge.label}
                  </span>
                );
              })()}
            </div>
            <p className="text-xs font-semibold text-foreground">
              {serial.tenBienThe}
            </p>
            {serial.soKhung && (
              <p className="text-[11px] text-muted-foreground font-mono">
                Số khung: {serial.soKhung}
              </p>
            )}
          </div>
        )}

        {/* Chọn Khách hàng */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Chủ sở hữu / Khách hàng mua xe <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn khách hàng theo họ tên & SĐT"
            options={customerOptions}
            value={formData.KhachHangID}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                KhachHangID: String(val || ""),
              }))
            }
            isLoading={isLoadingCustomers}
          />
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Tra cứu hồ sơ khách hàng đã đăng ký trong hệ thống
          </p>
        </div>

        {/* Biển số xe */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Biển số xe đăng ký (nếu có)
          </label>
          <Input
            placeholder="Ví dụ: 29-MD1 889.33"
            value={formData.BienSoXe || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                BienSoXe: e.target.value.toUpperCase(),
              }))
            }
            className="text-xs font-mono font-bold uppercase"
          />
        </div>

        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
          <p className="font-semibold flex items-center gap-1 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Kích hoạt hệ thống
          </p>
          Khi bấm xác nhận, trạng thái thiết bị sẽ tự động chuyển thành{" "}
          <strong>Đã xuất bán</strong> và hệ thống sẽ bắt đầu tính thời hạn bảo
          hành điện tử cho khách hàng.
        </div>
      </div>
    </SlideOver>
  );
};
