"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tags, SquarePen, Trash2, Globe, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface BrandsTableProps {
  items: SP_ThuongHieu[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: SP_ThuongHieu) => void;
  onDelete: (item: SP_ThuongHieu) => void;
}

export const BrandsTable: React.FC<BrandsTableProps> = ({
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
  const columns: Column<SP_ThuongHieu>[] = [
    {
      key: "maThuongHieu",
      title: "Mã hãng",
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
      key: "tenThuongHieu",
      title: "Thương hiệu & Định danh",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        const logoUrl = getImageUrl(row.duongDanLogo);
        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-lg bg-muted/60 border border-border/70 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={row.tenThuongHieu}
                  width={40}
                  height={40}
                  className="w-full h-full object-contain p-1"
                  unoptimized
                />
              ) : (
                <Tags className="w-4 h-4 text-muted-foreground/60" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-semibold text-foreground text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {row.tenThuongHieu}
              </span>
              <span className="text-[11px] text-muted-foreground font-mono truncate">
                slug: /{row.duongDan}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "quocGia",
      title: "Xuất xứ",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/50 border border-border/60 text-xs text-foreground font-medium">
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{v}</span>
          </div>
        ) : (
          <span className="text-muted-foreground/60 text-xs">Toàn cầu</span>
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
              Đang áp dụng
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
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Link
            href={`/admin/products?brandId=${row.thuongHieuID}`}
            title="Xem danh mục sản phẩm của hãng"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa thương hiệu"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa thương hiệu"
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
        <div className="min-w-[850px] p-3 flex flex-col gap-3 w-full">
          <Table<SP_ThuongHieu>
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
            itemName="thương hiệu"
          />
        </div>
      </div>
    </div>
  );
};
