"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { Tags, Upload, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useCreateThuongHieu } from "@/hooks/ThuongHieu/useThuongHieuApi";
import { CreateThuongHieuPayload } from "@/types/thuongHieu";

const thuongHieuSchema = z.object({
  maThuongHieu: z.string().trim().min(1, "Vui lòng nhập mã thương hiệu"),
  tenThuongHieu: z.string().trim().min(1, "Vui lòng nhập tên thương hiệu"),
  duongDan: z.string().trim().min(1, "Vui lòng nhập đường dẫn slug"),
});

interface CreateBrandSlideOverProps {
  open: boolean;
  onClose: () => void;
  countryOptions: SelectOption[];
  onSuccess?: () => void;
}

export const CreateBrandSlideOver: React.FC<CreateBrandSlideOverProps> = ({
  open,
  onClose,
  countryOptions,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateThuongHieuPayload>({
    MaThuongHieu: "",
    TenThuongHieu: "",
    DuongDan: "",
    QuocGiaID: null,
    QuocGia: "",
    MoTa: "",
    ThuTu: 0,
    TrangThai: true,
    file: null,
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateThuongHieu();

  useEffect(() => {
    if (open) {
      setFormData({
        MaThuongHieu: "",
        TenThuongHieu: "",
        DuongDan: "",
        QuocGiaID: null,
        QuocGia: "",
        MoTa: "",
        ThuTu: 0,
        TrangThai: true,
        file: null,
      });
      setLogoPreview(null);
      setErrors({});
    }
  }, [open]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleClearLogo = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setLogoPreview(null);
  };

  const handleSubmit = async () => {
    try {
      thuongHieuSchema.parse({
        maThuongHieu: formData.MaThuongHieu,
        tenThuongHieu: formData.TenThuongHieu,
        duongDan: formData.DuongDan,
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
        toast.error("Vui lòng nhập đầy đủ thông tin thương hiệu!");
      }
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới Thương hiệu"
      description="Đăng ký hãng sản xuất xe và linh kiện phụ tùng vào hệ thống"
      icon={Tags}
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
            Lưu thương hiệu
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Mã thương hiệu */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Mã thương hiệu <span className="text-rose-500">*</span>
          </label>
          <Input
            value={formData.MaThuongHieu}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                MaThuongHieu: e.target.value.toUpperCase(),
                DuongDan:
                  prev.DuongDan ||
                  e.target.value.toLowerCase().replace(/\s+/g, "-"),
              }))
            }
            placeholder="HONDA, VINFAST..."
            className={`font-mono uppercase rounded-lg bg-background ${
              errors.maThuongHieu ? "border-rose-500 ring-1 ring-rose-500/20" : ""
            }`}
          />
          {errors.maThuongHieu && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.maThuongHieu}
            </p>
          )}
        </div>

        {/* Tên thương hiệu */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Tên thương hiệu <span className="text-rose-500">*</span>
          </label>
          <Input
            value={formData.TenThuongHieu}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                TenThuongHieu: e.target.value,
              }))
            }
            placeholder="VinFast Auto, Honda..."
            className={`rounded-lg bg-background ${
              errors.tenThuongHieu ? "border-rose-500 ring-1 ring-rose-500/20" : ""
            }`}
          />
          {errors.tenThuongHieu && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tenThuongHieu}
            </p>
          )}
        </div>

        {/* Đường dẫn Slug */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Đường dẫn Slug <span className="text-rose-500">*</span>
          </label>
          <Input
            value={formData.DuongDan}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, DuongDan: e.target.value }))
            }
            placeholder="vinfast-auto"
            className={`font-mono rounded-lg bg-background ${
              errors.duongDan ? "border-rose-500 ring-1 ring-rose-500/20" : ""
            }`}
          />
          <p className="text-[11px] text-muted-foreground font-mono">
            Đường dẫn thân thiện: /thuong-hieu/{formData.DuongDan || "ten-hang"}
          </p>
          {errors.duongDan && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.duongDan}
            </p>
          )}
        </div>

        {/* Xuất xứ Quốc gia */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Xuất xứ Quốc gia
          </label>
          <SearchSelect
            options={countryOptions}
            value={formData.QuocGiaID || ""}
            onChange={(val) => {
              const opt = countryOptions.find(
                (c) => String(c.value) === String(val)
              );
              setFormData((prev) => ({
                ...prev,
                QuocGiaID: val ? Number(val) : null,
                QuocGia: opt?.label || "",
              }));
            }}
            placeholder="Chọn quốc gia xuất xứ"
            height={10}
          />
        </div>

        {/* Thứ tự ưu tiên */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Thứ tự ưu tiên
          </label>
          <Input
            type="number"
            min={0}
            value={formData.ThuTu}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ThuTu: parseInt(e.target.value) || 0,
              }))
            }
            className="rounded-lg font-mono bg-background"
          />
        </div>

        {/* Mô tả hãng */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Mô tả hãng sản xuất
          </label>
          <Input
            value={formData.MoTa || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MoTa: e.target.value }))
            }
            placeholder="Mô tả về lịch sử, phân khúc sản phẩm..."
            className="rounded-lg bg-background"
          />
        </div>

        {/* Logo Uploader */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Logo thương hiệu
          </label>
          <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl border border-border/70 bg-background flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain p-1"
                  unoptimized
                />
              ) : (
                <Tags className="w-7 h-7 text-muted-foreground/40 stroke-[1.5]" />
              )}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Tải logo lên
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
                {logoPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearLogo}
                    className="h-8 px-2 text-xs text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                  >
                    Xóa ảnh
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Hỗ trợ định dạng PNG, JPG, SVG hoặc WebP. Kích thước đề xuất 200x200px.
              </p>
            </div>
          </div>
        </div>

        {/* Trạng thái kích hoạt */}
        <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Trạng thái kích hoạt
            </p>
            <p className="text-xs text-muted-foreground">
              Cho phép liên kết hãng này khi quản lý xe và phụ tùng
            </p>
          </div>
          <Switch
            id="isActiveThuongHieuAdd"
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
