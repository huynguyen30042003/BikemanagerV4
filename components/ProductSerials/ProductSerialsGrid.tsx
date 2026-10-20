"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Plus,
  FolderOpen,
  Check,
  Copy,
  QrCode,
  Zap,
  BatteryCharging,
  Warehouse,
  User,
  Car,
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/Common/Pagination";
import { SP_SoSerial } from "@/types/soSerial";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Chưa cập nhật";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface ProductSerialsGridProps {
  items: SP_SoSerial[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onOpenWarranty: (item: SP_SoSerial) => void;
  onOpenChangeStatus: (item: SP_SoSerial) => void;
  onOpenAdd: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  getSerialStatusBadge: (statusId?: number | null) => {
    bgClass: string;
    textClass: string;
    borderClass: string;
    label: string;
  };
}

export const ProductSerialsGrid: React.FC<ProductSerialsGridProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onOpenWarranty,
  onOpenChangeStatus,
  onOpenAdd,
  onResetFilters,
  hasActiveFilters,
  getSerialStatusBadge,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-8 sm:p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h2 className="font-semibold text-base text-foreground">
          Không tìm thấy số Serial nào
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          {hasActiveFilters
            ? "Không có số serial nào tương ứng với điều kiện tìm kiếm hoặc bộ lọc hiện tại."
            : "Chưa có dữ liệu số serial / số khung nào được đăng ký trong hệ thống."}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer"
            >
              Đặt lại bộ lọc
            </Button>
          )}
          <Button
            size="sm"
            onClick={onOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Đăng ký Serial mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid of Serial Cards */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4"
      >
        {items.map((serial) => {
          const badge = getSerialStatusBadge(serial.trangThaiID);
          const isExpired =
            serial.ngayKetThucBaoHanh &&
            new Date(serial.ngayKetThucBaoHanh).getTime() <
              new Date().getTime();

          return (
            <Card
              key={serial.soSerialID}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between gap-3"
            >
              {/* Top Header */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      {serial.maSerial}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(serial.maSerial, serial.soSerialID)
                      }
                      title="Sao chép mã Serial"
                      className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
                    >
                      {copiedId === serial.soSerialID ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                    {serial.maQR && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                        <QrCode className="w-2.5 h-2.5" /> QR
                      </span>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {badge.label}
                  </span>
                </div>

                <h3
                  className="font-bold text-sm text-foreground line-clamp-1"
                  title={serial.tenBienThe}
                >
                  {serial.tenBienThe || "Biến thể chưa đặt tên"}
                </h3>
                {serial.tenSanPham && (
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                    Dòng xe: {serial.tenSanPham}
                  </p>
                )}
              </div>

              {/* Hardware Specs Grid */}
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-[11px]">
                    Số khung (VIN):
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {serial.soKhung || "Chưa cập nhật"}
                  </span>
                </div>

                {serial.soMay && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" /> Số máy:
                    </span>
                    <span className="font-mono font-medium text-foreground">
                      {serial.soMay}
                    </span>
                  </div>
                )}

                {serial.soPin && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3 text-emerald-500" />{" "}
                      Serial Pin:
                    </span>
                    <span className="font-mono font-medium text-foreground">
                      {serial.soPin}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>SX: {formatDate(serial.ngaySanXuat)}</span>
                  {serial.viTriLuuTru && (
                    <span className="flex items-center gap-1">
                      <Warehouse className="w-3 h-3 text-muted-foreground/70" />
                      {serial.viTriLuuTru}
                    </span>
                  )}
                </div>
              </div>

              {/* Customer & Warranty Info */}
              <div className="text-xs space-y-1 pt-1">
                {serial.khachHangID || serial.tenKhachHang ? (
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 font-medium text-foreground truncate max-w-[60%]">
                      <User className="w-3 h-3 text-blue-500 shrink-0" />
                      <span className="truncate">{serial.tenKhachHang}</span>
                    </div>
                    {serial.bienSoXe && (
                      <span className="font-mono font-bold text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        <Car className="w-2.5 h-2.5 inline mr-0.5" />
                        {serial.bienSoXe}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground/70 italic">
                    Chưa xuất bán cho khách
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Bảo hành:</span>
                  {serial.ngayKetThucBaoHanh ? (
                    isExpired ? (
                      <span className="text-rose-600 dark:text-rose-400 font-medium flex items-center gap-0.5">
                        <ShieldAlert className="w-3 h-3" /> Hết hạn (
                        {formatDate(serial.ngayKetThucBaoHanh)})
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Đến{" "}
                        {formatDate(serial.ngayKetThucBaoHanh)}
                      </span>
                    )
                  ) : (
                    <span className="italic">Chưa kích hoạt</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenWarranty(serial)}
                  className="flex-1 h-8 text-xs flex items-center justify-center gap-1 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Bảo hành</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChangeStatus(serial)}
                  className="flex-1 h-8 text-xs flex items-center justify-center gap-1 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shadow-2xs"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
                  <span>Trạng thái</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </motion.div>

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        itemName="số serial"
      />
    </div>
  );
};
