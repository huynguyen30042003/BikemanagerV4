"use client";

import React from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Common/Pagination";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import { BrandCard } from "./BrandCard";

interface BrandsGridProps {
  items: SP_ThuongHieu[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: SP_ThuongHieu) => void;
  onDelete: (item: SP_ThuongHieu) => void;
  onOpenAdd: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const BrandsGrid: React.FC<BrandsGridProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  onOpenAdd,
  onResetFilters,
  hasActiveFilters,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h2 className="font-semibold text-base text-foreground">
          Không tìm thấy thương hiệu phù hợp
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          {hasActiveFilters
            ? "Không có kết quả nào tương ứng với điều kiện tìm kiếm hoặc bộ lọc hiện tại."
            : "Chưa có thương hiệu nào được tạo trong hệ thống."}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer"
            >
              Đặt lại bộ lọc
            </Button>
          )}
          <Button
            size="sm"
            onClick={onOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm thương hiệu mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((brand, idx) => (
          <BrandCard
            key={brand.thuongHieuID}
            brand={brand}
            index={idx}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination Controls */}
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
  );
};
