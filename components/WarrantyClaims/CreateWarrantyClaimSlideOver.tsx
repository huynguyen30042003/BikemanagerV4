"use client";

import React, { useState, useEffect, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { SlideOver } from "@/components/ui/SlideOver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect } from "@/components/ui/selectSearch";
import {
  useCreatePhieuBaoHanh,
  useGetBaoHanh,
} from "@/hooks/BaoHanh/useBaoHanhApi";
import { useGetPhuTungs } from "@/hooks/BienTheSanPham/useBienTheSanPhamApi";
import {
  BH_BaoHanh,
  CreateChiTietBaoHanhPayload,
  CreatePhieuBaoHanhPayload,
} from "@/types/baoHanh";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import {
  Store,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  AlertCircle,
  Hash,
  UserCheck,
  Calendar,
  Gauge,
  Plus,
  Trash2,
  Package,
  RefreshCw,
} from "lucide-react";

const generateClaimCode = (): string => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const suffix = String(Math.floor(100 + Math.random() * 900));
  return `PBH${yyyy}${mm}${dd}-${suffix}`;
};

const getDefaultAppointmentDate = (): string => {
  const target = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  target.setHours(16, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(
    target.getDate(),
  )}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
};

export const warrantyClaimSchema = z.object({
  MaPhieuBaoHanh: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã phiếu bảo hành"),
  BaoHanhID: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn sổ bảo hành điện tử cần tiếp nhận"),
  DiaDiemID: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn trạm bảo hành / showroom tiếp nhận"),
  MoTaLoi: z
    .string()
    .trim()
    .min(5, "Vui lòng mô tả chi tiết sự cố hư hỏng (tối thiểu 5 ký tự)"),
  HuongXuLyID: z.number().min(1, "Vui lòng chọn hướng xử lý"),
  ChiPhiHangHoTro: z
    .number()
    .min(0, "Chi phí không được âm")
    .optional()
    .nullable(),
  ChiPhiKhachTra: z
    .number()
    .min(0, "Chi phí không được âm")
    .optional()
    .nullable(),
});

interface OptionItem {
  value: string | number;
  label: string;
}

const LOAI_XU_LY_OPTIONS: OptionItem[] = [
  { value: 1, label: "1 - Sửa chữa / Cân chỉnh kỹ thuật" },
  { value: 2, label: "2 - Đổi mới linh kiện / Pin" },
];

interface CreateWarrantyClaimSlideOverProps {
  open: boolean;
  onClose: () => void;
  diaDiemOptions: OptionItem[];
  claimStatusOptions: OptionItem[];
  isLoadingClaimStatuses?: boolean;
  actionOptions: OptionItem[];
  isLoadingActions?: boolean;
  onSuccess?: () => void;
}

export function CreateWarrantyClaimSlideOver({
  open,
  onClose,
  diaDiemOptions,
  claimStatusOptions,
  isLoadingClaimStatuses = false,
  actionOptions,
  isLoadingActions = false,
  onSuccess,
}: CreateWarrantyClaimSlideOverProps) {
  const [formData, setFormData] = useState<CreatePhieuBaoHanhPayload>({
    MaPhieuBaoHanh: "",
    BaoHanhID: "",
    KhachHangID: "",
    SoSerialID: "",
    DiaDiemID: "",
    NhanVienTiepNhanID: 1,
    KyThuatVienID: 2,
    NgayHenTra: "",
    SoKmHienTai: 0,
    MoTaLoi: "",
    KetQuaKiemTra: "",
    HuongXuLyID: 102,
    TrangThaiID: 96,
    ChiPhiHangHoTro: 0,
    ChiPhiKhachTra: 0,
    GhiChu: "",
    ChiTiets: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const createMutation = useCreatePhieuBaoHanh();

  // Lazy Queries chỉ tải khi mở SlideOver (Quy chuẩn Mục 8.1 AGENTS.md)
  const { data: rawWarranties, isLoading: isLoadingWarranties } = useGetBaoHanh(
    { PageIndex: 1, PageSize: 200 },
    { enabled: open },
  );
  const warranties: BH_BaoHanh[] = useMemo(
    () => (rawWarranties?.data ?? []) as BH_BaoHanh[],
    [rawWarranties],
  );
  const warrantyOptions: OptionItem[] = useMemo(
    () =>
      warranties.map((w) => ({
        value: w.baoHanhID,
        label: `${w.maBaoHanh} - ${w.tenKhachHang || "Khách"} (${
          w.tenBienThe || "Sản phẩm"
        } | Serial: ${w.maSerial || w.soKhung || "-"})`,
      })),
    [warranties],
  );

  const selectedWarranty: BH_BaoHanh | null = useMemo(
    () =>
      warranties.find((w) => w.baoHanhID === formData.BaoHanhID) ?? null,
    [warranties, formData.BaoHanhID],
  );

  // Lấy danh sách Biến thể sản phẩm / Linh kiện từ POST /api/BienTheSanPhamApi/GetPhuTungs
  const { data: rawPhuTungs, isLoading: isLoadingPhuTungs } = useGetPhuTungs(
    { PageIndex: 1, PageSize: 200 },
    { enabled: open },
  );
  const phuTungs: SP_BienTheSanPham[] = useMemo(
    () => (rawPhuTungs?.data ?? []) as SP_BienTheSanPham[],
    [rawPhuTungs],
  );
  const phuTungOptions: OptionItem[] = useMemo(
    () =>
      phuTungs.map((v) => ({
        value: v.bienTheSanPhamID,
        label: `${v.tenBienThe} [${v.maSKU}]`,
      })),
    [phuTungs],
  );

  // Reset form when opened
  useEffect(() => {
    if (open) {
      const defaultDiaDiem = diaDiemOptions[0]?.value
        ? String(diaDiemOptions[0].value)
        : "";
      const defaultAction = actionOptions[0]?.value
        ? Number(actionOptions[0].value)
        : 102;
      const defaultStatus = claimStatusOptions[0]?.value
        ? Number(claimStatusOptions[0].value)
        : 96;
      const firstWarranty = warranties[0];

      setFormData({
        MaPhieuBaoHanh: generateClaimCode(),
        BaoHanhID: firstWarranty?.baoHanhID ?? "",
        KhachHangID: firstWarranty?.khachHangID ?? "",
        SoSerialID: firstWarranty?.soSerialID ?? "",
        DiaDiemID: defaultDiaDiem,
        NhanVienTiepNhanID: 1,
        KyThuatVienID: 2,
        NgayHenTra: getDefaultAppointmentDate(),
        SoKmHienTai: 0,
        MoTaLoi: "",
        KetQuaKiemTra: "",
        HuongXuLyID: defaultAction,
        TrangThaiID: defaultStatus,
        ChiPhiHangHoTro: 0,
        ChiPhiKhachTra: 0,
        GhiChu: "",
        ChiTiets: [],
      });
      setErrors({});
    }
  }, [open, diaDiemOptions, actionOptions, claimStatusOptions, warranties]);

  const handleSelectWarranty = (baoHanhId: string) => {
    const matched = warranties.find((w) => w.baoHanhID === baoHanhId);
    setFormData((prev) => ({
      ...prev,
      BaoHanhID: baoHanhId,
      KhachHangID: matched?.khachHangID ?? prev.KhachHangID,
      SoSerialID: matched?.soSerialID ?? prev.SoSerialID,
    }));
    if (errors.BaoHanhID) {
      setErrors((prev) => ({ ...prev, BaoHanhID: "" }));
    }
  };

  const handleAddChiTiet = () => {
    const defaultPhuTung = phuTungs[0];
    setFormData((prev) => ({
      ...prev,
      ChiTiets: [
        ...(prev.ChiTiets ?? []),
        {
          LoaiXuLy: 2,
          BienTheSanPhamID: defaultPhuTung?.bienTheSanPhamID ?? "",
        },
      ],
    }));
  };

  const handleRemoveChiTiet = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ChiTiets: (prev.ChiTiets ?? []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateChiTiet = <K extends keyof CreateChiTietBaoHanhPayload>(
    index: number,
    field: K,
    value: CreateChiTietBaoHanhPayload[K],
  ) => {
    setFormData((prev) => {
      const nextDetails = [...(prev.ChiTiets ?? [])];
      nextDetails[index] = {
        ...nextDetails[index],
        [field]: value,
      };
      return {
        ...prev,
        ChiTiets: nextDetails,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = warrantyClaimSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        formattedErrors[path] = issue.message;
      });
      setErrors(formattedErrors);
      toast.warning("Vui lòng kiểm tra lại thông tin nhập!");
      return;
    }

    const formattedNgayHenTra = formData.NgayHenTra
      ? formData.NgayHenTra.length === 16
        ? `${formData.NgayHenTra}:00`
        : formData.NgayHenTra
      : null;

    // ChiTiets chỉ gửi về LoaiXuLy và BienTheSanPhamID từ api/BienTheSanPhamApi/GetPhuTungs
    const payload: CreatePhieuBaoHanhPayload = {
      ...formData,
      NgayHenTra: formattedNgayHenTra,
      ChiTiets: (formData.ChiTiets ?? [])
        .filter((ct) => Boolean(ct.BienTheSanPhamID))
        .map((ct) => ({
          LoaiXuLy: Number(ct.LoaiXuLy) || 1,
          BienTheSanPhamID: ct.BienTheSanPhamID || null,
        })),
    };

    try {
      await createMutation.mutateAsync(payload);
      toast.success("Lập phiếu tiếp nhận bảo hành thành công!");
      onClose();
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể tạo phiếu bảo hành!";
      toast.error(message);
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Tiếp Nhận Xe / Thiết Bị Bảo Hành"
      description="Ghi nhận đầy đủ sổ bảo hành, nhân sự, ODO, kết quả chẩn đoán và sản phẩm / linh kiện bảo hành"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {/* 1. Mã phiếu bảo hành & Trạm tiếp nhận */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-500" />
              <span>Mã phiếu bảo hành</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              <Input
                placeholder="VD: PBH20261013-001"
                value={formData.MaPhieuBaoHanh || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    MaPhieuBaoHanh: e.target.value,
                  }))
                }
                className="text-xs font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                title="Tạo mã mới"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    MaPhieuBaoHanh: generateClaimCode(),
                  }))
                }
                className="h-9 px-2.5 shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
            </div>
            {errors.MaPhieuBaoHanh && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.MaPhieuBaoHanh}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-blue-500" />
              <span>Trạm bảo hành / Showroom tiếp nhận</span>
              <span className="text-rose-500">*</span>
            </label>
            <SearchSelect
              options={diaDiemOptions}
              value={formData.DiaDiemID || ""}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, DiaDiemID: String(val) }))
              }
              placeholder="Chọn trạm tiếp nhận..."
            />
            {errors.DiaDiemID && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.DiaDiemID}
              </p>
            )}
          </div>
        </div>

        {/* 2. Sổ bảo hành điện tử (BaoHanhID) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sổ bảo hành điện tử (Xe / Linh kiện bảo hành)</span>
            <span className="text-rose-500">*</span>
          </label>
          <SearchSelect
            options={warrantyOptions}
            value={formData.BaoHanhID || ""}
            onChange={(val) => handleSelectWarranty(String(val))}
            isLoading={isLoadingWarranties}
            placeholder="Tìm theo mã sổ BH, tên khách hàng, số serial hoặc số khung..."
          />
          {errors.BaoHanhID && (
            <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.BaoHanhID}
            </p>
          )}

          {selectedWarranty && (
            <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <div>
                <span className="text-muted-foreground">Khách hàng: </span>
                <strong className="text-foreground">
                  {selectedWarranty.tenKhachHang || "-"}
                </strong>
                {selectedWarranty.dienThoaiKhachHang && (
                  <span className="font-mono text-muted-foreground">
                    {" "}
                    ({selectedWarranty.dienThoaiKhachHang})
                  </span>
                )}
              </div>
              <div>
                <span className="text-muted-foreground">Thiết bị / Xe: </span>
                <strong className="text-foreground">
                  {selectedWarranty.tenBienThe || "-"}
                </strong>
              </div>
              <div>
                <span className="text-muted-foreground">Serial / VIN: </span>
                <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                  {selectedWarranty.maSerial || selectedWarranty.soKhung || "-"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Thời hạn BH: </span>
                <span className="font-mono text-foreground">
                  {selectedWarranty.soThangBaoHanh} tháng
                  {selectedWarranty.gioiHanKm
                    ? ` / ${selectedWarranty.gioiHanKm.toLocaleString("vi-VN")} km`
                    : ""}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Nhân sự phụ trách & Thông số tiếp nhận (NhanVienTiepNhanID, KyThuatVienID, NgayHenTra, SoKmHienTai) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Mã NV tiếp nhận</span>
            </label>
            <Input
              type="number"
              min={1}
              value={formData.NhanVienTiepNhanID ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  NhanVienTiepNhanID: e.target.value
                    ? parseInt(e.target.value, 10)
                    : null,
                }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-amber-500" />
              <span>Mã Kỹ thuật viên</span>
            </label>
            <Input
              type="number"
              min={1}
              value={formData.KyThuatVienID ?? ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  KyThuatVienID: e.target.value
                    ? parseInt(e.target.value, 10)
                    : null,
                }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-emerald-500" />
              <span>Số KM hiện tại (ODO)</span>
            </label>
            <Input
              type="number"
              min={0}
              step={10}
              placeholder="VD: 4800"
              value={formData.SoKmHienTai ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  SoKmHienTai: parseInt(e.target.value, 10) || 0,
                }))
              }
              className="text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Ngày giờ hẹn trả</span>
            </label>
            <Input
              type="datetime-local"
              value={formData.NgayHenTra || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  NgayHenTra: e.target.value,
                }))
              }
              className="text-xs font-mono"
            />
          </div>
        </div>

        {/* 4. Triệu chứng lỗi & Chẩn đoán kỹ thuật */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Mô tả triệu chứng hư hỏng</span>
              <span className="text-rose-500">*</span>
            </label>
            <Textarea
              placeholder="VD: Pin sạc không nhận dòng, đèn báo lỗi đỏ nhấp nháy..."
              rows={3}
              value={formData.MoTaLoi}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, MoTaLoi: e.target.value }));
                if (errors.MoTaLoi) {
                  setErrors((prev) => ({ ...prev, MoTaLoi: "" }));
                }
              }}
              className="text-xs"
            />
            {errors.MoTaLoi && (
              <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.MoTaLoi}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-blue-500" />
              <span>Kết quả kiểm tra / Chẩn đoán kỹ thuật</span>
            </label>
            <Textarea
              placeholder="VD: Hỏng mạch BMS của cell pin số 4..."
              rows={3}
              value={formData.KetQuaKiemTra || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  KetQuaKiemTra: e.target.value,
                }))
              }
              className="text-xs"
            />
          </div>
        </div>

        {/* 5. Hướng xử lý & Trạng thái phiếu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Hướng xử lý bảo hành</span>
            </label>
            <SearchSelect
              options={actionOptions}
              value={Number(formData.HuongXuLyID)}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  HuongXuLyID: Number(val),
                }))
              }
              isLoading={isLoadingActions}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Trạng thái phiếu</span>
            </label>
            <SearchSelect
              options={claimStatusOptions}
              value={Number(formData.TrangThaiID)}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  TrangThaiID: Number(val),
                }))
              }
              isLoading={isLoadingClaimStatuses}
            />
          </div>
        </div>

        {/* 6. Danh sách ChiTiets: Chỉ chọn LoaiXuLy và BienTheSanPhamID (từ GetPhuTungs) */}
        <div className="space-y-2.5 pt-2 border-t border-border/80">
          <div className="flex items-center justify-between gap-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Package className="w-4 h-4 text-blue-600" />
              <span>
                Sản phẩm / Linh kiện bảo hành ({formData.ChiTiets?.length ?? 0})
              </span>
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddChiTiet}
              className="h-7 px-2.5 text-xs gap-1 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm linh kiện bảo hành</span>
            </Button>
          </div>

          {!formData.ChiTiets || formData.ChiTiets.length === 0 ? (
            <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center text-xs text-muted-foreground">
              Chưa chọn linh kiện / phụ tùng bảo hành. Bấm{" "}
              <strong>&quot;Thêm linh kiện bảo hành&quot;</strong> để chọn loại
              xử lý và linh kiện.
            </div>
          ) : (
            <div className="space-y-2.5">
              {formData.ChiTiets.map((ct, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-border/80 bg-muted/25 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      Hạng mục #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveChiTiet(idx)}
                      className="h-6 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 text-xs gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        Loại xử lý
                      </label>
                      <SearchSelect
                        options={LOAI_XU_LY_OPTIONS}
                        value={Number(ct.LoaiXuLy)}
                        onChange={(val) =>
                          handleUpdateChiTiet(idx, "LoaiXuLy", Number(val))
                        }
                      />
                    </div>

                    <div className="sm:col-span-7">
                      <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                        Biến thể sản phẩm / Linh kiện
                      </label>
                      <SearchSelect
                        options={phuTungOptions}
                        value={ct.BienTheSanPhamID || ""}
                        onChange={(val) =>
                          handleUpdateChiTiet(
                            idx,
                            "BienTheSanPhamID",
                            String(val),
                          )
                        }
                        isLoading={isLoadingPhuTungs}
                        placeholder="Chọn biến thể linh kiện / phụ tùng..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Tổng chi phí phiếu bảo hành */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/80">
          <div>
            <label className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
              Tổng chi phí Hãng hỗ trợ (đ)
            </label>
            <Input
              type="number"
              min={0}
              step={10000}
              value={formData.ChiPhiHangHoTro ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ChiPhiHangHoTro: parseFloat(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Tổng chi phí Khách chi trả (đ)
            </label>
            <Input
              type="number"
              min={0}
              step={10000}
              value={formData.ChiPhiKhachTra ?? 0}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ChiPhiKhachTra: parseFloat(e.target.value) || 0,
                }))
              }
              className="text-xs font-mono font-bold"
            />
          </div>
        </div>

        {/* 8. Ghi chú phiếu */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Ghi chú phiếu bảo hành
          </label>
          <Input
            placeholder="VD: Pin đủ điều kiện bảo hành đổi mới 1-1 theo chính sách hãng..."
            value={formData.GhiChu || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
            }
            className="text-xs"
          />
        </div>

        {/* Actions */}
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
            disabled={createMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
          >
            {createMutation.isPending ? "Đang lưu..." : "Lập phiếu"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
}
