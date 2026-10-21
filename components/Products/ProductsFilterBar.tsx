"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  RefreshCw,
  Search,
  Filter,
  LayoutGrid,
  List,
  X,
  Tags,
  FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";

export interface ProductsFilterBarProps {
  totalSanPham: number;
  activeCount: number;
  inactiveCount: number;
  searchInput: string;
  onSearch: (val: string) => void;
  brandFilter: string;
  onBrandFilterChange: (val: string) => void;
  brandOptions: SelectOption[];
  isLoadingBrands?: boolean;
  categoryFilter: string | number;
  onCategoryFilterChange: (val: string | number) => void;
  categoryOptions: SelectOption[];
  isLoadingCategories?: boolean;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onOpenAdd: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

interface ActiveChip {
  key: string;
  label: React.ReactNode;
  icon: React.ElementType;
  colorClass: string;
  onRemove: () => void;
}

export const ProductsFilterBar: React.FC<ProductsFilterBarProps> = ({
  totalSanPham,
  activeCount,
  inactiveCount,
  searchInput,
  onSearch,
  brandFilter,
  onBrandFilterChange,
  brandOptions,
  isLoadingBrands = false,
  categoryFilter,
  onCategoryFilterChange,
  categoryOptions,
  isLoadingCategories = false,
  statusFilter,
  onStatusFilterChange,
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

  // Status Filter Definitions mapped via .map()
  const statusOptions = useMemo(
    () => [
      {
        key: "all",
        label: "Tất cả",
        count: totalSanPham,
        activeColor: "text-blue-600 dark:text-blue-400 font-semibold",
      },
      {
        key: "active",
        label: "Kinh doanh",
        count: activeCount,
        activeColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
      },
      {
        key: "inactive",
        label: "Khóa",
        count: inactiveCount,
        activeColor: "text-slate-700 dark:text-slate-300 font-semibold",
      },
    ],
    [totalSanPham, activeCount, inactiveCount],
  );

  // View Mode Definitions mapped via .map()
  const viewModeOptions = useMemo(
    () => [
      {
        key: "grid" as const,
        label: "Lưới thẻ",
        icon: LayoutGrid,
        title: "Chế độ xem lưới",
      },
      {
        key: "table" as const,
        label: "Bảng dữ liệu",
        icon: List,
        title: "Chế độ xem bảng",
      },
    ],
    [],
  );

  const filterBrandOptions: SelectOption[] = useMemo(() => {
    return [{ value: "", label: "-- Tất cả thương hiệu --" }, ...brandOptions];
  }, [brandOptions]);

  const filterCategoryOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả ngành hàng --" },
      ...categoryOptions,
    ];
  }, [categoryOptions]);

  const currentBrandLabel = useMemo(() => {
    if (!brandFilter) return "";
    const found = brandOptions.find(
      (b) => String(b.value) === String(brandFilter),
    );
    return found ? found.label : `Hãng #${brandFilter.substring(0, 8)}`;
  }, [brandFilter, brandOptions]);

  const currentCategoryLabel = useMemo(() => {
    if (!categoryFilter) return "";
    const found = categoryOptions.find(
      (c) => String(c.value) === String(categoryFilter),
    );
    return found ? found.label : `Ngành #${categoryFilter}`;
  }, [categoryFilter, categoryOptions]);

  // Active filter chips dùng .map()
  const activeChips: ActiveChip[] = useMemo(() => {
    const list: ActiveChip[] = [];

    if (searchInput) {
      list.push({
        key: "search",
        label: `Từ khóa: "${searchInput}"`,
        icon: Search,
        colorClass: "bg-muted text-foreground border-border/60",
        onRemove: () => onSearch(""),
      });
    }

    if (brandFilter) {
      list.push({
        key: "brand",
        label: (
          <span className="flex items-center gap-1">
            <span className="truncate max-w-[160px]">
              Hãng: {currentBrandLabel}
            </span>
          </span>
        ),
        icon: Tags,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onBrandFilterChange(""),
      });
    }

    if (categoryFilter) {
      list.push({
        key: "category",
        label: (
          <span className="flex items-center gap-1">
            <span className="truncate max-w-[160px]">
              Ngành: {currentCategoryLabel}
            </span>
          </span>
        ),
        icon: FolderTree,
        colorClass:
          "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        onRemove: () => onCategoryFilterChange(""),
      });
    }

    if (statusFilter !== "all") {
      list.push({
        key: "status",
        label: `Trạng thái: ${statusFilter === "active" ? "Kinh doanh" : "Tạm khóa"}`,
        icon: Filter,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onStatusFilterChange("all"),
      });
    }

    return list;
  }, [
    searchInput,
    brandFilter,
    currentBrandLabel,
    categoryFilter,
    currentCategoryLabel,
    statusFilter,
    onSearch,
    onBrandFilterChange,
    onCategoryFilterChange,
    onStatusFilterChange,
  ]);

  const mobileFilterCount =
    (brandFilter ? 1 : 0) +
    (categoryFilter ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1 flex-wrap">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Kinh doanh</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Sản phẩm</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Package className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Sản phẩm & Dòng xe điện
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Hồ sơ phương tiện, xe máy điện, pin ắc quy và phụ tùng thay thế chính hãng
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              title="Tải lại dữ liệu sản phẩm"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
              />
              <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
              <span className="text-xs font-medium xs:hidden">Reload</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenAdd}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm sản phẩm</span>
            </Button>
          </div>
        </div>

        {/* Product Navigation Tabs */}
        <div className="pt-1 max-w-full">
          <ProductNavTabs activeTab="products" />
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
              placeholder="Tìm theo tên sản phẩm, mã hoặc slug..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/90 text-sm focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
              >
                ✕
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
              {mobileFilterCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {mobileFilterCount}
                </span>
              )}
            </Button>

            {/* View Switcher on mobile via .map() */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shadow-2xs">
                {viewModeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = viewMode === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onViewModeChange(opt.key)}
                      title={opt.title}
                      className={`flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer ${
                        isActive
                          ? "bg-background text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
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
                    isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
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

              {/* Lọc theo Thương hiệu */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Hãng sản xuất / Thương hiệu
                </label>
                <SearchSelect
                  options={filterBrandOptions}
                  value={brandFilter}
                  onChange={(val) => onBrandFilterChange(String(val))}
                  placeholder={
                    isLoadingBrands ? "Đang tải hãng..." : "Tất cả thương hiệu..."
                  }
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Lọc theo Ngành hàng */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Ngành hàng / Danh mục
                </label>
                <SearchSelect
                  options={filterCategoryOptions}
                  value={categoryFilter}
                  onChange={(val) => onCategoryFilterChange(val ? Number(val) : "")}
                  placeholder={
                    isLoadingCategories
                      ? "Đang tải ngành..."
                      : "Tất cả ngành hàng..."
                  }
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Lọc theo trạng thái */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái kinh doanh
                </label>
                <div className="grid grid-cols-3 gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs">
                  {statusOptions.map((opt) => {
                    const isActive = statusFilter === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => onStatusFilterChange(opt.key)}
                        className={`px-2 py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                          isActive
                            ? `bg-card shadow-xs ${opt.activeColor}`
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label} ({opt.count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* === GIAO DIỆN MÀN HÌNH LỚN (Desktop >= lg) === */}
        <div className="hidden lg:flex items-center justify-between gap-2.5 w-full">
          {/* Left: Search & Select dropdowns */}
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo tên sản phẩm, mã hoặc slug..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 w-full bg-background/90 text-sm focus-visible:ring-blue-500/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Thương hiệu */}
            <div className="w-48 shrink-0">
              <SearchSelect
                options={filterBrandOptions}
                value={brandFilter}
                onChange={(val) => onBrandFilterChange(String(val))}
                placeholder={
                  isLoadingBrands ? "Đang tải hãng..." : "Lọc thương hiệu..."
                }
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Filter Ngành hàng */}
            <div className="w-48 shrink-0">
              <SearchSelect
                options={filterCategoryOptions}
                value={categoryFilter}
                onChange={(val) =>
                  onCategoryFilterChange(val ? Number(val) : "")
                }
                placeholder={
                  isLoadingCategories
                    ? "Đang tải ngành..."
                    : "Lọc ngành hàng..."
                }
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Right: Dải bộ lọc trạng thái & View Mode Switcher & Reload */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Status Filter Segment via .map() */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
              {statusOptions.map((opt) => {
                const isActive = statusFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onStatusFilterChange(opt.key)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      isActive
                        ? `bg-background shadow-xs ${opt.activeColor}`
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                );
              })}
            </div>

            {/* Desktop View Switcher via .map() */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              {viewModeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = viewMode === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onViewModeChange(opt.key)}
                    title={opt.title}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                      isActive
                        ? "bg-background text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
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

        {/* Active Filter Chips via .map() */}
        {hasActiveFilters && activeChips.length > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {activeChips.map((chip) => {
              const Icon = chip.icon;
              return (
                <span
                  key={chip.key}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${chip.colorClass}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="hover:text-red-500 cursor-pointer ml-0.5"
                    title="Xóa tiêu chí này"
                  >
                    ✕
                  </button>
                </span>
              );
            })}
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

export default ProductsFilterBar;
