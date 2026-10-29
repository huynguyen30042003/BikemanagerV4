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
import { useUpdateNhaCungCap } from "@/hooks/NhaCungCap/useNhaCungCapApi";
import { useGetDiaPhuongCapXa } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXaApi";
import { nhaCungCapSchema } from "@/hooks/NhaCungCap/useNhaCungCap";
import { NH_NhaCungCap, UpdateNhaCungCapPayload } from "@/types/nhaCungCap";

interface UpdateSupplierSlideOverProps {
  open: boolean;
  onClose: () => void;
  supplier: NH_NhaCungCap | null;
  countryOptions: Array<{ value: number | string; label: string }>;
  provinceOptions: Array<{ value: number | string; label: string }>;
  isLoadingCountries?: boolean;
  isLoadingProvinces?: boolean;
  onSuccess?: () => void;
}

const INITIAL_DATA: UpdateNhaCungCapPayload = {
  MaNhaCungCap: "",
  NhaCungCapID: "",
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

export function UpdateSupplierSlideOver({
  open,
  onClose,
  supplier,
  countryOptions,
  provinceOptions,
  isLoadingCountries = false,
  isLoadingProvinces = false,
  onSuccess,
}: UpdateSupplierSlideOverProps) {
  // Local state isolation: Gõ phím không gây re-render trang cha!
  const [dataUpdate, setDataUpdate] =
    useState<UpdateNhaCungCapPayload>(INITIAL_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateNhaCungCap();

  // Đồng bộ thông tin nhà cung cấp khi mở modal
  useEffect(() => {
    if (open && supplier) {
      setDataUpdate({
        MaNhaCungCap: supplier.maNhaCungCap || "",
        NhaCungCapID: supplier.nhaCungCapID,
        TenNhaCungCap: supplier.tenNhaCungCap || "",
        DienThoai: supplier.dienThoai || "",
        HopThu: supplier.hopThu || "",
        DiaChi: supplier.diaChi || "",
        QuocGiaID: supplier.quocGiaID ?? 1,
        TinhID: supplier.tinhID ?? null,
        XaID: supplier.xaID ?? null,
        MaSoThue: supplier.maSoThue || "",
        NguoiLienHe: supplier.nguoiLienHe || "",
        SoTaiKhoanNganHang: supplier.soTaiKhoanNganHang || "",
        TenNganHang: supplier.tenNganHang || "",
        GhiChu: supplier.ghiChu || "",
        TrangThai: supplier.trangThai ?? true,
      });
      setErrors({});
    }
  }, [open, supplier]);

  // Query Xã theo Tỉnh đã chọn cục bộ
  const { data: dataCommunes } = useGetDiaPhuongCapXa(
    {
      TinhID: dataUpdate.TinhID ?? 0,
      PageIndex: 1,
      PageSize: 200,
      TrangThai: true,
    },
    Boolean(open && dataUpdate.TinhID),
  );

  const communeOptions = useMemo(() => {
    if (!dataUpdate.TinhID) return [];
    const list = dataCommunes?.data ?? dataCommunes?.items ?? [];
    return list.map((c: { xaID: number; ten: string }) => ({
      value: c.xaID,
      label: c.ten,
    }));
  }, [dataCommunes, dataUpdate.TinhID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = nhaCungCapSchema.safeParse({
      maNhaCungCap: dataUpdate.MaNhaCungCap,
      tenNhaCungCap: dataUpdate.TenNhaCungCap,
      dienThoai: dataUpdate.DienThoai,
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
      toast.success("Cập nhật thông tin nhà cung cấp thành công!");
      onClose();
      onSuccess?.();
    } catch {
      toast.error("Không thể cập nhật nhà cung cấp. Vui lòng kiểm tra lại!");
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chỉnh Sửa Nhà Cung Cấp"
      description={`Cập nhật thông tin đối tác: ${supplier?.tenNhaCungCap || ""}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mã nhà cung cấp
            </label>
            <Input
              type="text"
              value={dataUpdate.MaNhaCungCap}
              disabled
              className="text-xs font-mono bg-muted/50 cursor-not-allowed opacity-80"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tên nhà cung cấp <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={dataUpdate.TenNhaCungCap}
              onChange={(e) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.DienThoai}
              onChange={(e) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.HopThu || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, HopThu: e.target.value }))
              }
              className="text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Người liên hệ
            </label>
            <Input
              type="text"
              value={dataUpdate.NguoiLienHe || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.MaSoThue || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  MaSoThue: e.target.value,
                }))
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
              value={dataUpdate.QuocGiaID || 1}
              onChange={(val) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.TinhID || ""}
              onChange={(val) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.XaID || ""}
              onChange={(val) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  XaID: val ? Number(val) : null,
                }))
              }
              disabled={!dataUpdate.TinhID}
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
            value={dataUpdate.DiaChi || ""}
            onChange={(e) =>
              setDataUpdate((prev) => ({ ...prev, DiaChi: e.target.value }))
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
              value={dataUpdate.SoTaiKhoanNganHang || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.TenNganHang || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
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
            value={dataUpdate.GhiChu || ""}
            onChange={(e) =>
              setDataUpdate((prev) => ({ ...prev, GhiChu: e.target.value }))
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
              Đang kích hoạt giao dịch với nhà cung cấp
            </span>
          </div>
          <Switch
            checked={dataUpdate.TrangThai ?? true}
            onCheckedChange={(checked) =>
              setDataUpdate((prev) => ({ ...prev, TrangThai: checked }))
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
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {updateMutation.isPending ? "Đang lưu..." : "Cập nhật thay đổi"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}

export default UpdateSupplierSlideOver;
