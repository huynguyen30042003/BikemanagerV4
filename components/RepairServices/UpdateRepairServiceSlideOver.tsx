"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SC_DichVu, UpdateDichVuPayload } from "@/types/suaChua";

interface UpdateRepairServiceSlideOverProps {
  open: boolean;
  onClose: () => void;
  item: SC_DichVu | null;
  serviceTypeOptions: SelectOption[];
  isLoadingServiceTypes?: boolean;
  onSubmit: (formData: UpdateDichVuPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function UpdateRepairServiceSlideOver({
  open,
  onClose,
  item,
  serviceTypeOptions,
  isLoadingServiceTypes,
  onSubmit,
  isSubmitting = false,
}: UpdateRepairServiceSlideOverProps) {
  const [formData, setFormData] = useState<UpdateDichVuPayload>({
    DichVuID: "",
    MaDichVu: "",
    TenDichVu: "",
    DanhMucChiTietID: 114,
    MoTa: "",
    GiaCoBan: 50000,
    GiaKhuyenMai: null,
    ThoiGianDuKienPhut: 30,
    ThuTu: 0,
    TrangThai: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && item) {
      setFormData({
        DichVuID: item.dichVuID,
        MaDichVu: item.maDichVu,
        TenDichVu: item.tenDichVu,
        DanhMucChiTietID: item.danhMucChiTietID,
        MoTa: item.moTa || "",
        GiaCoBan: item.giaCoBan,
        GiaKhuyenMai: item.giaKhuyenMai ?? null,
        ThoiGianDuKienPhut: item.thoiGianDuKienPhut,
        ThuTu: item.thuTu,
        TrangThai: item.trangThai,
      });
      setErrors({});
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    const newErrors: Record<string, string> = {};

    if (!formData.TenDichVu.trim()) {
      newErrors.TenDichVu = "Vui lòng nhập tên dịch vụ";
    }
    if (formData.GiaCoBan < 0) {
      newErrors.GiaCoBan = "Giá cơ bản không được âm";
    }
    if ((formData.ThoiGianDuKienPhut ?? 0) < 1) {
      newErrors.ThoiGianDuKienPhut = "Thời gian thực hiện tối thiểu 1 phút";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.warning("Vui lòng kiểm tra lại thông tin nhập!");
      return;
    }

    setErrors({});
    await onSubmit({
      ...formData,
      DichVuID: item.dichVuID,
    });
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chỉnh Sửa Dịch Vụ"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
          <SquarePen className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            Cập nhật đơn giá tiền công, nhóm phân loại hoặc điều chỉnh thời gian
            thi công cho mã{" "}
            <strong className="font-mono">
              {formData.MaDichVu || item?.maDichVu}
            </strong>
            .
          </span>
        </div>

        {/* Mã Dịch Vụ */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Mã dịch vụ
          </label>
          <Input
            type="text"
            value={formData.MaDichVu || ""}
            disabled
            className="text-xs font-mono bg-muted/50 cursor-not-allowed opacity-80"
          />
        </div>

        {/* Tên dịch vụ */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Tên dịch vụ / Tiền công <span className="text-rose-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="VD: Cân vành xe điện, Vá lốp không săm..."
            value={formData.TenDichVu}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, TenDichVu: e.target.value }))
            }
            className={`text-xs ${errors.TenDichVu ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.TenDichVu && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.TenDichVu}</p>
          )}
        </div>

        {/* Nhóm dịch vụ SearchSelect with height={10} */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Nhóm dịch vụ (Từ danh mục chi tiết)
          </label>
          <SearchSelect
            options={serviceTypeOptions}
            value={String(formData.DanhMucChiTietID)}
            onChange={(val) =>
              setFormData((prev) => ({
                ...prev,
                DanhMucChiTietID: Number(val),
              }))
            }
            isLoading={isLoadingServiceTypes}
            height={10}
            placeholder="Chọn nhóm dịch vụ..."
          />
        </div>

        {/* Giá cơ bản & Thời gian */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Giá tiền công (VNĐ) <span className="text-rose-500">*</span>
            </label>
            <Input
              type="number"
              min={0}
              step={1000}
              value={formData.GiaCoBan}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  GiaCoBan: parseInt(e.target.value, 10) || 0,
                }))
              }
              className={`text-xs font-mono font-bold ${errors.GiaCoBan ? "border-rose-500" : ""}`}
            />
            {errors.GiaCoBan && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.GiaCoBan}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Thời gian ước tính (phút)
            </label>
            <Input
              type="number"
              min={1}
              value={formData.ThoiGianDuKienPhut ?? 30}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ThoiGianDuKienPhut: parseInt(e.target.value, 10) || 30,
                }))
              }
              className={`text-xs font-mono ${errors.ThoiGianDuKienPhut ? "border-rose-500" : ""}`}
            />
            {errors.ThoiGianDuKienPhut && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.ThoiGianDuKienPhut}
              </p>
            )}
          </div>
        </div>

        {/* Giá khuyến mại (nếu có) */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Giá khuyến mại (VNĐ - tùy chọn)
          </label>
          <Input
            type="number"
            min={0}
            step={1000}
            placeholder="Để trống nếu không giảm giá"
            value={formData.GiaKhuyenMai ?? ""}
            onChange={(e) => {
              const val = e.target.value.trim();
              setFormData((prev) => ({
                ...prev,
                GiaKhuyenMai: val ? parseInt(val, 10) : null,
              }));
            }}
            className="text-xs font-mono"
          />
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Mô tả chi tiết hạng mục công việc
          </label>
          <Textarea
            rows={3}
            placeholder="Mô tả các bước thực hiện, ghi chú kỹ thuật..."
            value={formData.MoTa || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MoTa: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        {/* Trạng thái Switch */}
        <div className="flex items-center gap-2.5 pt-2">
          <Switch
            checked={formData.TrangThai ?? true}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, TrangThai: checked }))
            }
          />
          <div>
            <label className="text-xs text-foreground font-medium block">
              Đang kinh doanh dịch vụ này
            </label>
            <span className="text-[11px] text-muted-foreground block">
              Cho phép chọn vào phiếu sửa chữa và tính doanh thu dịch vụ
            </span>
          </div>
        </div>

        {/* Actions */}
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
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật dịch vụ"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
