"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Barcode,
  Package,
  Zap,
  BatteryCharging,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { useCreateSoSerial } from "@/hooks/SoSerial/useSoSerialApi";
import { CreateSoSerialPayload } from "@/types/soSerial";
import DatePickerInput from "../ui/DatePickerInput";

const soSerialSchema = z.object({
  bienTheSanPhamID: z
    .string()
    .min(1, "Vui lòng chọn dòng xe / biến thể sản phẩm"),
  maSerial: z.string().trim().min(1, "Vui lòng nhập mã serial tem dán"),
});

interface CreateProductSerialSlideOverProps {
  open: boolean;
  onClose: () => void;
  variantOptions: SelectOption[];
  isLoadingVariants?: boolean;
  defaultBienTheId?: string;
  onSuccess?: () => void;
}

export const CreateProductSerialSlideOver: React.FC<
  CreateProductSerialSlideOverProps
> = ({
  open,
  onClose,
  variantOptions,
  isLoadingVariants = false,
  defaultBienTheId = "",
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateSoSerialPayload>({
    BienTheSanPhamID: defaultBienTheId,
    MaSerial: "",
    SoKhung: "",
    SoMay: "",
    SoPin: "",
    TrangThaiID: 59,
    KhoID: null,
    ViTriLuuTru: "",
    NgaySanXuat: "",
    GhiChu: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreateSoSerial();

  useEffect(() => {
    if (open) {
      setFormData({
        BienTheSanPhamID: defaultBienTheId,
        MaSerial: "",
        SoKhung: "",
        SoMay: "",
        SoPin: "",
        TrangThaiID: 59,
        KhoID: null,
        ViTriLuuTru: "",
        NgaySanXuat: "",
        GhiChu: "",
      });
      setErrors({});
    }
  }, [open, defaultBienTheId]);

  const handleSubmit = async () => {
    try {
      soSerialSchema.parse({
        bienTheSanPhamID: formData.BienTheSanPhamID,
        maSerial: formData.MaSerial,
      });

      setErrors({});
      await createMutation.mutateAsync(formData);
      onClose();
      onSuccess?.();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      }
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Đăng ký Số Serial & Khung Xe"
      description="Khai báo mã serial, số khung VIN, số động cơ và khối pin để quản lý định danh tài sản"
      icon={Barcode}
      footer={
        <div className="flex items-center gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={createMutation.isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Xác nhận tạo Serial
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        {/* Biến thể sản phẩm */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Dòng xe / Biến thể sản phẩm <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            placeholder="Chọn biến thể xe hoặc phụ tùng"
            options={variantOptions}
            value={formData.BienTheSanPhamID}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                BienTheSanPhamID: String(val || ""),
              }))
            }
            isLoading={isLoadingVariants}
            height={10}
            className={errors.bienTheSanPhamID ? "border-red-500" : ""}
          />
          {errors.bienTheSanPhamID && (
            <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.bienTheSanPhamID}
            </p>
          )}
        </div>

        {/* Mã Serial tem dán */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Mã Serial tem dán / Barcode <span className="text-rose-500">*</span>
          </label>
          <Input
            placeholder="Ví dụ: SR-VIN-2026-8890"
            value={formData.MaSerial}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MaSerial: e.target.value }))
            }
            className={`text-xs font-mono uppercase ${
              errors.maSerial ? "border-red-500" : ""
            }`}
          />
          {errors.maSerial && (
            <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.maSerial}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Mã barcode dán tem trên thân xe hoặc bao bì linh kiện
          </p>
        </div>

        {/* Định danh xe: Số khung, máy, pin */}
        <div className="p-3.5 rounded-lg border border-border/80 bg-muted/40 space-y-3">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-blue-500" />
            Định danh xe máy điện / Phương tiện
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Số khung (Số VIN)
              </label>
              <Input
                placeholder="Ví dụ: RL4HF0500... (17 ký tự)"
                value={formData.SoKhung || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    SoKhung: e.target.value.toUpperCase(),
                  }))
                }
                className="text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" /> Số máy / Động cơ
              </label>
              <Input
                placeholder="Ví dụ: EM-1500W-2026-X"
                value={formData.SoMay || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    SoMay: e.target.value.toUpperCase(),
                  }))
                }
                className="text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <BatteryCharging className="w-3 h-3 text-emerald-500" /> Số Serial
              khối Pin
            </label>
            <Input
              placeholder="Ví dụ: BAT-LFP-72V30AH-889"
              value={formData.SoPin || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  SoPin: e.target.value.toUpperCase(),
                }))
              }
              className="text-xs font-mono uppercase"
            />
          </div>
        </div>

        {/* Vị trí lưu kho & Ngày sản xuất */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Vị trí lưu kho / Kệ hàng
            </label>
            <Input
              placeholder="Ví dụ: Kệ A1 - Tầng 2"
              value={formData.ViTriLuuTru || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ViTriLuuTru: e.target.value,
                }))
              }
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ngày sản xuất
            </label>
            <DatePickerInput
              value={formData.NgaySanXuat || ""}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  NgaySanXuat: val,
                }))
              }
              max={new Date()}
              placeholder="dd/MM/yyyy"
            />
          </div>
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú nội bộ
          </label>
          <textarea
            rows={2}
            placeholder="Thông tin thêm về nguồn gốc lô hàng hoặc kiểm định..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
    </SlideOver>
  );
};
