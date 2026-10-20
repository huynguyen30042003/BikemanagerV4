"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Bike,
  Award,
  SquarePen,
  Trash2,
  Copy,
  Check,
  Briefcase,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KH_KhachHang } from "@/types/khachHang";
import { getImageUrl } from "@/shared/constants/apiConstants";
import { toast } from "sonner";

export interface CustomerCardProps {
  customer: KH_KhachHang;
  index: number;
  onEdit: (customer: KH_KhachHang) => void;
  onDelete: (customer: KH_KhachHang) => void;
}

export const CustomerCard = memo(function CustomerCard({
  customer,
  index,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success(`Đã sao chép mã khách hàng: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isBusiness = customer.loaiKhachHang === 2;
  const avatarUrl = customer.anhChanDung || customer.anhBieuTrung;
  const fullAvatarUrl = avatarUrl ? getImageUrl(avatarUrl) : null;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
      }}
    >
      <Card className="group rounded-xl border border-border/80 bg-card p-4 pb-2 shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between gap-3 relative h-full">
        <div className="space-y-3">
          {/* Top Bar: Avatar/Logo + Customer Type + Status Badge */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20 font-bold overflow-hidden shadow-2xs">
                {fullAvatarUrl ? (
                  <Image
                    src={fullAvatarUrl}
                    alt={customer.tenKhachHang}
                    width={44}
                    height={44}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : isBusiness ? (
                  <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <span
                  className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-semibold border truncate ${
                    isBusiness
                      ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25"
                      : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25"
                  }`}
                >
                  {isBusiness ? "Doanh nghiệp" : "Cá nhân"}
                </span>
              </div>
            </div>

            {customer.trangThai ? (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Hoạt động
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Khóa
              </span>
            )}
          </div>

          {/* Customer Name & Code */}
          <div>
            <h3
              onClick={() => onEdit(customer)}
              className="text-sm sm:text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
              title={customer.tenKhachHang}
            >
              {customer.tenKhachHang}
            </h3>

            {/* Mã KH click-to-copy */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
              <button
                type="button"
                onClick={(e) => handleCopyCode(customer.maKhachHang || "", e)}
                title="Sao chép mã khách hàng"
                className="group/code inline-flex items-center gap-1 font-mono text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md bg-muted/70 hover:bg-muted text-foreground border border-border/60 transition-colors cursor-pointer shadow-2xs"
              >
                <span className="text-muted-foreground text-[10px]">Mã:</span>
                <span className="font-semibold">
                  {customer.maKhachHang || "KH—"}
                </span>
                {copiedId === customer.maKhachHang ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3 opacity-40 group-hover/code:opacity-100 transition-opacity" />
                )}
              </button>

              {/* CCCD or MST Chip */}
              {(customer.maDinhDanh || customer.maSoThue) && (
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[10.5px] sm:text-[11px] font-mono bg-muted/40 text-muted-foreground border border-border/40 truncate max-w-[150px] sm:max-w-none">
                  {isBusiness ? (
                    <>
                      <Briefcase className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{customer.maSoThue}</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-3 h-3 text-blue-500 shrink-0" />
                      <span className="truncate">{customer.maDinhDanh}</span>
                    </>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-1 pt-1 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <a
                href={`tel:${customer.dienThoai}`}
                className="font-mono text-foreground hover:text-blue-600 transition-colors truncate"
              >
                {customer.dienThoai}
              </a>
            </div>
            {customer.hopThu && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <a
                  href={`mailto:${customer.hopThu}`}
                  className="hover:text-blue-600 transition-colors truncate"
                >
                  {customer.hopThu}
                </a>
              </div>
            )}
            {customer.diaChi && (
              <div className="flex items-start gap-2 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{customer.diaChi}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions: Quick Links & Edit/Delete */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1">
            <Link
              href={`/admin/customer/vehicles?khachHangId=${customer.khachHangID}`}
              title="Xem danh sách xe của khách hàng"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-blue-500/20 transition-colors"
            >
              <Bike className="w-3 h-3" />
              <span>Xe</span>
              <ArrowRight className="w-2.5 h-2.5 opacity-60" />
            </Link>

            <Link
              href="/admin/customer/statistics"
              title="Xem xếp hạng & công nợ"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-amber-500/20 transition-colors"
            >
              <Award className="w-3 h-3" />
              <span>Hạng</span>
            </Link>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(customer)}
              title="Chỉnh sửa hồ sơ"
              className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <SquarePen className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(customer)}
              title="Xóa khách hàng"
              className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
