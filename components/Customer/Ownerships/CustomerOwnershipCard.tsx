"use client";

import React, { memo } from "react";
import {
  Bike,
  User,
  Clock,
  ArrowRightLeft,
  Calendar,
  Phone,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KH_LichSuSoHuuPhuongTien } from "@/types/lichSuSoHuuPhuongTien";

export interface CustomerOwnershipCardProps {
  item: KH_LichSuSoHuuPhuongTien;
  index: number;
  onTransfer: (vehicleId: string) => void;
}

function formatDate(val?: string | null): string {
  if (!val) return "Hiện tại";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("vi-VN");
  } catch {
    return val;
  }
}

export const CustomerOwnershipCard = memo(function CustomerOwnershipCard({
  item,
  index,
  onTransfer,
}: CustomerOwnershipCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const renderLyDoBadge = (lyDo?: string | null) => {
    switch (lyDo) {
      case "MuaMoi":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            Mua mới
          </span>
        );
      case "SangTen":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            Sang tên đổi chủ
          </span>
        );
      case "ThuCuDoiMoi":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            Thu cũ đổi mới
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border/60">
            {lyDo || "Khác"}
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
      }}
    >
      <Card className="rounded-xl p-4 border border-border/80 bg-card hover:border-indigo-500/40 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col justify-between h-full gap-3">
        {/* Top: Phương tiện & Trạng thái chủ sở hữu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Bike className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-foreground truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {item.tenModel || "Phương tiện #" + item.phuongTienKhachHangID.substring(0, 8)}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  {item.bienSo || "Chưa có biển"}
                </span>
                {renderLyDoBadge(item.lyDo)}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {item.laChuSoHuuHienTai ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Chủ hiện tại
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                <Clock className="w-3 h-3 text-slate-400" />
                Đã chuyển
              </span>
            )}
          </div>
        </div>

        {/* Middle: Thông tin chủ xe & Thời gian sở hữu */}
        <div className="space-y-2 py-2 px-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-muted-foreground/70" />
              Chủ sở hữu:
            </span>
            <span className="font-semibold text-foreground truncate max-w-[160px]">
              {item.tenKhachHang || "Khách #" + item.khachHangID.substring(0, 8)}
            </span>
          </div>

          {item.dienThoaiKhachHang && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-muted-foreground/70" />
                Số điện thoại:
              </span>
              <span className="font-mono text-foreground font-medium">
                {item.dienThoaiKhachHang}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
              Thời gian:
            </span>
            <span className="font-mono text-[11px] text-foreground">
              {formatDate(item.ngayBatDauSoHuu)} → {formatDate(item.ngayKetThucSoHuu)}
            </span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
          <span className="text-[11px] text-muted-foreground">
            {item.laChuSoHuuHienTai
              ? "Đang lưu thông hợp pháp"
              : "Đã hoàn tất thủ tục chuyển nhượng"}
          </span>

          {item.laChuSoHuuHienTai ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTransfer(item.phuongTienKhachHangID)}
              className="h-8 px-3 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border-indigo-500/30 font-medium rounded-lg cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Sang tên</span>
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground/50 font-mono">—</span>
          )}
        </div>
      </Card>
    </motion.div>
  );
});
