"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRightLeft, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useChuyenQuyenSoHuu } from "@/hooks/LichSuSoHuuPhuongTien/useLichSuSoHuuPhuongTienApi";
import { ChuyenQuyenSoHuuPayload } from "@/types/lichSuSoHuuPhuongTien";

export const LY_DO_OPTIONS: SelectOption[] = [
  { value: "SangTen", label: "Sang tên xe (Chuyển quyền chủ mới)" },
  { value: "ThuCuDoiMoi", label: "Thu cũ đổi mới (Trade-in)" },
  { value: "BanLai", label: "Bán lại xe cũ cho cửa hàng" },
];

const chuyenQuyenSchema = z.object({
  phuongTienKhachHangID: z.string().min(1, "Vui lòng chọn xe cần chuyển quyền"),
  khachHangMoiID: z.string().min(1, "Vui lòng chọn chủ sở hữu mới"),
  lyDo: z.string().min(1, "Vui lòng chọn lý do chuyển quyền"),
});

interface TransferOwnershipSlideOverProps {
  open: boolean;
  onClose: () => void;
  vehicleOptions: SelectOption[];
  customerOptions: SelectOption[];
  isLoadingVehicles?: boolean;
  isLoadingCustomers?: boolean;
  defaultVehicleId?: string;
  onSuccess?: () => void;
}

export const TransferOwnershipSlideOver: React.FC<TransferOwnershipSlideOverProps> = ({
  open,
  onClose,
  vehicleOptions,
  customerOptions,
  isLoadingVehicles = false,
  isLoadingCustomers = false,
  defaultVehicleId = "",
  onSuccess,
}) => {
  const [formData, setFormData] = useState<ChuyenQuyenSoHuuPayload>({
    PhuongTienKhachHangID: defaultVehicleId || "",
    KhachHangMoiID: "",
    DonHangID: null,
    LyDo: "SangTen",
    GhiChu: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const transferMutation = useChuyenQuyenSoHuu();

  // Reset/sync form state when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        PhuongTienKhachHangID: defaultVehicleId || "",
        KhachHangMoiID: "",
        DonHangID: null,
        LyDo: "SangTen",
        GhiChu: "",
      });
      setErrors({});
    }
  }, [open, defaultVehicleId]);

  const handleChange = (field: keyof ChuyenQuyenSoHuuPayload, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field.charAt(0).toLowerCase() + field.slice(1)]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field.charAt(0).toLowerCase() + field.slice(1)];
        return copy;
      });
    }
  };

  const handleSubmit = async () => {
    try {
      chuyenQuyenSchema.parse({
        phuongTienKhachHangID: formData.PhuongTienKhachHangID,
        khachHangMoiID: formData.KhachHangMoiID,
        lyDo: formData.LyDo,
      });

      setErrors({});
      await transferMutation.mutateAsync(formData);
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng nhập đầy đủ thông tin chuyển quyền!");
      }
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chuyển quyền Sở hữu / Sang tên xe"
      description="Bàn giao phương tiện cho chủ sở hữu mới hoặc ghi nhận thu cũ đổi mới"
      icon={ArrowRightLeft}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={transferMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-medium"
            onClick={handleSubmit}
            disabled={transferMutation.isPending}
          >
            {transferMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Xác nhận sang tên
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-900 dark:text-indigo-200">
          Hệ thống sẽ cập nhật thời gian kết thúc sở hữu của chủ cũ và thiết lập
          khách hàng mới làm <strong>Chủ sở hữu hiện tại</strong> của phương tiện.
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* 1. Phương tiện xe */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Phương tiện xe cần sang tên <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={vehicleOptions}
              value={formData.PhuongTienKhachHangID}
              onChange={(val) => handleChange("PhuongTienKhachHangID", String(val))}
              placeholder="Chọn xe cần sang tên"
              isLoading={isLoadingVehicles}
              height={10}
              className={errors.phuongTienKhachHangID ? "border-red-500 ring-1 ring-red-500/30" : ""}
            />
            {errors.phuongTienKhachHangID && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.phuongTienKhachHangID}
              </p>
            )}
          </div>

          {/* 2. Chủ sở hữu mới */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Khách hàng chủ sở hữu mới <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={customerOptions}
              value={formData.KhachHangMoiID}
              onChange={(val) => handleChange("KhachHangMoiID", String(val))}
              placeholder="Chọn người nhận quyền sở hữu mới"
              isLoading={isLoadingCustomers}
              height={10}
              className={errors.khachHangMoiID ? "border-red-500 ring-1 ring-red-500/30" : ""}
            />
            {errors.khachHangMoiID && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.khachHangMoiID}
              </p>
            )}
          </div>

          {/* 3. Lý do chuyển quyền */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Hình thức chuyển giao <span className="text-red-500">*</span>
            </label>
            <SearchSelect
              options={LY_DO_OPTIONS}
              value={formData.LyDo}
              onChange={(val) => handleChange("LyDo", String(val))}
              height={10}
              className={errors.lyDo ? "border-red-500" : ""}
            />
            {errors.lyDo && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.lyDo}
              </p>
            )}
          </div>

          {/* 4. Ghi chú bàn giao */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Ghi chú bàn giao
            </label>
            <Input
              value={formData.GhiChu || ""}
              onChange={(e) => handleChange("GhiChu", e.target.value)}
              placeholder="Ghi chú về giấy tờ bàn giao, số tiền chuyển nhượng..."
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    </SlideOver>
  );
};
