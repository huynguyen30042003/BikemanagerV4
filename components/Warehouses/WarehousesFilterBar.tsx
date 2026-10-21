"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface WarehousesFilterBarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export function WarehousesFilterBar({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  activeCount,
  inactiveCount,
  hasActiveFilters,
  onResetFilters,
}: WarehousesFilterBarProps) {
  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm kiếm theo mã kho, tên kho, địa chỉ..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs bg-background/80 rounded-lg"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start sm:self-auto overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => onStatusFilterChange("all")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "all"
                ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tất cả ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("active")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "active"
                ? "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sử dụng ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange("inactive")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === "inactive"
                ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tạm khóa ({inactiveCount})
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs">
          <span className="text-muted-foreground font-medium">Đang lọc:</span>
          {searchInput && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
              Từ khóa: &quot;{searchInput}&quot;
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="hover:text-red-500 cursor-pointer ml-0.5"
              >
                ✕
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer ml-auto"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}

export default WarehousesFilterBar;
