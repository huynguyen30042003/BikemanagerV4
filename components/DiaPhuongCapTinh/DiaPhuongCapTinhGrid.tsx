"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Common/Pagination";
import { DM_DiaPhuongCapTinh } from "@/types/diaPhuongCapTinh";
import { DiaPhuongCapTinhCard } from "./DiaPhuongCapTinhCard";

export interface DiaPhuongCapTinhGridProps {
  items: DM_DiaPhuongCapTinh[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DM_DiaPhuongCapTinh) => void;
  onDelete: (item: DM_DiaPhuongCapTinh) => void;
  onOpenCreate: () => void;
  onSync: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  searchInput: string;
}

export const DiaPhuongCapTinhGrid: React.FC<DiaPhuongCapTinhGridProps> = ({
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
  onSync,
  onResetFilters,
  hasActiveFilters,
  searchInput: _searchInput,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-8 sm:p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <p className="font-semibold text-base text-foreground">
          Không tìm thấy tỉnh / thành phố nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {hasActiveFilters
            ? "Không có kết quả khớp với bộ lọc hiện tại. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
            : "Chưa có dữ liệu tỉnh / thành phố nào trong hệ thống. Hãy thêm mới hoặc nhấn Đồng bộ chuẩn!"}
        </p>
        <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
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
            variant="outline"
            size="sm"
            onClick={onSync}
            className="cursor-pointer"
          >
            Đồng bộ ngay
          </Button>
          <Button
            size="sm"
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm tỉnh mới
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4"
      >
        {items.map((loc, index) => (
          <DiaPhuongCapTinhCard
            key={loc.tinhID}
            item={loc}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </motion.div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        itemName="tỉnh/thành"
      />
    </div>
  );
};
