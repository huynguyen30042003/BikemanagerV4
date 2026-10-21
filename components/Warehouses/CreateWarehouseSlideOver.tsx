"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import { SlideOver } from "@/components/ui/SlideOver";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/ui/selectSearch";
import { useCreateKho } from "@/hooks/Kho/useKhoApi";
import { CreateKhoPayload } from "@/types/kho";
import { AlertCircle } from "lucide-react";

export const khoSchema = z.object({
  maKho: z.string().trim().min(1, "Vui lòng nhập mã kho hàng"),
  tenKho: z.string().trim().min(1, "Vui lòng nhập tên kho hàng"),
});

interface CreateWarehouseSlideOverProps {
  open: boolean;
  onClose: () => void;
  locationOptions: Array<{ value: number | string; label: string }>;
  loaiKhoOptions: Array<{ value: number | string; label: string }>;
  isLoadingLocations?: boolean;
  isLoadingLoaiKho?: boolean;
  onSuccess?: () => void;
}

const INITIAL_DATA: CreateKhoPayload = {
  MaKho: "",
  TenKho: "",
  DiaDiemID: null,
  LoaiKhoID: 17,
  DiaChi: "",
  DienThoai: "",
  LaKhoMacDinh: false,
  ChoPhepTonAm: false,
  TrangThai: true,
  GhiChu: "",
};

export function CreateWarehouseSlideOver({
  open,
  onClose,
  locationOptions,
  loaiKhoOptions,
  isLoadingLocations = false,
  isLoadingLoaiKho = false,
  onSuccess,
}: CreateWarehouseSlideOverProps) {
  // Local state isolation: Gõ phím không gây re-render trang cha!
  const [dataAdd, setDataAdd] = useState<CreateKhoPayload>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateKho();

  useEffect(() => {
    if (open) {
      setDataAdd({
        ...INITIAL_DATA,
        LoaiKhoID: Number(loaiKhoOptions[0]?.value ?? 17),
      });
      setErrors({});
    }
  }, [open, loaiKhoOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = khoSchema.safeParse({
      maKho: dataAdd.MaKho,
      tenKho: dataAdd.TenKho,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createMutation.mutateAsync(dataAdd);
      onClose();
      onSuccess?.();
    } catch {
      // Toast được xử lý tự động trong hook useCreateKho
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm Kho Hàng Mới"
      description="Khai báo kho tổng, kho showroom hoặc bãi xe vào hệ thống quản lý chuỗi"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã kho <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="Ví dụ: KHO-HN01"
              value={dataAdd.MaKho}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  MaKho: e.target.value.toUpperCase(),
                }))
              }
              className="text-xs font-mono uppercase"
            />
            {errors.maKho && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.maKho}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên kho hàng <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="Ví dụ: Kho Tổng Hà Nội"
              value={dataAdd.TenKho}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, TenKho: e.target.value }))
              }
              className="text-xs"
            />
            {errors.tenKho && (
              <p className="text-rose-500 text-[11px] mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.tenKho}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Trực thuộc Chi nhánh / Showroom
            </label>
            <SearchSelect
              placeholder="Chọn chi nhánh liên kết..."
              options={[
                { value: "", label: "Kho độc lập / Trung tâm" },
                ...locationOptions,
              ]}
              value={dataAdd.DiaDiemID || ""}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  DiaDiemID: val ? String(val) : null,
                }))
              }
              isLoading={isLoadingLocations}
              height={9}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Loại kho
            </label>
            <SearchSelect
              options={loaiKhoOptions}
              value={dataAdd.LoaiKhoID || (loaiKhoOptions[0]?.value ?? 0)}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  LoaiKhoID: Number(val),
                }))
              }
              isLoading={isLoadingLoaiKho}
              height={9}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số điện thoại liên hệ
            </label>
            <Input
              placeholder="0243..."
              value={dataAdd.DienThoai || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, DienThoai: e.target.value }))
              }
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Địa chỉ kho
            </label>
            <Input
              placeholder="Địa chỉ số nhà, đường, quận..."
              value={dataAdd.DiaChi || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, DiaChi: e.target.value }))
              }
              className="text-xs"
            />
          </div>
        </div>

        {/* Cờ cấu hình */}
        <div className="p-3 rounded-lg border border-border/80 bg-muted/40 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-foreground block">
                Đặt làm Kho mặc định
              </span>
              <span className="text-[11px] text-muted-foreground">
                Hệ thống sẽ tự động ưu tiên kho này khi tạo đơn hàng bán
              </span>
            </div>
            <Switch
              checked={dataAdd.LaKhoMacDinh}
              onCheckedChange={(v) =>
                setDataAdd((prev) => ({ ...prev, LaKhoMacDinh: v }))
              }
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div>
              <span className="text-xs font-medium text-foreground block">
                Cho phép tồn âm
              </span>
              <span className="text-[11px] text-muted-foreground">
                Cho phép xuất hàng kể cả khi tồn kho sổ sách đang bằng 0
              </span>
            </div>
            <Switch
              checked={dataAdd.ChoPhepTonAm}
              onCheckedChange={(v) =>
                setDataAdd((prev) => ({ ...prev, ChoPhepTonAm: v }))
              }
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border/60">
            <div>
              <span className="text-xs font-medium text-foreground block">
                Trạng thái hoạt động
              </span>
              <span className="text-[11px] text-muted-foreground">
                Bật để cho phép xuất nhập kho bình thường
              </span>
            </div>
            <Switch
              checked={dataAdd.TrangThai}
              onCheckedChange={(v) =>
                setDataAdd((prev) => ({ ...prev, TrangThai: v }))
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú
          </label>
          <textarea
            rows={2}
            placeholder="Thông tin quy mô, diện tích hoặc ghi chú nội bộ..."
            value={dataAdd.GhiChu || ""}
            onChange={(e) =>
              setDataAdd((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-2">
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
            disabled={createMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-medium"
          >
            {createMutation.isPending ? "Đang lưu..." : "Xác nhận tạo kho"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export default CreateWarehouseSlideOver;
