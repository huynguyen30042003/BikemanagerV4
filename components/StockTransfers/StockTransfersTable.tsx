"use client";

import React from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Truck,
  Eye,
  FolderOpen,
  Plus,
  Warehouse,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KHO_PhieuChuyenKho } from "@/types/phieuChuyenKho";
import { StatusBadgeInfo } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";

interface StockTransfersTableProps {
  items: KHO_PhieuChuyenKho[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  getTransferStatusBadge: (id?: number | null) => StatusBadgeInfo;
  onOpenDetail: (row: KHO_PhieuChuyenKho) => void;
  onOpenCreate: () => void;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export const StockTransfersTable: React.FC<StockTransfersTableProps> = ({
  items,
  isLoading,
  page,
  pageSize,
  totalPages,
  totalCount,
  setPage,
  setPageSize,
  getTransferStatusBadge,
  onOpenDetail,
  onOpenCreate,
}) => {
  const columns: Column<KHO_PhieuChuyenKho>[] = [
    {
      key: "maPhieuChuyen",
      title: "Mã phiếu",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {v ? String(v).toUpperCase() : "—"}
        </span>
      ),
    },
    {
      key: "khoXuatID",
      title: "Tuyến điều chuyển (Kho xuất → Kho nhập)",
      classNameHeader:
        "min-w-[260px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-2 text-xs py-0.5">
          <div className="flex items-center gap-1.5 min-w-0 max-w-[140px] sm:max-w-[180px]">
            <Warehouse className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span
              className="font-medium text-foreground truncate"
              title={row.tenKhoXuat || "Kho xuất"}
            >
              {row.tenKhoXuat || "Kho xuất"}
            </span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
          <div className="flex items-center gap-1.5 min-w-0 max-w-[140px] sm:max-w-[180px]">
            <Warehouse className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span
              className="font-medium text-foreground truncate"
              title={row.tenKhoNhap || "Kho nhập"}
            >
              {row.tenKhoNhap || "Kho nhập"}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "tongSoLuong",
      title: "Số lượng & Trị giá",
      classNameHeader:
        "w-40 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {row.tongSoLuong?.toLocaleString("vi-VN") ?? 0} kiện / xe
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {formatCurrency(row.tongGiaTriVon)}
          </span>
        </div>
      ),
    },
    {
      key: "nguoiGiaoHang",
      title: "Vận chuyển",
      classNameHeader:
        "w-48 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {row.nguoiGiaoHang ? (
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-foreground font-medium truncate max-w-[150px]">
                {row.nguoiGiaoHang}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground/50 italic text-[11px]">—</span>
          )}
          {row.bienSoXeVanChuyen && (
            <span className="font-mono text-[11px] text-muted-foreground pl-5">
              {row.bienSoXeVanChuyen}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "ngayXuat",
      title: "Thời gian",
      classNameHeader:
        "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground font-mono">
          {row.ngayXuat && (
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground/60 w-10 shrink-0">Xuất:</span>
              <span className="text-foreground">{formatDate(row.ngayXuat)}</span>
            </span>
          )}
          {row.ngayNhan && (
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground/60 w-10 shrink-0">Nhận:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                {formatDate(row.ngayNhan)}
              </span>
            </span>
          )}
          {!row.ngayXuat && !row.ngayNhan && (
            <span className="text-muted-foreground/50">
              Tạo: {formatDate(row.ngayTao)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const badge = getTransferStatusBadge(row.trangThaiID);
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenDetail(row)}
            title="Xem chi tiết & Thao tác phiếu chuyển"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card className="p-4 sm:p-6 rounded-xl border border-border/80 bg-card shadow-xs">
        <Skeleton className="h-10 w-full mb-3 rounded-lg" />
        <Skeleton className="h-12 w-full mb-2 rounded-lg" />
        <Skeleton className="h-12 w-full mb-2 rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </Card>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="p-3 sm:p-4 flex flex-col gap-3 w-full">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3 border border-border/60 shadow-2xs">
              <FolderOpen className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="font-semibold text-base text-foreground">
              Không tìm thấy phiếu điều chuyển kho nào
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Chưa có phiếu luân chuyển phù hợp với tiêu chí tìm kiếm hoặc bộ lọc hiện tại.
            </p>
            <Button
              size="sm"
              onClick={onOpenCreate}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-lg text-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Tạo phiếu chuyển kho mới
            </Button>
          </div>
        ) : (
          <>
            <Table<KHO_PhieuChuyenKho>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              itemName="phiếu chuyển"
            />
          </>
        )}
      </div>
    </div>
  );
};
