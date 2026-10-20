"use client";

import React, { useMemo } from "react";
import { History, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KHO_GiaoDichTonKho } from "@/types/tonKho";

export interface InventoryTransactionsTableProps {
  allGiaoDichItems: KHO_GiaoDichTonKho[];
  totalAllGiaoDichs: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
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

export const InventoryTransactionsTable: React.FC<
  InventoryTransactionsTableProps
> = ({
  allGiaoDichItems,
  totalAllGiaoDichs,
  page,
  pageSize,
  setPage,
  setPageSize,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalAllGiaoDichs / pageSize));

  const columns: Column<KHO_GiaoDichTonKho>[] = useMemo(
    () => [
      {
        key: "ngayTaoLap",
        title: "Thời gian",
        classNameHeader:
          "w-36 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs text-muted-foreground",
        render: (v) => formatDate(v ? String(v) : null),
      },
      {
        key: "tenKho",
        title: "Kho hàng",
        classNameHeader:
          "w-36 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs font-medium text-foreground",
        render: (v) => v || "—",
      },
      {
        key: "maSKU",
        title: "Sản phẩm & SKU",
        classNameHeader:
          "w-64 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-foreground">
                {row.maSKU || "N/A"}
              </span>
              {row.maSerial && (
                <span className="text-[10px] font-mono px-1 py-0.2 bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded border border-blue-500/20">
                  SN: {row.maSerial}
                </span>
              )}
            </div>
            <span className="font-medium text-foreground line-clamp-1">
              {row.tenBienThe || "Sản phẩm"}
            </span>
          </div>
        ),
      },
      {
        key: "loaiGiaoDichID",
        title: "Loại giao dịch",
        classNameHeader:
          "w-48 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">
              {row.tenLoaiGiaoDich || `Giao dịch ${row.loaiGiaoDichID}`}
            </span>
            {row.ghiChu && (
              <span className="text-[11px] text-muted-foreground line-clamp-1">
                {row.ghiChu}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "soLuong",
        title: "Biến động",
        classNameHeader:
          "w-24 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs font-bold",
        render: (v) => {
          const num = Number(v) || 0;
          if (num > 0) {
            return (
              <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
                <ArrowDownLeft className="w-3 h-3" />+{num}
              </span>
            );
          }
          return (
            <span className="text-rose-600 dark:text-rose-400 inline-flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {num}
            </span>
          );
        },
      },
      {
        key: "soLuongSau",
        title: "Tồn trước ➔ sau",
        classNameHeader:
          "w-28 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs",
        render: (_v, row) => (
          <span>
            <span className="text-muted-foreground">
              {row.soLuongTruoc ?? "—"}
            </span>
            <span className="text-muted-foreground mx-1">➔</span>
            <span className="font-bold text-foreground">{row.soLuongSau}</span>
          </span>
        ),
      },
      {
        key: "donGiaVon",
        title: "Đơn giá vốn",
        classNameHeader:
          "w-28 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs text-muted-foreground",
        render: (v) => formatCurrency(Number(v)),
      },
      {
        key: "giaTri",
        title: "Tổng giá trị",
        classNameHeader:
          "w-32 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs font-bold text-foreground",
        render: (v) => formatCurrency(Number(v)),
      },
    ],
    []
  );

  if (allGiaoDichItems.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-12 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <History className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Chưa có giao dịch biến động thẻ kho nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Mọi hoạt động nhập hàng, xuất bán, chuyển kho và kiểm kê sẽ tự động ghi sổ tại đây.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto min-w-0">
        <div className="min-w-[900px] p-3 flex flex-col gap-3 w-full">
          <Table<KHO_GiaoDichTonKho>
            data={allGiaoDichItems}
            columns={columns}
            showIndex
            startIndex={(page - 1) * pageSize}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalAllGiaoDichs}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="giao dịch"
          />
        </div>
      </div>
    </div>
  );
};
