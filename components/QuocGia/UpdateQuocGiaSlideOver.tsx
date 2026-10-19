"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { SquarePen, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { DM_QuocGia, UpdateQuocGiaPayload } from "@/types/quocGia";
import { useUpdateQuocGia } from "@/hooks/QuocGia/useQuocGiaApi";
import { quocGiaSchema } from "@/hooks/QuocGia/useQuocGia";

interface UpdateQuocGiaSlideOverProps {
  open: boolean;
  onClose: () => void;
  data: DM_QuocGia | null;
  onSuccess?: () => void;
}

export function UpdateQuocGiaSlideOver({
  open,
  onClose,
  data,
  onSuccess,
}: UpdateQuocGiaSlideOverProps) {
  const updateMutation = useUpdateQuocGia();

  const [formData, setFormData] = useState<UpdateQuocGiaPayload>({
    QuocGiaID: 0,
    MaQuocGia: "",
    Ten: "",
    TenKhongDau: "",
    ThuTu: 1,
    TrangThai: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && data) {
      setFormData({
        QuocGiaID: data.quocGiaID,
        MaQuocGia: data.maQuocGia,
        Ten: data.ten,
        TenKhongDau: data.tenKhongDau || "",
        ThuTu: data.thuTu ?? 1,
        TrangThai: data.trangThai ?? true,
      });
      setErrors({});
    }
  }, [open, data]);

  const handleSubmit = async () => {
    const result = quocGiaSchema.safeParse({
      maQuocGia: formData.MaQuocGia,
      ten: formData.Ten,
      thuTu: formData.ThuTu,
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
        MaQuocGia: formData.MaQuocGia.trim().toUpperCase(),
        Ten: formData.Ten.trim(),
        TenKhongDau: formData.TenKhongDau?.trim() || "",
      });

      if (res && (res.code === 200 || res.status === "success" || res.isSuccess || !res.code)) {
        toast.success(res?.message || "Cập nhật quốc gia thành công!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || "Không thể cập nhật quốc gia");
      }
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(errorMessage || "Có lỗi xảy ra khi cập nhật quốc gia");
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title={`Cập nhật Quốc gia #${formData.QuocGiaID}`}
      description="Chỉnh sửa thông tin và mã định danh quốc gia theo chuẩn ISO"
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
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
        {/* Mã Quốc gia */}
        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Mã Quốc gia <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.MaQuocGia}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                MaQuocGia: e.target.value.toUpperCase(),
              }))
            }
            placeholder="Nhập mã..."
            maxLength={10}
            className={`font-mono uppercase rounded-lg ${
              errors.maQuocGia ? "border-red-500" : ""
            }`}
          />
          {errors.maQuocGia && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.maQuocGia}
            </p>
          )}
        </div>

        {/* Thứ tự hiển thị */}
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

        {/* Tên Quốc gia */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tên Quốc gia <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.Ten}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, Ten: e.target.value }))
            }
            placeholder="Nhập tên quốc gia..."
            className={`rounded-lg ${errors.ten ? "border-red-500" : ""}`}
          />
          {errors.ten && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.ten}
            </p>
          )}
        </div>

        {/* Tên không dấu */}
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tên không dấu
          </label>
          <Input
            value={formData.TenKhongDau || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                TenKhongDau: e.target.value,
              }))
            }
            placeholder="Nhập tên không dấu..."
            className="rounded-lg"
          />
          <span className="text-[11px] text-muted-foreground">
            Hỗ trợ tìm kiếm nhanh không dấu
          </span>
        </div>

        {/* Trạng thái */}
        <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
          <div>
            <p className="text-sm font-medium text-foreground">
              Trạng thái kích hoạt
            </p>
            <p className="text-xs text-muted-foreground">
              Kích hoạt sử dụng quốc gia trong toàn bộ hệ thống
            </p>
          </div>
          <Switch
            id="isActiveQuocGiaUpdate"
            checked={formData.TrangThai}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, TrangThai: checked }))
            }
          />
        </div>
      </div>
    </SlideOver>
  );
}
