"use client";

import React from "react";
import Image from "next/image";
import { Users, User, Building2, RefreshCw, Upload, AlertCircle, CreditCard, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect } from "@/components/ui/selectSearch";
import { CreateKhachHangPayload } from "@/types/khachHang";

interface CreateCustomerSlideOverProps {
  open: boolean;
  onClose: () => void;
  dataAdd: CreateKhachHangPayload;
  setDataAdd: React.Dispatch<React.SetStateAction<CreateKhachHangPayload>>;
  handleSubmit: () => void;
  isCreating: boolean;
  errors: Record<string, string>;
  provinceOptions: Array<{ value: number | string; label: string }>;
  isLoadingTinh: boolean;
  communeOptionsAdd: Array<{ value: number | string; label: string }>;
  isLoadingXaAdd: boolean;
  avatarPreviewAdd: string | null;
  logoPreviewAdd: string | null;
  handleAvatarChangeAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoChangeAdd: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CreateCustomerSlideOver({
  open,
  onClose,
  dataAdd,
  setDataAdd,
  handleSubmit,
  isCreating,
  errors,
  provinceOptions,
  isLoadingTinh,
  communeOptionsAdd,
  isLoadingXaAdd,
  avatarPreviewAdd,
  logoPreviewAdd,
  handleAvatarChangeAdd,
  handleLogoChangeAdd,
}: CreateCustomerSlideOverProps) {
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
            disabled={isCreating}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
            onClick={handleSubmit}
            disabled={isCreating}
          >
            {isCreating ? (
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
              setDataAdd((prev) => ({ ...prev, LoaiKhachHang: 1 }))
            }
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              dataAdd.LoaiKhachHang === 1
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
              setDataAdd((prev) => ({ ...prev, LoaiKhachHang: 2 }))
            }
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              dataAdd.LoaiKhachHang === 2
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
              {dataAdd.LoaiKhachHang === 1
                ? "Họ và tên khách hàng"
                : "Tên doanh nghiệp / Công ty"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.TenKhachHang}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  TenKhachHang: e.target.value,
                }))
              }
              placeholder={
                dataAdd.LoaiKhachHang === 1
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
              Số điện thoại (dùng Zalo){" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              value={dataAdd.DienThoai}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, DienThoai: e.target.value }))
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
              value={dataAdd.HopThu || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, HopThu: e.target.value }))
              }
              placeholder="customer@email.com"
              className="rounded-lg"
            />
          </div>

          {/* DÀNH CHO CÁ NHÂN */}
          {dataAdd.LoaiKhachHang === 1 ? (
            <>
              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                  Số CCCD / CMND
                </label>
                <Input
                  value={dataAdd.MaDinhDanh || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({
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
                <Input
                  type="date"
                  value={dataAdd.NgaySinh || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({
                      ...prev,
                      NgaySinh: e.target.value,
                    }))
                  }
                  className="rounded-lg"
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Ngày cấp CCCD
                </label>
                <Input
                  type="date"
                  value={dataAdd.NgayCapMaDinhDanh || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({
                      ...prev,
                      NgayCapMaDinhDanh: e.target.value,
                    }))
                  }
                  className="rounded-lg"
                />
              </div>

              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Nơi cấp CCCD
                </label>
                <Input
                  value={dataAdd.NoiCapMaDinhDanh || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({
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
                    {avatarPreviewAdd ? (
                      <Image
                        src={avatarPreviewAdd}
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
                      onChange={handleAvatarChangeAdd}
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
                  value={dataAdd.MaSoThue || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({
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
                  value={dataAdd.NguoiDaiDien || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({
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
                  value={dataAdd.DienThoaiNguoiDaiDien || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({
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
                  value={dataAdd.TrangChu || ""}
                  onChange={(e) =>
                    setDataAdd((prev) => ({
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
                    {logoPreviewAdd ? (
                      <Image
                        src={logoPreviewAdd}
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
                      onChange={handleLogoChangeAdd}
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
              value={dataAdd.TinhID || ""}
              onChange={(val) =>
                setDataAdd((prev) => ({
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
              options={communeOptionsAdd}
              value={dataAdd.XaID || ""}
              onChange={(val) =>
                setDataAdd((prev) => ({
                  ...prev,
                  XaID: val ? Number(val) : null,
                }))
              }
              placeholder={
                dataAdd.TinhID ? "Chọn Xã / Phường" : "Chọn Tỉnh trước"
              }
              disabled={!dataAdd.TinhID}
              isLoading={isLoadingXaAdd}
              height={10}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Địa chỉ chi tiết
            </label>
            <Input
              value={dataAdd.DiaChi || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, DiaChi: e.target.value }))
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
              value={dataAdd.GhiChu || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({ ...prev, GhiChu: e.target.value }))
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
              checked={dataAdd.TrangThai}
              onCheckedChange={(checked) =>
                setDataAdd((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
