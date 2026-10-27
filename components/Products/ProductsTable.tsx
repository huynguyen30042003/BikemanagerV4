"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Bike,
  ShoppingBag,
  SquarePen,
  Trash2,
  Boxes,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { SP_SanPham } from "@/types/sanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface ProductsTableProps {
  items: SP_SanPham[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: SP_SanPham) => void;
  onDelete: (item: SP_SanPham) => void;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
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
  const columns: Column<SP_SanPham>[] = [
    {
      key: "maSanPham",
      title: "Mã SP",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/80">
          {v ? String(v).toUpperCase() : "N/A"}
        </span>
      ),
    },
    {
      key: "tenSanPham",
      title: "Sản phẩm & Định danh",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        const avatarUrl = getImageUrl(row.anhDaiDien);
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-11 h-11 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={row.tenSanPham}
                  width={44}
                  height={44}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : row.laPhuongTien ? (
                <Bike className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              ) : (
                <Package className="w-5 h-5 text-muted-foreground/60" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-foreground text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {row.tenSanPham}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="font-mono">slug: /{row.duongDan}</span>
                <span>•</span>
                <span>BH: {row.soThangBaoHanhMacDinh ?? 12}T</span>
                {row.tenDonViTinh && (
                  <>
                    <span>•</span>
                    <span className="font-medium text-foreground/80">
                      ĐVT: {row.tenDonViTinh}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "danhMucChiTietID",
      title: "Ngành hàng & Hãng",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-1 py-1">
          <span className="text-xs font-medium text-foreground">
            {row.tenDanhMucChiTiet || "Ngành hàng"}
          </span>
          {row.tenThuongHieu && (
            <span className="inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[11px] font-semibold bg-muted text-muted-foreground border border-border/60">
              {row.tenThuongHieu}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "laPhuongTien",
      title: "Đặc tính phân loại",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col items-center gap-1 justify-center">
          {row.laPhuongTien ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
              <Bike className="w-3 h-3" />
              Xe nguyên chiếc
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border/60">
              <Package className="w-3 h-3" />
              Phụ tùng
            </span>
          )}

          {row.daXuatBan && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
              <ShoppingBag className="w-2.5 h-2.5" />
              Bán POS
            </span>
          )}
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kinh doanh
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              Tạm ngừng
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
            href={`/admin/product-variants?productId=${row.sanPhamID}`}
            title="Quản lý biến thể màu sắc và dung lượng pin"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
          >
            <Boxes className="w-4 h-4" />
          </Link>

          <Link
            href={`/admin/product-images?productId=${row.sanPhamID}`}
            title="Quản lý thư viện hình ảnh xe"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-sky-600 hover:bg-sky-500/10 dark:hover:text-sky-400 rounded-lg transition-colors cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa sản phẩm"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa sản phẩm"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="min-w-[950px] p-3 flex flex-col gap-3 w-full">
          <Table<SP_SanPham>
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
            itemName="sản phẩm"
          />
        </div>
      </div>
    </div>
  );
};
