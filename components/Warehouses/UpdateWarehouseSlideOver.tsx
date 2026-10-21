"use client";

import React, { useState, useEffect } from "react";
import { SlideOver } from "@/components/ui/SlideOver";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/ui/selectSearch";
import { useUpdateKho } from "@/hooks/Kho/useKhoApi";
import { KHO_Kho, UpdateKhoPayload } from "@/types/kho";
import { AlertCircle } from "lucide-react";
import { khoSchema } from "./CreateWarehouseSlideOver";

interface UpdateWarehouseSlideOverProps {
  open: boolean;
  onClose: () => void;
  warehouse: KHO_Kho | null;
  locationOptions: Array<{ value: number | string; label: string }>;
  loaiKhoOptions: Array<{ value: number | string; label: string }>;
  isLoadingLocations?: boolean;
  isLoadingLoaiKho?: boolean;
  onSuccess?: () => void;
}

const INITIAL_DATA: UpdateKhoPayload = {
  KhoID: "",
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

export function UpdateWarehouseSlideOver({
  open,
  onClose,
  warehouse,
  locationOptions,
  loaiKhoOptions,
  isLoadingLocations = false,
  isLoadingLoaiKho = false,
  onSuccess,
}: UpdateWarehouseSlideOverProps) {
  // Local state isolation: Gõ phím không gây re-render trang cha!
  const [dataUpdate, setDataUpdate] = useState<UpdateKhoPayload>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateKho();

  useEffect(() => {
    if (open && warehouse) {
      setDataUpdate({
        KhoID: warehouse.khoID,
        MaKho: warehouse.maKho,
        TenKho: warehouse.tenKho,
        DiaDiemID: warehouse.diaDiemID || null,
        LoaiKhoID: warehouse.loaiKhoID ?? 17,
        DiaChi: warehouse.diaChi || "",
        DienThoai: warehouse.dienThoai || "",
        LaKhoMacDinh: warehouse.laKhoMacDinh ?? false,
        ChoPhepTonAm: warehouse.choPhepTonAm ?? false,
        TrangThai: warehouse.trangThai ?? true,
        GhiChu: warehouse.ghiChu || "",
      });
      setErrors({});
    }
  }, [open, warehouse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = khoSchema.safeParse({
      maKho: dataUpdate.MaKho,
      tenKho: dataUpdate.TenKho,
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
      await updateMutation.mutateAsync(dataUpdate);
      onClose();
      onSuccess?.();
    } catch {
      // Toast được xử lý tự động trong hook useUpdateKho
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chỉnh Sửa Kho Hàng"
      description={`Cập nhật thông tin chi tiết: ${warehouse?.tenKho || ""}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã kho
            </label>
            <Input
              value={dataUpdate.MaKho}
              disabled
              className="text-xs font-mono uppercase bg-muted/50 cursor-not-allowed opacity-80"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên kho hàng <span className="text-rose-500">*</span>
            </label>
            <Input
              value={dataUpdate.TenKho}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, TenKho: e.target.value }))
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
              value={dataUpdate.DiaDiemID || ""}
              onChange={(val) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.LoaiKhoID || 17}
              onChange={(val) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.DienThoai || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  DienThoai: e.target.value,
                }))
              }
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Địa chỉ kho
            </label>
            <Input
              value={dataUpdate.DiaChi || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, DiaChi: e.target.value }))
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
              checked={dataUpdate.LaKhoMacDinh}
              onCheckedChange={(v) =>
                setDataUpdate((prev) => ({ ...prev, LaKhoMacDinh: v }))
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
              checked={dataUpdate.ChoPhepTonAm}
              onCheckedChange={(v) =>
                setDataUpdate((prev) => ({ ...prev, ChoPhepTonAm: v }))
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
              checked={dataUpdate.TrangThai}
              onCheckedChange={(v) =>
                setDataUpdate((prev) => ({ ...prev, TrangThai: v }))
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
            value={dataUpdate.GhiChu || ""}
            onChange={(e) =>
              setDataUpdate((prev) => ({ ...prev, GhiChu: e.target.value }))
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
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs font-medium"
          >
            {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export default UpdateWarehouseSlideOver;
