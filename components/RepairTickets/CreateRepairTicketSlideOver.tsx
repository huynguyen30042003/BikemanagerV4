"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Wrench, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CreatePhieuSuaChuaPayload } from "@/types/suaChua";

interface VehicleOption extends SelectOption {
  khachHangID?: string;
}

interface CreateRepairTicketSlideOverProps {
  open: boolean;
  onClose: () => void;
  customerOptions: SelectOption[];
  vehicleOptions: VehicleOption[];
  serviceTypeOptions: SelectOption[];
  diaDiemOptions: SelectOption[];
  khoOptions: SelectOption[];
  onSubmit: (formData: CreatePhieuSuaChuaPayload) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateRepairTicketSlideOver({
  open,
  onClose,
  customerOptions,
  vehicleOptions,
  serviceTypeOptions,
  diaDiemOptions,
  khoOptions,
  onSubmit,
  isSubmitting = false,
}: CreateRepairTicketSlideOverProps) {
  const [formData, setFormData] = useState<CreatePhieuSuaChuaPayload>({
    KhachHangID: "",
    PhuongTienKhachHangID: "",
    DiaDiemID: "",
    KhoID: "",
    LoaiDichVuID: 114,
    SoKmHienTai: 0,
    MoTaVanDe: "",
    KetQuaChanDoan: "",
    GiaiPhapXuLy: "",
    TrangThaiID: 107,
    TrangThaiThanhToanID: 83,
    ThoiGianHenTra: null,
    GhiChu: "",
    ChiTiets: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData({
        KhachHangID: customerOptions[0]?.value ? String(customerOptions[0].value) : "",
        PhuongTienKhachHangID: vehicleOptions[0]?.value ? String(vehicleOptions[0].value) : "",
        DiaDiemID: diaDiemOptions[0]?.value ? String(diaDiemOptions[0].value) : "",
        KhoID: khoOptions[0]?.value ? String(khoOptions[0].value) : "",
        LoaiDichVuID: serviceTypeOptions[0]?.value ? Number(serviceTypeOptions[0].value) : 114,
        SoKmHienTai: 0,
        MoTaVanDe: "",
        KetQuaChanDoan: "",
        GiaiPhapXuLy: "",
        TrangThaiID: 107,
        TrangThaiThanhToanID: 83,
        ThoiGianHenTra: null,
        GhiChu: "",
        ChiTiets: [
          {
            LoaiHangMuc: 1,
            MaHangMuc: "DV-KT",
            TenHangMuc: "Kiểm tra tổng quát xe điện",
            SoLuong: 1,
            DonGia: 100000,
            TienGiamGia: 0,
            ThanhTien: 100000,
          },
        ],
      });
      setErrors({});
    }
  }, [open, customerOptions, vehicleOptions, diaDiemOptions, khoOptions, serviceTypeOptions]);

  // Lọc danh sách xe theo khách hàng đã chọn (nếu có)
  const filteredVehicles = useMemo(() => {
    if (!formData.KhachHangID) return vehicleOptions;
    const matched = vehicleOptions.filter(
      (v) => String(v.khachHangID) === String(formData.KhachHangID)
    );
    return matched.length > 0 ? matched : vehicleOptions;
  }, [vehicleOptions, formData.KhachHangID]);

  const handleAddDetailRow = () => {
    setFormData((prev) => ({
      ...prev,
      ChiTiets: [
        ...prev.ChiTiets,
        {
          LoaiHangMuc: 1,
          MaHangMuc: "DV-SC",
          TenHangMuc: "",
          SoLuong: 1,
          DonGia: 50000,
          TienGiamGia: 0,
          ThanhTien: 50000,
        },
      ],
    }));
  };

  const handleRemoveDetailRow = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      ChiTiets: prev.ChiTiets.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.KhachHangID) {
      newErrors.KhachHangID = "Vui lòng chọn khách hàng";
    }
    if (!formData.MoTaVanDe?.trim()) {
      newErrors.MoTaVanDe = "Vui lòng ghi nhận tình trạng xe / vấn đề";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.warning("Vui lòng kiểm tra lại thông tin tiếp nhận!");
      return;
    }

    setErrors({});
    await onSubmit(formData);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Tiếp Nhận Sửa Chữa & Bảo Dưỡng Xe"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-300">
          <Wrench className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            Tiếp nhận xe vào xưởng, ghi nhận triệu chứng phản ánh, cấu hình các hạng mục dịch vụ dự kiến và phụ tùng thay thế.
          </span>
        </div>

        {/* Khách hàng & Phương tiện */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Chủ xe / Khách hàng <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              placeholder="Chọn khách hàng..."
              options={customerOptions}
              value={formData.KhachHangID}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  KhachHangID: String(val),
                }))
              }
              height={10}
            />
            {errors.KhachHangID && (
              <p className="text-[11px] text-rose-500 mt-1">{errors.KhachHangID}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Phương tiện xe của khách
            </label>
            <SearchSelect
              placeholder="Chọn xe..."
              options={filteredVehicles}
              value={formData.PhuongTienKhachHangID}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  PhuongTienKhachHangID: String(val),
                }))
              }
              height={10}
            />
          </div>
        </div>

        {/* Gói dịch vụ, ODO, Kho */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Gói dịch vụ (Từ DM chi tiết)
            </label>
            <SearchSelect
              options={serviceTypeOptions}
              value={String(formData.LoaiDichVuID)}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  LoaiDichVuID: Number(val),
                }))
              }
              height={10}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Số Km (ODO) hiện tại
            </label>
            <Input
              type="number"
              min={0}
              value={formData.SoKmHienTai || 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  SoKmHienTai: parseInt(e.target.value, 10) || 0,
                }))
              }
              className="text-xs font-mono h-10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Kho phụ tùng xuất linh kiện
            </label>
            <SearchSelect
              options={khoOptions}
              value={formData.KhoID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, KhoID: String(val) }))
              }
              height={10}
            />
          </div>
        </div>

        {/* Khách phản ánh */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Khách phản ánh / Triệu chứng xe <span className="text-rose-500">*</span>
          </label>
          <Textarea
            placeholder="VD: Xe đi bị kêu ở bánh sau, ga không bốc, pin sụt nhanh..."
            rows={2}
            value={formData.MoTaVanDe || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, MoTaVanDe: e.target.value }))
            }
            className={`text-xs ${errors.MoTaVanDe ? "border-rose-500 focus-visible:ring-rose-500" : ""}`}
          />
          {errors.MoTaVanDe && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.MoTaVanDe}</p>
          )}
        </div>

        {/* Chẩn đoán */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Thợ máy chẩn đoán & Phương án xử lý
          </label>
          <Textarea
            placeholder="VD: Thay vòng bi moay-ơ bánh sau, cân chỉnh phanh đĩa..."
            rows={2}
            value={formData.KetQuaChanDoan || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                KetQuaChanDoan: e.target.value,
              }))
            }
            className="text-xs"
          />
        </div>

        {/* Chi tiết hạng mục tiền công / phụ tùng */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-foreground">
              Hạng mục tiền công & Phụ tùng thay thế ({formData.ChiTiets.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleAddDetailRow}
              className="text-blue-600 text-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Thêm hạng mục
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {formData.ChiTiets.map((row, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-border bg-muted/30 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
              >
                <div className="sm:col-span-6">
                  <Input
                    type="text"
                    placeholder="Tên công việc / Tên phụ tùng"
                    value={row.TenHangMuc}
                    onChange={(e) => {
                      const updated = [...formData.ChiTiets];
                      updated[idx].TenHangMuc = e.target.value;
                      setFormData((prev) => ({ ...prev, ChiTiets: updated }));
                    }}
                    className="text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    type="number"
                    min={1}
                    placeholder="SL"
                    value={row.SoLuong}
                    onChange={(e) => {
                      const updated = [...formData.ChiTiets];
                      const qty = Math.max(1, parseInt(e.target.value, 10) || 1);
                      updated[idx].SoLuong = qty;
                      updated[idx].ThanhTien = qty * updated[idx].DonGia;
                      setFormData((prev) => ({ ...prev, ChiTiets: updated }));
                    }}
                    className="text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="Đơn giá"
                    value={row.DonGia}
                    onChange={(e) => {
                      const updated = [...formData.ChiTiets];
                      const price = parseInt(e.target.value, 10) || 0;
                      updated[idx].DonGia = price;
                      updated[idx].ThanhTien = updated[idx].SoLuong * price;
                      setFormData((prev) => ({ ...prev, ChiTiets: updated }));
                    }}
                    className="text-xs font-mono font-bold"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveDetailRow(idx)}
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
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
            {isSubmitting ? "Đang lưu..." : "Lập phiếu sửa chữa"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
