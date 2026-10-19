"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { SquarePen, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { DM_DanhMucChung, UpdateDanhMucChungPayload } from "@/types/danhMucChung";
import { useUpdateDanhMucChung } from "@/hooks/DanhMucChung/useDanhMucChungApi";
import { danhMucChungSchema } from "@/hooks/DanhMucChung/useDanhMucChung";

interface UpdateDanhMucChungSlideOverProps {
  open: boolean;
  onClose: () => void;
  data: DM_DanhMucChung | null;
  onSuccess?: () => void;
}

export function UpdateDanhMucChungSlideOver({
  open,
  onClose,
  data,
  onSuccess,
}: UpdateDanhMucChungSlideOverProps) {
  const updateCategory = useUpdateDanhMucChung();

  const [formData, setFormData] = useState<UpdateDanhMucChungPayload>({
    DanhMucID: 0,
    Ten: "",
    MoTa: "",
    ThuTu: 1,
    TrangThai: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync initial data when modal opens with a target item
  useEffect(() => {
    if (open && data) {
      setFormData({
        DanhMucID: data.danhMucID,
        Ten: data.ten || "",
        MoTa: data.moTa || "",
        ThuTu: data.thuTu ?? 1,
        TrangThai: data.trangThai ?? true,
      });
      setErrors({});
    }
  }, [open, data]);

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
      await updateCategory.mutateAsync(formData);
      toast.success("Cập nhật danh mục thành công");
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đã có lỗi xảy ra khi cập nhật danh mục";
      toast.error(msg);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Cập nhật danh mục #${data?.danhMucID || formData.DanhMucID}`}
      description="Chỉnh sửa thông tin danh mục phân loại mẹ"
      icon={SquarePen}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={updateCategory.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit}
            disabled={updateCategory.isPending}
          >
            {updateCategory.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu thay đổi
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
            placeholder="Nhập tên danh mục..."
            className={`rounded-lg text-xs ${
              errors.ten ? "border-red-500 focus-visible:ring-red-500/30" : ""
            }`}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                Ten: e.target.value,
              }))
            }
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
              id="isActiveUpdateModal"
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  TrangThai: checked,
                }))
              }
            />
            <label
              htmlFor="isActiveUpdateModal"
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
            placeholder="Nhập mô tả tóm tắt..."
            className="h-28 resize-none rounded-lg text-xs"
          />
        </div>
      </div>
    </SlideOver>
  );
}
