"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlideOver } from "@/components/ui/SlideOver";
import { KHO_TonKho, UpdateDinhMucPayload } from "@/types/tonKho";

export const dinhMucTonKhoSchema = z.object({
  soLuongToiThieu: z
    .number()
    .min(0, "Số lượng tối thiểu phải lớn hơn hoặc bằng 0"),
  viTriLuuTru: z.string().optional(),
});

export type DinhMucTonKhoFormData = z.infer<typeof dinhMucTonKhoSchema>;

export interface UpdateDinhMucSlideOverProps {
  open: boolean;
  onClose: () => void;
  selectedItem: KHO_TonKho | null;
  onSubmit: (data: UpdateDinhMucPayload) => Promise<void> | void;
  isUpdating: boolean;
}

export const UpdateDinhMucSlideOver: React.FC<UpdateDinhMucSlideOverProps> = ({
  open,
  onClose,
  selectedItem,
  onSubmit,
  isUpdating,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DinhMucTonKhoFormData>({
    resolver: zodResolver(dinhMucTonKhoSchema),
    defaultValues: {
      soLuongToiThieu: 5,
      viTriLuuTru: "",
    },
  });

  useEffect(() => {
    if (open && selectedItem) {
      reset({
        soLuongToiThieu: selectedItem.soLuongToiThieu ?? 5,
        viTriLuuTru: selectedItem.viTriLuuTru || "",
      });
    }
  }, [open, selectedItem, reset]);

  const onFormSubmit = async (values: DinhMucTonKhoFormData) => {
    if (!selectedItem) return;
    await onSubmit({
      KhoID: selectedItem.khoID,
      BienTheSanPhamID: selectedItem.bienTheSanPhamID,
      SoLuongToiThieu: values.soLuongToiThieu,
      ViTriLuuTru: values.viTriLuuTru?.trim() || "",
    });
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Cài Đặt Định Mức & Kệ Hàng"
      description="Thiết lập ngưỡng tồn kho an toàn và vị trí dãy/kệ lưu trữ trong kho"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-2">
        {selectedItem && (
          <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 space-y-1">
            <span className="font-mono text-xs font-bold text-foreground block">
              {selectedItem.maSKU}
            </span>
            <p className="text-xs font-semibold text-foreground">
              {selectedItem.tenBienThe}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Tại kho: {selectedItem.tenKho}
            </p>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Số lượng tồn kho tối thiểu (Ngưỡng cảnh báo){" "}
            <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            min={0}
            {...register("soLuongToiThieu", { valueAsNumber: true })}
            className={`text-xs font-mono ${errors.soLuongToiThieu ? "border-red-500 ring-1 ring-red-500/20" : ""}`}
          />
          {errors.soLuongToiThieu ? (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.soLuongToiThieu.message}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground mt-1">
              Hệ thống sẽ gắn cờ cảnh báo màu vàng khi số lượng khả dụng thấp
              hơn mức này
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Vị trí lưu kho / Kệ hàng
          </label>
          <Input
            placeholder="Ví dụ: Kệ A1 - Tầng 2, Dãy Bãi 03"
            {...register("viTriLuuTru")}
            className="text-xs"
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="cursor-pointer text-xs"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isUpdating}
            className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer text-xs font-semibold"
          >
            {isUpdating ? "Đang lưu..." : "Lưu cài đặt"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
