"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { Package, Upload, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useCreateSanPham } from "@/hooks/SanPham/useSanPhamApi";
import { CreateSanPhamPayload } from "@/types/sanPham";

const sanPhamSchema = z.object({
  maSanPham: z.string().trim().min(1, "Vui lòng nhập mã sản phẩm"),
  tenSanPham: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm"),
  thuongHieuID: z.string().min(1, "Vui lòng chọn thương hiệu / hãng sản xuất"),
  danhMucChiTietID: z.number().min(1, "Vui lòng chọn ngành hàng / danh mục chi tiết"),
});

interface CreateProductSlideOverProps {
  open: boolean;
  onClose: () => void;
  brandOptions: SelectOption[];
  isLoadingBrands?: boolean;
  categoryOptions: SelectOption[];
  isLoadingCategories?: boolean;
  defaultBrandId?: string;
  defaultCategoryId?: number;
  onSuccess?: () => void;
}

export const CreateProductSlideOver: React.FC<CreateProductSlideOverProps> = ({
  open,
  onClose,
  brandOptions,
  isLoadingBrands = false,
  categoryOptions,
  isLoadingCategories = false,
  defaultBrandId = "",
  defaultCategoryId = 0,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateSanPhamPayload>({
    MaSanPham: "",
    TenSanPham: "",
    DanhMucChiTietID: defaultCategoryId || 0,
    ThuongHieuID: defaultBrandId || "",
    DuongDan: "",
    DonViTinhID: null,
    MoTaNgan: "",
    MoTa: "",
    ThongSoKyThuatJson: "",
    SoThangBaoHanhMacDinh: 12,
    LaPhuongTien: false,
    DaXuatBan: true,
    TrangThai: true,
    file: null,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateSanPham();

  useEffect(() => {
    if (open) {
      setFormData({
        MaSanPham: "",
        TenSanPham: "",
        DanhMucChiTietID: defaultCategoryId || 0,
        ThuongHieuID: defaultBrandId || "",
        DuongDan: "",
        DonViTinhID: null,
        MoTaNgan: "",
        MoTa: "",
        ThongSoKyThuatJson: "",
        SoThangBaoHanhMacDinh: 12,
        LaPhuongTien: false,
        DaXuatBan: true,
        TrangThai: true,
        file: null,
      });
      setAvatarPreview(null);
      setErrors({});
    }
  }, [open, defaultBrandId, defaultCategoryId]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleClearAvatar = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setAvatarPreview(null);
  };

  const handleSubmit = async () => {
    try {
      sanPhamSchema.parse({
        maSanPham: formData.MaSanPham,
        tenSanPham: formData.TenSanPham,
        thuongHieuID: formData.ThuongHieuID,
        danhMucChiTietID: Number(formData.DanhMucChiTietID),
      });

      setErrors({});
      await createMutation.mutateAsync(formData);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng nhập đầy đủ các trường bắt buộc!");
      }
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới Sản phẩm / Dòng xe"
      description="Đăng ký mã sản phẩm, thương hiệu và cấu hình kinh doanh"
      icon={Package}
      footer={
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={createMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu sản phẩm
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Mã sản phẩm */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Mã sản phẩm <span className="text-rose-500">*</span>
          </label>
          <Input
            value={formData.MaSanPham}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                MaSanPham: e.target.value.toUpperCase(),
                DuongDan:
                  prev.DuongDan ||
                  e.target.value.toLowerCase().replace(/\s+/g, "-"),
              }))
            }
            placeholder="SP-FELIZ-S..."
            className={`font-mono uppercase rounded-lg bg-background ${
              errors.maSanPham ? "border-rose-500 ring-1 ring-rose-500/20" : ""
            }`}
          />
          {errors.maSanPham && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.maSanPham}
            </p>
          )}
        </div>

        {/* Tên sản phẩm */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Tên sản phẩm <span className="text-rose-500">*</span>
          </label>
          <Input
            value={formData.TenSanPham}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, TenSanPham: e.target.value }))
            }
            placeholder="Xe máy điện VinFast Feliz S..."
            className={`rounded-lg bg-background ${
              errors.tenSanPham ? "border-rose-500 ring-1 ring-rose-500/20" : ""
            }`}
          />
          {errors.tenSanPham && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tenSanPham}
            </p>
          )}
        </div>

        {/* Thương hiệu hãng */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Thương hiệu hãng <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            options={brandOptions}
            value={formData.ThuongHieuID}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, ThuongHieuID: String(val) }))
            }
            placeholder="Chọn hãng sản xuất"
            isLoading={isLoadingBrands}
            height={10}
            className={
              errors.thuongHieuID ? "border-rose-500 ring-1 ring-rose-500/20" : ""
            }
          />
          {errors.thuongHieuID && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.thuongHieuID}
            </p>
          )}
        </div>

        {/* Ngành hàng / Danh mục */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Ngành hàng / Danh mục <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            options={categoryOptions}
            value={formData.DanhMucChiTietID || ""}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                DanhMucChiTietID: Number(val),
              }))
            }
            placeholder="Chọn ngành hàng"
            isLoading={isLoadingCategories}
            height={10}
            className={
              errors.danhMucChiTietID
                ? "border-rose-500 ring-1 ring-rose-500/20"
                : ""
            }
          />
          {errors.danhMucChiTietID && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.danhMucChiTietID}
            </p>
          )}
        </div>

        {/* Đường dẫn Slug */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Đường dẫn Slug URL
          </label>
          <Input
            value={formData.DuongDan}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DuongDan: e.target.value }))
            }
            placeholder="vinfast-feliz-s"
            className="font-mono rounded-lg bg-background"
          />
          <p className="text-[11px] text-muted-foreground font-mono">
            Đường dẫn thân thiện: /san-pham/{formData.DuongDan || "ten-san-pham"}
          </p>
        </div>

        {/* Bảo hành mặc định */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Bảo hành mặc định (tháng)
          </label>
          <Input
            type="number"
            min={0}
            value={formData.SoThangBaoHanhMacDinh}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoThangBaoHanhMacDinh: parseInt(e.target.value) || 0,
              }))
            }
            className="rounded-lg font-mono bg-background"
          />
        </div>

        {/* Mô tả ngắn */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Mô tả ngắn
          </label>
          <Input
            value={formData.MoTaNgan || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MoTaNgan: e.target.value }))
            }
            placeholder="Dòng xe máy điện đô thị thanh lịch, pin LFP bền bỉ..."
            className="rounded-lg bg-background"
          />
        </div>

        {/* Ảnh đại diện sản phẩm */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Ảnh đại diện sản phẩm
          </label>
          <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-border/70 bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <Package className="w-7 h-7 text-muted-foreground/40 stroke-[1.5]" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Tải ảnh lên
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
                {avatarPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAvatar}
                    className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                  >
                    Xóa ảnh
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Hỗ trợ định dạng PNG, JPG hoặc WebP. Kích thước đề xuất 800x600px.
              </p>
            </div>
          </div>
        </div>

        {/* Switches */}
        <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">Xe nguyên chiếc</p>
            <p className="text-xs text-muted-foreground">
              Tự động sinh hồ sơ phương tiện khách hàng khi bán xe
            </p>
          </div>
          <Switch
            id="isVehicleAdd"
            checked={formData.LaPhuongTien}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, LaPhuongTien: checked }))
            }
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Niêm yết bán tại quầy
            </p>
            <p className="text-xs text-muted-foreground">
              Cho phép hiển thị và tạo đơn bán hàng tại quầy POS
            </p>
          </div>
          <Switch
            id="isPublishedAdd"
            checked={formData.DaXuatBan}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, DaXuatBan: checked }))
            }
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Trạng thái kinh doanh
            </p>
            <p className="text-xs text-muted-foreground">
              Kích hoạt sản phẩm trong toàn hệ thống
            </p>
          </div>
          <Switch
            id="isActiveSanPhamAdd"
            checked={formData.TrangThai}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, TrangThai: checked }))
            }
          />
        </div>
      </div>
    </SlideOver>
  );
};
