"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  ArrowLeft,
  Share2,
  Printer,
  Check,
  Eye,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KH_KhachHang } from "@/types/khachHang";
import { KH_ThongKeKhachHang } from "@/types/thongKeKhachHang";
import { DH_DonHang } from "@/types/donHang";
import { takeImage } from "@/utils";
import {
  formatCurrency,
  getTierConfig,
} from "@/components/Customer/Detail/CustomerDetailUtils";

export interface CustomerDetailHeaderProps {
  customer: KH_KhachHang;
  stats: KH_ThongKeKhachHang | null;
  orders: DH_DonHang[];
  isAdminMode: boolean;
  previewPublic: boolean;
  setPreviewPublic: React.Dispatch<React.SetStateAction<boolean>>;
  copiedLink: boolean;
  onCopyPublicLink: () => void;
}

export const CustomerDetailHeader: React.FC<CustomerDetailHeaderProps> =
  React.memo(
    ({
      customer,
      stats,
      orders,
      isAdminMode,
      previewPublic,
      setPreviewPublic,
      copiedLink,
      onCopyPublicLink,
    }) => {
      const isBusiness = customer.loaiKhachHang === 2;
      const avatarPath = isBusiness
        ? customer.anhBieuTuong
        : customer.anhChanDung;
      const avatarMaxSize = isBusiness
        ? customer.maxSizeBieuTuong
        : customer.maxSizeChanDung;
      const avatarUrl = avatarPath
        ? takeImage(avatarPath, 480, avatarMaxSize)
        : null;
      const tierInfo = getTierConfig(stats?.hangKhachHang);

      const totalSpent =
        stats?.tongTienDaChi ??
        orders.reduce((sum, o) => sum + (o.tongTien ?? 0), 0);

      return (
        <div className="space-y-4">
          {/* Top Action Bar (Ẩn khi in) */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 print:hidden">
            <div className="flex items-center gap-2">
              {isAdminMode ? (
                <Link href="/admin/customer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Danh sách khách hàng</span>
                  </Button>
                </Link>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cổng Tra Cứu Hồ Sơ & Sổ Bảo Hành Điện Tử</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {isAdminMode && (
                <Button
                  variant={previewPublic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewPublic((p) => !p)}
                  className="h-8 text-xs gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>
                    {previewPublic
                      ? "Đang xem chế độ Khách hàng"
                      : "Xem như Khách hàng"}
                  </span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={onCopyPublicLink}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                {copiedLink ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>Chia sẻ Link Public</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="h-8 text-xs gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In Sổ Bảo Hành</span>
              </Button>
            </div>
          </div>

          {/* HERO CARD: HỒ SƠ ĐỊNH DANH KHÁCH HÀNG (DIGITAL PASSPORT) */}
          <Card className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-blue-600/5 via-card to-indigo-600/5 p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
              {/* Avatar + Primary Identity */}
              <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border-2 border-blue-500/25 overflow-hidden shadow-sm">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={customer.tenKhachHang}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  ) : isBusiness ? (
                    <Building2 className="w-8 h-8 text-indigo-600" />
                  ) : (
                    <User className="w-8 h-8 text-blue-600" />
                  )}
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${tierInfo.badgeClass}`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {tierInfo.label}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60 font-semibold">
                      Mã KH: {customer.maKhachHang || "KH-"}
                    </span>
                  </div>

                  <h1 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight break-words">
                    {customer.tenKhachHang}
                  </h1>

                  <div className="flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground flex-wrap">
                    <span className="inline-flex items-center gap-1.5 font-mono text-foreground font-medium">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {customer.dienThoai}
                    </span>
                    {customer.hopThu && (
                      <span className="inline-flex items-center gap-1.5 break-all">
                        <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        {customer.hopThu}
                      </span>
                    )}
                    {isBusiness && customer.maSoThue && (
                      <span className="inline-flex items-center gap-1.5 font-mono">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        MST: {customer.maSoThue}
                      </span>
                    )}
                    {!isBusiness && customer.maDinhDanh && (
                      <span className="inline-flex items-center gap-1.5 font-mono">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        CCCD: {customer.maDinhDanh}
                      </span>
                    )}
                  </div>

                  {customer.diaChi && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                      <span className="break-words">{customer.diaChi}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Member Points & Loyalty Box */}
              <div className="w-full md:w-auto grid grid-cols-2 sm:inline-flex items-center gap-3 sm:gap-4 px-4 py-3 rounded-xl bg-card/90 border border-border/80 shadow-2xs shrink-0">
                <div>
                  <div className="text-[11px] text-muted-foreground">
                    Điểm tích lũy
                  </div>
                  <div className="text-sm sm:text-lg font-bold text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1">
                    <Award className="w-4 h-4 shrink-0" />
                    <span>
                      {(stats?.diemTichLuy ?? 0).toLocaleString("vi-VN")} điểm
                    </span>
                  </div>
                  {stats?.tyLeGiamGia ? (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Ưu đãi chiết khấu: {stats.tyLeGiamGia}%
                    </div>
                  ) : null}
                </div>

                <div className="hidden sm:block h-9 w-px bg-border/70" />

                <div className="border-l sm:border-l-0 border-border/70 pl-3 sm:pl-0">
                  <div className="text-[11px] text-muted-foreground">
                    Tổng chi tiêu
                  </div>
                  <div className="text-sm sm:text-base font-bold text-foreground font-mono">
                    {formatCurrency(totalSpent)}
                  </div>
                  {!previewPublic && (stats?.congNoHienTai ?? 0) > 0 && (
                    <div className="text-[11px] text-rose-600 font-medium">
                      Công nợ: {formatCurrency(stats?.congNoHienTai)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    },
  );

CustomerDetailHeader.displayName = "CustomerDetailHeader";

