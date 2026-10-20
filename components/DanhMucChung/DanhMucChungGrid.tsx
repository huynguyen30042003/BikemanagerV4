"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FolderOpen, Plus, Layers, ArrowRight, SquarePen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Common/Pagination";
import { DM_DanhMucChung } from "@/types/danhMucChung";

interface DanhMucChungGridProps {
  items: DM_DanhMucChung[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DM_DanhMucChung) => void;
  onDelete: (item: DM_DanhMucChung) => void;
  onOpenCreate: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  searchInput: string;
}

export const DanhMucChungGrid: React.FC<DanhMucChungGridProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  onOpenCreate,
  onResetFilters,
  hasActiveFilters,
  searchInput,
}) => {
  const shouldReduceMotion = useReducedMotion();

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
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer"
            >
              Xóa bộ lọc
            </Button>
          )}
          <Button
            size="sm"
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm danh mục mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
      >
        {items.map((cat: DM_DanhMucChung) => (
          <Card
            key={cat.danhMucID}
            className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between gap-2.5 sm:gap-3"
          >
            <div>
              {/* Top Badges */}
              <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
                <span className="font-mono text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border/60">
                  #{cat.danhMucID}
                </span>

                {cat.trangThai ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Sử dụng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/25">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Khóa
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 hover:text-blue-600 transition-colors">
                {cat.ten}
              </h3>

              {/* Description */}
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">
                {cat.moTa || (
                  <span className="text-muted-foreground/50 italic">
                    Chưa có mô tả chi tiết
                  </span>
                )}
              </p>
            </div>

            {/* Card Bottom Meta & Actions: Tối ưu hàng ngang cân đối cho màn hình 390px */}
            <div className="pt-2.5 sm:pt-3 border-t border-border/60 flex items-center justify-between gap-2">
              <Link
                href={`/admin/danhMucChiTiet?danhMucId=${cat.danhMucID}`}
                title="Xem các mục chi tiết thuộc danh mục này"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20 transition-colors text-xs font-medium truncate max-w-[190px] xs:max-w-[210px] group/link"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">{cat.soLuongChiTiet ?? 0} mục con</span>
                <ArrowRight className="w-3 h-3 text-blue-500 opacity-60 group-hover/link:translate-x-0.5 transition-transform shrink-0 hidden xs:inline" />
              </Link>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onEdit(cat)}
                  title="Chỉnh sửa danh mục"
                  className="h-8 w-8 text-muted-foreground hover:text-blue-600 cursor-pointer"
                >
                  <SquarePen className="w-3.5 h-3.5" />
                </Button>

                <Button
                  variant="outline"
                  size="icon-sm"
                  onClick={() => onDelete(cat)}
                  title="Xóa danh mục"
                  className="h-8 w-8 text-muted-foreground hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

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
  );
};
