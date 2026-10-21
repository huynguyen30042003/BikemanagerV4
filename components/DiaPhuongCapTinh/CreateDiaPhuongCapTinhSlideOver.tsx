"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Building2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect } from "@/components/ui/selectSearch";
import { CreateDiaPhuongCapTinhPayload } from "@/types/diaPhuongCapTinh";
import { useCreateDiaPhuongCapTinh } from "@/hooks/DiaPhuongCapTinh/useDiaPhuongCapTinhApi";
import { diaPhuongCapTinhSchema } from "@/hooks/DiaPhuongCapTinh/useDiaPhuongCapTinh";

const LOAI_TINH_OPTIONS = [
  { value: 1, label: "Tỉnh" },
  { value: 2, label: "Thành phố trực thuộc TW" },
];

interface CreateDiaPhuongCapTinhSlideOverProps {
  open: boolean;
  onClose: () => void;
  defaultThuTu?: number;
  onSuccess?: () => void;
}

export function CreateDiaPhuongCapTinhSlideOver({
  open,
  onClose,
  defaultThuTu = 1,
  onSuccess,
}: CreateDiaPhuongCapTinhSlideOverProps) {
  const createMutation = useCreateDiaPhuongCapTinh();

  const [formData, setFormData] = useState<CreateDiaPhuongCapTinhPayload>({
    MaTinh: "",
    Ten: "",
    TenKhongDau: "",
    ThuTu: defaultThuTu,
    Loai: 1,
    TrangThai: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData({
        MaTinh: "",
        Ten: "",
        TenKhongDau: "",
        ThuTu: defaultThuTu,
        Loai: 1,
        TrangThai: true,
      });
      setErrors({});
    }
  }, [open, defaultThuTu]);

  const handleSubmit = async () => {
    const result = diaPhuongCapTinhSchema.safeParse({
      maTinh: formData.MaTinh,
      ten: formData.Ten,
      thuTu: formData.ThuTu,
      loai: formData.Loai,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Vui lòng kiểm tra lại thông tin nhập");
      return;
    }

    setErrors({});

    try {
      const res = await createMutation.mutateAsync({
        ...formData,
        MaTinh: formData.MaTinh.trim(),
        Ten: formData.Ten.trim(),
        TenKhongDau: formData.TenKhongDau?.trim() || "",
      });

      if (res && (res.code === 200 || res.status === "success" || res.isSuccess)) {
        toast.success(res.message || "Thêm tỉnh / thành phố mới thành công!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || "Không thể thêm tỉnh / thành phố");
      }
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(errorMessage || "Đã xảy ra lỗi khi tạo tỉnh / thành phố");
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới Tỉnh / Thành phố"
      description="Khai báo đơn vị hành chính cấp tỉnh vào hệ thống"
      icon={Building2}
      footer={
        <>
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
            Lưu tỉnh / TP
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Mã tỉnh <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.MaTinh}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, MaTinh: e.target.value }));
              if (errors.maTinh) setErrors((prev) => ({ ...prev, maTinh: "" }));
            }}
            placeholder="Ví dụ: 01, 79..."
            className={`font-mono rounded-lg ${errors.maTinh ? "border-red-500" : ""}`}
          />
          {errors.maTinh && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.maTinh}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Phân loại <span className="text-red-500">*</span>
          </label>
          <SearchSelect
            options={LOAI_TINH_OPTIONS}
            value={formData.Loai}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, Loai: Number(val) || 1 }))
            }
            placeholder="Chọn loại..."
            height={10}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tên Tỉnh / Thành phố <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.Ten}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, Ten: e.target.value }));
              if (errors.ten) setErrors((prev) => ({ ...prev, ten: "" }));
            }}
            placeholder="Ví dụ: Thành phố Hà Nội, Tỉnh Đồng Nai..."
            className={`rounded-lg ${errors.ten ? "border-red-500" : ""}`}
          />
          {errors.ten && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.ten}
            </p>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tên không dấu
          </label>
          <Input
            value={formData.TenKhongDau || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, TenKhongDau: e.target.value }))
            }
            placeholder="Ví dụ: Thanh pho Ha Noi..."
            className="rounded-lg"
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Thứ tự hiển thị
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
            className="rounded-lg font-mono"
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5 justify-end pb-1">
          <span className="text-sm font-medium text-foreground">
            Trạng thái
          </span>
          <div className="flex items-center gap-2.5 h-9.5 px-3 rounded-lg border border-border/70 bg-muted/30">
            <Switch
              id="isActiveTinhAdd"
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
            <label
              htmlFor="isActiveTinhAdd"
              className="text-xs font-medium cursor-pointer select-none"
            >
              {formData.TrangThai ? "Kích hoạt" : "Tạm khóa"}
            </label>
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
