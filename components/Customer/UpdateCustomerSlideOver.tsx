"use client";

import React from "react";
import {
  SquarePen,
  RefreshCw,
  Upload,
  AlertCircle,
  User,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SlideOver } from "@/components/ui/SlideOver";
import { SearchSelect } from "@/components/ui/selectSearch";
import { DatePickerInput } from "@/components/ui/DatePickerInput";
import { UpdateKhachHangPayload } from "@/types/khachHang";
import Image from "next/image";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface UpdateCustomerSlideOverProps {
  open: boolean;
  onClose: () => void;
  dataUpdate: UpdateKhachHangPayload;
  setDataUpdate: React.Dispatch<React.SetStateAction<UpdateKhachHangPayload>>;
  handleSubmitUpdate: () => void;
  isUpdating: boolean;
  errors: Record<string, string>;
  provinceOptions: Array<{ value: number | string; label: string }>;
  isLoadingTinh: boolean;
  communeOptionsUpdate: Array<{ value: number | string; label: string }>;
  isLoadingXaUpdate: boolean;
  avatarPreviewUpdate: string | null;
  logoPreviewUpdate: string | null;
  handleAvatarChangeUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoChangeUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearAvatar: () => void;
}

export function UpdateCustomerSlideOver({
  open,
  onClose,
  dataUpdate,
  setDataUpdate,
  handleSubmitUpdate,
  isUpdating,
  errors,
  provinceOptions,
  isLoadingTinh,
  communeOptionsUpdate,
  isLoadingXaUpdate,
  avatarPreviewUpdate,
  logoPreviewUpdate,
  handleAvatarChangeUpdate,
  handleLogoChangeUpdate,
  handleClearAvatar,
}: UpdateCustomerSlideOverProps) {
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
            disabled={isUpdating}
          >
            Hủy
          </Button>
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm active:scale-[0.98] transition-transform"
            onClick={handleSubmitUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? (
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
              value={dataUpdate.TenKhachHang}
              onChange={(e) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.DienThoai}
              onChange={(e) =>
                setDataUpdate((prev) => ({
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
              value={dataUpdate.HopThu || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, HopThu: e.target.value }))
              }
              className="rounded-lg"
            />
          </div>

          {dataUpdate.LoaiKhachHang === 1 ? (
            <>
              <div className="col-span-1 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">
                  Số CCCD
                </label>
                <Input
                  value={dataUpdate.MaDinhDanh || ""}
                  onChange={(e) =>
                    setDataUpdate((prev) => ({
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
                  value={dataUpdate.NgaySinh || ""}
                  onChange={(val) =>
                    setDataUpdate((prev) => ({
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
                    {/* {avatarPreviewUpdate ? (
                      <Image
                        src={avatarPreviewUpdate}
                        alt="Avatar preview"
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground/60" />
                    )} */}
                    {!!avatarPreviewUpdate ? (
                      <Image
                        src={avatarPreviewUpdate}
                        alt="Ảnh mới"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : !dataUpdate.XoaAnhChanDung && dataUpdate.anhChanDung ? (
                      <Image
                        src={getImageUrl(String(dataUpdate.anhChanDung))}
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
                      onChange={handleAvatarChangeUpdate}
                    />
                  </label>
                  {(avatarPreviewUpdate || !dataUpdate?.fileAnhChanDung) && (
                    <Button
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
                  value={dataUpdate.MaSoThue || ""}
                  onChange={(e) =>
                    setDataUpdate((prev) => ({
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
                  value={dataUpdate.NguoiDaiDien || ""}
                  onChange={(e) =>
                    setDataUpdate((prev) => ({
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
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    Chọn logo mới
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChangeUpdate}
                    />
                  </label>
                  {logoPreviewUpdate && (
                    <span className="text-xs text-emerald-600 font-medium">
                      Đã chọn logo mới
                    </span>
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
              value={dataUpdate.TinhID || ""}
              onChange={(val) =>
                setDataUpdate((prev) => ({
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
              options={communeOptionsUpdate}
              value={dataUpdate.XaID || ""}
              onChange={(val) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  XaID: val ? Number(val) : null,
                }))
              }
              placeholder={
                dataUpdate.TinhID ? "Chọn Xã / Phường" : "Chọn Tỉnh trước"
              }
              disabled={!dataUpdate.TinhID}
              isLoading={isLoadingXaUpdate}
              height={10}
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Địa chỉ chi tiết
            </label>
            <Input
              value={dataUpdate.DiaChi || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, DiaChi: e.target.value }))
              }
              className="rounded-lg"
            />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Ghi chú
            </label>
            <Input
              value={dataUpdate.GhiChu || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({ ...prev, GhiChu: e.target.value }))
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
              checked={dataUpdate.TrangThai}
              onCheckedChange={(checked) =>
                setDataUpdate((prev) => ({ ...prev, TrangThai: checked }))
              }
            />
          </div>
        </div>
      </div>
    </SlideOver>
  );
}
