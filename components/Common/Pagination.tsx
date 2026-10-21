"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  itemName?: string;
  pageSizeOptions?: SelectOption[];
  className?: string;
  showPageNumbers?: boolean;
}

export function Pagination({
  page,
  totalPages,
  totalCount,
  pageSize,
  setPage,
  setPageSize,
  itemName = "mục",
  pageSizeOptions = [
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
    { value: 50, label: "50" },
    { value: 100, label: "100" },
  ],
  className = "",
  showPageNumbers = true,
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);

  const handlePrev = () => {
    setPage(Math.max(1, page - 1));
  };

  const handleNext = () => {
    setPage(Math.min(safeTotalPages, page + 1));
  };

  const handleSelectPageSize = (val: string | number) => {
    setPageSize(Number(val));
    setPage(1);
  };

  // Generate numbered pages with ellipsis logic
  // Trên desktop: hiển thị khoảng cách +/- 2 trang (tối đa 5 số)
  // Trên mobile (<sm): ẩn các số xa +/- 2 qua CSS (hidden sm:inline-flex) để không tràn viền
  const pageNumbers = showPageNumbers
    ? Array.from({ length: safeTotalPages }, (_, index) => index + 1).filter(
        (p) => p === 1 || p === safeTotalPages || Math.abs(p - page) <= 2,
      )
    : [];

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 pt-3 border-t border-border/70 text-xs text-muted-foreground ${className}`}
    >
      {/* 1. Thông tin trang & Tổng số bản ghi (Mobile: nằm chung hàng với Bộ chọn số lượng) */}
      <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
        <div className="text-[11px] sm:text-xs">
          Trang <strong className="text-foreground">{page}</strong> /{" "}
          <span>{safeTotalPages}</span>{" "}
          <span className="text-muted-foreground/60">•</span> Tổng{" "}
          <strong className="text-foreground">{totalCount}</strong> {itemName}
        </div>

        {/* Bộ chọn số lượng hiển thị trên Mobile (< sm) */}
        <div className="sm:hidden flex items-center">
          <SearchSelect
            options={pageSizeOptions}
            value={pageSize}
            onChange={handleSelectPageSize}
            className="w-[98px] h-8 text-[11px]"
            height={8}
          />
        </div>
      </div>

      {/* 2. Dải điều hướng trang (Desktop: nằm chung 1 hàng với Bộ chọn; Mobile: canh giữa cân xứng) */}
      <div className="flex items-center justify-center sm:justify-end gap-1.5 w-full sm:w-auto">
        {/* Bộ chọn số lượng hiển thị trên Desktop (>= sm) */}
        <div className="hidden sm:flex items-center gap-1.5 mr-1">
          <span className="text-xs whitespace-nowrap text-muted-foreground/80">
            Hiển thị:
          </span>
          <SearchSelect
            options={pageSizeOptions}
            value={pageSize}
            onChange={handleSelectPageSize}
            className="w-24 h-8 text-xs"
            height={8}
          />
        </div>

        {/* Nút Trang Trước */}
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={handlePrev}
          title="Trang trước"
          className="h-8 px-2 sm:px-2.5 text-xs gap-1 border-border/70 hover:bg-muted/70 cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline text-xs font-medium">Trước</span>
        </Button>

        {/* Danh sách các số trang */}
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {pageNumbers.map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const isDistantNeighbor =
                Math.abs(p - page) === 2 && p !== 1 && p !== safeTotalPages;

              return (
                <React.Fragment key={p}>
                  {prev && p - prev > 1 && (
                    <span className="px-0.5 sm:px-1 text-muted-foreground/60 text-xs select-none">
                      ...
                    </span>
                  )}
                  <Button
                    variant={page === p ? "default" : "outline"}
                    size="sm"
                    className={`h-8 min-w-8 p-0 text-xs cursor-pointer active:scale-95 transition-all ${
                      isDistantNeighbor
                        ? "hidden sm:inline-flex"
                        : "inline-flex"
                    } ${
                      page === p
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-2xs font-semibold border-blue-600"
                        : "border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Nút Trang Sau */}
        <Button
          variant="outline"
          size="sm"
          disabled={page >= safeTotalPages}
          onClick={handleNext}
          title="Trang sau"
          className="h-8 px-2 sm:px-2.5 text-xs gap-1 border-border/70 hover:bg-muted/70 cursor-pointer active:scale-95 transition-all shrink-0"
        >
          <span className="hidden xs:inline text-xs font-medium">Sau</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
