"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/ui/selectSearch";
import { useCreateBaoHanh } from "@/hooks/BaoHanh/useBaoHanhApi";
import { CreateBaoHanhPayload } from "@/types/baoHanh";
import {
  ShieldCheck,
  Calendar,
  User,
  Barcode,
  AlertCircle,
} from "lucide-react";

export const warrantySchema = z.object({
  SoSerialID: z.string().min(1, "Vui lòng chọn số serial / khung xe"),
  BienTheSanPhamID: z.string().min(1, "Biến thể sản phẩm không hợp lệ"),
  KhachHangID: z.string().min(1, "Vui lòng chọn khách hàng sở hữu"),
  SoThangBaoHanh: z.number().min(1, "Thời hạn bảo hành tối thiểu 1 tháng"),
  GioiHanKm: z
    .number()
    .min(0, "Giới hạn Km không được âm")
    .optional()
    .nullable(),
  TrangThaiID: z.number().min(1, "Vui lòng chọn trạng thái sổ bảo hành"),
  DieuKienBaoHanh: z.string().optional().nullable(),
  GhiChu: z.string().optional().nullable(),
});

interface OptionItem {
  value: string | number;
  label: string;
  bienTheID?: string;
}

interface CreateWarrantySlideOverProps {
  open: boolean;
  onClose: () => void;
  serialOptions: OptionItem[];
  customerOptions: OptionItem[];
  warrantyStatusOptions: OptionItem[];
  isLoadingStatuses?: boolean;
  onSuccess?: () => void;
}

export function CreateWarrantySlideOver({
  open,
  onClose,
  serialOptions,
  customerOptions,
  warrantyStatusOptions,
  isLoadingStatuses = false,
  onSuccess,
}: CreateWarrantySlideOverProps) {
  const [formData, setFormData] = useState<CreateBaoHanhPayload>({
    SoSerialID: "",
    BienTheSanPhamID: "",
    KhachHangID: "",
    NgayKichHoat: new Date().toISOString(),
    NgayBatDau: new Date().toISOString(),
    NgayKetThuc: new Date(
      Date.now() + 365 * 24 * 3600 * 1000 * 3,
    ).toISOString(),
    SoThangBaoHanh: 36,
    GioiHanKm: 30000,
    TrangThaiID: 91, // Đang hiệu lực
    DieuKienBaoHanh:
      "Bảo hành 3 năm hoặc 30.000 km đối với khung sườn, động cơ và pin",
    GhiChu: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateBaoHanh();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      const defaultSerial = serialOptions[0];
      const defaultCustomer = customerOptions[0];
      const defaultStatus = warrantyStatusOptions[0]?.value
        ? Number(warrantyStatusOptions[0].value)
        : 91;

      setFormData({
        SoSerialID: defaultSerial?.value ? String(defaultSerial.value) : "",
        BienTheSanPhamID: defaultSerial?.bienTheID ?? "",
        KhachHangID: defaultCustomer?.value
          ? String(defaultCustomer.value)
          : "",
        NgayKichHoat: new Date().toISOString(),
        NgayBatDau: new Date().toISOString(),
        NgayKetThuc: new Date(
          Date.now() + 365 * 24 * 3600 * 1000 * 3,
        ).toISOString(),
        SoThangBaoHanh: 36,
        GioiHanKm: 30000,
        TrangThaiID: defaultStatus,
        DieuKienBaoHanh:
          "Bảo hành 3 năm hoặc 30.000 km đối với khung sườn, động cơ và pin",
        GhiChu: "",
      });
      setErrors({});
    }
  }, [open, serialOptions, customerOptions, warrantyStatusOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = warrantySchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      toast.warning("Vui lòng kiểm tra lại thông tin nhập!");
      return;
    }

    try {
      await createMutation.mutateAsync(formData);
      toast.success("Kích hoạt sổ bảo hành điện tử thành công!");
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể kích hoạt bảo hành!";
      toast.error(message);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Kích Hoạt Sổ Bảo Hành Điện Tử"
      description="Tạo sổ bảo hành điện tử cho phương tiện/thiết bị theo số serial hoặc số khung VIN"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Serial / Xe */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <Barcode className="w-3.5 h-3.5 text-blue-500" />
            <span>Xe / Serial / Số Khung</span>
            <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn số serial / khung xe..."
            options={serialOptions}
            value={formData.SoSerialID}
            onChange={(val) => {
              const selected = serialOptions.find((x) => x.value === val);
              setFormData((prev) => ({
                ...prev,
                SoSerialID: String(val),
                BienTheSanPhamID: selected?.bienTheID || prev.BienTheSanPhamID,
              }));
              if (errors.SoSerialID) {
                setErrors((prev) => ({ ...prev, SoSerialID: "" }));
              }
            }}
          />
          {errors.SoSerialID && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.SoSerialID}
            </p>
          )}
        </div>

        {/* Khách hàng */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span>Khách hàng sở hữu</span>
            <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn khách hàng..."
            options={customerOptions}
            value={formData.KhachHangID}
            onChange={(val) => {
              setFormData((prev) => ({ ...prev, KhachHangID: String(val) }));
              if (errors.KhachHangID) {
                setErrors((prev) => ({ ...prev, KhachHangID: "" }));
              }
            }}
          />
          {errors.KhachHangID && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.KhachHangID}
            </p>
          )}
        </div>

        {/* Thời hạn & Giới hạn km */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Thời hạn BH (tháng)</span>
            </label>
            <Input
              type="number"
              min={1}
              value={formData.SoThangBaoHanh}
              onChange={(e) => {
                const months = parseInt(e.target.value) || 12;
                setFormData((prev) => ({
                  ...prev,
                  SoThangBaoHanh: months,
                  NgayKetThuc: new Date(
                    Date.now() + months * 30 * 24 * 3600 * 1000,
                  ).toISOString(),
                }));
              }}
              className="text-xs font-mono"
            />
            {errors.SoThangBaoHanh && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.SoThangBaoHanh}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Giới hạn Km (ODO)
            </label>
            <Input
              type="number"
              min={0}
              step={1000}
              value={formData.GioiHanKm ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  GioiHanKm: parseInt(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono"
            />
          </div>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Trạng thái bảo hành</span>
          </label>
          <SearchSelect
            options={warrantyStatusOptions}
            value={Number(formData.TrangThaiID)}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, TrangThaiID: Number(val) }))
            }
            isLoading={isLoadingStatuses}
          />
        </div>

        {/* Điều kiện */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Điều kiện & Chính sách cam kết
          </label>
          <Textarea
            rows={3}
            placeholder="Mô tả chính sách bảo hành, cam kết thay mới linh kiện chính hãng..."
            value={formData.DieuKienBaoHanh || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                DieuKienBaoHanh: e.target.value,
              }))
            }
            className="text-xs"
          />
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú nội bộ
          </label>
          <Input
            placeholder="Ghi chú thêm (tùy chọn)..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={createMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
          >
            {createMutation.isPending ? "Đang lưu..." : "Kích hoạt bảo hành"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
