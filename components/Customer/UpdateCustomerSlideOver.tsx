"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  SquarePen,
  RefreshCw,
  Upload,
  AlertCircle,
  User,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { KH_KhachHang, UpdateKhachHangPayload } from "@/types/khachHang";
import { DM_DiaPhuongCapXa } from "@/types/diaPhuongCapXa";
import { getImageUrl } from "@/shared/constants/apiConstants";
import {
  khachHangSchema,
  useUpdateKhachHang,
} from "@/hooks/KhachHang/useKhachHang";
import { useGetDiaPhuongCapXa } from "@/hooks/DiaPhuongCapXa/useDiaPhuongCapXaApi";

export interface UpdateCustomerSlideOverProps {
  open: boolean;
  onClose: () => void;
  customer: KH_KhachHang | null;
  provinceOptions: SelectOption[];
  isLoadingTinh: boolean;
  onSuccess?: () => void;
}

const INITIAL_UPDATE_DATA: UpdateKhachHangPayload = {
  KhachHangID: "",
  LoaiKhachHang: 1,
  TenKhachHang: "",
  DienThoai: "",
  HopThu: "",
  DiaChi: "",
  TinhID: null,
  XaID: null,
  GhiChu: "",
  TrangThai: true,

  XoaAnhChanDung: false,
  XoaAnhBieuTrung: false,

  // Cá nhân
  MaDinhDanh: "",
  NgayCapMaDinhDanh: "",
  NoiCapMaDinhDanh: "",
  NgaySinh: "",
  GioiTinhID: null,
  QuocTichID: null,
  DanTocID: null,
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

export function UpdateCustomerSlideOver({
  open,
  onClose,
  customer,
  provinceOptions,
  isLoadingTinh,
  onSuccess,
}: UpdateCustomerSlideOverProps) {
  const updateMutation = useUpdateKhachHang();

  const [formData, setFormData] =
    useState<UpdateKhachHangPayload>(INITIAL_UPDATE_DATA);
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

  // Đồng bộ dữ liệu khách hàng cần sửa vào state nội bộ khi mở modal
  useEffect(() => {
    if (open && customer) {
      setFormData({
        KhachHangID: customer.khachHangID,
        LoaiKhachHang: customer.loaiKhachHang,
        TenKhachHang: customer.tenKhachHang,
        DienThoai: customer.dienThoai,
        HopThu: customer.hopThu || "",
        DiaChi: customer.diaChi || "",
        TinhID: customer.tinhID || null,
        XaID: customer.xaID || null,
        GhiChu: customer.ghiChu || "",
        TrangThai: customer.trangThai,

        XoaAnhChanDung: false,
        XoaAnhBieuTrung: false,

        MaDinhDanh: customer.maDinhDanh || "",
        NgayCapMaDinhDanh: customer.ngayCapMaDinhDanh
          ? customer.ngayCapMaDinhDanh.substring(0, 10)
          : "",
        NoiCapMaDinhDanh: customer.noiCapMaDinhDanh || "",
        NgaySinh: customer.ngaySinh ? customer.ngaySinh.substring(0, 10) : "",
        GioiTinhID: customer.gioiTinhID || null,
        QuocTichID: customer.quocTichID || null,
        DanTocID: customer.danTocID || null,
        anhChanDung: customer.anhChanDung || null,
        fileAnhChanDung: null,

        MaSoThue: customer.maSoThue || "",
        NguoiDaiDien: customer.nguoiDaiDien || "",
        DienThoaiNguoiDaiDien: customer.dienThoaiNguoiDaiDien || "",
        ToChucCapChaID: customer.toChucCapChaID || null,
        LoaiToChucID: customer.loaiToChucID || null,
        TrangChu: customer.trangChu || "",
        anhBieuTrung: customer.anhBieuTrung || null,
        fileAnhBieuTrung: null,
      });
      setErrors({});
      setAvatarPreview(null);
      setLogoPreview(null);
    }
  }, [open, customer]);

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
        XoaAnhChanDung: true,
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
        XoaAnhBieuTrung: true,
      }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleClearAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      fileAnhChanDung: null,
      XoaAnhChanDung: true,
    }));
    setAvatarPreview(null);
  };

  const handleClearLogo = () => {
    setFormData((prev) => ({
      ...prev,
      fileAnhBieuTrung: null,
      XoaAnhBieuTrung: true,
    }));
    setLogoPreview(null);
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
      toast.error("Vui lòng kiểm tra lại thông tin cập nhật!");
      return;
    }

    setErrors({});
    try {
      await updateMutation.mutateAsync(formData);
      onSuccess?.();
      onClose();
    } catch {
      // Toast lỗi đã được xử lý trong useUpdateKhachHang
    }
  };

  const hasCurrentAvatar = Boolean(
    avatarPreview || (!formData.XoaAnhChanDung && formData.anhChanDung),
  );
  const hasCurrentLogo = Boolean(
    logoPreview || (!formData.XoaAnhBieuTrung && formData.anhBieuTrung),
  );

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Cập nhật Hồ sơ Khách hàng"
      description="Chỉnh sửa thông tin định danh và địa chỉ liên lạc"
      icon={SquarePen}
      footer={
        <>
          <Button
            variant="outline"
            className="flex-1 cursor-pointer"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
            ) : null}
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3.5">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.TenKhachHang}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  TenKhachHang: e.target.value,
                }))
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
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.DienThoai}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  DienThoai: e.target.value,
                }))
              }
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
              className="rounded-lg"
            />
          </div>

          {formData.LoaiKhachHang === 1 ? (
            <>
              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Số CCCD
                </label>
                <Input
                  value={formData.MaDinhDanh || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      MaDinhDanh: e.target.value,
                    }))
                  }
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

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Đổi ảnh chân dung
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Ảnh mới"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : !formData.XoaAnhChanDung && formData.anhChanDung ? (
                      <Image
                        src={getImageUrl(String(formData.anhChanDung))}
                        alt="Ảnh hiện tại"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    Chọn ảnh mới
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  {hasCurrentAvatar && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAvatar}
                      className="h-8 px-2 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Xóa ảnh hiện tại
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Mã số thuế
                </label>
                <Input
                  value={formData.MaSoThue || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      MaSoThue: e.target.value,
                    }))
                  }
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
                  className="rounded-lg"
                />
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Đổi logo doanh nghiệp
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border border-dashed border-border bg-muted/40 flex items-center justify-center overflow-hidden shrink-0">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="Logo mới"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : !formData.XoaAnhBieuTrung && formData.anhBieuTrung ? (
                      <Image
                        src={getImageUrl(String(formData.anhBieuTrung))}
                        alt="Logo hiện tại"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-muted-foreground/60" />
                    )}
                  </div>
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    Chọn logo mới
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </label>
                  {hasCurrentLogo && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearLogo}
                      className="h-8 px-2 text-xs text-rose-600 hover:text-rose-800 hover:bg-rose-500/10 cursor-pointer"
                    >
                      Xóa logo hiện tại
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

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
              className="rounded-lg"
            />
          </div>

          <div className="col-span-2 flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-muted/20">
            <div>
              <p className="text-sm font-medium text-foreground">
                Trạng thái hoạt động
              </p>
              <p className="text-xs text-muted-foreground">
                Kích hoạt tài khoản khách hàng trong toàn hệ thống
              </p>
            </div>
            <Switch
              id="isActiveKhachHangUpdate"
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
