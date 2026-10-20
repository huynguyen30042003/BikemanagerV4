"use client";

import React, { useMemo } from "react";
import {
  Barcode,
  Plus,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  X,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";

interface ProductSerialsFilterBarProps {
  searchInput: string;
  onSearch: (val: string) => void;
  bienTheFilter: string;
  onBienTheFilterChange: (val: string) => void;
  variantOptions: SelectOption[];
  isLoadingVariants?: boolean;
  statusFilter: number | null;
  onStatusFilterChange: (val: number | null) => void;
  serialStatusOptions: SelectOption[];
  isLoadingSerialStatuses?: boolean;
  getSerialStatusLabel: (statusId?: number | null) => string;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onOpenAdd: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProductSerialsFilterBar: React.FC<
  ProductSerialsFilterBarProps
> = ({
  searchInput,
  onSearch,
  bienTheFilter,
  onBienTheFilterChange,
  variantOptions,
  isLoadingVariants = false,
  statusFilter,
  onStatusFilterChange,
  serialStatusOptions,
  isLoadingSerialStatuses = false,
  getSerialStatusLabel,
  viewMode,
  onViewModeChange,
  onOpenAdd,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
  hasActiveFilters,
}) => {
  const filterVariantOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "Tất cả dòng xe & biến thể" },
      ...variantOptions,
    ];
  }, [variantOptions]);

  const filterStatusOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "Tất cả trạng thái serial" },
      ...serialStatusOptions.map((opt) => ({
        value: String(opt.value),
        label: opt.label,
      })),
    ];
  }, [serialStatusOptions]);

  const currentVariantLabel = useMemo(() => {
    if (!bienTheFilter) return "";
    const found = variantOptions.find(
      (v) => String(v.value) === String(bienTheFilter),
    );
    return found ? found.label : `Biến thể #${bienTheFilter.substring(0, 8)}`;
  }, [bienTheFilter, variantOptions]);

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/40">/</span>
              <span>Kinh doanh</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground">Số Serial & Khung Xe</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Barcode className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Số Serial & Khung Máy Pin
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý định danh từng chiếc xe, số khung VIN, số động cơ, khối
                  pin & kích hoạt bảo hành điện tử
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
              />
              <span className="text-xs font-medium hidden xs:inline">
                Làm mới
              </span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenAdd}
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium active:scale-[0.98] transition-transform"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Đăng ký Serial mới</span>
            </Button>
          </div>
        </div>

        {/* Product Navigation Tabs */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <ProductNavTabs activeTab="serials" />
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm mã serial, số khung, số máy, pin, biển số..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 text-xs bg-background/90 focus-visible:ring-blue-500/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Lọc theo Biến thể sản phẩm */}
            <div className="w-full sm:w-64">
              <SearchSelect
                placeholder="Tất cả dòng xe & biến thể"
                options={filterVariantOptions}
                value={bienTheFilter}
                onChange={(val) => {
                  onBienTheFilterChange(val ? String(val) : "");
                }}
                isLoading={isLoadingVariants}
                className="h-9.5 text-xs"
              />
            </div>

            {/* Lọc theo Trạng thái */}
            <div className="w-full sm:w-56">
              <SearchSelect
                placeholder="Tất cả trạng thái serial"
                options={filterStatusOptions}
                value={statusFilter !== null ? String(statusFilter) : ""}
                onChange={(val) => {
                  onStatusFilterChange(val ? Number(val) : null);
                }}
                isLoading={isLoadingSerialStatuses}
                className="h-9.5 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Dạng lưới thẻ tài sản"
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                title="Dạng bảng chi tiết"
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetFilters}
                className="h-9 px-3 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer shrink-0"
              >
                <Filter className="w-3.5 h-3.5 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {searchInput && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Từ khóa: &quot;{searchInput}&quot;
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  aria-label="Xóa từ khóa"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {bienTheFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                {currentVariantLabel}
                <button
                  type="button"
                  onClick={() => onBienTheFilterChange("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  aria-label="Xóa bộ lọc biến thể"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== null && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Trạng thái: {getSerialStatusLabel(statusFilter)}
                <button
                  type="button"
                  onClick={() => onStatusFilterChange(null)}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  aria-label="Xóa bộ lọc trạng thái"
                >
                  <X className="w-3 h-3" />
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
    </div>
  );
};
