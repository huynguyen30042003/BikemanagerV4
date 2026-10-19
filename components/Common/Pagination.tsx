"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";

export interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number) => void;
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
  const pageNumbers = showPageNumbers
    ? Array.from({ length: safeTotalPages }, (_, index) => index + 1).filter(
        (p) => p === 1 || p === safeTotalPages || Math.abs(p - page) <= 2
      )
    : [];

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground ${className}`}
    >
      <div className="text-xs">
        Trang <strong className="text-foreground">{page}</strong> /{" "}
        {safeTotalPages} (Tổng{" "}
        <strong className="text-foreground">{totalCount}</strong> {itemName})
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs whitespace-nowrap">Hiển thị:</span>
        <SearchSelect
          options={pageSizeOptions}
          value={pageSize}
          onChange={handleSelectPageSize}
          className="w-22 h-8 text-xs"
        />

        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={handlePrev}
          className="h-8 text-xs cursor-pointer active:scale-95"
        >
          Trước
        </Button>

        {showPageNumbers &&
          pageNumbers.map((p, idx, arr) => {
            const prev = arr[idx - 1];
            return (
              <React.Fragment key={p}>
                {prev && p - prev > 1 && (
                  <span className="px-1 text-muted-foreground text-xs select-none">
                    ...
                  </span>
                )}
                <Button
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 p-0 text-xs cursor-pointer active:scale-95 ${
                    page === p
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-2xs font-semibold"
                      : ""
                  }`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              </React.Fragment>
            );
          })}

        <Button
          variant="outline"
          size="sm"
          disabled={page >= safeTotalPages}
          onClick={handleNext}
          className="h-8 text-xs cursor-pointer active:scale-95"
        >
          Sau
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
