"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Upload, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useAddHinhAnh } from "@/hooks/HinhAnhSanPham/useHinhAnhSanPhamApi";

interface UploadProductImageSlideOverProps {
  open: boolean;
  onClose: () => void;
  selectedSanPhamId: string;
  variantOptions: SelectOption[];
  defaultBienTheId?: string;
  nextOrderIndex?: number;
  onSuccess?: () => void;
}

export const UploadProductImageSlideOver: React.FC<
  UploadProductImageSlideOverProps
> = ({
  open,
  onClose,
  selectedSanPhamId,
  variantOptions,
  defaultBienTheId = "",
  nextOrderIndex = 1,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<{
    BienTheSanPhamID: string;
    TieuDe: string;
    ThuTuSapXep: number;
    LaAnhDaiDien: boolean;
    file: File | null;
  }>({
    BienTheSanPhamID: defaultBienTheId,
    TieuDe: "",
    ThuTuSapXep: nextOrderIndex,
    LaAnhDaiDien: false,
    file: null,
  });

  const [previewUpload, setPreviewUpload] = useState<string | null>(null);
  const [errorFile, setErrorFile] = useState<string | null>(null);

  const addMutation = useAddHinhAnh();

  useEffect(() => {
    if (open) {
      setFormData({
        BienTheSanPhamID: defaultBienTheId,
        TieuDe: "",
        ThuTuSapXep: nextOrderIndex,
        LaAnhDaiDien: nextOrderIndex === 1,
        file: null,
      });
      setPreviewUpload(null);
      setErrorFile(null);
    }
  }, [open, defaultBienTheId, nextOrderIndex]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (< 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorFile("Dung lượng tệp không được vượt quá 5MB!");
        return;
      }
      setErrorFile(null);
      setFormData((prev) => ({ ...prev, file }));
      setPreviewUpload(URL.createObjectURL(file));
    }
  };

  const handleClearUpload = () => {
    setFormData((prev) => ({ ...prev, file: null }));
    setPreviewUpload(null);
    setErrorFile(null);
  };

  const handleSubmit = async () => {
    if (!formData.file) {
      setErrorFile("Vui lòng chọn tệp ảnh để tải lên!");
      toast.error("Vui lòng chọn tệp ảnh để tải lên!");
      return;
    }

    try {
      await addMutation.mutateAsync({
        SanPhamID: selectedSanPhamId,
        BienTheSanPhamID: formData.BienTheSanPhamID || null,
        TieuDe: formData.TieuDe || "",
        ThuTuSapXep: formData.ThuTuSapXep,
        LaAnhDaiDien: formData.LaAnhDaiDien,
        file: formData.file,
      });
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
      title="Tải lên Hình ảnh Gallery"
      description="Bổ sung hình ảnh sản phẩm hoặc ảnh biến thể màu sắc"
      icon={Upload}
      footer={
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={addMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold"
            onClick={handleSubmit}
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Tải lên ngay
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Đối tượng áp dụng */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">
            Áp dụng cho đối tượng
          </label>
          <SearchSelect
            options={variantOptions}
            value={formData.BienTheSanPhamID}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                BienTheSanPhamID: String(val),
              }))
            }
            placeholder="Chọn đối tượng áp dụng"
            className="h-9.5 text-xs"
            height={9.5}
          />
        </div>

        {/* Tiêu đề ảnh */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">
            Tiêu đề / Chú thích ảnh
          </label>
          <Input
            value={formData.TieuDe}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, TieuDe: e.target.value }))
            }
            placeholder="Ví dụ: Góc chụp chính diện, Cụm đồng hồ LCD..."
            className="rounded-lg text-xs"
          />
        </div>

        {/* Thứ tự hiển thị */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">
            Thứ tự hiển thị trong album
          </label>
          <Input
            type="number"
            min={1}
            value={formData.ThuTuSapXep}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ThuTuSapXep: parseInt(e.target.value) || 1,
              }))
            }
            className="rounded-lg font-mono text-xs"
          />
        </div>

        {/* Upload box */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">
            Chọn tệp hình ảnh <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${
              errorFile
                ? "border-red-500/80 bg-red-500/5"
                : "border-border bg-muted/20 hover:bg-muted/40"
            }`}
          >
            {previewUpload ? (
              <div className="relative aspect-4/3 w-48 rounded-lg overflow-hidden border border-border shadow-xs mb-3">
                <Image
                  src={previewUpload}
                  alt="Preview"
                  width={192}
                  height={144}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-2">
                <Upload className="w-6 h-6" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                {previewUpload ? "Chọn ảnh khác" : "Chọn tệp từ thiết bị"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {previewUpload && (
                <button
                  type="button"
                  onClick={handleClearUpload}
                  className="text-xs text-rose-600 hover:underline cursor-pointer"
                >
                  Xóa ảnh
                </button>
              )}
            </div>

            {errorFile ? (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorFile}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-2">
                Hỗ trợ định dạng JPG, PNG, WEBP tối đa 5MB
              </p>
            )}
          </div>
        </div>

        {/* Switch đặt làm ảnh đại diện */}
        <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/70 bg-muted/20">
          <div>
            <p className="text-xs font-medium text-foreground">
              Đặt làm ảnh đại diện chính
            </p>
            <p className="text-[11px] text-muted-foreground">
              Ảnh chính được hiển thị tại danh sách xe
            </p>
          </div>
          <Switch
            id="isCoverImage"
            checked={formData.LaAnhDaiDien}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, LaAnhDaiDien: checked }))
            }
          />
        </div>
      </div>
    </SlideOver>
  );
};
