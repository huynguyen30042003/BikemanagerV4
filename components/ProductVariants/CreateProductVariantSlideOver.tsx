"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { z } from "zod";
import { toast } from "sonner";
import { Boxes, Upload, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useCreateBienThe } from "@/hooks/BienTheSanPham/useBienTheSanPhamApi";
import { CreateBienThePayload } from "@/types/bienTheSanPham";

export const bienTheSchema = z.object({
  sanPhamID: z.string().min(1, "Vui lòng chọn dòng sản phẩm cha"),
  maSKU: z.string().trim().min(1, "Vui lòng nhập mã SKU"),
  tenBienThe: z.string().trim().min(1, "Vui lòng nhập tên biến thể"),
  giaBan: z.number().min(0, "Giá bán không được âm"),
});

interface CreateProductVariantSlideOverProps {
  open: boolean;
  onClose: () => void;
  productOptions: SelectOption[];
  isLoadingProducts?: boolean;
  defaultSanPhamId?: string;
  onSuccess?: () => void;
}

export const CreateProductVariantSlideOver: React.FC<
  CreateProductVariantSlideOverProps
> = ({
  open,
  onClose,
  productOptions,
  isLoadingProducts = false,
  defaultSanPhamId = "",
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateBienThePayload>({
    SanPhamID: defaultSanPhamId || "",
    MaSKU: "",
    MaVach: "",
    TenBienThe: "",
    MauSac: "",
    DungLuongPin: "",
    CongSuatDongCo: "",
    GiaNhap: 0,
    GiaBan: 0,
    GiaBanSi: 0,
    GiaSuaChua: null,
    SoThangBaoHanh: 12,
    QuanLyTheoSerial: true,
    TrangThai: true,
    file: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateBienThe();

  useEffect(() => {
    if (open) {
      setFormData({
        SanPhamID: defaultSanPhamId || "",
        MaSKU: "",
        MaVach: "",
        TenBienThe: "",
        MauSac: "",
        DungLuongPin: "",
        CongSuatDongCo: "",
        GiaNhap: 0,
        GiaBan: 0,
        GiaBanSi: 0,
        GiaSuaChua: null,
        SoThangBaoHanh: 12,
        QuanLyTheoSerial: true,
        TrangThai: true,
        file: null,
      });
      setImagePreview(null);
      setErrors({});
    }
  }, [open, defaultSanPhamId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleClearImage = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    try {
      bienTheSchema.parse({
        sanPhamID: formData.SanPhamID,
        maSKU: formData.MaSKU,
        tenBienThe: formData.TenBienThe,
        giaBan: formData.GiaBan,
      });

      setErrors({});
      await createMutation.mutateAsync(formData);
      onClose();
      onSuccess?.();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      }
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới Biến thể & SKU"
      description="Đăng ký màu sắc xe, dung lượng pin, công suất và giá niêm yết"
      icon={Boxes}
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu biến thể
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3.5">
        {/* Parent Product */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Dòng sản phẩm cha <span className="text-red-500">*</span>
          </label>
          <SearchSelect
            options={productOptions}
            value={formData.SanPhamID}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, SanPhamID: String(val) }))
            }
            placeholder="Chọn dòng sản phẩm cha..."
            isLoading={isLoadingProducts}
            height={10}
            className={errors.sanPhamID ? "border-red-500" : ""}
          />
          {errors.sanPhamID && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.sanPhamID}
            </p>
          )}
        </div>

        {/* SKU Code */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Mã SKU <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.MaSKU}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                MaSKU: e.target.value.toUpperCase(),
              }))
            }
            placeholder="VD: SKU-FELIZS-DEN..."
            className={`font-mono uppercase rounded-lg text-xs ${
              errors.maSKU ? "border-red-500" : ""
            }`}
          />
          {errors.maSKU && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.maSKU}
            </p>
          )}
        </div>

        {/* Barcode */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Mã vạch Barcode
          </label>
          <Input
            value={formData.MaVach || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MaVach: e.target.value }))
            }
            placeholder="8931234567890"
            className="font-mono rounded-lg text-xs"
          />
        </div>

        {/* Variant Name */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Tên biến thể <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.TenBienThe}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, TenBienThe: e.target.value }))
            }
            placeholder="Ví dụ: Màu Đen Nhám - Pin LFP 3.5kWh"
            className={`rounded-lg text-xs ${
              errors.tenBienThe ? "border-red-500" : ""
            }`}
          />
          {errors.tenBienThe && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tenBienThe}
            </p>
          )}
        </div>

        {/* Color */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Màu sắc xe
          </label>
          <Input
            value={formData.MauSac || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MauSac: e.target.value }))
            }
            placeholder="Đen nhám, Đỏ, Trắng..."
            className="rounded-lg text-xs"
          />
        </div>

        {/* Battery Capacity */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Dung lượng Pin
          </label>
          <Input
            value={formData.DungLuongPin || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                DungLuongPin: e.target.value,
              }))
            }
            placeholder="3.5 kWh, 72V-20Ah..."
            className="rounded-lg text-xs font-mono"
          />
        </div>

        {/* Motor Power */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Công suất động cơ
          </label>
          <Input
            value={formData.CongSuatDongCo || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                CongSuatDongCo: e.target.value,
              }))
            }
            placeholder="3000W, 1200W..."
            className="rounded-lg text-xs font-mono"
          />
        </div>

        {/* Warranty Months */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Bảo hành (tháng)
          </label>
          <Input
            type="number"
            min={0}
            value={formData.SoThangBaoHanh}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoThangBaoHanh: parseInt(e.target.value) || 0,
              }))
            }
            className="rounded-lg font-mono text-xs"
          />
        </div>

        {/* Pricing */}
        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Giá nhập tham chiếu (VNĐ)
          </label>
          <Input
            type="number"
            min={0}
            value={formData.GiaNhap}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                GiaNhap: parseFloat(e.target.value) || 0,
              }))
            }
            className="font-mono rounded-lg text-xs"
          />
        </div>

        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Giá bán lẻ (VNĐ) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min={0}
            value={formData.GiaBan}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                GiaBan: parseFloat(e.target.value) || 0,
              }))
            }
            className="font-mono rounded-lg text-xs"
          />
          {errors.giaBan && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.giaBan}
            </p>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Giá bán sỉ / thợ (VNĐ)
          </label>
          <Input
            type="number"
            min={0}
            value={formData.GiaBanSi}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                GiaBanSi: parseFloat(e.target.value) || 0,
              }))
            }
            className="font-mono rounded-lg text-xs"
          />
        </div>

        {!formData.QuanLyTheoSerial && (
          <div className="col-span-2 sm:col-span-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-amber-600 dark:text-amber-400 flex items-center justify-between">
              <span>Giá sửa chữa / thay thế (VNĐ)</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                (Tùy chọn)
              </span>
            </label>
            <Input
              type="number"
              min={0}
              value={formData.GiaSuaChua ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  GiaSuaChua: e.target.value
                    ? parseFloat(e.target.value)
                    : null,
                }))
              }
              placeholder="Mặc định lấy giá bán nếu trống"
              className="font-mono rounded-lg text-xs border-amber-500/30 focus-visible:border-amber-500"
            />
          </div>
        )}

        {/* Image Upload */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">
            Ảnh biến thể / màu xe
          </label>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <Boxes className="w-6 h-6 text-muted-foreground/60" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                Tải ảnh lên
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleClearImage}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Xóa ảnh
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Switch: Quản lý theo Serial */}
        <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
          <div>
            <p className="text-xs font-medium text-foreground">
              Quản lý theo Serial
            </p>
            <p className="text-[11px] text-muted-foreground">
              Theo dõi từng chiếc theo số Khung, Máy, Pin
            </p>
          </div>
          <Switch
            id="isSerialManagedAdd"
            checked={formData.QuanLyTheoSerial}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, QuanLyTheoSerial: checked }))
            }
          />
        </div>

        {/* Switch: Trạng thái kinh doanh */}
        <div className="col-span-2 flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
          <div>
            <p className="text-xs font-medium text-foreground">
              Trạng thái kinh doanh
            </p>
            <p className="text-[11px] text-muted-foreground">
              Kích hoạt biến thể trong toàn hệ thống bán lẻ
            </p>
          </div>
          <Switch
            id="isActiveBienTheAdd"
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
