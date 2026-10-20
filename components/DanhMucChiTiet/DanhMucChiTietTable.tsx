"use client";

import React from "react";
import Link from "next/link";
import { FolderOpen, FolderTree, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { DM_DanhMucChiTiet } from "@/types/danhMucChiTiet";

export interface DanhMucChiTietTableProps {
  items: DM_DanhMucChiTiet[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DM_DanhMucChiTiet) => void;
  onDelete: (item: DM_DanhMucChiTiet) => void;
  parentCategoryMap: Map<number, string>;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  onOpenCreate?: () => void;
  searchInput?: string;
}

export const DanhMucChiTietTable: React.FC<DanhMucChiTietTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  parentCategoryMap,
  onResetFilters,
  hasActiveFilters,
  onOpenCreate,
  searchInput,
}) => {
  const getParentName = (danhMucId?: number, row?: DM_DanhMucChiTiet) => {
    return (
      row?.tenDanhMuc ||
      row?.tenDanhMucChung ||
      (danhMucId ? parentCategoryMap.get(Number(danhMucId)) : "") ||
      `Danh mục #${danhMucId || 0}`
    );
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-8 sm:p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <p className="font-semibold text-base text-foreground">
          Không tìm thấy mục chi tiết nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {searchInput
            ? `Không có kết quả nào khớp với từ khóa "${searchInput}". Bạn hãy thử tìm kiếm từ khóa khác hoặc đặt lại bộ lọc.`
            : "Hiện tại chưa có mục chi tiết nào trong hệ thống. Hãy tạo mục đầu tiên!"}
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
              className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm mục chi tiết mới
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Cấu hình các cột của bảng: theo rule 545, KHÔNG hiển thị cột thứ tự khi xem
  const columns: Column<DM_DanhMucChiTiet>[] = [
    {
      key: "danhMucChiTietID",
      title: "Mã",
      classNameHeader: "w-20 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-md bg-muted/60 border border-border/50">
          #{v}
        </span>
      ),
    },
    {
      key: "ten",
      title: "Tên mục chi tiết",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (v, row) => (
        <div className="flex flex-col gap-1 py-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm hover:text-purple-600 transition-colors">
              {v}
            </span>
            {row.maSo && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                {row.maSo}
              </span>
            )}
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
      key: "danhMucID",
      title: "Danh mục cha",
      classNameHeader: "font-semibold text-xs text-muted-foreground w-60",
      render: (danhMucId, row) => {
        const parentName = getParentName(Number(danhMucId), row);
        return (
          <Link
            href={`/admin/danhMucChung?search=${encodeURIComponent(parentName)}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-500/20 max-w-[230px] truncate shadow-2xs hover:bg-purple-500/20 transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
            <span className="truncate">{parentName}</span>
          </Link>
        );
      },
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
            title="Chỉnh sửa mục chi tiết"
            className="h-8 w-8 text-muted-foreground hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa mục chi tiết"
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
          <div className="min-w-[680px]">
            <Table<DM_DanhMucChiTiet>
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
          itemName="mục chi tiết"
        />
      </div>
    </div>
  );
};
