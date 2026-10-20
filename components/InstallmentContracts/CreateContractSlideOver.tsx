"use client";

import React, { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CreateHopDongTraGopPayload } from "@/types/traGop";
import {
  TRANG_THAI_HOP_DONG,
  TRANG_THAI_GIAI_NGAN,
} from "@/hooks/TraGop/useTraGop";
import { toast } from "sonner";

export interface CreateContractSlideOverProps {
  open: boolean;
  onClose: () => void;
  providerOptions: SelectOption[];
  onSubmit: (data: CreateHopDongTraGopPayload) => Promise<void> | void;
  isSubmitting: boolean;
}

const getInitialFormData = (defaultProviderId = ""): CreateHopDongTraGopPayload => ({
  DonHangID: "",
  KhachHangID: "",
  DonViTraGopID: defaultProviderId,
  SoHopDong: `HDS-${Date.now().toString().slice(-6)}`,
  MaHoSoOnline: "",
  TongGiaTriDonHang: 0,
  TienTraTruoc: 0,
  SoTienVay: 0,
  PhiBaoHiemKhoanVay: 0,
  LaiSuat: 0,
  SoThangTraGop: 12,
  SoTienTraHangThang: 0,
  NgayTraHangThang: 5,
  TrangThaiHopDongID: TRANG_THAI_HOP_DONG.CHO_DUYET,
  TrangThaiGiaiNganID: TRANG_THAI_GIAI_NGAN.CHUA_GIAI_NGAN,
  DuongDanHopDongPdf: "",
  DanhSachTaiLieuJson: "",
  NguoiThamChieu: "",
  GhiChu: "",
});

export const CreateContractSlideOver: React.FC<CreateContractSlideOverProps> = ({
  open,
  onClose,
  providerOptions,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<CreateHopDongTraGopPayload>(() =>
    getInitialFormData(
      providerOptions[0]?.value != null
        ? String(providerOptions[0].value)
        : ""
    )
  );

  // Khi modal mở, tự sinh mã hợp đồng và reset form nếu chưa chọn đơn vị
  useEffect(() => {
    if (open) {
      setFormData(
        getInitialFormData(
          providerOptions[0]?.value != null
            ? String(providerOptions[0].value)
            : ""
        )
      );
    }
  }, [open, providerOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.SoHopDong.trim()) {
      toast.warning("Vui lòng nhập số hợp đồng tín dụng!");
      return;
    }
    if (!formData.DonViTraGopID) {
      toast.warning("Vui lòng chọn đơn vị đối tác tài chính!");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Lập Hồ Sơ Vay Mua Xe Trả Góp"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số hợp đồng tín dụng <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.SoHopDong}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, SoHopDong: e.target.value }))
              }
              className="text-xs font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã hồ sơ online (App thẩm định)
            </label>
            <Input
              type="text"
              placeholder="VD: APP-HD-99120"
              value={formData.MaHoSoOnline || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  MaHoSoOnline: e.target.value,
                }))
              }
              className="text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Đơn vị tài chính cho vay <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            options={providerOptions}
            value={formData.DonViTraGopID}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, DonViTraGopID: String(val) }))
            }
          />
        </div>

        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-3">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            Thông tin khoản vay & tài chính
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Tổng giá trị xe (đ)
              </label>
              <Input
                type="number"
                value={formData.TongGiaTriDonHang}
                onChange={(e) => {
                  const total = Number(e.target.value);
                  const prepay = formData.TienTraTruoc;
                  const loan = Math.max(0, total - prepay);
                  const months = formData.SoThangTraGop || 1;
                  setFormData((prev) => ({
                    ...prev,
                    TongGiaTriDonHang: total,
                    SoTienVay: loan,
                    SoTienTraHangThang: Math.round(loan / months),
                  }));
                }}
                className="text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Khách trả trước (đ)
              </label>
              <Input
                type="number"
                value={formData.TienTraTruoc}
                onChange={(e) => {
                  const prepay = Number(e.target.value);
                  const total = formData.TongGiaTriDonHang;
                  const loan = Math.max(0, total - prepay);
                  const months = formData.SoThangTraGop || 1;
                  setFormData((prev) => ({
                    ...prev,
                    TienTraTruoc: prepay,
                    SoTienVay: loan,
                    SoTienTraHangThang: Math.round(loan / months),
                  }));
                }}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Khoản vay tín dụng (đ)
              </label>
              <Input
                type="number"
                value={formData.SoTienVay}
                onChange={(e) => {
                  const loan = Number(e.target.value);
                  const months = formData.SoThangTraGop || 1;
                  setFormData((prev) => ({
                    ...prev,
                    SoTienVay: loan,
                    SoTienTraHangThang: Math.round(loan / months),
                  }));
                }}
                className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Kỳ hạn vay (tháng)
              </label>
              <Input
                type="number"
                value={formData.SoThangTraGop}
                onChange={(e) => {
                  const months = Number(e.target.value) || 1;
                  const loan = formData.SoTienVay;
                  const monthly = Math.round(loan / months);
                  setFormData((prev) => ({
                    ...prev,
                    SoThangTraGop: months,
                    SoTienTraHangThang: monthly,
                  }));
                }}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Lãi suất (%/tháng)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="VD: 0 hoặc 1.89"
                value={formData.LaiSuat}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    LaiSuat: Number(e.target.value),
                  }))
                }
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Góp hàng tháng (ước tính)
              </label>
              <Input
                type="number"
                value={formData.SoTienTraHangThang}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    SoTienTraHangThang: Number(e.target.value),
                  }))
                }
                className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Người tham chiếu bảo lãnh (nếu có)
            </label>
            <Input
              type="text"
              placeholder="VD: Nguyễn Thị Mai (Vợ - 0912 999 888)"
              value={formData.NguoiThamChieu || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  NguoiThamChieu: e.target.value,
                }))
              }
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ngày đến hạn đóng hàng tháng
            </label>
            <Input
              type="number"
              placeholder="VD: 5 (mùng 5 hàng tháng)"
              value={formData.NgayTraHangThang || 5}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  NgayTraHangThang: Number(e.target.value),
                }))
              }
              className="text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú hồ sơ
          </label>
          <Input
            type="text"
            placeholder="VD: Khách hàng mua xe Feliz S trả góp gói 0% lãi suất của HD Saison..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
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
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {isSubmitting ? "Đang lưu..." : "Lập hồ sơ vay"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
