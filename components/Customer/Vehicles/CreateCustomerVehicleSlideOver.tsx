"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Bike, RefreshCw, AlertCircle, BatteryCharging } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CreatePhuongTienPayload } from "@/types/phuongTienKhachHang";
import { useCreatePhuongTien } from "@/hooks/PhuongTienKhachHang/usePhuongTienKhachHangApi";
import { phuongTienSchema } from "@/hooks/PhuongTienKhachHang/usePhuongTienKhachHang";

interface CreateCustomerVehicleSlideOverProps {
  open: boolean;
  onClose: () => void;
  customerOptions: SelectOption[];
  isLoadingCustomers?: boolean;
  defaultKhachHangId?: string;
  onSuccess?: () => void;
}

const initialPayload: CreatePhuongTienPayload = {
  KhachHangID: "",
  ThuongHieuID: null,
  TenModel: "",
  BienSo: "",
  SoKhung: "",
  SoMay: "",
  SoPin: "",
  MauSac: "",
  SoKmHienTai: 0,
  NgayMua: "",
  GhiChu: "",
  TrangThai: true,
};

export const CreateCustomerVehicleSlideOver: React.FC<CreateCustomerVehicleSlideOverProps> = ({
  open,
  onClose,
  customerOptions,
  isLoadingCustomers = false,
  defaultKhachHangId = "",
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreatePhuongTienPayload>({
    ...initialPayload,
    KhachHangID: defaultKhachHangId,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreatePhuongTien();

  useEffect(() => {
    if (open) {
      setFormData({
        ...initialPayload,
        KhachHangID: defaultKhachHangId,
      });
      setErrors({});
    }
  }, [open, defaultKhachHangId]);

  const handleSubmit = async () => {
    try {
      phuongTienSchema.parse({
        khachHangID: formData.KhachHangID,
        tenModel: formData.TenModel,
        bienSo: formData.BienSo,
      });

      setErrors({});
      await createMutation.mutateAsync(formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng nhập đầy đủ thông tin phương tiện bắt buộc!");
      }
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Đăng Ký Phương Tiện Mới"
      description="Thêm hồ sơ xe gắn liền với thông tin chủ sở hữu và số nhận dạng"
      icon={Bike}
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
            Lưu phương tiện
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3.5">
        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Khách hàng chủ sở hữu <span className="text-red-500">*</span>
          </label>
          <SearchSelect
            options={customerOptions}
            value={formData.KhachHangID}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, KhachHangID: String(val) }))
            }
            placeholder="Chọn khách hàng sở hữu..."
            isLoading={isLoadingCustomers}
            className={errors.khachHangID ? "border-red-500" : ""}
          />
          {errors.khachHangID && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.khachHangID}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Dòng xe / Model <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.TenModel}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, TenModel: e.target.value }))
            }
            placeholder="Ví dụ: VinFast Feliz S..."
            className={`rounded-lg ${errors.tenModel ? "border-red-500" : ""}`}
          />
          {errors.tenModel && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.tenModel}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Biển số xe <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.BienSo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                BienSo: e.target.value.toUpperCase(),
              }))
            }
            placeholder="Ví dụ: 29A1-123.45"
            className={`font-mono uppercase rounded-lg ${errors.bienSo ? "border-red-500" : ""}`}
          />
          {errors.bienSo && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.bienSo}
            </p>
          )}
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Màu sắc</label>
          <Input
            value={formData.MauSac || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MauSac: e.target.value }))
            }
            placeholder="Đen nhám, Trắng, Đỏ..."
            className="rounded-lg"
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Số Km hiện tại (ODO)
          </label>
          <Input
            type="number"
            min={0}
            value={formData.SoKmHienTai || 0}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoKmHienTai: parseInt(e.target.value) || 0,
              }))
            }
            className="font-mono rounded-lg"
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Số khung</label>
          <Input
            value={formData.SoKhung || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoKhung: e.target.value.toUpperCase(),
              }))
            }
            placeholder="VF12345678..."
            className="font-mono uppercase rounded-lg"
          />
        </div>

        <div className="col-span-1 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Số máy</label>
          <Input
            value={formData.SoMay || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoMay: e.target.value.toUpperCase(),
              }))
            }
            placeholder="ENG123456..."
            className="font-mono uppercase rounded-lg"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
            Mã Serial Pin (Dành cho xe máy điện)
          </label>
          <Input
            value={formData.SoPin || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                SoPin: e.target.value.toUpperCase(),
              }))
            }
            placeholder="PIN-LFP-019283..."
            className="font-mono uppercase rounded-lg"
          />
        </div>

        <div className="col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Ghi chú</label>
          <Input
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            placeholder="Tình trạng xe khi tiếp nhận..."
            className="rounded-lg"
          />
        </div>

        <div className="col-span-2 flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/30">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">
              Trạng thái sử dụng
            </span>
            <span className="text-xs text-muted-foreground">
              Xe đang hoạt động bình thường và sẵn sàng làm dịch vụ
            </span>
          </div>
          <Switch
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
