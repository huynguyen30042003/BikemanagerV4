"use client";

import React, { memo } from "react";
import Link from "next/link";
import {
  Bike,
  BatteryCharging,
  Gauge,
  History,
  SquarePen,
  Trash2,
  User,
  Phone,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KH_PhuongTienKhachHang } from "@/types/phuongTienKhachHang";

export interface CustomerVehicleCardProps {
  item: KH_PhuongTienKhachHang;
  index: number;
  onEdit: (item: KH_PhuongTienKhachHang) => void;
  onDelete: (item: KH_PhuongTienKhachHang) => void;
}

export const CustomerVehicleCard = memo(function CustomerVehicleCard({
  item,
  index,
  onEdit,
  onDelete,
}: CustomerVehicleCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
      }}
    >
      <Card className="rounded-xl p-4 border border-border/80 bg-card hover:border-blue-500/40 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col justify-between h-full gap-3">
        {/* Top: Model xe, Biển số & Trạng thái */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Bike className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-foreground truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.tenModel}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 tracking-wider">
                  {item.bienSo ? item.bienSo.toUpperCase() : "CHƯA ĐĂNG KÝ"}
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {item.trangThai ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sử dụng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Ngừng HĐ
              </span>
            )}
          </div>
        </div>

        {/* Middle: Thông tin chủ sở hữu & Thông số kỹ thuật */}
        <div className="space-y-2 py-2 px-3 rounded-lg bg-muted/40 border border-border/50 text-xs">
          {/* Chủ sở hữu */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-muted-foreground/70" />
              Chủ xe:
            </span>
            <span className="font-semibold text-foreground truncate max-w-[170px] hover:text-blue-600">
              {item.tenKhachHang || "Khách #" + item.khachHangID.substring(0, 8)}
            </span>
          </div>

          {/* Điện thoại chủ xe */}
          {item.dienThoaiKhachHang && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-muted-foreground/70" />
                Liên hệ:
              </span>
              <span className="font-mono text-foreground font-medium">
                {item.dienThoaiKhachHang}
              </span>
            </div>
          )}

          {/* Số Km ODO */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
            <span className="text-muted-foreground flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-indigo-500" />
              Đồng hồ ODO:
            </span>
            <span className="font-mono text-foreground font-bold">
              {item.soKmHienTai != null ? Number(item.soKmHienTai).toLocaleString("vi-VN") : 0} km
            </span>
          </div>

          {/* Màu sắc & Pin */}
          {(item.mauSac || item.soPin) && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Màu / Pin:</span>
              <div className="flex items-center gap-2">
                {item.mauSac && <span>{item.mauSac}</span>}
                {item.soPin && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                    <BatteryCharging className="w-3 h-3" />
                    {item.soPin}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Số khung / Số máy */}
          {(item.soKhung || item.soMay) && (
            <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground font-mono pt-0.5">
              <span>{item.soKhung ? `K: ${item.soKhung}` : ""}</span>
              <span>{item.soMay ? `M: ${item.soMay}` : ""}</span>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
          <Link
            href={`/admin/customer/ownerships?vehicleId=${item.id}`}
            title="Xem lịch sử sở hữu & sang tên"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>Lịch sử sở hữu</span>
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(item)}
              title="Chỉnh sửa xe"
              className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <SquarePen className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(item)}
              title="Xóa phương tiện"
              className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
