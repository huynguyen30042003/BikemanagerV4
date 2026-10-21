"use client";

import React, { useState } from "react";
import {
  Search,
  Warehouse,
  Boxes,
  Barcode,
  ArrowRight,
  Plus,
  RefreshCw,
  FolderOpen,
  Layers,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { SearchSelect } from "@/components/ui/selectSearch";
import { KHO_TonKho } from "@/types/tonKho";
import { useGetTonKho } from "@/hooks/TonKho/useTonKhoApi";

interface OpeningStockReferenceTableProps {
  khoFilter: string;
  onKhoFilterChange: (khoId: string) => void;
  khoOptions: Array<{ value: string; label: string }>;
  isLoadingKhos: boolean;
  onSelectVariant: (bienTheId: string, khoId?: string) => void;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export const OpeningStockReferenceTable: React.FC<
  OpeningStockReferenceTableProps
> = ({
  khoFilter,
  onKhoFilterChange,
  khoOptions,
  isLoadingKhos,
  onSelectVariant,
}) => {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [searchInput, setSearchInput] = useState<string>("");

  const { data, isLoading, isFetching, refetch } = useGetTonKho({
    KhoID: khoFilter || null,
    TuKhoa: searchInput,
    PageIndex: page,
    PageSize: pageSize,
  });

  const items: KHO_TonKho[] = data?.data ?? data?.items ?? [];
  const totalCount = data?.totalItems ?? data?.totalCount ?? items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const columns: Column<KHO_TonKho>[] = [
    {
      key: "maSKU",
      title: "SKU / Mã vạch",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {row.maSKU || "—"}
          </span>
          {row.maVach && (
            <span className="font-mono text-[10px] text-muted-foreground">
              {row.maVach}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tenBienThe",
      title: "Sản phẩm & Biến thể",
      classNameHeader:
        "min-w-[240px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground text-xs">
            {row.tenBienThe || row.tenSanPham || "Mặt hàng"}
          </span>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            {row.tenKho && (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Warehouse className="w-3 h-3 shrink-0" />
                {row.tenKho}
              </span>
            )}
            {row.viTriLuuTru && (
              <span className="font-mono bg-muted px-1.5 py-0.2 rounded text-[10px]">
                {row.viTriLuuTru}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "soLuong",
      title: "Tồn thực tế / Khả dụng",
      classNameHeader:
        "w-44 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="flex flex-col items-end gap-0.5 font-mono text-xs">
          <span className="font-bold text-foreground">
            {row.soLuong?.toLocaleString("vi-VN") ?? 0} kiện / xe
          </span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Khả dụng: {row.soLuongKhaDung?.toLocaleString("vi-VN") ?? 0}
            </span>
            {row.soLuongDaDat > 0 && (
              <span className="text-muted-foreground">
                (Đã đặt: {row.soLuongDaDat})
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "giaNhap",
      title: "Đơn giá vốn & Bán",
      classNameHeader:
        "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="flex flex-col items-end gap-0.5 font-mono text-xs">
          <span className="font-semibold text-foreground">
            {formatCurrency(row.giaNhap)}
          </span>
          {row.giaBan && (
            <span className="text-[11px] text-muted-foreground">
              Bán: {formatCurrency(row.giaBan)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "function",
      title: "Nhập tồn",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelectVariant(row.bienTheSanPhamID, row.khoID)}
          className="h-7 px-2.5 text-xs text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer font-medium"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Nhập thêm
        </Button>
      ),
    },
  ];

  return (
    <Card className="p-4 sm:p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Tra Cứu Tồn Kho Hiện Tại Để Đối Chiếu
          </h3>
          <p className="text-xs text-muted-foreground">
            Xem số lượng tồn hiện có trong kho trước khi thực hiện khởi tạo số dư đầu kỳ
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Warehouse Dropdown */}
          <div className="w-full sm:w-56 shrink-0">
            <SearchSelect
              placeholder="Tất cả kho hàng"
              options={[{ value: "", label: "Tất cả kho hàng" }, ...khoOptions]}
              value={khoFilter}
              onChange={(val) => {
                onKhoFilterChange(val ? String(val) : "");
                setPage(1);
              }}
              isLoading={isLoadingKhos}
              className="text-xs"
            />
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Tìm theo SKU, tên sản phẩm..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="pl-8 h-9 text-xs bg-background"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 text-xs border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
            <span className="hidden sm:inline ml-1">Làm mới</span>
          </Button>
        </div>
      </div>

      {/* Table Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-2.5 border border-border/60">
            <FolderOpen className="w-6 h-6 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-sm text-foreground">
            Chưa có dữ liệu tồn kho nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-0.5">
            Kho hàng được chọn hiện chưa có dữ liệu tồn. Bạn có thể sử dụng biểu mẫu phía trên để nhập số dư đầu kỳ ngay!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
      )}
    </Card>
  );
};
