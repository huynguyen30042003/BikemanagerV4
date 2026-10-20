"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Common/Pagination";
import { DM_DanhMucChiTiet } from "@/types/danhMucChiTiet";
import { DanhMucChiTietCard } from "./DanhMucChiTietCard";

export interface DanhMucChiTietGridProps {
  items: DM_DanhMucChiTiet[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DM_DanhMucChiTiet) => void;
  onDelete: (item: DM_DanhMucChiTiet) => void;
  onOpenCreate: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  searchInput: string;
  parentCategoryMap: Map<number, string>;
}

export const DanhMucChiTietGrid: React.FC<DanhMucChiTietGridProps> = ({
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
  parentCategoryMap,
}) => {
  const shouldReduceMotion = useReducedMotion();

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
            className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer font-medium"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm mục chi tiết mới
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
        {items.map((item, index) => (
          <DanhMucChiTietCard
            key={item.danhMucChiTietID}
            item={item}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            parentCategoryMap={parentCategoryMap}
          />
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
        itemName="mục chi tiết"
      />
    </div>
  );
};
