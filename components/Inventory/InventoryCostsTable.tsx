"use client";

import React, { useMemo } from "react";
import { Receipt } from "lucide-react";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KHO_LoChiPhiTonKho } from "@/types/tonKho";

export interface InventoryCostsTableProps {
  loChiPhiItems: KHO_LoChiPhiTonKho[];
  totalLoChiPhis: number;
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

export const InventoryCostsTable: React.FC<InventoryCostsTableProps> = ({
  loChiPhiItems,
  totalLoChiPhis,
  page,
  pageSize,
  setPage,
  setPageSize,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalLoChiPhis / pageSize));

  const columns: Column<KHO_LoChiPhiTonKho>[] = useMemo(
    () => [
      {
        key: "maSKU",
        title: "Mặt hàng & Mã Lô",
        classNameHeader:
          "w-64 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-foreground">
                {row.maSKU || "N/A"}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-muted rounded border border-border/70 text-muted-foreground">
                Lô: {row.loID ? row.loID.slice(0, 8) : "—"}
              </span>
            </div>
            <span className="font-medium text-foreground line-clamp-1">
              {row.tenBienThe || "Sản phẩm"}
            </span>
          </div>
        ),
      },
      {
        key: "soKhung",
        title: "Số khung / Serial",
        classNameHeader:
          "w-40 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs",
        render: (_v, row) =>
          row.soKhung || row.maSerial ? (
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              {row.soKhung || row.maSerial}
            </span>
          ) : (
            <span className="text-muted-foreground text-[11px] italic">
              Quản lý theo SL
            </span>
          ),
      },
      {
        key: "tenKho",
        title: "Kho lưu trữ",
        classNameHeader:
          "w-40 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs text-foreground font-medium",
        render: (v) => v || "—",
      },
      {
        key: "loaiThamChieu",
        title: "Nguồn gốc / Tham chiếu",
        classNameHeader:
          "w-36 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-muted text-foreground border border-border/60 w-fit">
              {row.loaiThamChieu || "Đơn nhập hàng"}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {formatDate(row.ngayNhap)}
            </span>
          </div>
        ),
      },
      {
        key: "giaNhap",
        title: "Giá nhập gốc",
        classNameHeader:
          "w-28 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs text-muted-foreground",
        render: (v) => formatCurrency(Number(v)),
      },
      {
        key: "chiPhiPhanBo",
        title: "Chi phí PB",
        classNameHeader:
          "w-24 text-right text-xs font-semibold text-muted-foreground",
        classNameItem:
          "text-right font-mono text-xs text-amber-600 dark:text-amber-400",
        render: (v) => `+${formatCurrency(Number(v))}`,
      },
      {
        key: "giaVonThucTe",
        title: "Giá vốn thực tế",
        classNameHeader:
          "w-32 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs font-bold text-foreground",
        render: (v) => (
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            {formatCurrency(Number(v))}
          </span>
        ),
      },
      {
        key: "soLuongConLai",
        title: "Còn lại / Nhập",
        classNameHeader:
          "w-28 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs",
        render: (_v, row) => (
          <div className="flex items-center justify-end gap-1">
            <span className="font-bold text-foreground">
              {row.soLuongConLai}
            </span>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground text-[11px]">
              {row.soLuongNhap}
            </span>
          </div>
        ),
      },
    ],
    []
  );

  if (loChiPhiItems.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-12 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <Receipt className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Chưa có lô chi phí tồn kho nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Các lô giá vốn và chi phí phân bổ sẽ được tự động ghi nhận khi hoàn thành đơn nhập hàng hoặc điều chuyển kho.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto min-w-0">
        <div className="min-w-[900px] p-3 flex flex-col gap-3 w-full">
          <Table<KHO_LoChiPhiTonKho>
            data={loChiPhiItems}
            columns={columns}
            showIndex
            startIndex={(page - 1) * pageSize}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalLoChiPhis}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="lô chi phí"
          />
        </div>
      </div>
    </div>
  );
};
