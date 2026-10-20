"use client";

import React from "react";
import Link from "next/link";
import { FolderOpen, Layers, ArrowRight, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { DM_DanhMucChung } from "@/types/danhMucChung";

export interface DanhMucChungTableProps {
  items: DM_DanhMucChung[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DM_DanhMucChung) => void;
  onDelete: (item: DM_DanhMucChung) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  onOpenCreate?: () => void;
  searchInput?: string;
}

export const DanhMucChungTable: React.FC<DanhMucChungTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  onResetFilters,
  hasActiveFilters,
  onOpenCreate,
  searchInput,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-8 sm:p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <p className="font-semibold text-base text-foreground">
          Không tìm thấy danh mục nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {searchInput
            ? `Không có kết quả nào khớp với từ khóa "${searchInput}". Bạn hãy thử tìm kiếm từ khóa khác hoặc đặt lại bộ lọc.`
            : "Hiện tại chưa có danh mục chung nào trong hệ thống. Hãy tạo danh mục đầu tiên!"}
        </p>
        <div className="flex items-center gap-2 mt-4">
          {hasActiveFilters && onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer"
            >
              Xóa bộ lọc
            </Button>
          )}
          {onOpenCreate && (
            <Button
              size="sm"
              onClick={onOpenCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm danh mục mới
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Cột bảng: theo rule 545, KHÔNG hiển thị cột thứ tự khi xem
  const columns: Column<DM_DanhMucChung>[] = [
    {
      key: "danhMucID",
      title: "Mã",
      classNameHeader: "w-18 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-muted/60 border border-border/50">
          #{v}
        </span>
      ),
    },
    {
      key: "ten",
      title: "Tên danh mục dùng chung",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-1 py-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
              {row.ten}
            </span>

            {/* Interactive child category count badge */}
            <Link
              href={`/admin/danhMucChiTiet?danhMucId=${row.danhMucID}`}
              title="Nhấn để xem danh sách mục chi tiết thuộc danh mục này"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer shadow-2xs group"
            >
              <Layers className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>{row.soLuongChiTiet ?? 0} mục chi tiết</span>
              <ArrowRight className="w-2.5 h-2.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {row.moTa ? (
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-xl">
              {row.moTa}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/50 italic">
              Chưa có mô tả chi tiết
            </span>
          )}
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader: "text-center w-32 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v === true ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sử dụng
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Khóa
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader: "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa danh mục"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa danh mục"
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
      <div className="p-3 sm:p-4 flex flex-col gap-3 w-full">
        {/* Anti-Blowout Table Container for small mobile screens per Rule 14.3.4 */}
        <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="min-w-[620px]">
            <Table<DM_DanhMucChung>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />
          </div>
        </div>

        {/* Pagination Controls */}
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          itemName="danh mục"
        />
      </div>
    </div>
  );
};
