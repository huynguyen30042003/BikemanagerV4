"use client";

import React, { useMemo } from "react";
import {
  Boxes,
  Plus,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  X,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";

interface ProductVariantsFilterBarProps {
  totalBienThe: number;
  activeCount: number;
  searchInput: string;
  onSearch: (val: string) => void;
  sanPhamFilter: string;
  onSanPhamFilterChange: (val: string) => void;
  productOptions: SelectOption[];
  isLoadingProducts?: boolean;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onOpenAdd: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProductVariantsFilterBar: React.FC<
  ProductVariantsFilterBarProps
> = ({
  searchInput,
  onSearch,
  sanPhamFilter,
  onSanPhamFilterChange,
  productOptions,
  isLoadingProducts = false,
  viewMode,
  onViewModeChange,
  onOpenAdd,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
  hasActiveFilters,
}) => {
  const filterProductOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả dòng sản phẩm --" },
      ...productOptions,
    ];
  }, [productOptions]);

  const currentProductLabel = useMemo(() => {
    if (!sanPhamFilter) return "";
    const found = productOptions.find(
      (p) => String(p.value) === String(sanPhamFilter),
    );
    return found ? found.label : `Dòng xe #${sanPhamFilter.substring(0, 8)}`;
  }, [sanPhamFilter, productOptions]);

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
              <span className="text-foreground">Biến thể sản phẩm</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Biến thể Sản phẩm & SKU
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý phiên bản màu sắc xe, dung lượng pin, công suất động cơ,
                  mã SKU và định giá bán lẻ / sỉ
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
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm biến thể</span>
            </Button>
          </div>
        </div>

        {/* Product Navigation Tabs */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <ProductNavTabs activeTab="variants" />
        </div>
      </div>

      {/* 2. Multi-Filter Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo mã SKU, tên biến thể hoặc màu sắc..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/90 text-xs sm:text-sm focus-visible:ring-blue-500/20"
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

          <div className="flex items-center gap-2">
            {/* Filter Dòng sản phẩm cha */}
            <div className="flex-1 sm:w-64 sm:flex-initial">
              <SearchSelect
                options={filterProductOptions}
                value={sanPhamFilter}
                onChange={(val) => onSanPhamFilterChange(String(val))}
                placeholder={
                  isLoadingProducts
                    ? "Đang tải sản phẩm..."
                    : "Lọc theo dòng sản phẩm"
                }
                isLoading={isLoadingProducts}
                className="h-9.5 text-xs"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Dạng lưới thẻ"
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
                  aria-label="Xóa bộ lọc từ khóa"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sanPhamFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                <Package className="w-3 h-3 mr-0.5" />
                {currentProductLabel}
                <button
                  type="button"
                  onClick={() => onSanPhamFilterChange("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  aria-label="Xóa bộ lọc dòng sản phẩm"
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
