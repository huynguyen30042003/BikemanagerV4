"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { SquarePen, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { DM_DanhMucChiTiet, UpdateDanhMucChiTietPayload } from "@/types/danhMucChiTiet";
import { useUpdateDanhMucChiTiet } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietApi";
import { danhMucChiTietSchema } from "@/hooks/DanhMucChiTiet/useDanhMucChiTiet";

interface UpdateDanhMucChiTietSlideOverProps {
  open: boolean;
  onClose: () => void;
  data: DM_DanhMucChiTiet | null;
  parentCategoryOptions: SelectOption[];
  onSuccess?: () => void;
}

export function UpdateDanhMucChiTietSlideOver({
  open,
  onClose,
  data,
  parentCategoryOptions,
  onSuccess,
}: UpdateDanhMucChiTietSlideOverProps) {
  const updateDetail = useUpdateDanhMucChiTiet();

  const [formData, setFormData] = useState<UpdateDanhMucChiTietPayload>({
    DanhMucChiTietID: 0,
    DanhMucID: 0,
    Ten: "",
    MoTa: "",
    ThuTu: 1,
    TrangThai: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync data when modal opens with target record
  useEffect(() => {
    if (open && data) {
      setFormData({
        DanhMucChiTietID: data.danhMucChiTietID,
        DanhMucID: data.danhMucID || 0,
        Ten: data.ten || "",
        MoTa: data.moTa || "",
        ThuTu: data.thuTu ?? 1,
        TrangThai: data.trangThai ?? true,
      });
      setErrors({});
    }
  }, [open, data]);

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
      await updateDetail.mutateAsync(formData);
      toast.success("Cập nhật danh mục chi tiết thành công");
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đã có lỗi xảy ra khi cập nhật danh mục chi tiết";
      toast.error(msg);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Cập nhật mục #${data?.danhMucChiTietID || formData.DanhMucChiTietID}`}
      description="Chỉnh sửa thông tin danh mục chi tiết"
      icon={SquarePen}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={updateDetail.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit}
            disabled={updateDetail.isPending}
          >
            {updateDetail.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu thay đổi
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

        {/* Tên danh mục con */}
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
            placeholder="Nhập tên mục chi tiết..."
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

        {/* Thứ tự */}
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
              id="isActiveDetailUpdateModal"
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  TrangThai: checked,
                }))
              }
            />
            <label
              htmlFor="isActiveDetailUpdateModal"
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
            placeholder="Nhập mô tả..."
            className="h-28 resize-none rounded-lg text-sm"
          />
        </div>
      </div>
    </SlideOver>
  );
}
