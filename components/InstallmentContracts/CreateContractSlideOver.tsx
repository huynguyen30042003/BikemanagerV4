"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  DollarSign,
  FileText,
  User,
  ShoppingBag,
  Calendar,
  ShieldCheck,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { CreateHopDongTraGopPayload } from "@/types/traGop";
import {
  TRANG_THAI_HOP_DONG,
  TRANG_THAI_GIAI_NGAN,
} from "@/hooks/TraGop/useTraGop";
import { useGetKhachHang } from "@/hooks/KhachHang/useKhachHangApi";
import { useGetDonHang } from "@/hooks/DonHang/useDonHangApi";
import { DH_DonHang } from "@/types/donHang";
import { toast } from "sonner";
import DatePickerInput from "../ui/DatePickerInput";

export interface CreateContractSlideOverProps {
  open: boolean;
  onClose: () => void;
  providerOptions: SelectOption[];
  onSubmit: (data: CreateHopDongTraGopPayload) => Promise<void> | void;
  isSubmitting: boolean;
}

const STATUS_OPTIONS: SelectOption[] = [
  { value: "110", label: "Chờ thẩm định (110)" },
  { value: "111", label: "Đã duyệt vay (111)" },
  { value: "112", label: "Từ chối hồ sơ (112)" },
  { value: "113", label: "Đã ký hợp đồng (113)" },
  { value: "114", label: "Đang trả góp (114)" },
  { value: "115", label: "Đã tất toán (115)" },
  { value: "116", label: "Đã hủy (116)" },
];

const DISBURSEMENT_OPTIONS: SelectOption[] = [
  { value: "120", label: "Chưa giải ngân về shop (120)" },
  { value: "121", label: "Đã giải ngân về shop (121)" },
];

const formatCurrentDateTime = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const getInitialFormData = (
  defaultProviderId = "",
): CreateHopDongTraGopPayload => ({
  DonHangID: "00000000-0000-0000-0000-000000000000",
  KhachHangID: "00000000-0000-0000-0000-000000000000",
  DonViTraGopID: defaultProviderId,
  SoHopDong: `HDS-${Date.now().toString().slice(-6)}`,
  MaHoSoOnline: "",
  TongGiaTriDonHang: 0,
  TienTraTruoc: 0,
  SoTienVay: 0,
  PhiBaoHiemKhoanVay: 500000,
  LaiSuat: 0.0,
  SoThangTraGop: 12,
  SoTienTraHangThang: 0,
  NgayTraHangThang: 5,
  TrangThaiHopDongID: TRANG_THAI_HOP_DONG.CHO_DUYET,
  NgayNopHoSo: formatCurrentDateTime(),
  TrangThaiGiaiNganID: TRANG_THAI_GIAI_NGAN.CHUA_GIAI_NGAN,
  DuongDanHopDongPdf: "",
  DanhSachTaiLieuJson: "",
  NhanVienLamHoSoID: 1,
  NguoiThamChieu: "",
  GhiChu: "",
});

export const CreateContractSlideOver: React.FC<
  CreateContractSlideOverProps
> = ({ open, onClose, providerOptions, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<CreateHopDongTraGopPayload>(() =>
    getInitialFormData(
      providerOptions[0]?.value != null ? String(providerOptions[0].value) : "",
    ),
  );

  // Tài liệu chi tiết để nhập tiện lợi
  const [cccdMatTruoc, setCccdMatTruoc] = useState("");
  const [cccdMatSau, setCccdMatSau] = useState("");
  const [taiLieuKhac, setTaiLieuKhac] = useState("");

  // Tải danh sách đơn hàng để chọn liên kết
  const { data: dataOrders, isLoading: isLoadingOrders } = useGetDonHang({
    PageIndex: 1,
    PageSize: 100,
  });

  const orderOptions = useMemo(() => {
    const list = (dataOrders?.data ?? dataOrders?.items ?? []) as DH_DonHang[];
    const opts: SelectOption[] = [
      {
        value: "00000000-0000-0000-0000-000000000000",
        label: "-- Chưa gắn đơn hàng (Nhập thông tin tự do) --",
      },
    ];
    list
      .filter((o) => (o.conNo || 0) > 0)
      .forEach((o) => {
        const formattedTotal = new Intl.NumberFormat("vi-VN").format(
          o.tongTien || 0,
        );
        const formattedDebt = new Intl.NumberFormat("vi-VN").format(
          o.conNo || 0,
        );
        opts.push({
          value: o.donHangID,
          label: `${o.maDonHang} - ${o.tenKhachHang || "Khách"} (Tổng: ${formattedTotal} đ | Còn nợ: ${formattedDebt} đ)`,
        });
      });
    return opts;
  }, [dataOrders]);

  // Tải danh sách khách hàng để chọn
  const { data: dataCustomers, isLoading: isLoadingCustomers } =
    useGetKhachHang({
      PageIndex: 1,
      PageSize: 100,
    });

  const customerOptions = useMemo(() => {
    const list = dataCustomers?.data ?? dataCustomers?.items ?? [];
    const opts: SelectOption[] = [
      {
        value: "00000000-0000-0000-0000-000000000000",
        label: "Khách lẻ / Chưa chọn hồ sơ định danh",
      },
    ];
    list.forEach(
      (c: { khachHangID: string; tenKhachHang: string; dienThoai: string }) => {
        opts.push({
          value: c.khachHangID,
          label: `${c.tenKhachHang} - ${c.dienThoai}`,
        });
      },
    );
    return opts;
  }, [dataCustomers]);

  // Khi modal mở, tự sinh mã hợp đồng và reset form
  useEffect(() => {
    if (open) {
      setFormData(
        getInitialFormData(
          providerOptions[0]?.value != null
            ? String(providerOptions[0].value)
            : "",
        ),
      );
      setCccdMatTruoc("");
      setCccdMatSau("");
      setTaiLieuKhac("");
    }
  }, [open, providerOptions]);

  // Tự động tính toán số tiền trả góp hàng tháng (Gốc + Bảo hiểm + Lãi suất)
  const recalculateMonthlyPayment = (
    loan: number,
    months: number,
    rate: number,
    insurance: number,
  ): number => {
    if (!loan || loan <= 0) return 0;
    const validMonths = Math.max(1, months);
    // Gốc vay + phí bảo hiểm chia đều các tháng + tiền lãi mỗi tháng
    const principalAndInsurance = loan + insurance;
    const interestTotal = principalAndInsurance * (rate / 100) * validMonths;
    return Math.round((principalAndInsurance + interestTotal) / validMonths);
  };

  // Khi chọn Đơn hàng -> Tự động điền Khách hàng, Giá trị đơn hàng, Tiền trả trước và Số tiền vay (= Số tiền còn nợ của đơn hàng)
  const handleOrderChange = (orderId: string) => {
    const list = (dataOrders?.data ?? dataOrders?.items ?? []) as DH_DonHang[];
    const matched = list.find((o) => o.donHangID === orderId);

    if (matched && orderId !== "00000000-0000-0000-0000-000000000000") {
      const total = matched.tongTien || 0;
      // Số tiền vay tín dụng chính là số tiền còn nợ của đơn hàng
      const loan = matched.conNo || 0;
      // Khách trả trước = Số tiền đã thanh toán (hoặc tổng - nợ)
      const prepay =
        matched.daThanhToan !== undefined
          ? matched.daThanhToan
          : Math.max(0, total - loan);
      const months = formData.SoThangTraGop || 12;
      const rate = formData.LaiSuat ?? 0;
      const insurance = formData.PhiBaoHiemKhoanVay ?? 500000;

      const monthlyPayment = recalculateMonthlyPayment(
        loan,
        months,
        rate,
        insurance,
      );

      setFormData((prev) => ({
        ...prev,
        DonHangID: matched.donHangID,
        KhachHangID: matched.khachHangID || prev.KhachHangID,
        TongGiaTriDonHang: total,
        TienTraTruoc: prepay,
        SoTienVay: loan,
        SoTienTraHangThang: monthlyPayment,
      }));
    } else {
      // Khi chưa chọn đơn hàng -> Để trống các thông tin khoản vay
      setFormData((prev) => ({
        ...prev,
        DonHangID: "00000000-0000-0000-0000-000000000000",
        TongGiaTriDonHang: 0,
        TienTraTruoc: 0,
        SoTienVay: 0,
        SoTienTraHangThang: 0,
      }));
    }
  };

  const handleTongGiaTriChange = (val: number) => {
    const prepay = formData.TienTraTruoc || 0;
    const loan = Math.max(0, val - prepay);
    const monthlyPayment = recalculateMonthlyPayment(
      loan,
      formData.SoThangTraGop || 12,
      formData.LaiSuat ?? 0,
      formData.PhiBaoHiemKhoanVay ?? 0,
    );
    setFormData((prev) => ({
      ...prev,
      TongGiaTriDonHang: val,
      SoTienVay: loan,
      SoTienTraHangThang: monthlyPayment,
    }));
  };

  const handleTienTraTruocChange = (val: number) => {
    const total = formData.TongGiaTriDonHang || 0;
    const loan = Math.max(0, total - val);
    const monthlyPayment = recalculateMonthlyPayment(
      loan,
      formData.SoThangTraGop || 12,
      formData.LaiSuat ?? 0,
      formData.PhiBaoHiemKhoanVay ?? 0,
    );
    setFormData((prev) => ({
      ...prev,
      TienTraTruoc: val,
      SoTienVay: loan,
      SoTienTraHangThang: monthlyPayment,
    }));
  };

  const handleSoTienVayChange = (val: number) => {
    const monthlyPayment = recalculateMonthlyPayment(
      val,
      formData.SoThangTraGop || 12,
      formData.LaiSuat ?? 0,
      formData.PhiBaoHiemKhoanVay ?? 0,
    );
    setFormData((prev) => ({
      ...prev,
      SoTienVay: val,
      SoTienTraHangThang: monthlyPayment,
    }));
  };

  const handleSoThangChange = (val: number) => {
    const monthlyPayment = recalculateMonthlyPayment(
      formData.SoTienVay || 0,
      val,
      formData.LaiSuat ?? 0,
      formData.PhiBaoHiemKhoanVay ?? 0,
    );
    setFormData((prev) => ({
      ...prev,
      SoThangTraGop: val,
      SoTienTraHangThang: monthlyPayment,
    }));
  };

  const handleLaiSuatChange = (val: number) => {
    const monthlyPayment = recalculateMonthlyPayment(
      formData.SoTienVay || 0,
      formData.SoThangTraGop || 12,
      val,
      formData.PhiBaoHiemKhoanVay ?? 0,
    );
    setFormData((prev) => ({
      ...prev,
      LaiSuat: val,
      SoTienTraHangThang: monthlyPayment,
    }));
  };

  const handleBaoHiemChange = (val: number) => {
    const monthlyPayment = recalculateMonthlyPayment(
      formData.SoTienVay || 0,
      formData.SoThangTraGop || 12,
      formData.LaiSuat ?? 0,
      val,
    );
    setFormData((prev) => ({
      ...prev,
      PhiBaoHiemKhoanVay: val,
      SoTienTraHangThang: monthlyPayment,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.SoHopDong.trim()) {
      toast.warning("Vui lòng nhập số hợp đồng tín dụng!");
      return;
    }
    if (!formData.DonViTraGopID) {
      toast.warning("Vui lòng chọn đơn vị đối tác tài chính!");
      return;
    }
    if (!formData.SoTienVay || formData.SoTienVay <= 0) {
      toast.warning(
        "Vui lòng chọn đơn hàng còn nợ hoặc nhập số tiền vay lớn hơn 0!",
      );
      return;
    }

    // Đóng gói danh sách tài liệu thành JSON chuỗi chuẩn
    const docList: string[] = [];
    if (cccdMatTruoc.trim()) docList.push(cccdMatTruoc.trim());
    if (cccdMatSau.trim()) docList.push(cccdMatSau.trim());
    if (taiLieuKhac.trim()) docList.push(taiLieuKhac.trim());

    const finalPayload: CreateHopDongTraGopPayload = {
      ...formData,
      DanhSachTaiLieuJson: docList.length > 0 ? JSON.stringify(docList) : "",
      NgayNopHoSo: formData.NgayNopHoSo
        ? new Date(formData.NgayNopHoSo).toISOString()
        : new Date().toISOString(),
    };

    await onSubmit(finalPayload);
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Lập Hồ Sơ Vay Mua Xe Trả Góp"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
        {/* Banner tóm tắt */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300">
          <CreditCard className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
          <span>
            Điền đầy đủ thông tin hồ sơ vay mua xe trả góp theo quy định đối tác
            tài chính (HD Saison, FE Credit, Home Credit...).
          </span>
        </div>

        {/* 1. KHỐI ĐỊNH DANH HỢP ĐỒNG & ĐỐI TÁC */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            1. Thông tin hợp đồng & đối tác tài chính
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Số hợp đồng tín dụng <span className="text-rose-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="VD: HDS-202610-0089"
                value={formData.SoHopDong}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    SoHopDong: e.target.value,
                  }))
                }
                className="text-xs font-mono font-bold h-10"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Mã hồ sơ online (App thẩm định)
              </label>
              <Input
                type="text"
                placeholder="VD: APP-HD-99120"
                value={formData.MaHoSoOnline || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    MaHoSoOnline: e.target.value,
                  }))
                }
                className="text-xs font-mono h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Đơn vị đối tác cho vay <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn đối tác tài chính..."
                options={providerOptions}
                value={formData.DonViTraGopID}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    DonViTraGopID: String(val),
                  }))
                }
                height={10}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Ngày nộp hồ sơ
              </label>
              <DatePickerInput
                value={formData.NgayNopHoSo || ""}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    NgayNopHoSo: val,
                  }))
                }
                max={new Date()}
                placeholder="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>

        {/* 2. KHỐI KHÁCH HÀNG & ĐƠN HÀNG */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            2. Khách hàng vay mua xe & Đơn hàng liên kết
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Khách hàng đứng tên vay
              </label>
              <SearchSelect
                placeholder="Chọn khách hàng vay..."
                options={customerOptions}
                value={formData.KhachHangID || ""}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    KhachHangID: String(val),
                  }))
                }
                isLoading={isLoadingCustomers}
                height={10}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Đơn hàng bán xe liên kết{" "}
                <span className="text-rose-500">*</span>
              </label>
              <SearchSelect
                placeholder="Chọn đơn hàng (tự động điền giá trị)..."
                options={orderOptions}
                value={formData.DonHangID}
                onChange={(val) => handleOrderChange(String(val))}
                isLoading={isLoadingOrders}
                height={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Người tham chiếu bảo lãnh
              </label>
              <Input
                type="text"
                placeholder="VD: Nguyễn Thị Mai (Vợ - 0912999888)"
                value={formData.NguoiThamChieu || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    NguoiThamChieu: e.target.value,
                  }))
                }
                className="text-xs h-10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                ID Nhân viên lập hồ sơ
              </label>
              <Input
                type="number"
                min={1}
                value={formData.NhanVienLamHoSoID ?? 1}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    NhanVienLamHoSoID: parseInt(e.target.value, 10) || 1,
                  }))
                }
                className="text-xs font-mono h-10"
              />
            </div>
          </div>
        </div>

        {/* 3. KHỐI KHOẢN VAY & TÀI CHÍNH CHI TIẾT */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h4 className="font-bold text-foreground flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              3. Thông tin khoản vay & Lịch trả góp (tính toán tự động)
            </h4>
            <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
              Số tiền vay = Tiền còn nợ của đơn hàng
            </span>
          </div>

          {/* Dòng 1: Tổng tiền, trả trước, số tiền vay */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Tổng giá trị xe (VNĐ) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min={0}
                step={10000}
                placeholder="Chờ chọn đơn hàng..."
                value={formData.TongGiaTriDonHang || ""}
                onChange={(e) =>
                  handleTongGiaTriChange(parseInt(e.target.value, 10) || 0)
                }
                className="text-xs font-mono font-semibold h-10"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Khách trả trước (VNĐ)
              </label>
              <Input
                type="number"
                min={0}
                step={10000}
                placeholder="Chờ chọn đơn hàng..."
                value={formData.TienTraTruoc || ""}
                onChange={(e) =>
                  handleTienTraTruocChange(parseInt(e.target.value, 10) || 0)
                }
                className="text-xs font-mono h-10"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Số tiền vay tín dụng (Còn nợ ĐH) (VNĐ){" "}
                <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                min={0}
                step={10000}
                placeholder="Bằng số tiền còn nợ của đơn hàng..."
                value={formData.SoTienVay || ""}
                onChange={(e) =>
                  handleSoTienVayChange(parseInt(e.target.value, 10) || 0)
                }
                className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 h-10"
              />
            </div>
          </div>

          {/* Dòng 2: Phí bảo hiểm, Lãi suất, Kỳ hạn */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Phí bảo hiểm khoản vay (VNĐ)
              </label>
              <Input
                type="number"
                min={0}
                step={10000}
                placeholder="VD: 500000"
                value={
                  formData.PhiBaoHiemKhoanVay !== undefined &&
                  formData.PhiBaoHiemKhoanVay !== null
                    ? formData.PhiBaoHiemKhoanVay
                    : ""
                }
                onChange={(e) =>
                  handleBaoHiemChange(
                    e.target.value === ""
                      ? 0
                      : parseInt(e.target.value, 10) || 0,
                  )
                }
                className="text-xs font-mono h-10"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Lãi suất (%/tháng)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="VD: 0 hoặc 1.89"
                value={
                  formData.LaiSuat !== undefined && formData.LaiSuat !== null
                    ? formData.LaiSuat
                    : ""
                }
                onChange={(e) =>
                  handleLaiSuatChange(
                    e.target.value === "" ? 0 : parseFloat(e.target.value) || 0,
                  )
                }
                className="text-xs font-mono h-10"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Kỳ hạn vay (tháng)
              </label>
              <Input
                type="number"
                min={1}
                max={60}
                placeholder="VD: 12"
                value={formData.SoThangTraGop || ""}
                onChange={(e) =>
                  handleSoThangChange(parseInt(e.target.value, 10) || 12)
                }
                className="text-xs font-mono font-bold h-10"
              />
            </div>
          </div>

          {/* Dòng 3: Góp hàng tháng & Ngày thu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-border/50">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Số tiền trả hàng tháng (VNĐ)
              </label>
              <Input
                type="number"
                min={0}
                step={1000}
                placeholder="Tự động tính theo khoản vay..."
                value={formData.SoTienTraHangThang || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    SoTienTraHangThang: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 h-10"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Ngày đến hạn đóng hàng tháng (Mùng mấy)
              </label>
              <Input
                type="number"
                min={1}
                max={31}
                placeholder="VD: 5 (mùng 5 hàng tháng)"
                value={formData.NgayTraHangThang || 5}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    NgayTraHangThang: parseInt(e.target.value, 10) || 5,
                  }))
                }
                className="text-xs font-mono h-10"
              />
            </div>
          </div>
        </div>

        {/* 4. KHỐI TRẠNG THÁI THẨM ĐỊNH & GIẢI NGÂN */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            4. Trạng thái thẩm định & Giải ngân
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Trạng thái thẩm định ban đầu
              </label>
              <SearchSelect
                options={STATUS_OPTIONS}
                value={Number(formData.TrangThaiHopDongID || 110)}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    TrangThaiHopDongID: Number(val),
                  }))
                }
                height={10}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Trạng thái giải ngân
              </label>
              <SearchSelect
                options={DISBURSEMENT_OPTIONS}
                value={Number(formData.TrangThaiGiaiNganID || 120)}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    TrangThaiGiaiNganID: Number(val),
                  }))
                }
                height={10}
              />
            </div>
          </div>
        </div>

        {/* 5. KHỐI TÀI LIỆU & FILE HỢP ĐỒNG */}
        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-3 shadow-xs">
          <h4 className="font-bold text-foreground flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            5. Hồ sơ tài liệu & Hợp đồng đính kèm
          </h4>

          {/* <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Đường dẫn file hợp đồng PDF
            </label>
            <Input
              type="text"
              placeholder="VD: /uploads/hopdong/HD_202610_0089.pdf"
              value={formData.DuongDanHopDongPdf || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  DuongDanHopDongPdf: e.target.value,
                }))
              }
              className="text-xs font-mono h-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Ảnh CCCD mặt trước
              </label>
              <Input
                type="text"
                placeholder="VD: /uploads/cccd/khach_mat_truoc.jpg"
                value={cccdMatTruoc}
                onChange={(e) => setCccdMatTruoc(e.target.value)}
                className="text-xs font-mono h-9"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-muted-foreground mb-1">
                Ảnh CCCD mặt sau
              </label>
              <Input
                type="text"
                placeholder="VD: /uploads/cccd/khach_mat_sau.jpg"
                value={cccdMatSau}
                onChange={(e) => setCccdMatSau(e.target.value)}
                className="text-xs font-mono h-9"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-muted-foreground mb-1">
              Tài liệu bổ sung / Chứng minh thu nhập (tùy chọn)
            </label>
            <Input
              type="text"
              placeholder="VD: /uploads/saoke/saoke_3thang.pdf"
              value={taiLieuKhac}
              onChange={(e) => setTaiLieuKhac(e.target.value)}
              className="text-xs font-mono h-9"
            />
          </div> */}

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Ghi chú hồ sơ
            </label>
            <Textarea
              rows={2}
              placeholder="VD: Khách chọn gói 0% lãi suất của HD Saison, kỳ hạn 12 tháng..."
              value={formData.GhiChu || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              className="text-xs"
            />
          </div>
        </div>

        {/* Nút thao tác Submit */}
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
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs cursor-pointer font-medium"
          >
            {isSubmitting ? "Đang lưu..." : "Lập hồ sơ vay"}
          </Button>
        </div>
      </form>
    </SlideOver>
  );
};
