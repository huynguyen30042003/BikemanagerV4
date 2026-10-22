"use client";

import React from "react";
import {
  Calendar,
  QrCode,
  Zap,
  BatteryCharging,
  User,
  Car,
  ShieldCheck,
  ShieldAlert,
  ArrowRightLeft,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
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

interface ProductSerialsTableProps {
  items: SP_SoSerial[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onOpenWarranty: (item: SP_SoSerial) => void;
  onOpenChangeStatus: (item: SP_SoSerial) => void;
  onOpenImages?: (item: SP_SoSerial) => void;
  getSerialStatusBadge: (statusId?: number | null) => {
    bgClass: string;
    textClass: string;
    borderClass: string;
    label: string;
  };
}

export const ProductSerialsTable: React.FC<ProductSerialsTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onOpenWarranty,
  onOpenChangeStatus,
  onOpenImages,
  getSerialStatusBadge,
}) => {
  const columns: Column<SP_SoSerial>[] = [
    {
      key: "maSerial",
      title: "Mã Serial & Định danh",
      classNameHeader:
        "w-60 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              {row.maSerial}
            </span>
            {row.maQR && (
              <span
                title={`Mã QR: ${row.maQR}`}
                className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60"
              >
                <QrCode className="w-3 h-3" /> QR
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Calendar className="w-3 h-3 text-muted-foreground/60" />
            <span>SX: {formatDate(row.ngaySanXuat)}</span>
            {row.ngayNhap && (
              <>
                <span>•</span>
                <span>Nhập: {formatDate(row.ngayNhap)}</span>
              </>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "tenBienThe",
      title: "Sản phẩm / Biến thể",
      classNameHeader:
        "w-50 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-xs text-foreground line-clamp-1">
            {row.tenBienThe || "Biến thể chưa đặt tên"}
          </span>
          {row.tenSanPham && (
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              Dòng: {row.tenSanPham}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "soKhung",
      title: "Số Khung / Máy / Pin",
      classNameHeader:
        "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-1 text-[11px]">
          {row.soKhung ? (
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="font-medium text-muted-foreground/80 w-12 shrink-0">
                Khung:
              </span>
              <span className="font-mono font-medium px-1.5 py-0.5 rounded bg-muted border border-border/50">
                {row.soKhung}
              </span>
            </div>
          ) : (
            <div className="text-muted-foreground/60 italic text-[11px]">
              Khung: Chưa cập nhật
            </div>
          )}

          {row.soMay ? (
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="font-medium text-muted-foreground/80 w-12 shrink-0 flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5 text-amber-500" /> Máy:
              </span>
              <span className="font-mono font-medium px-1.5 py-0.5 rounded bg-muted border border-border/50">
                {row.soMay}
              </span>
            </div>
          ) : null}

          {row.soPin ? (
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
              <span className="font-medium text-muted-foreground/80 w-12 shrink-0 flex items-center gap-0.5">
                <BatteryCharging className="w-2.5 h-2.5 text-emerald-500" /> Pin:
              </span>
              <span className="font-mono font-medium px-1.5 py-0.5 rounded bg-muted border border-border/50">
                {row.soPin}
              </span>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader:
        "w-44 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const badge = getSerialStatusBadge(row.trangThaiID);
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "khachHangID",
      title: "Khách hàng & Biển số",
      classNameHeader:
        "w-56 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        if (row.khachHangID || row.tenKhachHang) {
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 text-xs font-medium text-foreground">
                <User className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="truncate">{row.tenKhachHang}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground pl-4">
                {row.dienThoaiKhachHang && (
                  <span>{row.dienThoaiKhachHang}</span>
                )}
                {row.bienSoXe && (
                  <span className="font-mono font-bold text-foreground px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                    <Car className="w-2.5 h-2.5 inline mr-0.5" />
                    {row.bienSoXe}
                  </span>
                )}
              </div>
            </div>
          );
        }
        return (
          <span className="text-muted-foreground/60 italic text-xs">
            Chưa xuất bán
          </span>
        );
      },
    },
    {
      key: "ngayBatDauBaoHanh",
      title: "Bảo hành điện tử",
      classNameHeader:
        "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        if (!row.ngayBatDauBaoHanh && !row.ngayKetThucBaoHanh) {
          return (
            <span className="text-muted-foreground/60 italic text-xs">
              Chưa kích hoạt
            </span>
          );
        }

        const isExpired =
          row.ngayKetThucBaoHanh &&
          new Date(row.ngayKetThucBaoHanh).getTime() < new Date().getTime();

        return (
          <div className="flex flex-col gap-0.5 text-[11px]">
            <div className="flex items-center gap-1">
              {isExpired ? (
                <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-semibold">
                  <ShieldAlert className="w-3 h-3" /> Hết hạn
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Còn hạn
                </span>
              )}
            </div>
            <span className="text-muted-foreground">
              Đến: {formatDate(row.ngayKetThucBaoHanh)}
            </span>
          </div>
        );
      },
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenImages?.(row)}
            title="Xem và tải lên hình ảnh xe / thiết bị"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
          >
            <Camera className="w-4 h-4 text-primary" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenWarranty(row)}
            title="Kích hoạt / Cập nhật bảo hành điện tử"
            className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChangeStatus(row)}
            title="Chuyển trạng thái serial"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="p-3 flex flex-col gap-3 w-full">
        {/* Anti-blowout horizontal scrolling wrapper */}
        <div className="overflow-x-auto w-full">
          <div className="min-w-[1050px]">
            <Table<SP_SoSerial>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />
          </div>
        </div>

        {/* Standardized Pagination */}
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
    </div>
  );
};
