"use client";

import React from "react";
import { Column, Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/Common/RoleGuard";
import { Pagination } from "@/components/Common/Pagination";
import { BH_BaoHanh } from "@/types/baoHanh";
import { Barcode, User, Trash2, FolderOpen, Plus, Camera } from "lucide-react";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface WarrantiesTableProps {
  items: BH_BaoHanh[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onPageSizeChange: (size: number | ((prev: number) => number)) => void;
  onDelete: (item: BH_BaoHanh) => void;
  onAddNew: () => void;
  onOpenImages?: (item: BH_BaoHanh) => void;
  getWarrantyStatusBadge: (statusId: number) => {
    label: string;
    className: string;
  };
}

export function WarrantiesTable({
  items,
  isLoading,
  page,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onDelete,
  onAddNew,
  onOpenImages,
  getWarrantyStatusBadge,
}: WarrantiesTableProps) {
  const columns: Column<BH_BaoHanh>[] = [
    {
      key: "maBaoHanh",
      title: "Mã Sổ Bảo Hành",
      classNameHeader:
        "w-36 inline-block text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "xePin",
      title: "Phương Tiện / Serial / Khung VIN",
      classNameHeader:
        "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <Barcode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            Serial: {row.maSerial || "Chưa có"}
          </span>
          {row.soKhung && (
            <span className="text-[11px] font-mono text-muted-foreground">
              Số khung VIN: {row.soKhung}
            </span>
          )}
          {row.tenBienThe && (
            <span className="text-[10px] text-muted-foreground/80 line-clamp-1">
              Dòng xe: {row.tenBienThe}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "khachHang",
      title: "Chủ xe",
      classNameHeader:
        "min-w-[160px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {row.tenKhachHang || "Khách lẻ"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {row.dienThoaiKhachHang || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "ngayKetThuc",
      title: "Thời hạn bảo hành",
      classNameHeader:
        "w-44 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="text-muted-foreground">
            Từ: {formatDate(row.ngayBatDau)}
          </span>
          <span className="font-semibold text-foreground">
            Đến: {formatDate(row.ngayKetThuc)}
          </span>
          {row.gioiHanKm ? (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono">
              Hạn ODO: {row.gioiHanKm.toLocaleString("vi-VN")} km
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "trangThaiID",
      title: "Trạng thái",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getWarrantyStatusBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader:
        "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1">
          {row.soSerialID && onOpenImages && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onOpenImages(row)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
              title="Xem ảnh xe & lịch sử bảo hành"
            >
              <Camera className="w-3.5 h-3.5" />
            </Button>
          )}
          <RoleGuard allowedRoles={["Administrator", "AdminAccess"]}>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(row)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
              title="Hủy sổ bảo hành"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </RoleGuard>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="p-3 flex flex-col gap-3 w-full">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <FolderOpen className="w-10 h-10 mb-2 stroke-[1.5]" />
            <p className="font-semibold text-foreground">
              Chưa có sổ bảo hành nào
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
              Không tìm thấy sổ bảo hành phù hợp với bộ lọc hiện tại.
            </p>
            <RoleGuard
              allowedRoles={[
                "Administrator",
                "AdminAccess",
                "TechnicalAccess",
                "SaleAccess",
              ]}
            >
              <Button
                size="sm"
                onClick={onAddNew}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" /> Kích hoạt sổ mới
              </Button>
            </RoleGuard>
          </div>
        ) : (
          <>
            <Table<BH_BaoHanh>
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
              setPage={onPageChange}
              setPageSize={onPageSizeChange}
              itemName="sổ bảo hành"
            />
          </>
        )}
      </div>
    </div>
  );
}
