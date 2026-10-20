"use client";

import React, { memo } from "react";
import {
  Award,
  Crown,
  Sparkles,
  ShoppingBag,
  Wrench,
  SquarePen,
  Phone,
  Calendar,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KH_ThongKeKhachHang } from "@/types/thongKeKhachHang";

export interface CustomerStatisticCardProps {
  item: KH_ThongKeKhachHang;
  index: number;
  onEdit: (item: KH_ThongKeKhachHang) => void;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(val?: string | null): string {
  if (!val) return "Chưa có";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("vi-VN");
  } catch {
    return val;
  }
}

export const CustomerStatisticCard = memo(function CustomerStatisticCard({
  item,
  index,
  onEdit,
}: CustomerStatisticCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const renderTierBadge = (tier: string) => {
    switch (tier) {
      case "KimCuong":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 shadow-2xs">
            <Crown className="w-3 h-3 text-violet-600 dark:text-violet-400" />
            Kim Cương
          </span>
        );
      case "Vang":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shadow-2xs">
            <Award className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Hạng Vàng
          </span>
        );
      case "Bac":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            <Sparkles className="w-3 h-3 text-slate-500" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border/60">
            Chuẩn
          </span>
        );
    }
  };

  const debt = Number(item.congNoHienTai) || 0;
  const displayName = item.tenKhachHang || "Hồ sơ #" + item.khachHangID.substring(0, 8);
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
      }}
    >
      <Card className="rounded-xl p-4 border border-border/80 bg-card hover:border-amber-500/40 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col justify-between h-full gap-3">
        {/* Header: Avatar, Name, Phone & Tier Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/20 font-bold text-xs">
              {initials || "KH"}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-foreground truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {displayName}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                {item.maKhachHang && (
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-muted border border-border/50">
                    {item.maKhachHang}
                  </span>
                )}
                {item.dienThoai && (
                  <span className="font-mono flex items-center gap-1 text-[11px]">
                    <Phone className="w-3 h-3 text-muted-foreground/70" />
                    {item.dienThoai}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0">{renderTierBadge(String(item.hangKhachHang))}</div>
        </div>

        {/* Metrics Grid */}
        <div className="space-y-2 py-2 px-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
          {/* Điểm tích lũy & Chiết khấu */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Điểm thưởng:
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="font-bold text-foreground">
                {item.diemTichLuy ?? 0} pts
              </span>
              {item.tyLeGiamGia > 0 && (
                <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  -{item.tyLeGiamGia}%
                </span>
              )}
            </div>
          </div>

          {/* Đơn hàng / Sửa chữa */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
              Đơn / Sửa chữa:
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-foreground font-semibold">
                {item.tongSoDonHang ?? 0} đơn
              </span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-muted-foreground flex items-center gap-0.5">
                <Wrench className="w-3 h-3 text-amber-500" />
                {item.tongSoLanSuaChua ?? 0} lượt
              </span>
            </div>
          </div>

          {/* Tổng tiền chi tiêu */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Tổng chi tiêu:
            </span>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(item.tongTienDaChi)}
            </span>
          </div>

          {/* Công nợ hiện tại */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-violet-500" />
              Công nợ:
            </span>
            {debt > 0 ? (
              <span className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/20">
                {formatCurrency(debt)}
              </span>
            ) : (
              <span className="font-mono text-[11px] text-muted-foreground">0 đ</span>
            )}
          </div>
        </div>

        {/* Footer: Lần giao dịch cuối & Nút Điều chỉnh */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
          <div className="flex flex-col text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5 text-muted-foreground/70" />
              Mua: {formatDate(item.lanMuaHangGanNhat)}
            </span>
            {item.lanSuaChuaGanNhat && (
              <span className="text-[9px] text-muted-foreground/80 pl-3.5">
                Sửa: {formatDate(item.lanSuaChuaGanNhat)}
              </span>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="h-7 px-2.5 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 border-amber-500/30 font-medium rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Điều chỉnh hạng thẻ & công nợ"
          >
            <SquarePen className="w-3.5 h-3.5" />
            <span>Sửa</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});
