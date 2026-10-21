"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Compass, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CreateDiaPhuongCapXaPayload } from "@/types/diaPhuongCapXa";
import { useCreateDiaPhuongCapXa } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXaApi";
import { diaPhuongCapXaSchema } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXa";

const LOAI_XA_OPTIONS: SelectOption[] = [
  { value: 1, label: "Xã" },
  { value: 2, label: "Phường" },
  { value: 3, label: "Thị trấn / Đặc khu" },
];

interface CreateDiaPhuongCapXaSlideOverProps {
  open: boolean;
  onClose: () => void;
  provinceOptions: SelectOption[];
  defaultTinhId?: number;
  defaultThuTu?: number;
  onSuccess?: () => void;
}

export function CreateDiaPhuongCapXaSlideOver({
  open,
  onClose,
  provinceOptions,
  defaultTinhId = 0,
  defaultThuTu = 1,
  onSuccess,
}: CreateDiaPhuongCapXaSlideOverProps) {
  const createMutation = useCreateDiaPhuongCapXa();

  const [formData, setFormData] = useState<CreateDiaPhuongCapXaPayload>({
    TinhID: defaultTinhId,
    MaXa: "",
    Ten: "",
    TenKhongDau: "",
    Loai: 1,
    ThuTu: defaultThuTu,
    TrangThai: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData({
        TinhID: defaultTinhId,
        MaXa: "",
        Ten: "",
        TenKhongDau: "",
        Loai: 1,
        ThuTu: defaultThuTu,
        TrangThai: true,
      });
      setErrors({});
    }
  }, [open, defaultTinhId, defaultThuTu]);

  const handleSubmit = async () => {
    const result = diaPhuongCapXaSchema.safeParse({
      tinhID: formData.TinhID,
      maXa: formData.MaXa,
      ten: formData.Ten,
      loai: formData.Loai,
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
      const res = await createMutation.mutateAsync({
        ...formData,
        MaXa: formData.MaXa.trim(),
        Ten: formData.Ten.trim(),
        TenKhongDau: formData.TenKhongDau?.trim() || "",
      });

      if (res && (res.code === 200 || res.status === "success" || res.isSuccess)) {
        toast.success(res.message || "Thêm xã / phường mới thành công!");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || "Không thể thêm xã / phường");
      }
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      toast.error(errorMessage || "Đã xảy ra lỗi khi tạo xã / phường");
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới Xã / Phường"
      description="Khai báo đơn vị hành chính cấp cơ sở thuộc tỉnh / thành phố"
      icon={Compass}
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
            Lưu xã / phường
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Trực thuộc Tỉnh / Thành phố <span className="text-red-500">*</span>
          </label>
          <SearchSelect
            options={provinceOptions}
            value={formData.TinhID || ""}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, TinhID: Number(val) || 0 }));
              if (errors.tinhID) setErrors((prev) => ({ ...prev, tinhID: "" }));
            }}
            placeholder="-- Chọn Tỉnh / TP --"
            height={10}
          />
          {errors.tinhID && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tinhID}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Mã xã <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.MaXa}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, MaXa: e.target.value }));
              if (errors.maXa) setErrors((prev) => ({ ...prev, maXa: "" }));
            }}
            placeholder="Ví dụ: 00001..."
            className={`font-mono rounded-lg ${errors.maXa ? "border-red-500" : ""}`}
          />
          {errors.maXa && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.maXa}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Phân loại <span className="text-red-500">*</span>
          </label>
          <SearchSelect
            options={LOAI_XA_OPTIONS}
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
            Tên Xã / Phường / Thị trấn <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.Ten}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, Ten: e.target.value }));
              if (errors.ten) setErrors((prev) => ({ ...prev, ten: "" }));
            }}
            placeholder="Ví dụ: Phường Phúc Xá, Xã Tiền Phong..."
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
            placeholder="Ví dụ: Phuong Phuc Xa..."
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
              id="isActiveXaAdd"
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
            <label
              htmlFor="isActiveXaAdd"
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
