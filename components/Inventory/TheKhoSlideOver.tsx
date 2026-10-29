"use client";

import React, { useMemo } from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { SlideOver } from "@/components/ui/SlideOver";
import { KHO_TonKho, KHO_GiaoDichTonKho } from "@/types/tonKho";
import { useGetGiaoDichTonKho } from "@/hooks/TonKho/useTonKhoApi";

export interface TheKhoSlideOverProps {
  open: boolean;
  onClose: () => void;
  selectedItem: KHO_TonKho | null;
  theKhoItems?: KHO_GiaoDichTonKho[];
  isLoadingTheKho?: boolean;
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

export const TheKhoSlideOver: React.FC<TheKhoSlideOverProps> = ({
  open,
  onClose,
  selectedItem,
  theKhoItems: theKhoItemsProp,
  isLoadingTheKho: isLoadingTheKhoProp,
}) => {
  // Lazy query: chỉ tải dữ liệu thẻ kho khi modal thực sự mở và đã chọn mặt hàng
  const { data: dataGiaoDichs, isLoading: isLoadingQuery } =
    useGetGiaoDichTonKho({
      KhoID: open && selectedItem ? selectedItem.khoID : null,
      BienTheSanPhamID:
        open && selectedItem ? selectedItem.bienTheSanPhamID : null,
      PageIndex: 1,
      PageSize: 100,
    });

  const theKhoItems = useMemo(() => {
    if (theKhoItemsProp) return theKhoItemsProp;
    return dataGiaoDichs?.data ?? dataGiaoDichs?.items ?? [];
  }, [theKhoItemsProp, dataGiaoDichs]);

  const isLoading = isLoadingTheKhoProp ?? isLoadingQuery;
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
        key: "loaiGiaoDichID",
        title: "Loại giao dịch",
        classNameHeader:
          "text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left text-xs",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-foreground">
              {row.tenLoaiGiaoDich || `Giao dịch ${row.loaiGiaoDichID}`}
            </span>
            {row.ghiChu && (
              <span className="text-[11px] text-muted-foreground truncate">
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
        title: "Tồn sau",
        classNameHeader:
          "w-20 text-right text-xs font-semibold text-muted-foreground",
        classNameItem:
          "text-right font-mono text-xs text-foreground font-semibold",
        render: (v) => v || 0,
      },
      {
        key: "donGiaVon",
        title: "Đơn giá vốn",
        classNameHeader:
          "w-28 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right font-mono text-xs text-muted-foreground",
        render: (v) => formatCurrency(Number(v)),
      },
    ],
    [],
  );

  return (
    <SlideOver
      open={open}
      onClose={onClose}
      title="Sổ Thẻ Kho / Lịch Sử Giao Dịch"
      description="Theo dõi toàn bộ biến động xuất, nhập, chuyển kho và đối soát số lượng tồn"
      maxWidth="xl"
    >
      <div className="space-y-4 py-2">
        {selectedItem && (
          <div className="p-3.5 rounded-xl border border-border/80 bg-muted/40 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground">
                {selectedItem.maSKU}
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                Tồn hiện tại: {selectedItem.soLuong}
              </span>
            </div>
            <p className="text-xs font-semibold text-foreground">
              {selectedItem.tenBienThe}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2 py-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : theKhoItems.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs">
            Chưa có lịch sử giao dịch phát sinh cho mặt hàng này tại kho đã
            chọn.
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <Table<KHO_GiaoDichTonKho>
              data={theKhoItems}
              columns={columns}
              showIndex
            />
          </div>
        )}
      </div>
    </SlideOver>
  );
};
