"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { BookmarkPlus, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CreateDanhMucChiTietPayload } from "@/types/danhMucChiTiet";
import { useCreateDanhMucChiTiet } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietApi";
import { danhMucChiTietSchema } from "@/hooks/DanhMucChiTiet/useDanhMucChiTiet";

interface CreateDanhMucChiTietSlideOverProps {
  open: boolean;
  onClose: () => void;
  parentCategoryOptions: SelectOption[];
  defaultParentId?: number;
  defaultThuTu?: number;
  onSuccess?: () => void;
}

export function CreateDanhMucChiTietSlideOver({
  open,
  onClose,
  parentCategoryOptions,
  defaultParentId,
  defaultThuTu = 1,
  onSuccess,
}: CreateDanhMucChiTietSlideOverProps) {
  const createDetail = useCreateDanhMucChiTiet();

  const [formData, setFormData] = useState<CreateDanhMucChiTietPayload>({
    DanhMucID: defaultParentId || 0,
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
        DanhMucID: defaultParentId || (parentCategoryOptions.length > 0 ? Number(parentCategoryOptions[0].value) : 0),
        Ten: "",
        MoTa: "",
        ThuTu: defaultThuTu,
        TrangThai: true,
      });
      setErrors({});
    }
  }, [open, defaultParentId, defaultThuTu, parentCategoryOptions]);

  const handleSubmit = async () => {
    const validation = danhMucChiTietSchema.safeParse({
      danhMucID: formData.DanhMucID,
      ten: formData.Ten,
      thuTu: formData.ThuTu,
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        errMap[fieldName] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    setErrors({});
    try {
      await createDetail.mutateAsync(formData);
      toast.success("Thêm danh mục chi tiết thành công");
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đã có lỗi xảy ra khi thêm danh mục chi tiết";
      toast.error(msg);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới danh mục chi tiết"
      description="Tạo một mục con thuộc danh mục dùng chung đã chọn"
      icon={BookmarkPlus}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={createDetail.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit}
            disabled={createDetail.isPending}
          >
            {createDetail.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Tạo danh mục
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {/* CUSTOM SEARCH SELECT: Danh mục chung cha (Bắt buộc theo rule) */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground flex items-center justify-between">
            <span>
              Danh mục chung (cha) <span className="text-red-500">*</span>
            </span>
            <span className="text-[11px] text-muted-foreground">Bắt buộc</span>
          </label>
          <SearchSelect
            options={parentCategoryOptions}
            value={formData.DanhMucID || ""}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                DanhMucID: Number(val) || 0,
              }))
            }
            placeholder="Chọn danh mục chung cha"
            className="w-full"
          />
          {errors.danhMucID && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.danhMucID}
            </p>
          )}
        </div>

        {/* Tên mục chi tiết */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground flex items-center justify-between">
            <span>
              Tên mục chi tiết <span className="text-red-500">*</span>
            </span>
            <span className="text-[11px] text-muted-foreground">Bắt buộc</span>
          </label>
          <Input
            value={formData.Ten}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Ten: e.target.value }))
            }
            placeholder="Ví dụ: Pin Lithium 48V, Xe đạp địa hình..."
            className={`rounded-lg ${
              errors.ten ? "border-red-500 focus-visible:ring-red-500/30" : ""
            }`}
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
          <label className="text-sm font-medium text-foreground">
            Thứ tự hiển thị
          </label>
          <Input
            type="number"
            min={0}
            value={formData.ThuTu}
            className="rounded-lg font-mono"
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
        <div className="col-span-1 flex flex-col gap-1.5 justify-end pb-1">
          <span className="text-sm font-medium text-foreground">
            Trạng thái
          </span>
          <div className="flex items-center gap-2.5 h-9.5 px-3 rounded-lg border border-border/70 bg-muted/30">
            <Switch
              id="isActiveDetailAddModal"
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  TrangThai: checked,
                }))
              }
            />
            <label
              htmlFor="isActiveDetailAddModal"
              className="text-xs font-medium text-foreground cursor-pointer select-none"
            >
              {formData.TrangThai ? "Kích hoạt sử dụng" : "Tạm khóa"}
            </label>
          </div>
        </div>

        {/* Mô tả */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Mô tả chi tiết
          </label>
          <Textarea
            value={formData.MoTa || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                MoTa: e.target.value,
              }))
            }
            placeholder="Nhập mô tả tóm tắt thuộc tính này..."
            className="h-28 resize-none rounded-lg text-sm"
          />
        </div>
      </div>
    </SlideOver>
  );
}
