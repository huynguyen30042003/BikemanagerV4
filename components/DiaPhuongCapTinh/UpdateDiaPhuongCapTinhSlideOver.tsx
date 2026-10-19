"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { SquarePen, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect } from "@/components/ui/selectSearch";
import { DM_DiaPhuongCapTinh, UpdateDiaPhuongCapTinhPayload } from "@/types/diaPhuongCapTinh";
import { useUpdateDiaPhuongCapTinh } from "@/hooks/DiaPhuongCapTinh/useDiaPhuongCapTinhApi";
import { diaPhuongCapTinhSchema } from "@/hooks/DiaPhuongCapTinh/useDiaPhuongCapTinh";

const LOAI_TINH_OPTIONS = [
  { value: 1, label: "Tỉnh" },
  { value: 2, label: "Thành phố trực thuộc TW" },
];

interface UpdateDiaPhuongCapTinhSlideOverProps {
  open: boolean;
  onClose: () => void;
  data: DM_DiaPhuongCapTinh | null;
  onSuccess?: () => void;
}

export function UpdateDiaPhuongCapTinhSlideOver({
  open,
  onClose,
  data,
  onSuccess,
}: UpdateDiaPhuongCapTinhSlideOverProps) {
  const updateMutation = useUpdateDiaPhuongCapTinh();

  const [formData, setFormData] = useState<UpdateDiaPhuongCapTinhPayload>({
    TinhID: 0,
    MaTinh: "",
    Ten: "",
    TenKhongDau: "",
    ThuTu: 1,
    Loai: 1,
    TrangThai: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && data) {
      setFormData({
        TinhID: data.tinhID,
        MaTinh: data.maTinh,
        Ten: data.ten,
        TenKhongDau: data.tenKhongDau || "",
        ThuTu: data.thuTu ?? 1,
        Loai: data.loai ?? 1,
        TrangThai: data.trangThai ?? true,
      });
      setErrors({});
    }
  }, [open, data]);

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
      const res = await updateMutation.mutateAsync({
        ...formData,
        MaTinh: formData.MaTinh.trim(),
        Ten: formData.Ten.trim(),
        TenKhongDau: formData.TenKhongDau?.trim() || "",
      });

      if (res && (res.code === 200 || res.status === "success" || res.isSuccess)) {
        toast.success(res.message || "Cập nhật tỉnh / thành phố thành công!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || "Không thể cập nhật tỉnh / thành phố");
      }
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(errorMessage || "Đã xảy ra lỗi khi cập nhật tỉnh / thành phố");
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Cập nhật Tỉnh / TP #${formData.TinhID}`}
      description="Chỉnh sửa thông tin đơn vị hành chính cấp tỉnh"
      icon={SquarePen}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu thay đổi
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
            placeholder="Nhập mã..."
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
            placeholder="Nhập tên..."
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
            placeholder="Nhập tên không dấu..."
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
              id="isActiveTinhUpdate"
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
            <label
              htmlFor="isActiveTinhUpdate"
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
