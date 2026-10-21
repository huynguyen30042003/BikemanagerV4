"use client";

import React, { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SlideOver } from "@/components/ui/SlideOver";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/ui/selectSearch";
import { useCreateNhaCungCap } from "@/hooks/NhaCungCap/useNhaCungCapApi";
import { useGetDiaPhuongCapXa } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXaApi";
import { nhaCungCapSchema } from "@/hooks/NhaCungCap/useNhaCungCap";
import { CreateNhaCungCapPayload } from "@/types/nhaCungCap";

interface CreateSupplierSlideOverProps {
  open: boolean;
  onClose: () => void;
  countryOptions: Array<{ value: number | string; label: string }>;
  provinceOptions: Array<{ value: number | string; label: string }>;
  isLoadingCountries?: boolean;
  isLoadingProvinces?: boolean;
  onSuccess?: () => void;
}

const INITIAL_DATA: CreateNhaCungCapPayload = {
  MaNhaCungCap: "",
  TenNhaCungCap: "",
  DienThoai: "",
  HopThu: "",
  DiaChi: "",
  QuocGiaID: 1,
  TinhID: null,
  XaID: null,
  MaSoThue: "",
  NguoiLienHe: "",
  SoTaiKhoanNganHang: "",
  TenNganHang: "",
  GhiChu: "",
  TrangThai: true,
};

export function CreateSupplierSlideOver({
  open,
  onClose,
  countryOptions,
  provinceOptions,
  isLoadingCountries = false,
  isLoadingProvinces = false,
  onSuccess,
}: CreateSupplierSlideOverProps) {
  // Local state isolation: Gõ phím không gây re-render trang cha!
  const [dataAdd, setDataAdd] = useState<CreateNhaCungCapPayload>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateNhaCungCap();

  // Reset form khi mở modal
  useEffect(() => {
    if (open) {
      setDataAdd(INITIAL_DATA);
      setErrors({});
    }
  }, [open]);

  // Query Xã theo Tỉnh đã chọn cục bộ
  const { data: dataCommunes } = useGetDiaPhuongCapXa({
    TinhID: dataAdd.TinhID ?? 0,
    PageIndex: 1,
    PageSize: 200,
    TrangThai: true,
  });

  const communeOptions = useMemo(() => {
    if (!dataAdd.TinhID) return [];
    const list = dataCommunes?.data ?? dataCommunes?.items ?? [];
    return list.map((c: { xaID: number; ten: string }) => ({
      value: c.xaID,
      label: c.ten,
    }));
  }, [dataCommunes, dataAdd.TinhID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = nhaCungCapSchema.safeParse({
      maNhaCungCap: dataAdd.MaNhaCungCap,
      tenNhaCungCap: dataAdd.TenNhaCungCap,
      dienThoai: dataAdd.DienThoai,
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
      toast.success("Thêm nhà cung cấp mới thành công!");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Không thể thêm nhà cung cấp. Vui lòng thử lại!");
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm Nhà Cung Cấp Mới"
      description="Đăng ký hồ sơ đối tác, kênh nhập xe điện, pin hoặc phụ tùng"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã nhà cung cấp <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: NCC-VINFAST"
              value={dataAdd.MaNhaCungCap || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  MaNhaCungCap: e.target.value,
                }))
              }
              className={`text-xs font-mono ${
                errors.maNhaCungCap ? "border-rose-500" : ""
              }`}
            />
            {errors.maNhaCungCap && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.maNhaCungCap}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên nhà cung cấp <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: Công ty TNHH VinFast Auto"
              value={dataAdd.TenNhaCungCap}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  TenNhaCungCap: e.target.value,
                }))
              }
              className={`text-xs ${
                errors.tenNhaCungCap ? "border-rose-500" : ""
              }`}
            />
            {errors.tenNhaCungCap && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.tenNhaCungCap}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số điện thoại liên hệ <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="VD: 02431234567 hoặc 1900..."
              value={dataAdd.DienThoai}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  DienThoai: e.target.value,
                }))
              }
              className={`text-xs ${errors.dienThoai ? "border-rose-500" : ""}`}
            />
            {errors.dienThoai && (
              <p className="text-[11px] text-rose-500 mt-1">
                {errors.dienThoai}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Hộp thư (Email)
            </label>
            <Input
              type="email"
              placeholder="VD: cskh@vinfast.vn"
              value={dataAdd.HopThu || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, HopThu: e.target.value }))
              }
              className="text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Người liên hệ / Đại diện
            </label>
            <Input
              type="text"
              placeholder="VD: Nguyễn Văn Phụ Trách"
              value={dataAdd.NguoiLienHe || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  NguoiLienHe: e.target.value,
                }))
              }
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã số thuế
            </label>
            <Input
              type="text"
              placeholder="VD: 0108928374"
              value={dataAdd.MaSoThue || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, MaSoThue: e.target.value }))
              }
              className="text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Quốc gia
            </label>
            <SearchSelect
              options={countryOptions}
              value={dataAdd.QuocGiaID || 1}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  QuocGiaID: Number(val) || 1,
                }))
              }
              isLoading={isLoadingCountries}
              height={9}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tỉnh / Thành phố
            </label>
            <SearchSelect
              placeholder="Chọn tỉnh..."
              options={provinceOptions}
              value={dataAdd.TinhID || ""}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  TinhID: val ? Number(val) : null,
                  XaID: null,
                }))
              }
              isLoading={isLoadingProvinces}
              height={9}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Phường / Xã
            </label>
            <SearchSelect
              placeholder="Chọn phường xã..."
              options={communeOptions}
              value={dataAdd.XaID || ""}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  XaID: val ? Number(val) : null,
                }))
              }
              disabled={!dataAdd.TinhID}
              height={9}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Địa chỉ chi tiết
          </label>
          <Input
            type="text"
            placeholder="VD: Tòa nhà VinFast, Khu đô thị Vinhomes Riverside"
            value={dataAdd.DiaChi || ""}
            onChange={(e) =>
              setDataAdd((prev) => ({ ...prev, DiaChi: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số tài khoản ngân hàng
            </label>
            <Input
              type="text"
              placeholder="VD: 19034567890123"
              value={dataAdd.SoTaiKhoanNganHang || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  SoTaiKhoanNganHang: e.target.value,
                }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên ngân hàng
            </label>
            <Input
              type="text"
              placeholder="VD: Techcombank - CN Hà Nội"
              value={dataAdd.TenNganHang || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  TenNganHang: e.target.value,
                }))
              }
              className="text-xs"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú hợp tác
          </label>
          <Textarea
            rows={2}
            placeholder="Nhập thông tin hợp đồng, điều khoản công nợ..."
            value={dataAdd.GhiChu || ""}
            onChange={(e) =>
              setDataAdd((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
          <div>
            <span className="text-xs font-semibold text-foreground block">
              Trạng thái hợp tác
            </span>
            <span className="text-[11px] text-muted-foreground">
              Cho phép tạo đơn đặt hàng và giao dịch với nhà cung cấp này
            </span>
          </div>
          <Switch
            checked={dataAdd.TrangThai ?? true}
            onCheckedChange={(checked) =>
              setDataAdd((prev) => ({ ...prev, TrangThai: checked }))
            }
          />
        </div>

        <div className="pt-3 border-t border-border flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={createMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {createMutation.isPending ? "Đang xử lý..." : "Lưu nhà cung cấp"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export default CreateSupplierSlideOver;
