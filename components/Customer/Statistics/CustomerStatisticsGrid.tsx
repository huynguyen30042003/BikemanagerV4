"use client";

import React from "react";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Common/Pagination";
import { KH_ThongKeKhachHang } from "@/types/thongKeKhachHang";
import { CustomerStatisticCard } from "./CustomerStatisticCard";

interface CustomerStatisticsGridProps {
  items: KH_ThongKeKhachHang[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: KH_ThongKeKhachHang) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const CustomerStatisticsGrid: React.FC<CustomerStatisticsGridProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onResetFilters,
  hasActiveFilters,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <p className="font-semibold text-base text-foreground">
          Chưa có hồ sơ thống kê nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {hasActiveFilters
            ? "Không tìm thấy dữ liệu nào khớp với bộ lọc tìm kiếm. Hãy thử điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
            : "Chưa có thông số tích lũy khách hàng nào được ghi nhận."}
        </p>
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer text-xs"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <CustomerStatisticCard
            key={item.khachHangID}
            item={item}
            index={idx}
            onEdit={onEdit}
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
        itemName="hồ sơ"
      />
    </div>
  );
};
