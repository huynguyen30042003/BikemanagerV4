"use client";

import React from "react";
import { Warehouse, Eye, FileSpreadsheet, FolderOpen, Scale, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KHO_PhieuKiemKe } from "@/types/phieuKiemKe";
import { StatusBadgeInfo } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";

interface StockAuditsTableProps {
  items: KHO_PhieuKiemKe[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  getAuditStatusBadge: (id?: number | null) => StatusBadgeInfo;
  onOpenDetail: (row: KHO_PhieuKiemKe) => void;
  onOpenCapNhat: (row: KHO_PhieuKiemKe) => void;
  onOpenCreate: () => void;
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

export const StockAuditsTable: React.FC<StockAuditsTableProps> = ({
  items,
  isLoading,
  page,
  pageSize,
  totalPages,
  totalCount,
  setPage,
  setPageSize,
  getAuditStatusBadge,
  onOpenDetail,
  onOpenCapNhat,
  onOpenCreate,
}) => {
  const columns: Column<KHO_PhieuKiemKe>[] = [
    {
      key: "maPhieuKiemKe",
      title: "Mã phiếu",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {v ? String(v).toUpperCase() : "—"}
        </span>
      ),
    },
    {
      key: "tenKho",
      title: "Kho kiểm kê",
      classNameHeader: "min-w-[160px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (v) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Warehouse className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate">{v || "Kho chung"}</span>
        </div>
      ),
    },
    {
      key: "tongSoLuongHeThong",
      title: "Sổ sách / Thực đếm",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1 text-xs font-mono">
          <span className="text-muted-foreground" title="Số lượng sổ sách hệ thống">
            {row.tongSoLuongHeThong?.toLocaleString("vi-VN") ?? 0}
          </span>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-bold text-foreground" title="Số lượng kiểm đếm thực tế">
            {row.tongSoLuongThucTe?.toLocaleString("vi-VN") ?? 0}
          </span>
        </div>
      ),
    },
    {
      key: "tongSoLuongLech",
      title: "Chênh lệch",
      classNameHeader: "w-32 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right font-mono text-xs font-bold",
      render: (v) => {
        const num = Number(v) || 0;
        if (num === 0) {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Khớp (0)
            </span>
          );
        }
        if (num > 0) {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
              +{num} (Thừa)
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
            {num} (Thiếu)
          </span>
        );
      },
    },
    {
      key: "ngayKiemKe",
      title: "Thời gian",
      classNameHeader: "w-40 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-[11px] text-muted-foreground">
          <span>Kiểm: {formatDate(row.ngayKiemKe)}</span>
          {row.ngayCanBang && (
            <span className="text-emerald-600 dark:text-emerald-400">
              Duyệt: {formatDate(row.ngayCanBang)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader: "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getAuditStatusBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
            <span>{badge.label}</span>
          </span>
        );
      },
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader: "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const isDangKiemKe = row.trangThaiID === 26 || row.trangThaiID === 1;
        return (
          <div className="flex gap-1 justify-center items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenDetail(row)}
              title="Xem chi tiết & Đối soát"
              className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
            </Button>

            {isDangKiemKe && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onOpenCapNhat(row)}
                title="Nhập số đếm thực tế"
                className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <Card className="p-6 rounded-xl border border-border/80">
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
            <div className="w-14 h-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
              <FolderOpen className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="font-semibold text-base text-foreground">
              Không tìm thấy phiếu kiểm kê nào
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Chưa có đợt kiểm kê nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm.
            </p>
            <Button
              size="sm"
              onClick={onOpenCreate}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            >
              Tạo đợt kiểm kê mới
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table<KHO_PhieuKiemKe>
                data={items}
                columns={columns}
                showIndex
                startIndex={(page - 1) * pageSize}
              />
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              itemName="đợt kiểm kê"
            />
          </>
        )}
      </div>
    </div>
  );
};
