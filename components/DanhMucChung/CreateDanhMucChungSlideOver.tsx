"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FolderPlus, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CreateDanhMucChungPayload } from "@/types/danhMucChung";
import { useCreateDanhMucChung } from "@/hooks/DanhMucChung/useDanhMucChungApi";
import { danhMucChungSchema } from "@/hooks/DanhMucChung/useDanhMucChung";

interface CreateDanhMucChungSlideOverProps {
  open: boolean;
  onClose: () => void;
  defaultThuTu?: number;
  onSuccess?: () => void;
}

export function CreateDanhMucChungSlideOver({
  open,
  onClose,
  defaultThuTu = 1,
  onSuccess,
}: CreateDanhMucChungSlideOverProps) {
  const createCategory = useCreateDanhMucChung();

  const [formData, setFormData] = useState<CreateDanhMucChungPayload>({
    Ten: "",
    MoTa: "",
    ThuTu: defaultThuTu,
    TrangThai: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        Ten: "",
        MoTa: "",
        ThuTu: defaultThuTu,
        TrangThai: true,
      });
      setErrors({});
    }
  }, [open, defaultThuTu]);

  const handleSubmit = async () => {
    const result = danhMucChungSchema.safeParse({
      ten: formData.Ten,
      thuTu: formData.ThuTu,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          newErrors[String(field)] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await createCategory.mutateAsync(formData);
      toast.success("Thêm danh mục thành công");
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đã có lỗi xảy ra khi thêm danh mục";
      toast.error(msg);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới danh mục dùng chung"
      description="Định nghĩa danh mục thuộc tính phân loại mẹ vào hệ thống"
      icon={FolderPlus}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={createCategory.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit}
            disabled={createCategory.isPending}
          >
            {createCategory.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu danh mục
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Tên danh mục */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span>
              Tên danh mục <span className="text-red-500">*</span>
            </span>
            <span className="text-[11px] text-muted-foreground font-normal">
              Bắt buộc
            </span>
          </label>
          <Input
            type="text"
            value={formData.Ten}
            placeholder="Ví dụ: Thương hiệu xe, Loại khung xe, Dung tích pin..."
            className={`rounded-lg text-xs ${
              errors.ten ? "border-red-500 focus-visible:ring-red-500/30" : ""
            }`}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                Ten: e.target.value,
              }))
            }
            autoFocus
          />
          {errors.ten && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.ten}
            </p>
          )}
        </div>

        {/* Thứ tự sắp xếp */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">
            Thứ tự hiển thị
          </label>
          <Input
            type="number"
            min={0}
            value={formData.ThuTu}
            className="rounded-lg font-mono text-xs"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                ThuTu: parseInt(e.target.value) || 0,
              }))
            }
          />
          {errors.thuTu && (
            <p className="text-xs text-red-600">{errors.thuTu}</p>
          )}
        </div>

        {/* Trạng thái sử dụng (Switch Radix) */}
        <div className="col-span-1 flex flex-col gap-1.5 justify-end pb-0.5">
          <span className="text-xs font-semibold text-foreground">
            Trạng thái
          </span>
          <div className="flex items-center gap-2.5 h-9.5 px-3 rounded-lg border border-border/70 bg-muted/30">
            <Switch
              id="isActiveAddModal"
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  TrangThai: checked,
                }))
              }
            />
            <label
              htmlFor="isActiveAddModal"
              className="text-xs font-medium text-foreground cursor-pointer select-none"
            >
              {formData.TrangThai ? "Kích hoạt sử dụng" : "Tạm khóa"}
            </label>
          </div>
        </div>

        {/* Mô tả */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground">
            Mô tả danh mục
          </label>
          <Textarea
            value={formData.MoTa || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                MoTa: e.target.value,
              }))
            }
            placeholder="Nhập mô tả tóm tắt mục đích hoặc ghi chú của danh mục này..."
            className="h-28 resize-none rounded-lg text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            Mô tả ngắn gọn giúp các quản trị viên khác hiểu rõ phạm vi phân loại.
          </p>
        </div>
      </div>
    </SlideOver>
  );
}
