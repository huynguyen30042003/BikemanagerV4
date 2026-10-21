"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/ui/selectSearch";

interface SuppliersFilterBarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  countryOptions: Array<{ value: number | string; label: string }>;
  isLoadingCountries?: boolean;
  quocGiaFilter: string;
  onQuocGiaFilterChange: (val: string) => void;
  coCongNoFilter: string;
  onCoCongNoFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFiltered?: number;
}

export function SuppliersFilterBar({
  searchInput,
  onSearchChange,
  countryOptions,
  isLoadingCountries = false,
  quocGiaFilter,
  onQuocGiaFilterChange,
  coCongNoFilter,
  onCoCongNoFilterChange,
  statusFilter,
  onStatusFilterChange,
  onResetFilters,
  hasActiveFilters,
}: SuppliersFilterBarProps) {
  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-1 gap-2.5 items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm mã NCC, tên nhà cung cấp, SĐT, MST, người LH..."
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

          {/* Lọc theo Quốc gia */}
          <div className="w-full lg:w-48">
            <SearchSelect
              placeholder="Tất cả quốc gia..."
              options={[{ value: "", label: "Tất cả quốc gia" }, ...countryOptions]}
              value={quocGiaFilter}
              onChange={(val) => onQuocGiaFilterChange(val ? String(val) : "")}
              isLoading={isLoadingCountries}
              height={9}
            />
          </div>

          {/* Lọc theo Công nợ */}
          <div className="w-full lg:w-44">
            <SearchSelect
              placeholder="Trạng thái nợ..."
              options={[
                { value: "all", label: "Tất cả công nợ" },
                { value: "hasDebt", label: "Có công nợ (>0)" },
                { value: "noDebt", label: "Đã hết nợ (=0)" },
              ]}
              value={coCongNoFilter}
              onChange={(val) => onCoCongNoFilterChange(String(val) || "all")}
              height={9}
            />
          </div>

          {/* Lọc theo Trạng thái hoạt động */}
          <div className="w-full lg:w-44">
            <SearchSelect
              placeholder="Trạng thái..."
              options={[
                { value: "all", label: "Tất cả trạng thái" },
                { value: "active", label: "Đang giao dịch" },
                { value: "inactive", label: "Tạm ngưng" },
              ]}
              value={statusFilter}
              onChange={(val) => onStatusFilterChange(String(val) || "all")}
              height={9}
            />
          </div>
        </div>

        {/* Nút Xóa bộ lọc */}
        {hasActiveFilters && (
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
            >
              <Filter className="w-3.5 h-3.5 mr-1" />
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuppliersFilterBar;
