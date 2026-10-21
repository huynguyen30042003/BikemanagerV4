"use client";

import React, { useMemo, useState } from "react";
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

export interface ProductSerialsFilterBarProps {
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

interface ActiveFilterChip {
  id: string;
  label: React.ReactNode;
  onRemove: () => void;
  bgClass: string;
  borderClass: string;
  textClass: string;
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Đếm số lượng bộ lọc nâng cao đang áp dụng (ngoài search)
  const activeCount = useMemo(() => {
    let count = 0;
    if (bienTheFilter) count++;
    if (statusFilter !== null) count++;
    return count;
  }, [bienTheFilter, statusFilter]);

  // Danh sách các active filter chips xử lý bằng .map()
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

    if (bienTheFilter) {
      list.push({
        id: "variant",
        label: currentVariantLabel,
        onRemove: () => onBienTheFilterChange(""),
        bgClass: "bg-indigo-500/10",
        borderClass: "border-indigo-500/20",
        textClass: "text-indigo-700 dark:text-indigo-300",
      });
    }

    if (statusFilter !== null) {
      list.push({
        id: "status",
        label: `Trạng thái: ${getSerialStatusLabel(statusFilter)}`,
        onRemove: () => onStatusFilterChange(null),
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/20",
        textClass: "text-blue-700 dark:text-blue-300",
      });
    }

    return list;
  }, [
    searchInput,
    bienTheFilter,
    currentVariantLabel,
    statusFilter,
    getSerialStatusLabel,
    onSearch,
    onBienTheFilterChange,
    onStatusFilterChange,
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
              <span className="text-foreground">Số Serial & Khung Xe</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Barcode className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Số Serial & Khung Máy Pin
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý định danh từng chiếc xe, số khung VIN, số động cơ,
                  khối pin & kích hoạt bảo hành điện tử
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
              className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium active:scale-[0.98] transition-transform flex-1 sm:flex-initial justify-center"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Đăng ký Serial mới</span>
            </Button>
          </div>
        </div>

        {/* Product Navigation Tabs */}
        <div className="pt-1 max-w-full">
          <ProductNavTabs activeTab="serials" />
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 sm:p-3.5 shadow-xs space-y-3">
        {/* MOBILE/TABLET VIEW (lg:hidden) */}
        <div className="lg:hidden space-y-2">
          {/* Search Input Full Width */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm mã serial, số khung, số máy, pin..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 text-xs bg-background/90 focus-visible:ring-blue-500/20 w-full"
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

          {/* Quick Toolbar row */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`h-8.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer border-border/80 transition-colors ${
                activeCount > 0
                  ? "border-blue-500/50 bg-blue-50/50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              )}
              <span>Bộ lọc</span>
              {activeCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-blue-600 text-white dark:bg-blue-500 text-[10px] flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </Button>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Dạng lưới thẻ tài sản"
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
          </div>

          {/* Collapsible Filter Panel on Mobile */}
          {isMobileMenuOpen && (
            <div className="p-3 bg-muted/30 rounded-xl border border-border/80 space-y-3 mt-2 animate-in fade-in-50 slide-in-from-top-1">
              <div className="flex items-center justify-between pb-1 border-b border-border/60">
                <span className="text-xs font-semibold text-foreground">
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

              {/* Lọc theo Biến thể sản phẩm */}
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                  Dòng xe & Biến thể:
                </label>
                <SearchSelect
                  placeholder="Tất cả dòng xe & biến thể"
                  options={filterVariantOptions}
                  value={bienTheFilter}
                  onChange={(val) => {
                    onBienTheFilterChange(val ? String(val) : "");
                  }}
                  isLoading={isLoadingVariants}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Lọc theo Trạng thái serial */}
              <div>
                <label className="text-[11px] font-medium text-muted-foreground mb-1 block">
                  Trạng thái serial:
                </label>
                <SearchSelect
                  placeholder="Tất cả trạng thái serial"
                  options={filterStatusOptions}
                  value={statusFilter !== null ? String(statusFilter) : ""}
                  onChange={(val) => {
                    onStatusFilterChange(val ? Number(val) : null);
                  }}
                  isLoading={isLoadingSerialStatuses}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP VIEW (hidden lg:flex) */}
        <div className="hidden lg:flex items-center justify-between gap-2.5 w-full">
          <div className="flex flex-1 items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm mã serial, số khung, số máy, pin..."
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
            <div className="w-64">
              <SearchSelect
                placeholder="Tất cả dòng xe & biến thể"
                options={filterVariantOptions}
                value={bienTheFilter}
                onChange={(val) => {
                  onBienTheFilterChange(val ? String(val) : "");
                }}
                isLoading={isLoadingVariants}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Lọc theo Trạng thái */}
            <div className="w-56">
              <SearchSelect
                placeholder="Tất cả trạng thái serial"
                options={filterStatusOptions}
                value={statusFilter !== null ? String(statusFilter) : ""}
                onChange={(val) => {
                  onStatusFilterChange(val ? Number(val) : null);
                }}
                isLoading={isLoadingSerialStatuses}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
export default ProductSerialsFilterBar;
