"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Users,
  User,
  Building2,
  RefreshCw,
  Upload,
  AlertCircle,
  CreditCard,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { CreateKhachHangPayload } from "@/types/khachHang";
import { DM_DiaPhuongCapXa } from "@/types/diaPhuongCapXa";
import {
  khachHangSchema,
  useCreateKhachHang,
} from "@/hooks/KhachHang/useKhachHang";
import { useGetDiaPhuongCapXa } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXaApi";

export interface CreateCustomerSlideOverProps {
  open: boolean;
  onClose: () => void;
  provinceOptions: SelectOption[];
  isLoadingTinh: boolean;
  onSuccess?: () => void;
}

const INITIAL_FORM_DATA: CreateKhachHangPayload = {
  LoaiKhachHang: 1, // 1: Cá nhân, 2: Doanh nghiệp
  TenKhachHang: "",
  DienThoai: "",
  HopThu: "",
  DiaChi: "",
  TinhID: 20,
  XaID: 1819,
  GhiChu: "",
  TrangThai: true,

  // Cá nhân
  MaDinhDanh: "",
  NgayCapMaDinhDanh: "",
  NoiCapMaDinhDanh: "",
  NgaySinh: "",
  GioiTinhID: null,
  QuocTichID: 10,
  DanTocID: 8,
  anhChanDung: null,
  fileAnhChanDung: null,

  // Doanh nghiệp
  MaSoThue: "",
  NguoiDaiDien: "",
  DienThoaiNguoiDaiDien: "",
  ToChucCapChaID: null,
  LoaiToChucID: null,
  TrangChu: "",
  anhBieuTrung: null,
  fileAnhBieuTrung: null,
};

export function CreateCustomerSlideOver({
  open,
  onClose,
  provinceOptions,
  isLoadingTinh,
  onSuccess,
}: CreateCustomerSlideOverProps) {
  const createMutation = useCreateKhachHang();

  const [formData, setFormData] =
    useState<CreateKhachHangPayload>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Chỉ gọi API xã/phường khi SlideOver đang mở và đã chọn Tỉnh/Thành
  const { data: dataXa, isLoading: isLoadingXa } = useGetDiaPhuongCapXa(
    {
      TinhID: formData.TinhID ? Number(formData.TinhID) : undefined,
      PageIndex: 1,
      PageSize: 200,
    },
    Boolean(open && formData.TinhID),
  );

  const communeOptions = useMemo(() => {
    const communes: DM_DiaPhuongCapXa[] = dataXa?.data ?? [];
    return communes.map((x) => ({
      value: x.xaID,
      label: x.ten,
    }));
  }, [dataXa]);

  // Reset form khi mở modal và dọn dẹp Object URL chống rò rỉ bộ nhớ
  useEffect(() => {
    if (open) {
      setFormData(INITIAL_FORM_DATA);
      setErrors({});
      setAvatarPreview(null);
      setLogoPreview(null);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fileAnhChanDung: file,
      }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        fileAnhBieuTrung: file,
      }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const result = khachHangSchema.safeParse({
      tenKhachHang: formData.TenKhachHang,
      dienThoai: formData.DienThoai,
      loaiKhachHang: formData.LoaiKhachHang,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[String(issue.path[0])] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Vui lòng kiểm tra lại các trường bắt buộc!");
      return;
    }

    setErrors({});
    try {
      await createMutation.mutateAsync(formData);
      onSuccess?.();
      onClose();
    } catch {
      // Toast lỗi đã được xử lý trong useCreateKhachHang
    }
  };

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Thêm mới Khách hàng"
      description="Đăng ký hồ sơ khách hàng cá nhân hoặc tổ chức doanh nghiệp"
      icon={Users}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={createMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
            onClick={handleSubmit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu hồ sơ
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Chọn Loại Khách Hàng */}
        <div className="p-1 rounded-xl bg-muted/60 border border-border/60 flex gap-1">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, LoaiKhachHang: 1 }))
            }
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              formData.LoaiKhachHang === 1
                ? "bg-background text-blue-600 dark:text-blue-400 shadow-xs border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User className="w-4 h-4" />
            Khách hàng Cá nhân
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, LoaiKhachHang: 2 }))
            }
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              formData.LoaiKhachHang === 2
                ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-xs border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Doanh nghiệp / Tổ chức
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              {formData.LoaiKhachHang === 1
                ? "Họ và tên khách hàng"
                : "Tên doanh nghiệp / Công ty"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.TenKhachHang}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  TenKhachHang: e.target.value,
                }))
              }
              placeholder={
                formData.LoaiKhachHang === 1
                  ? "Ví dụ: Nguyễn Văn A"
                  : "Ví dụ: Công ty TNHH Vận Tải Xanh"
              }
              className={`rounded-lg ${errors.tenKhachHang ? "border-red-500" : ""}`}
            />
            {errors.tenKhachHang && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.tenKhachHang}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Số điện thoại (dùng Zalo) <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.DienThoai}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, DienThoai: e.target.value }))
              }
              placeholder="0901234567"
              className={`rounded-lg font-mono ${errors.dienThoai ? "border-red-500" : ""}`}
            />
            {errors.dienThoai && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.dienThoai}
              </p>
            )}
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Hộp thư Email
            </label>
            <Input
              type="email"
              value={formData.HopThu || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, HopThu: e.target.value }))
              }
              placeholder="customer@email.com"
              className="rounded-lg"
            />
          </div>

          {/* DÀNH CHO CÁ NHÂN */}
          {formData.LoaiKhachHang === 1 ? (
            <>
              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  Số CCCD / CMND
                </label>
                <Input
                  value={formData.MaDinhDanh || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      MaDinhDanh: e.target.value,
                    }))
                  }
                  placeholder="001200001234"
                  className="font-mono rounded-lg"
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Ngày sinh
                </label>
                <DatePickerInput
                  value={formData.NgaySinh || ""}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      NgaySinh: val,
                    }))
                  }
                  max={new Date()}
                  placeholder="dd/MM/yyyy"
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Ngày cấp CCCD
                </label>
                <DatePickerInput
                  value={formData.NgayCapMaDinhDanh || ""}
                  onChange={(val) =>
                    setFormData((prev) => ({
                      ...prev,
                      NgayCapMaDinhDanh: val,
                    }))
                  }
                  max={new Date()}
                  placeholder="dd/MM/yyyy"
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Nơi cấp CCCD
                </label>
                <Input
                  value={formData.NoiCapMaDinhDanh || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      NoiCapMaDinhDanh: e.target.value,
                    }))
                  }
                  placeholder="Cục CS QLHC về TTXH"
                  className="rounded-lg"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Ảnh chân dung
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar preview"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    Tải ảnh lên
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* DÀNH CHO DOANH NGHIỆP */
            <>
              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  Mã số thuế (MST)
                </label>
                <Input
                  value={formData.MaSoThue || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      MaSoThue: e.target.value,
                    }))
                  }
                  placeholder="0101234567"
                  className="font-mono rounded-lg"
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Người đại diện
                </label>
                <Input
                  value={formData.NguoiDaiDien || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      NguoiDaiDien: e.target.value,
                    }))
                  }
                  placeholder="Nguyễn Văn Đại Diện"
                  className="rounded-lg"
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  SĐT người đại diện
                </label>
                <Input
                  value={formData.DienThoaiNguoiDaiDien || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      DienThoaiNguoiDaiDien: e.target.value,
                    }))
                  }
                  placeholder="0987654321"
                  className="font-mono rounded-lg"
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Website chủ
                </label>
                <Input
                  value={formData.TrangChu || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      TrangChu: e.target.value,
                    }))
                  }
                  placeholder="https://company.vn"
                  className="rounded-lg"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Logo / Ảnh biểu trưng
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    Tải logo lên
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Địa chỉ & Địa bàn */}
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tỉnh / Thành phố
            </label>
            <SearchSelect
              options={provinceOptions}
              value={formData.TinhID || ""}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  TinhID: val ? Number(val) : null,
                  XaID: null,
                }))
              }
              placeholder="Chọn Tỉnh / TP"
              isLoading={isLoadingTinh}
              height={10}
            />
          </div>

          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Xã / Phường
            </label>
            <SearchSelect
              options={communeOptions}
              value={formData.XaID || ""}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  XaID: val ? Number(val) : null,
                }))
              }
              placeholder={
                formData.TinhID ? "Chọn Xã / Phường" : "Chọn Tỉnh trước"
              }
              disabled={!formData.TinhID}
              isLoading={isLoadingXa}
              height={10}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Địa chỉ chi tiết
            </label>
            <Input
              value={formData.DiaChi || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, DiaChi: e.target.value }))
              }
              placeholder="Số nhà, tên đường, khu dân cư..."
              className="rounded-lg"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Ghi chú
            </label>
            <Input
              value={formData.GhiChu || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, GhiChu: e.target.value }))
              }
              placeholder="Ghi chú thêm về sở thích, nguồn khách..."
              className="rounded-lg"
            />
          </div>

          {/* Trạng thái */}
          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">
                Trạng thái hoạt động
              </p>
              <p className="text-xs text-muted-foreground">
                Cho phép tạo đơn hàng, mua trả góp và sử dụng dịch vụ
              </p>
            </div>
            <Switch
              id="isActiveKhachHangAdd"
              checked={formData.TrangThai}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
