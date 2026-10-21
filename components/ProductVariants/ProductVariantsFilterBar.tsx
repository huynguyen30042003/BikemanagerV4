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
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";

export interface ProductVariantsFilterBarProps {
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

interface ActiveFilterChip {
  id: string;
  label: React.ReactNode;
  onRemove: () => void;
  bgClass: string;
  borderClass: string;
  textClass: string;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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

  // Active filter chips dùng .map()
  const activeChips: ActiveFilterChip[] = useMemo(() => {
    const list: ActiveFilterChip[] = [];

    if (searchInput) {
      list.push({
        id: "search",
        label: `Từ khóa: "${searchInput}"`,
        onRemove: () => onSearch(""),
        bgClass: "bg-muted",
        borderClass: "border-border/60",
        textClass: "text-foreground",
      });
    }

    if (sanPhamFilter) {
      list.push({
        id: "product",
        label: (
          <span className="flex items-center gap-1">
            <Package className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[200px]">
              {currentProductLabel}
            </span>
          </span>
        ),
        onRemove: () => onSanPhamFilterChange(""),
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/20",
        textClass: "text-blue-700 dark:text-blue-300",
      });
    }

    return list;
  }, [
    searchInput,
    sanPhamFilter,
    currentProductLabel,
    onSearch,
    onSanPhamFilterChange,
  ]);

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70 mb-2 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-1 flex-wrap">
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
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Biến thể Sản phẩm & SKU
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý phiên bản màu sắc xe, dung lượng pin, công suất động
                  cơ, mã SKU và định giá bán lẻ / sỉ
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs flex-1 sm:flex-initial justify-center"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
              />
              <span className="text-xs font-medium">Làm mới</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenAdd}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium flex-1 sm:flex-initial justify-center"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm biến thể</span>
            </Button>
          </div>
        </div>

        {/* Product Navigation Tabs */}
        <div className="pt-1 max-w-full">
          <ProductNavTabs activeTab="variants" />
        </div>
      </div>

      {/* 2. Multi-Filter Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo mã SKU, tên biến thể hoặc màu sắc..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/90 text-sm focus-visible:ring-blue-500/20"
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

          {/* Dòng điều khiển: Nút mở bộ lọc + Chuyển đổi View + Tải lại */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="h-8.5 px-3 gap-1.5 text-xs font-medium border-border/80 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Filter className="w-3.5 h-3.5" />
              )}
              <span>Bộ lọc</span>
              {sanPhamFilter && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  1
                </span>
              )}
            </Button>

            {/* View Mode Switcher on Mobile */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onViewModeChange("grid")}
                  title="Dạng lưới thẻ"
                  className={`flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-background text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("table")}
                  title="Dạng bảng chi tiết"
                  className={`flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-background text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isFetching || isLoadingKPI}
                title="Tải lại dữ liệu"
                className="h-8.5 w-8.5 cursor-pointer shadow-2xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isFetching || isLoadingKPI
                      ? "animate-spin text-blue-500"
                      : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* KHUNG BỘ LỌC CHI TIẾT KHI MÀN HÌNH NHỎ (Thu gọn / Mở rộng) */}
          {isMobileMenuOpen && (
            <div className="flex flex-col gap-3 p-3 rounded-xl bg-muted/40 border border-border/70 animate-in fade-in-50 slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-border/40">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Bộ lọc chi tiết
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              {/* Lọc theo Dòng sản phẩm cha */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Dòng sản phẩm
                </label>
                <SearchSelect
                  options={filterProductOptions}
                  value={sanPhamFilter}
                  onChange={(val) => onSanPhamFilterChange(String(val))}
                  placeholder={
                    isLoadingProducts
                      ? "Đang tải sản phẩm..."
                      : "Tất cả dòng sản phẩm..."
                  }
                  isLoading={isLoadingProducts}
                  className="h-9 text-xs w-full"
                  height={9}
                />
              </div>
            </div>
          )}
        </div>

        {/* === GIAO DIỆN MÀN HÌNH LỚN (Desktop >= lg) === */}
        <div className="hidden lg:flex items-center justify-between gap-2.5 w-full">
          {/* Left: Search Input & Product dropdown */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo mã SKU, tên biến thể hoặc màu sắc..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 w-full bg-background/90 text-sm focus-visible:ring-blue-500/20"
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

            <div className="w-64 shrink-0">
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
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Right: View Mode & Reload */}
          <div className="flex items-center gap-2 shrink-0">
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

            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              title="Tải lại dữ liệu"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Active Filter Chips (.map() based) */}
        {hasActiveFilters && activeChips.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${chip.bgClass} ${chip.borderClass} ${chip.textClass}`}
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-rose-500 cursor-pointer ml-0.5"
                  aria-label={`Xóa bộ lọc ${chip.id}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
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
export default ProductVariantsFilterBar;
