"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CreateDonNhapHangPayload } from "@/types/donNhapHang";
import { formatCurrency } from "./PurchaseOrdersKpiGrid";

export interface CreatePurchaseOrderSlideOverProps {
  open: boolean;
  onClose: () => void;
  supplierOptions: SelectOption[];
  isLoadingSuppliers?: boolean;
  khoOptions: SelectOption[];
  isLoadingKhos?: boolean;
  variantOptions: SelectOption[];
  isLoadingVariants?: boolean;
  onSubmit: (data: CreateDonNhapHangPayload) => Promise<void> | void;
  isCreating: boolean;
}

const getInitialFormData = (): CreateDonNhapHangPayload => ({
  NhaCungCapID: "",
  KhoID: "",
  TrangThaiID: 66,
  SoHoaDonChungTu: "",
  NgayHoaDon: null,
  ChiPhiVanChuyen: 0,
  HanThanhToan: null,
  GhiChu: "",
  ChiTiets: [
    {
      BienTheSanPhamID: "",
      SoLuong: 1,
      DonGiaNhap: 0,
      PhanTramGiamGia: 0,
      TienGiamGia: 0,
      ThueVAT: 10,
      TienThueVAT: 0,
      ThanhTien: 0,
      QuanLyTheoSerial: true,
      GhiChu: "",
    },
  ],
  Serials: [],
});

export const CreatePurchaseOrderSlideOver: React.FC<
  CreatePurchaseOrderSlideOverProps
> = ({
  open,
  onClose,
  supplierOptions,
  isLoadingSuppliers = false,
  khoOptions,
  isLoadingKhos = false,
  variantOptions,
  isLoadingVariants = false,
  onSubmit,
  isCreating,
}) => {
  const [formData, setFormData] = useState<CreateDonNhapHangPayload>(getInitialFormData);

  useEffect(() => {
    if (open) {
      setFormData({
        ...getInitialFormData(),
        NhaCungCapID: supplierOptions[0]?.value ? String(supplierOptions[0].value) : "",
        KhoID: khoOptions[0]?.value ? String(khoOptions[0].value) : "",
      });
    }
  }, [open, supplierOptions, khoOptions]);

  const handleAddDetailRow = () => {
    setFormData((prev) => ({
      ...prev,
      ChiTiets: [
        ...prev.ChiTiets,
        {
          BienTheSanPhamID: "",
          SoLuong: 1,
          DonGiaNhap: 0,
          PhanTramGiamGia: 0,
          TienGiamGia: 0,
          ThueVAT: 10,
          TienThueVAT: 0,
          ThanhTien: 0,
          QuanLyTheoSerial: true,
          GhiChu: "",
        },
      ],
    }));
  };

  const handleRemoveDetailRow = (index: number) => {
    if (formData.ChiTiets.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      ChiTiets: prev.ChiTiets.filter((_, idx) => idx !== index),
    }));
  };

  const subTotal = useMemo(() => {
    return formData.ChiTiets.reduce(
      (sum, item) => sum + (item.SoLuong || 0) * (item.DonGiaNhap || 0),
      0
    );
  }, [formData.ChiTiets]);

  const totalVat = useMemo(() => {
    return formData.ChiTiets.reduce(
      (sum, item) => sum + (item.TienThueVAT || 0),
      0
    );
  }, [formData.ChiTiets]);

  const totalPayment = useMemo(() => {
    const detailsTotal = formData.ChiTiets.reduce(
      (sum, item) => sum + (item.ThanhTien || 0),
      0
    );
    return detailsTotal + (Number(formData.ChiPhiVanChuyen) || 0);
  }, [formData.ChiTiets, formData.ChiPhiVanChuyen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Tạo Đơn Nhập Hàng Mới"
      description="Lập phiếu đặt hàng từ nhà sản xuất / NCC và cấu hình mặt hàng nhập kho"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nhà cung cấp <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn nhà cung cấp..."
              options={supplierOptions}
              value={formData.NhaCungCapID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, NhaCungCapID: String(val) }))
              }
              isLoading={isLoadingSuppliers}
              height={10}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Kho tiếp nhận <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn kho tiếp nhận..."
              options={khoOptions}
              value={formData.KhoID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, KhoID: String(val) }))
              }
              isLoading={isLoadingKhos}
              height={10}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số hóa đơn / Chứng từ
            </label>
            <Input
              type="text"
              placeholder="VD: HD-VAT-2024001"
              value={formData.SoHoaDonChungTu || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  SoHoaDonChungTu: e.target.value,
                }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ngày hóa đơn
            </label>
            <Input
              type="date"
              value={
                formData.NgayHoaDon ? formData.NgayHoaDon.slice(0, 10) : ""
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  NgayHoaDon: e.target.value
                    ? new Date(e.target.value).toISOString()
                    : null,
                }))
              }
              className="text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Chi phí vận chuyển (đ)
            </label>
            <Input
              type="number"
              min={0}
              placeholder="VD: 500000"
              value={formData.ChiPhiVanChuyen || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ChiPhiVanChuyen: parseInt(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono"
            />
          </div>
        </div>

        {/* Danh sách mặt hàng */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Danh sách mặt hàng nhập ({formData.ChiTiets.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleAddDetailRow}
              className="text-blue-600 hover:text-blue-700 text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Thêm mặt hàng
            </Button>
          </div>

          <div className="space-y-3">
            {formData.ChiTiets.map((row, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-muted/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Mặt hàng #{idx + 1}
                  </span>
                  {formData.ChiTiets.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveDetailRow(idx)}
                      className="text-rose-500 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Sản phẩm / Dòng xe / Phiên bản
                    </label>
                    <SearchSelect
                      placeholder="Chọn biến thể sản phẩm..."
                      options={variantOptions}
                      value={row.BienTheSanPhamID}
                      onChange={(val) => {
                        const updated = [...formData.ChiTiets];
                        const selectedVar = (
                          variantOptions as Array<{
                            value: string;
                            sku?: string;
                            name?: string;
                            defaultPrice?: number;
                          }>
                        ).find((v) => v.value === val);

                        updated[idx].BienTheSanPhamID = String(val);
                        updated[idx].MaSKU = selectedVar?.sku || "";
                        updated[idx].TenSanPham = selectedVar?.name || "";
                        if (
                          selectedVar?.defaultPrice &&
                          !updated[idx].DonGiaNhap
                        ) {
                          updated[idx].DonGiaNhap = selectedVar.defaultPrice;
                        }
                        const donGia = updated[idx].DonGiaNhap || 0;
                        const soLuong = updated[idx].SoLuong || 1;
                        const vat = Number(updated[idx].ThueVAT) || 0;
                        const sub = soLuong * donGia;
                        updated[idx].TienThueVAT = (sub * vat) / 100;
                        updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                        setFormData((prev) => ({
                          ...prev,
                          ChiTiets: updated,
                        }));
                      }}
                      isLoading={isLoadingVariants}
                      height={9}
                    />
                  </div>

                  <div className="grid grid-cols-3 md:col-span-7 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        Số lượng
                      </label>
                      <Input
                        type="number"
                        min={1}
                        value={row.SoLuong}
                        onChange={(e) => {
                          const updated = [...formData.ChiTiets];
                          const sl = parseInt(e.target.value) || 0;
                          updated[idx].SoLuong = sl;
                          const donGia = updated[idx].DonGiaNhap || 0;
                          const vat = Number(updated[idx].ThueVAT) || 0;
                          const sub = sl * donGia;
                          updated[idx].TienThueVAT = (sub * vat) / 100;
                          updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                          setFormData((prev) => ({
                            ...prev,
                            ChiTiets: updated,
                          }));
                        }}
                        className="text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        Đơn giá nhập (đ)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={row.DonGiaNhap}
                        onChange={(e) => {
                          const updated = [...formData.ChiTiets];
                          const gia = parseInt(e.target.value) || 0;
                          updated[idx].DonGiaNhap = gia;
                          const sl = updated[idx].SoLuong || 1;
                          const vat = Number(updated[idx].ThueVAT) || 0;
                          const sub = sl * gia;
                          updated[idx].TienThueVAT = (sub * vat) / 100;
                          updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                          setFormData((prev) => ({
                            ...prev,
                            ChiTiets: updated,
                          }));
                        }}
                        className="text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        % Thuế VAT
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        value={
                          row.ThueVAT === undefined || row.ThueVAT === null
                            ? ""
                            : row.ThueVAT
                        }
                        onChange={(e) => {
                          const updated = [...formData.ChiTiets];
                          const inputVal = e.target.value;
                          const parsed = parseFloat(inputVal);
                          updated[idx].ThueVAT = isNaN(parsed)
                            ? 0
                            : Math.max(0, Math.min(100, parsed));
                          const sl = updated[idx].SoLuong || 1;
                          const donGia = updated[idx].DonGiaNhap || 0;
                          const vat = Number(updated[idx].ThueVAT) || 0;
                          const sub = sl * donGia;
                          updated[idx].TienThueVAT = (sub * vat) / 100;
                          updated[idx].ThanhTien = sub + updated[idx].TienThueVAT;
                          setFormData((prev) => ({
                            ...prev,
                            ChiTiets: updated,
                          }));
                        }}
                        placeholder="VD: 10"
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                  <span className="text-muted-foreground">
                    Tiền thuế VAT: {formatCurrency(row.TienThueVAT)} (áp dụng{" "}
                    {Number(row.ThueVAT) || 0}%)
                  </span>
                  <span className="font-semibold text-foreground">
                    Thành tiền: {formatCurrency(row.ThanhTien)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bảng tổng hợp tài chính đơn nhập */}
          <div className="p-3 rounded-lg border border-border/70 bg-card/60 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Tiền hàng (tạm tính):</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(subTotal)}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tổng thuế VAT:</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(totalVat)}
              </span>
            </div>
            {Boolean(formData.ChiPhiVanChuyen) && (
              <div className="flex justify-between text-muted-foreground">
                <span>Chi phí vận chuyển:</span>
                <span className="font-mono font-medium text-foreground">
                  {formatCurrency(formData.ChiPhiVanChuyen)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-1.5 border-t border-border/60 text-sm font-bold">
              <span className="text-foreground">Tổng cộng thanh toán:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {formatCurrency(totalPayment)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú đơn nhập
          </label>
          <Textarea
            rows={2}
            placeholder="Nhập thông tin kiểm đếm, ghi chú bàn giao..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
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
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {isCreating ? "Đang xử lý..." : "Tạo đơn nhập hàng"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
export default CreatePurchaseOrderSlideOver;
