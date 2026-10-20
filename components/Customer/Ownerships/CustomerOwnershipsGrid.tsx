"use client";

import React from "react";
import { FolderOpen, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Common/Pagination";
import { KH_LichSuSoHuuPhuongTien } from "@/types/lichSuSoHuuPhuongTien";
import { CustomerOwnershipCard } from "./CustomerOwnershipCard";

interface CustomerOwnershipsGridProps {
  items: KH_LichSuSoHuuPhuongTien[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onTransfer: (vehicleId: string) => void;
  onOpenTransfer: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const CustomerOwnershipsGrid: React.FC<CustomerOwnershipsGridProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onTransfer,
  onOpenTransfer,
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
          Chưa có bản ghi lịch sử sở hữu nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {hasActiveFilters
            ? "Không tìm thấy dữ liệu nào khớp với bộ lọc tìm kiếm. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
            : "Chưa có lượt sở hữu hoặc sang tên xe nào được ghi nhận."}
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
            onClick={onOpenTransfer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-medium"
          >
            <ArrowRightLeft className="w-4 h-4 mr-1" /> Chuyển quyền / Sang tên
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <CustomerOwnershipCard
            key={item.id}
            item={item}
            index={idx}
            onTransfer={onTransfer}
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
        itemName="lượt sở hữu"
      />
    </div>
  );
};
