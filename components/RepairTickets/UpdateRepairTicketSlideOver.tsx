"use client";

import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  ShieldCheck,
  Tag,
  Sparkles,
  Package,
  Edit3,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import {
  UpdatePhieuSuaChuaPayload,
  CreateChiTietSuaChuaItem,
  SC_PhieuSuaChua,
} from "@/types/suaChua";
import { getPhieuSuaChuaByIdApi } from "@/shared/api/SuaChua";
import { Label } from "../ui/label";

interface VehicleOption extends SelectOption {
  khachHangID?: string;
}

interface ServiceLookupOption extends SelectOption {
  maDichVu?: string;
  tenDichVu?: string;
  donGia?: number;
}

interface PartLookupOption extends SelectOption {
  maSKU?: string;
  tenBienThe?: string;
  donGia?: number;
  donViTinhID?: number;
}

interface UpdateRepairTicketSlideOverProps {
  open: boolean;
  onClose: () => void;
  ticket: SC_PhieuSuaChua | null;
  customerOptions: SelectOption[];
  vehicleOptions: VehicleOption[];
  serviceTypeOptions: SelectOption[];
  diaDiemOptions: SelectOption[];
  khoOptions: SelectOption[];
  serviceOptions?: ServiceLookupOption[];
  partOptions?: PartLookupOption[];
  onSubmit: (formData: UpdatePhieuSuaChuaPayload) => Promise<void>;
  isSubmitting?: boolean;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

const getInitialChiTiet = (): CreateChiTietSuaChuaItem => ({
  LoaiHangMuc: 1, // 1: Tiền công dịch vụ
  DichVuID: null,
  BienTheSanPhamID: null,
  MaHangMuc: "",
  TenHangMuc: "",
  DonViTinhID: null,
  SoLuong: 1,
  DonGia: 0,
  TienGiamGia: 0,
  ThanhTien: 0,
  GhiChu: "",
});

export function UpdateRepairTicketSlideOver({
  open,
  onClose,
  ticket,
  customerOptions,
  vehicleOptions,
  serviceTypeOptions,
  diaDiemOptions,
  khoOptions,
  serviceOptions = [],
  partOptions = [],
  onSubmit,
  isSubmitting = false,
}: UpdateRepairTicketSlideOverProps) {
  const [formData, setFormData] = useState<UpdatePhieuSuaChuaPayload>({
    PhieuSuaChuaID: "",
    KhachHangID: "",
    PhuongTienKhachHangID: "",
    DiaDiemID: "",
    KhoID: "",
    NhanVienTiepNhanID: 1,
    KyThuatVienChinhID: 2,
    LoaiDichVuID: 114,
    SoKmHienTai: 0,
    MoTaVanDe: "",
    KetQuaChanDoan: "",
    GiaiPhapXuLy: "",
    ThoiGianHenTra: null,
    TienGiamGia: 0,
    TienThueVAT: 0,
    SoThangBaoHanhSuaChua: 3,
    GhiChu: "",
    ChiTiets: [getInitialChiTiet()],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const populateFormData = (item: any) => {
    if (!item) return;
    const rawChiTiets = item.chiTiets || item.ChiTiets || [];
    setFormData({
      PhieuSuaChuaID: item.phieuSuaChuaID || item.PhieuSuaChuaID || "",
      KhachHangID: item.khachHangID || item.KhachHangID || "",
      PhuongTienKhachHangID: item.phuongTienKhachHangID || item.PhuongTienKhachHangID || "",
      DiaDiemID: item.diaDiemID || item.DiaDiemID || "",
      KhoID: item.khoID || item.KhoID || "",
      NhanVienTiepNhanID: item.nhanVienTiepNhanID ?? item.NhanVienTiepNhanID ?? 1,
      KyThuatVienChinhID: item.kyThuatVienChinhID ?? item.KyThuatVienChinhID ?? 2,
      LoaiDichVuID: item.loaiDichVuID || item.LoaiDichVuID || 114,
      SoKmHienTai: item.soKmHienTai ?? item.SoKmHienTai ?? 0,
      MoTaVanDe: item.moTaVanDe || item.MoTaVanDe || "",
      KetQuaChanDoan: item.ketQuaChanDoan || item.KetQuaChanDoan || "",
      GiaiPhapXuLy: item.giaiPhapXuLy || item.GiaiPhapXuLy || "",
      ThoiGianHenTra: item.thoiGianHenTra || item.ThoiGianHenTra || null,
      TienGiamGia: item.tienGiamGia ?? item.TienGiamGia ?? 0,
      TienThueVAT: item.tienThueVAT ?? item.TienThueVAT ?? 0,
      SoThangBaoHanhSuaChua: item.soThangBaoHanhSuaChua ?? item.SoThangBaoHanhSuaChua ?? 3,
      GhiChu: item.ghiChu || item.GhiChu || "",
      TrangThaiID: item.trangThaiID || item.TrangThaiID,
      TrangThaiThanhToanID: item.trangThaiThanhToanID || item.TrangThaiThanhToanID,
      ChiTiets:
        rawChiTiets.length > 0
          ? rawChiTiets.map((ct: any) => ({
              LoaiHangMuc: Number(ct.loaiHangMuc ?? ct.LoaiHangMuc) || 1,
              DichVuID: ct.dichVuID ?? ct.DichVuID ?? null,
              BienTheSanPhamID: ct.bienTheSanPhamID ?? ct.BienTheSanPhamID ?? null,
              MaHangMuc: ct.maHangMuc ?? ct.MaHangMuc ?? "",
              TenHangMuc: ct.tenHangMuc ?? ct.TenHangMuc ?? "",
              DonViTinhID: ct.donViTinhID ?? ct.DonViTinhID ?? null,
              SoLuong: Number(ct.soLuong ?? ct.SoLuong) || 1,
              DonGia: Number(ct.donGia ?? ct.DonGia) || 0,
              TienGiamGia: Number(ct.tienGiamGia ?? ct.TienGiamGia) || 0,
              ThanhTien:
                Number(ct.thanhTien ?? ct.ThanhTien) ||
                Math.max(
                  0,
                  (Number(ct.soLuong ?? ct.SoLuong) || 1) * (Number(ct.donGia ?? ct.DonGia) || 0) -
                    (Number(ct.tienGiamGia ?? ct.TienGiamGia) || 0),
                ),
              GhiChu: ct.ghiChu ?? ct.GhiChu ?? "",
            }))
          : [getInitialChiTiet()],
    });
    setErrors({});
  };

  useEffect(() => {
    if (open && ticket) {
      const ticketId = ticket.phieuSuaChuaID || (ticket as any).PhieuSuaChuaID;
      if (ticketId) {
        setIsLoadingDetail(true);
        // Gọi API Get chi tiết đầy đủ của phiếu sửa chữa trước khi chỉnh sửa
        getPhieuSuaChuaByIdApi(ticketId)
          .then((fullData) => {
            if (fullData) {
              populateFormData(fullData);
            } else {
              populateFormData(ticket);
            }
          })
          .catch((err) => {
            console.error("Lỗi khi tải chi tiết phiếu sửa chữa:", err);
            populateFormData(ticket);
          })
          .finally(() => {
            setIsLoadingDetail(false);
          });
      } else {
        populateFormData(ticket);
      }
    }
  }, [open, ticket?.phieuSuaChuaID]);

  // Lọc danh sách xe theo khách hàng đã chọn (nếu có)
  const filteredVehicles = useMemo(() => {
    if (!formData.KhachHangID) return vehicleOptions;
    const matched = vehicleOptions.filter(
      (v) => String(v.khachHangID) === String(formData.KhachHangID),
    );
    return matched.length > 0 ? matched : vehicleOptions;
  }, [vehicleOptions, formData.KhachHangID]);

  const handleAddDetailRow = (type: 1 | 2 = 1) => {
    setFormData((prev) => ({
      ...prev,
      ChiTiets: [
        ...prev.ChiTiets,
        {
          LoaiHangMuc: type,
          DichVuID: null,
          BienTheSanPhamID: null,
          MaHangMuc: "",
          TenHangMuc: "",
          DonViTinhID: null,
          SoLuong: 1,
          DonGia: type === 1 ? 50000 : 100000,
          TienGiamGia: 0,
          ThanhTien: type === 1 ? 50000 : 100000,
          GhiChu: "",
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

  const handleUpdateDetailRow = (
    idx: number,
    field: keyof CreateChiTietSuaChuaItem,
    val: unknown,
  ) => {
    setFormData((prev) => {
      const updated = [...prev.ChiTiets];
      const item = { ...updated[idx], [field]: val };

      // Tự động tính Thành tiền
      if (
        field === "SoLuong" ||
        field === "DonGia" ||
        field === "TienGiamGia"
      ) {
        const qty = Number(item.SoLuong) || 0;
        const price = Number(item.DonGia) || 0;
        const discount = Number(item.TienGiamGia) || 0;
        item.ThanhTien = Math.max(0, qty * price - discount);
      }

      updated[idx] = item;
      return { ...prev, ChiTiets: updated };
    });
  };

  const handleSelectServicePreset = (idx: number, dichVuId: string) => {
    const selected = serviceOptions.find(
      (s) => String(s.value) === String(dichVuId),
    );
    if (!selected) return;

    setFormData((prev) => {
      const updated = [...prev.ChiTiets];
      const qty = updated[idx].SoLuong || 1;
      const price = selected.donGia || 0;
      const discount = updated[idx].TienGiamGia || 0;

      updated[idx] = {
        ...updated[idx],
        LoaiHangMuc: 1,
        DichVuID: String(selected.value),
        BienTheSanPhamID: null,
        MaHangMuc: selected.maDichVu || "DV-SC",
        TenHangMuc: selected.tenDichVu || selected.label,
        DonGia: price,
        ThanhTien: Math.max(0, qty * price - discount),
      };
      return { ...prev, ChiTiets: updated };
    });
  };

  const handleSelectPartPreset = (idx: number, partId: string) => {
    const selected = partOptions.find(
      (p) => String(p.value) === String(partId),
    );
    if (!selected) return;

    setFormData((prev) => {
      const updated = [...prev.ChiTiets];
      const qty = updated[idx].SoLuong || 1;
      const price = selected.donGia || 0;
      const discount = updated[idx].TienGiamGia || 0;

      updated[idx] = {
        ...updated[idx],
        LoaiHangMuc: 2,
        BienTheSanPhamID: String(selected.value),
        DichVuID: null,
        MaHangMuc: selected.maSKU || "",
        TenHangMuc: selected.tenBienThe || selected.label,
        DonViTinhID: selected.donViTinhID || null,
        DonGia: price,
        ThanhTien: Math.max(0, qty * price - discount),
      };
      return { ...prev, ChiTiets: updated };
    });
  };

  // Tính tổng tiền các hạng mục
  const subTotalLabor = useMemo(
    () =>
      formData.ChiTiets.filter((c) => c.LoaiHangMuc === 1).reduce(
        (acc, cur) => acc + (cur.ThanhTien || 0),
        0,
      ),
    [formData.ChiTiets],
  );

  const subTotalParts = useMemo(
    () =>
      formData.ChiTiets.filter((c) => c.LoaiHangMuc === 2).reduce(
        (acc, cur) => acc + (cur.ThanhTien || 0),
        0,
      ),
    [formData.ChiTiets],
  );

  const grandTotal = useMemo(
    () =>
      Math.max(
        0,
        subTotalLabor +
          subTotalParts -
          (formData.TienGiamGia || 0) +
          (formData.TienThueVAT || 0),
      ),
    [subTotalLabor, subTotalParts, formData.TienGiamGia, formData.TienThueVAT],
  );

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
      toast.warning("Vui lòng kiểm tra lại thông tin sửa chữa bắt buộc!");
      return;
    }

    // Đảm bảo các dòng chi tiết hợp lệ
    const validChiTiets = formData.ChiTiets.filter(
      (c) => c.TenHangMuc?.trim() && c.SoLuong > 0,
    );

    if (validChiTiets.length === 0) {
      toast.warning(
        "Vui lòng nhập ít nhất 1 hạng mục dịch vụ hoặc linh kiện thay thế!",
      );
      return;
    }

    // Kiểm tra dòng phụ tùng (LoaiHangMuc = 2) bắt buộc phải có BienTheSanPhamID
    const missingPart = validChiTiets.find(
      (c) => c.LoaiHangMuc === 2 && !c.BienTheSanPhamID,
    );
    if (missingPart) {
      toast.warning(
        `Hạng mục phụ tùng "${missingPart.TenHangMuc || "chưa chọn"}" bắt buộc phải chọn linh kiện/biến thể sản phẩm từ kho để có thể tự động trừ tồn kho khi bàn giao xe!`,
      );
      return;
    }

    await onSubmit({
      ...formData,
      ChiTiets: validChiTiets,
    });
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Chỉnh Sửa Phiếu Sửa Chữa"
      description={`Cập nhật thông tin phiếu [${ticket?.maPhieuSuaChua || "PSC"}], chẩn đoán & danh mục sửa chữa`}
      maxWidth="2xl"
    >
      {isLoadingDetail ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-xs font-medium">Đang tải dữ liệu chi tiết phiếu sửa chữa...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* Banner hướng dẫn */}
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
          <Edit3 className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            Chỉnh sửa chẩn đoán bệnh, giải pháp xử lý, các khoản tiền công dịch
            vụ và phụ tùng linh kiện thay thế theo yêu cầu thực tế.
          </span>
        </div>

        {/* Khách hàng & Phương tiện xe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Khách hàng <span className="text-destructive">*</span>
            </label>
            <SearchSelect
              options={customerOptions}
              value={formData.KhachHangID}
              onChange={(val) => {
                setFormData((prev) => ({
                  ...prev,
                  KhachHangID: String(val),
                  PhuongTienKhachHangID: "",
                }));
                if (errors.KhachHangID) {
                  setErrors((prev) => ({ ...prev, KhachHangID: "" }));
                }
              }}
              placeholder="Chọn khách hàng..."
            />
            {errors.KhachHangID && (
              <span className="text-[11px] text-destructive mt-1 block">
                {errors.KhachHangID}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Phương tiện / Xe vào xưởng
            </label>
            <SearchSelect
              options={filteredVehicles}
              value={formData.PhuongTienKhachHangID}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  PhuongTienKhachHangID: String(val),
                }))
              }
              placeholder="Chọn biển số / số khung..."
            />
          </div>
        </div>

        {/* Địa điểm, Kho xuất & Gói dịch vụ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Chi nhánh / Điểm tiếp nhận
            </label>
            <SearchSelect
              options={diaDiemOptions}
              value={formData.DiaDiemID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, DiaDiemID: String(val) }))
              }
              placeholder="Chọn chi nhánh..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Kho xuất phụ tùng
            </label>
            <SearchSelect
              options={khoOptions}
              value={formData.KhoID}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, KhoID: String(val) }))
              }
              placeholder="Chọn kho xuất..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Loại gói dịch vụ
            </label>
            <SearchSelect
              options={serviceTypeOptions}
              value={formData.LoaiDichVuID}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  LoaiDichVuID: Number(val) || 114,
                }))
              }
              placeholder="Loại dịch vụ..."
            />
          </div>
        </div>

        {/* Triệu chứng, Chẩn đoán, Giải pháp */}
        <div className="space-y-3">
          <div>
            <Label className="block text-xs font-semibold text-foreground mb-1">
              Mô tả vấn đề / Triệu chứng phản ánh{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={2}
              placeholder="VD: Xe kêu chén cổ và hỏng thêm má phanh sau..."
              value={formData.MoTaVanDe || ""}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  MoTaVanDe: e.target.value,
                }));
                if (errors.MoTaVanDe) {
                  setErrors((prev) => ({ ...prev, MoTaVanDe: "" }));
                }
              }}
              className="text-xs"
            />
            {errors.MoTaVanDe && (
              <span className="text-[11px] text-destructive mt-1 block">
                {errors.MoTaVanDe}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Kết quả chẩn đoán kỹ thuật
              </label>
              <Textarea
                rows={2}
                placeholder="VD: Bát phốt rơ, má phanh sau mòn hết..."
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

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Giải pháp & Biện pháp khắc phục
              </label>
              <Textarea
                rows={2}
                placeholder="VD: Thay bát phốt và thay má phanh sau..."
                value={formData.GiaiPhapXuLy || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    GiaiPhapXuLy: e.target.value,
                  }))
                }
                className="text-xs"
              />
            </div>
          </div>
        </div>

        {/* BẢNG HẠNG MỤC DỊCH VỤ & PHỤ TÙNG */}
        <div className="pt-2 border-t border-border/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div>
              <span className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Danh mục Tiền công & Phụ tùng ({formData.ChiTiets.length})
              </span>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Loại 1: Tiền công dịch vụ | Loại 2: Phụ tùng / Linh kiện thay
                thế
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleAddDetailRow(1)}
                className="text-xs gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <Plus className="w-3 h-3" /> Tiền công DV
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleAddDetailRow(2)}
                className="text-xs gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                <Package className="w-3 h-3" /> Phụ tùng xe
              </Button>
            </div>
          </div>

          <div className="space-y-2.5">
            {formData.ChiTiets.map((ct, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs space-y-2 transition-all ${
                  ct.LoaiHangMuc === 1
                    ? "border-blue-200/80 bg-blue-50/20 dark:border-blue-900/40 dark:bg-blue-950/10"
                    : "border-emerald-200/80 bg-emerald-50/20 dark:border-emerald-900/40 dark:bg-emerald-950/10"
                }`}
              >
                {/* Header dòng: Loại hạng mục + Preset selector */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        ct.LoaiHangMuc === 1
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300"
                      }`}
                    >
                      {ct.LoaiHangMuc === 1 ? "Tiền công DV" : "Phụ tùng / LK"}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Preset Quick Select */}
                  <div className="flex-1 max-w-xs">
                    {ct.LoaiHangMuc === 1 && serviceOptions.length > 0 ? (
                      <SearchSelect
                        options={serviceOptions}
                        value={ct.DichVuID || ""}
                        onChange={(val) =>
                          handleSelectServicePreset(idx, String(val))
                        }
                        placeholder="-- Chọn bảng giá DV mẫu --"
                      />
                    ) : ct.LoaiHangMuc === 2 && partOptions.length > 0 ? (
                      <SearchSelect
                        options={partOptions}
                        value={ct.BienTheSanPhamID || ""}
                        onChange={(val) =>
                          handleSelectPartPreset(idx, String(val))
                        }
                        placeholder="-- Chọn linh kiện kho mẫu --"
                      />
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleRemoveDetailRow(idx)}
                    disabled={formData.ChiTiets.length <= 1}
                    className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                {/* Hàng nhập chi tiết */}
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-12 sm:col-span-6">
                    <label className="block text-[10px] text-muted-foreground mb-0.5">
                      Tên hạng mục / Phụ tùng
                    </label>
                    <Input
                      type="text"
                      placeholder="Tên công việc hoặc phụ tùng thay..."
                      value={ct.TenHangMuc}
                      onChange={(e) =>
                        handleUpdateDetailRow(idx, "TenHangMuc", e.target.value)
                      }
                      className="text-xs h-8"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-1">
                    <label className="block text-[10px] text-muted-foreground mb-0.5">
                      SL
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={ct.SoLuong}
                      onChange={(e) =>
                        handleUpdateDetailRow(
                          idx,
                          "SoLuong",
                          Number(e.target.value) || 1,
                        )
                      }
                      className="text-xs h-8 px-1 text-center font-bold"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <label className="block text-[10px] text-muted-foreground mb-0.5">
                      Đơn giá
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="5000"
                      value={ct.DonGia}
                      onChange={(e) =>
                        handleUpdateDetailRow(
                          idx,
                          "DonGia",
                          Number(e.target.value) || 0,
                        )
                      }
                      className="text-xs h-8 px-1 text-right font-mono"
                    />
                  </div>

                  <div className="col-span-5 sm:col-span-1">
                    <label className="block text-[10px] text-muted-foreground mb-0.5">
                      Giảm giá
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="5000"
                      value={ct.TienGiamGia || 0}
                      onChange={(e) =>
                        handleUpdateDetailRow(
                          idx,
                          "TienGiamGia",
                          Number(e.target.value) || 0,
                        )
                      }
                      className="text-xs h-8 px-1 text-right font-mono"
                    />
                  </div>

                  <div className="col-span-12 sm:col-span-2">
                    <label className="block text-[10px] text-muted-foreground mb-0.5 text-right">
                      Thành tiền
                    </label>
                    <div className="text-xs h-8 flex items-center justify-end font-bold font-mono text-foreground px-2 bg-muted/40 rounded border border-border/50">
                      {formatCurrency(ct.ThanhTien)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tổng kết tài chính phiếu sửa chữa */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-muted/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tiền công dịch vụ:</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(subTotalLabor)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tiền phụ tùng & linh kiện:</span>
            <span className="font-mono font-medium text-foreground">
              {formatCurrency(subTotalParts)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Giảm giá phiếu (VNĐ)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  step="10000"
                  placeholder="0"
                  value={formData.TienGiamGia || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      TienGiamGia: Number(e.target.value) || 0,
                    }))
                  }
                  className="text-xs h-8 pl-7 font-mono"
                />
                <Tag className="w-3 h-3 absolute left-2.5 top-2.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Tiền thuế VAT (VNĐ)
              </label>
              <Input
                type="number"
                min="0"
                step="10000"
                placeholder="0"
                value={formData.TienThueVAT || 0}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    TienThueVAT: Number(e.target.value) || 0,
                  }))
                }
                className="text-xs h-8 font-mono text-right"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm font-bold text-foreground pt-2 border-t border-border/80">
            <span>Tổng thanh toán dự kiến:</span>
            <span className="font-mono text-base text-blue-600 dark:text-blue-400">
              {formatCurrency(grandTotal)}
            </span>
          </div>
        </div>

        {/* Ghi chú */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú tiếp nhận / Yêu cầu riêng của khách
          </label>
          <Textarea
            rows={2}
            placeholder="VD: Khách yêu cầu giữ lại phụ tùng cũ đã thay..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-xs h-9 px-4"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="text-xs h-9 px-5 bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-xs"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
          </Button>
        </div>
      </form>
      )}
    </SlideOver>
  );
}
