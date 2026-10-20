"use client";

import React, { useState, useEffect } from "react";
import { User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CreateDonViTraGopPayload } from "@/types/traGop";
import { toast } from "sonner";

export interface CreateInstallmentProviderSlideOverProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDonViTraGopPayload) => Promise<void> | void;
  isSubmitting: boolean;
  defaultOrder?: number;
}

const getInitialFormData = (defaultOrder = 1): CreateDonViTraGopPayload => ({
  MaDonVi: "",
  TenDonVi: "",
  DienThoai: "",
  Email: "",
  DiaChi: "",
  TenNguoiLienHe: "",
  SdtNguoiLienHe: "",
  DiaChiAPI: "",
  ApiKey: "",
  CauHinhGoiVayJson: "",
  ThuTu: defaultOrder,
  DangHoatDong: true,
  GhiChu: "",
});

export const CreateInstallmentProviderSlideOver: React.FC<
  CreateInstallmentProviderSlideOverProps
> = ({ open, onClose, onSubmit, isSubmitting, defaultOrder = 1 }) => {
  const [formData, setFormData] = useState<CreateDonViTraGopPayload>(() =>
    getInitialFormData(defaultOrder)
  );

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData(defaultOrder));
    }
  }, [open, defaultOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.MaDonVi.trim()) {
      toast.warning("Vui lòng nhập mã đối tác (VD: HDSAISON, HOMECREDIT)!");
      return;
    }
    if (!formData.TenDonVi.trim()) {
      toast.warning("Vui lòng nhập tên công ty tài chính!");
      return;
    }
    if (!formData.DienThoai.trim()) {
      toast.warning("Vui lòng nhập số hotline liên hệ!");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm Đối Tác Trả Góp"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã đơn vị (UNIQUE) <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: HDSAISON, HOMECREDIT"
              value={formData.MaDonVi}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  MaDonVi: e.target.value.toUpperCase(),
                }))
              }
              className="text-xs font-mono font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên công ty tài chính <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: Công ty Tài chính TNHH HD SAISON"
              value={formData.TenDonVi}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, TenDonVi: e.target.value }))
              }
              className="text-xs font-medium"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Hotline hỗ trợ <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: 1900 558 854"
              value={formData.DienThoai}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, DienThoai: e.target.value }))
              }
              className="text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Email liên hệ
            </label>
            <Input
              type="email"
              placeholder="VD: hotro@hdsaison.com.vn"
              value={formData.Email || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, Email: e.target.value }))
              }
              className="text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Địa chỉ trụ sở / chi nhánh
          </label>
          <Input
            type="text"
            placeholder="VD: 24C Phan Đăng Lưu, Phường 6, Bình Thạnh, TP.HCM"
            value={formData.DiaChi || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DiaChi: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        {/* Thông tin nhân viên tín dụng phụ trách tại showroom */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-3">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-500" />
            Nhân viên tín dụng phụ trách showroom
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Họ tên Sale đối tác
              </label>
              <Input
                type="text"
                placeholder="VD: Nguyễn Văn Tuấn"
                value={formData.TenNguoiLienHe || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    TenNguoiLienHe: e.target.value,
                  }))
                }
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Số điện thoại Sale
              </label>
              <Input
                type="text"
                placeholder="VD: 0988 123 456"
                value={formData.SdtNguoiLienHe || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    SdtNguoiLienHe: e.target.value,
                  }))
                }
                className="text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Tích hợp kỹ thuật API */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-3">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            Cấu hình tích hợp duyệt hồ sơ online / API
          </h4>
          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Endpoint URL API
            </label>
            <Input
              type="text"
              placeholder="VD: https://api-partner.hdsaison.com.vn/v1/loan"
              value={formData.DiaChiAPI || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, DiaChiAPI: e.target.value }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Api Key / Secret Token
            </label>
            <Input
              type="password"
              placeholder="Nhập API Key liên kết nếu có..."
              value={formData.ApiKey || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, ApiKey: e.target.value }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Cấu hình gói vay JSON (kỳ hạn, ưu đãi 0%...)
            </label>
            <Input
              type="text"
              placeholder='VD: {"GoiUuDai": ["LaiSuat0%", "Kỳ hạn 6-12-24 tháng"]}'
              value={formData.CauHinhGoiVayJson || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  CauHinhGoiVayJson: e.target.value,
                }))
              }
              className="text-xs font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú nghiệp vụ
          </label>
          <Input
            type="text"
            placeholder="VD: Đối tác trả góp 0% cho dòng xe VinFast Feliz & Klara"
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Switch
            checked={formData.DangHoatDong}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, DangHoatDong: checked }))
            }
          />
          <label className="text-xs text-foreground font-medium cursor-pointer">
            Đang hợp tác hoạt động
          </label>
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
            {isSubmitting ? "Đang lưu..." : "Thêm đối tác"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
