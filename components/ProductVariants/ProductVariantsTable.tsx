"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Boxes,
  Barcode,
  BatteryCharging,
  Zap,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface ProductVariantsTableProps {
  items: SP_BienTheSanPham[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: SP_BienTheSanPham) => void;
  onDelete: (item: SP_BienTheSanPham) => void;
}

export const ProductVariantsTable: React.FC<ProductVariantsTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
}) => {
  const columns: Column<SP_BienTheSanPham>[] = [
    {
      key: "maSKU",
      title: "Mã SKU / Barcode",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col items-center">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted/80 text-foreground border border-border/60">
            {row.maSKU}
          </span>
          {row.maVach && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono mt-0.5">
              <Barcode className="w-3 h-3 text-muted-foreground" />
              {row.maVach}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tenBienThe",
      title: "Biến thể & Thuộc tính",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-muted/60 border border-border/60 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {row.hinhAnh && getImageUrl(row.hinhAnh) ? (
              <Image
                src={getImageUrl(row.hinhAnh)}
                alt={row.tenBienThe}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <Boxes className="w-5 h-5 text-muted-foreground/60" />
            )}
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors truncate">
              {row.tenBienThe}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              {row.mauSac && (
                <span className="font-medium text-foreground/80">
                  Màu: {row.mauSac}
                </span>
              )}
              {row.dungLuongPin && (
                <span className="inline-flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400">
                  <BatteryCharging className="w-3 h-3" />
                  {row.dungLuongPin}
                </span>
              )}
              {row.congSuatDongCo && (
                <span className="inline-flex items-center gap-1 font-mono text-amber-600 dark:text-amber-400">
                  <Zap className="w-3 h-3" />
                  {row.congSuatDongCo}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "sanPhamID",
      title: "Dòng sản phẩm cha",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <span className="text-xs text-foreground font-medium">
          {row.tenSanPham || `SP #${row.sanPhamID.substring(0, 8)}`}
        </span>
      ),
    },
    {
      key: "giaBan",
      title: "Giá bán lẻ",
      classNameHeader:
        "w-32 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => (
        <span className="font-mono text-xs font-bold text-foreground">
          {formatCurrency(Number(v))}
        </span>
      ),
    },
    {
      key: "giaBanSi",
      title: "Giá sỉ / Thợ",
      classNameHeader:
        "w-32 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => (
        <span className="font-mono text-xs text-muted-foreground">
          {formatCurrency(Number(v))}
        </span>
      ),
    },
    {
      key: "quanLyTheoSerial",
      title: "Quản lý Serial",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            Số Khung/Pin
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">
            Theo số lượng
          </span>
        ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kinh doanh
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Ngừng bán
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Link
            href={`/admin/product-serials?variantId=${row.bienTheSanPhamID}`}
            title="Quản lý danh sách Serial / Số khung của biến thể"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Barcode className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa biến thể"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa biến thể"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
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
          <div className="min-w-[950px]">
            <Table<SP_BienTheSanPham>
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
          itemName="biến thể"
        />
      </div>
    </div>
  );
};
