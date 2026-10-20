"use client";

import React, { useMemo } from "react";
import {
  Warehouse,
  History,
  SlidersHorizontal,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KHO_TonKho } from "@/types/tonKho";

export interface InventoryStockTableProps {
  items: KHO_TonKho[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onOpenTheKho: (item: KHO_TonKho) => void;
  onOpenDinhMuc: (item: KHO_TonKho) => void;
}

export const InventoryStockTable: React.FC<InventoryStockTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onOpenTheKho,
  onOpenDinhMuc,
}) => {
  const columns: Column<KHO_TonKho>[] = useMemo(
    () => [
      {
        key: "maSKU",
        title: "Mã SKU & Barcode",
        classNameHeader:
          "w-40 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-xs font-bold text-foreground">
              {row.maSKU || "—"}
            </span>
            {row.maVach && (
              <span className="font-mono text-[11px] text-muted-foreground">
                Vạch: {row.maVach}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "tenBienThe",
        title: "Sản phẩm & Biến thể",
        classNameHeader:
          "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-xs text-foreground line-clamp-1">
              {row.tenBienThe || "Chưa đặt tên biến thể"}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              {row.tenSanPham && <span>Dòng: {row.tenSanPham}</span>}
              {row.mauSac && <span>• Màu: {row.mauSac}</span>}
              {row.dungLuongPin && <span>• Pin: {row.dungLuongPin}</span>}
            </div>
          </div>
        ),
      },
      {
        key: "tenKho",
        title: "Kho & Vị trí kệ",
        classNameHeader:
          "w-44 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 text-xs font-medium text-foreground">
              <Warehouse className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{row.tenKho || "Kho chung"}</span>
            </div>
            {row.viTriLuuTru ? (
              <span className="text-[11px] text-muted-foreground pl-4.5">
                Kệ: <strong className="text-foreground">{row.viTriLuuTru}</strong>
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground/60 italic pl-4.5">
                Chưa gán vị trí
              </span>
            )}
          </div>
        ),
      },
      {
        key: "soLuong",
        title: "Tồn thực tế",
        classNameHeader:
          "w-24 text-right text-xs font-semibold text-muted-foreground",
        classNameItem:
          "text-right font-mono text-xs font-semibold text-foreground",
        render: (v) => v || 0,
      },
      {
        key: "soLuongDaDat",
        title: "Đã đặt giữ",
        classNameHeader:
          "w-24 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs text-muted-foreground",
        render: (v) => v || 0,
      },
      {
        key: "soLuongDangChuyen",
        title: "Đang chuyển",
        classNameHeader:
          "w-24 text-right text-xs font-semibold text-muted-foreground",
        classNameItem:
          "text-right font-mono text-xs text-blue-600 dark:text-blue-400",
        render: (v) => v || 0,
      },
      {
        key: "soLuongKhaDung",
        title: "Khả dụng bán",
        classNameHeader:
          "w-28 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right",
        render: (_v, row) => {
          const kd = row.soLuongKhaDung || 0;
          const min = row.soLuongToiThieu ?? 5;

          if (kd <= 0) {
            return (
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                0 (Hết hàng)
              </span>
            );
          }
          if (kd <= min) {
            return (
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                {kd} (Sắp hết)
              </span>
            );
          }
          return (
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {kd}
            </span>
          );
        },
      },
      {
        key: "soLuongToiThieu",
        title: "Định mức tối thiểu",
        classNameHeader:
          "w-28 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center font-mono text-xs text-muted-foreground",
        render: (v) => (v != null ? v : "—"),
      },
      {
        key: "function",
        title: "Thao tác",
        classNameHeader:
          "w-24 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (_v, row) => (
          <div className="flex gap-1 justify-center items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenTheKho(row)}
              title="Xem Thẻ kho / Lịch sử xuất nhập tồn"
              className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              <History className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenDinhMuc(row)}
              title="Cài đặt định mức an toàn & vị trí kệ"
              className="h-8 w-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onOpenTheKho, onOpenDinhMuc]
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-12 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <FolderOpen className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Không tìm thấy mặt hàng tồn kho nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Chưa có số liệu tồn kho thỏa mãn điều kiện lọc tìm kiếm hiện tại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto min-w-0">
        <div className="min-w-[900px] p-3 flex flex-col gap-3 w-full">
          <Table<KHO_TonKho>
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
            itemName="mặt hàng"
          />
        </div>
      </div>
    </div>
  );
};
