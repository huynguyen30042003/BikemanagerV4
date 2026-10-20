"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CreateDonHangPayload } from "@/types/donHang";
import { formatCurrency } from "./OrdersKpiGrid";

export interface CreateOrderSlideOverProps {
  open: boolean;
  onClose: () => void;
  customerOptions: SelectOption[];
  isLoadingCustomers: boolean;
  diaDiemOptions: SelectOption[];
  khoOptions: SelectOption[];
  isLoadingKhos: boolean;
  orderTypeOptions: SelectOption[];
  isLoadingOrderTypes: boolean;
  variantOptions: Array<{
    value: string;
    label: string;
    sku?: string;
    name?: string;
    defaultPrice?: number;
  }>;
  isLoadingVariants: boolean;
  onSubmit: (data: CreateDonHangPayload) => Promise<any>;
  isCreating: boolean;
}

const getInitialFormData = (): CreateDonHangPayload => ({
  KhachHangID: "",
  DiaDiemID: "",
  KhoXuatID: "",
  LoaiDonHangID: 87, // 87: Bán lẻ tại quầy
  TrangThaiDonHangID: 72, // 72: Chờ xử lý
  TrangThaiThanhToanID: 83, // 83: Chưa thanh toán
  PhiVanChuyen: 0,
  PhiDichVuBienSo: 0,
  TienGiamGia: 0,
  GhiChu: "",
  ChiTiets: [
    {
      BienTheSanPhamID: "",
      MaSKU: "",
      TenSanPham: "",
      SoLuong: 1,
      DonGiaBan: 0,
      TienGiamGia: 0,
      ThueVAT: 10,
      TienThueVAT: 0,
      ThanhTien: 0,
      QuanLyTheoSerial: false,
      LaPhuongTien: false,
      SoThangBaoHanh: 12,
    },
  ],
});

export const CreateOrderSlideOver: React.FC<CreateOrderSlideOverProps> = ({
  open,
  onClose,
  customerOptions,
  isLoadingCustomers,
  diaDiemOptions,
  khoOptions,
  isLoadingKhos,
  orderTypeOptions,
  isLoadingOrderTypes,
  variantOptions,
  isLoadingVariants,
  onSubmit,
  isCreating,
}) => {
  const [formData, setFormData] = useState<CreateDonHangPayload>(getInitialFormData);

  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
    }
  }, [open]);

  const handleAddDetailRow = () => {
    setFormData((prev) => ({
      ...prev,
      ChiTiets: [
        ...prev.ChiTiets,
        {
          BienTheSanPhamID: "",
          MaSKU: "",
          TenSanPham: "",
          SoLuong: 1,
          DonGiaBan: 0,
          TienGiamGia: 0,
          ThueVAT: 10,
          TienThueVAT: 0,
          ThanhTien: 0,
          QuanLyTheoSerial: false,
          LaPhuongTien: false,
          SoThangBaoHanh: 12,
        },
      ],
    }));
  };

  const handleRemoveDetailRow = (index: number) => {
    if (formData.ChiTiets.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      ChiTiets: prev.ChiTiets.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Tạo Đơn Hàng Mới"
      description="Lập phiếu bán xe điện, phụ tùng linh kiện hoặc bán trả góp"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Khách hàng <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn khách hàng..."
              options={customerOptions}
              value={formData.KhachHangID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, KhachHangID: String(val) }))
              }
              isLoading={isLoadingCustomers}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Chi nhánh / Cửa hàng
            </label>
            <SearchSelect
              placeholder="Chọn showroom..."
              options={diaDiemOptions}
              value={formData.DiaDiemID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, DiaDiemID: String(val) }))
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Kho xuất hàng <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn kho xuất..."
              options={khoOptions}
              value={formData.KhoXuatID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, KhoXuatID: String(val) }))
              }
              isLoading={isLoadingKhos}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Hình thức bán hàng
            </label>
            <SearchSelect
              options={orderTypeOptions}
              value={String(formData.LoaiDonHangID)}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  LoaiDonHangID: Number(val),
                }))
              }
              isLoading={isLoadingOrderTypes}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Phí giao xe (đ)
            </label>
            <Input
              type="number"
              min={0}
              value={formData.PhiVanChuyen || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  PhiVanChuyen: parseInt(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Phí dịch vụ biển số (đ)
            </label>
            <Input
              type="number"
              min={0}
              value={formData.PhiDichVuBienSo || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  PhiDichVuBienSo: parseInt(e.target.value) || 0,
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
              Danh sách sản phẩm bán ({formData.ChiTiets.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleAddDetailRow}
              className="text-blue-600 hover:text-blue-700 text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Thêm sản phẩm
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
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
                  <div className="md:col-span-5">
                    <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                      Sản phẩm / Biến thể
                    </label>
                    <SearchSelect
                      placeholder="Chọn biến thể..."
                      options={variantOptions}
                      value={row.BienTheSanPhamID}
                      onChange={(val) => {
                        const updated = [...formData.ChiTiets];
                        const selectedVar = variantOptions.find(
                          (v) => v.value === val
                        );
                        updated[idx].BienTheSanPhamID = String(val);
                        updated[idx].MaSKU = selectedVar?.sku || "";
                        updated[idx].TenSanPham = selectedVar?.name || "";
                        if (
                          selectedVar?.defaultPrice &&
                          !updated[idx].DonGiaBan
                        ) {
                          updated[idx].DonGiaBan = selectedVar.defaultPrice;
                        }
                        const qty = updated[idx].SoLuong || 1;
                        const price = updated[idx].DonGiaBan || 0;
                        const vat = Number(updated[idx].ThueVAT) || 0;
                        const sub = qty * price;
                        updated[idx].TienThueVAT = (sub * vat) / 100;
                        updated[idx].ThanhTien =
                          sub + updated[idx].TienThueVAT;
                        setFormData((prev) => ({
                          ...prev,
                          ChiTiets: updated,
                        }));
                      }}
                      isLoading={isLoadingVariants}
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
                          const qty = Math.max(
                            1,
                            parseInt(e.target.value) || 1
                          );
                          updated[idx].SoLuong = qty;
                          const price = updated[idx].DonGiaBan || 0;
                          const vat = Number(updated[idx].ThueVAT) || 0;
                          const sub = qty * price;
                          updated[idx].TienThueVAT = (sub * vat) / 100;
                          updated[idx].ThanhTien =
                            sub + updated[idx].TienThueVAT;
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
                        Đơn giá bán (đ)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        value={row.DonGiaBan}
                        onChange={(e) => {
                          const updated = [...formData.ChiTiets];
                          const price = parseInt(e.target.value) || 0;
                          updated[idx].DonGiaBan = price;
                          const qty = updated[idx].SoLuong || 1;
                          const vat = Number(updated[idx].ThueVAT) || 0;
                          const sub = qty * price;
                          updated[idx].TienThueVAT = (sub * vat) / 100;
                          updated[idx].ThanhTien =
                            sub + updated[idx].TienThueVAT;
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
                          if (inputVal === "") {
                            updated[idx].ThueVAT = "" as unknown as number;
                          } else {
                            const parsed = parseFloat(inputVal);
                            updated[idx].ThueVAT = isNaN(parsed)
                              ? 0
                              : Math.max(0, Math.min(100, parsed));
                          }
                          const qty = updated[idx].SoLuong || 1;
                          const price = updated[idx].DonGiaBan || 0;
                          const vat = Number(updated[idx].ThueVAT) || 0;
                          const sub = qty * price;
                          updated[idx].TienThueVAT = (sub * vat) / 100;
                          updated[idx].ThanhTien =
                            sub + updated[idx].TienThueVAT;
                          setFormData((prev) => ({
                            ...prev,
                            ChiTiets: updated,
                          }));
                        }}
                        onBlur={() => {
                          if (
                            row.ThueVAT === ("" as unknown as number) ||
                            row.ThueVAT === undefined ||
                            row.ThueVAT === null
                          ) {
                            const updated = [...formData.ChiTiets];
                            updated[idx].ThueVAT = 0;
                            setFormData((prev) => ({
                              ...prev,
                              ChiTiets: updated,
                            }));
                          }
                        }}
                        placeholder="VD: 10"
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-border/50">
                  <span className="text-muted-foreground">
                    Tiền thuế VAT: {formatCurrency(row.TienThueVAT || 0)} (áp
                    dụng {Number(row.ThueVAT) || 0}%)
                  </span>
                  <span className="font-semibold text-foreground">
                    Thành tiền: {formatCurrency(row.ThanhTien)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bảng tổng hợp tài chính đơn hàng */}
          <div className="p-3 rounded-lg border border-border/70 bg-card/60 space-y-1.5 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Tiền hàng (tạm tính):</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(
                  formData.ChiTiets.reduce(
                    (sum, item) =>
                      sum + (item.SoLuong || 0) * (item.DonGiaBan || 0),
                    0
                  )
                )}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tổng thuế VAT:</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(
                  formData.ChiTiets.reduce(
                    (sum, item) => sum + (item.TienThueVAT || 0),
                    0
                  )
                )}
              </span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-border/60 text-sm font-bold">
              <span className="text-foreground">Tổng cộng đơn hàng:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {formatCurrency(
                  formData.ChiTiets.reduce(
                    (sum, item) => sum + (item.ThanhTien || 0),
                    0
                  ) +
                    (formData.PhiVanChuyen || 0) +
                    (formData.PhiDichVuBienSo || 0) -
                    (formData.TienGiamGia || 0)
                )}
              </span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú đơn hàng
          </label>
          <Textarea
            placeholder="VD: Khách yêu cầu đăng ký biển số TP.HCM, giao sau 17h..."
            rows={2}
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isCreating}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {isCreating ? "Đang tạo..." : "Lập đơn hàng"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
