"use client";

import React, { useMemo, useState } from "react";
import {
  Layers,
  RefreshCw,
  Search,
  Filter,
  X,
  Package,
  Receipt,
  History,
  Warehouse,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";

export interface InventoryFilterBarProps {
  totalCount: number;
  activeTab: "stock" | "costs" | "transactions";
  setActiveTab: (tab: "stock" | "costs" | "transactions") => void;
  totalLoChiPhis: number;
  totalAllGiaoDichs: number;
  searchInput: string;
  onSearch: (val: string) => void;
  khoFilter: string;
  setKhoFilter: (val: string) => void;
  khoOptions: SelectOption[];
  isLoadingKhos: boolean;
  warningFilter: "all" | "low" | "out";
  setWarningFilter: (val: "all" | "low" | "out") => void;
  lowStockCount: number;
  outOfStockCount: number;
  stockItemsCount: number;
  isFetching: boolean;
  onRefresh: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

interface ActiveChip {
  key: string;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  onRemove: () => void;
}

export const InventoryFilterBar: React.FC<InventoryFilterBarProps> = ({
  totalCount,
  activeTab,
  setActiveTab,
  totalLoChiPhis,
  totalAllGiaoDichs,
  searchInput,
  onSearch,
  khoFilter,
  setKhoFilter,
  khoOptions,
  isLoadingKhos,
  warningFilter,
  setWarningFilter,
  lowStockCount,
  outOfStockCount,
  stockItemsCount,
  isFetching,
  onRefresh,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toàn bộ options cho Kho gồm mục Tất cả
  const allKhoOptions: SelectOption[] = useMemo(() => {
    return [{ value: "", label: "-- Tất cả kho hàng --" }, ...khoOptions];
  }, [khoOptions]);

  // Cấu hình các sub-tabs
  const subTabs = useMemo(
    () => [
      {
        key: "stock" as const,
        label: "Tồn kho thực tế",
        icon: Package,
        count: totalCount,
      },
      {
        key: "costs" as const,
        label: "Lô chi phí & Giá vốn",
        icon: Receipt,
        count: totalLoChiPhis,
      },
      {
        key: "transactions" as const,
        label: "Sổ giao dịch biến động",
        icon: History,
        count: totalAllGiaoDichs,
      },
    ],
    [totalCount, totalLoChiPhis, totalAllGiaoDichs],
  );

  // Cấu hình các nút lọc cảnh báo tồn kho
  const warningOptions = useMemo(
    () => [
      {
        key: "all" as const,
        label: "Tất cả",
        count: stockItemsCount,
        color: "text-blue-600 dark:text-blue-400 font-semibold",
      },
      {
        key: "low" as const,
        label: "Sắp hết",
        count: lowStockCount,
        color: "text-amber-600 dark:text-amber-400 font-semibold",
      },
      {
        key: "out" as const,
        label: "Hết hàng",
        count: outOfStockCount,
        color: "text-rose-600 dark:text-rose-400 font-semibold",
      },
    ],
    [stockItemsCount, lowStockCount, outOfStockCount],
  );

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    if (khoFilter) count++;
    if (activeTab === "stock" && warningFilter !== "all") count++;
    return count;
  }, [khoFilter, activeTab, warningFilter]);

  // Danh sách các chip bộ lọc đang active (.map based)
  const activeChips: ActiveChip[] = useMemo(() => {
    const chips: ActiveChip[] = [];

    if (searchInput.trim()) {
      chips.push({
        key: "search",
        label: `Từ khóa: "${searchInput}"`,
        icon: Search,
        colorClass: "bg-muted text-foreground border-border/60",
        onRemove: () => onSearch(""),
      });
    }

    if (khoFilter) {
      const match = khoOptions.find((k) => k.value === khoFilter);
      chips.push({
        key: "kho",
        label: `Kho: ${match?.label || khoFilter}`,
        icon: Warehouse,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => setKhoFilter(""),
      });
    }

    if (activeTab === "stock" && warningFilter !== "all") {
      chips.push({
        key: "warning",
        label: `Cảnh báo: ${
          warningFilter === "low" ? "Sắp hết hàng" : "Hết hàng"
        }`,
        icon: AlertTriangle,
        colorClass:
          warningFilter === "low"
            ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
            : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
        onRemove: () => setWarningFilter("all"),
      });
    }

    return chips;
  }, [
    searchInput,
    khoFilter,
    warningFilter,
    activeTab,
    khoOptions,
    onSearch,
    setKhoFilter,
    setWarningFilter,
  ]);

  const searchPlaceholder = useMemo(() => {
    if (activeTab === "stock")
      return "Tìm theo tên sản phẩm, mã SKU, màu sắc...";
    if (activeTab === "costs")
      return "Tìm theo mã lô chi phí, mã phiếu nhập, nhà cung cấp...";
    return "Tìm theo mã giao dịch, số chứng từ, serial...";
  }, [activeTab]);

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
              <span>Kho & Vận hành</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Tồn kho & Thẻ kho</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Quản Lý Tồn Kho & Thẻ Kho
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Theo dõi số lượng tồn thực tế, khả dụng bán, định mức an toàn và lịch sử xuất nhập thẻ kho
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              title="Tải lại dữ liệu kho"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
              <span className="text-xs font-medium xs:hidden">Reload</span>
            </Button>
          </div>
        </div>

        {/* Warehouse Navigation Tabs */}
        <div className="pt-1 max-w-full">
          <WarehouseNavTabs activeTab="inventory" totalInventory={totalCount} />
        </div>
      </div>

      {/* 2. Sub-Tab Switcher (Cuộn mượt không vỡ layout) */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3 overflow-x-auto no-scrollbar scroll-smooth min-w-0">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                isSelected
                  ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20"
                  : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Filter Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 text-xs bg-background/80 w-full"
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

          {/* Dòng điều khiển: Nút mở bộ lọc + Tải lại */}
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
              {activeCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {activeCount}
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isFetching}
              title="Tải lại dữ liệu"
              className="h-8.5 w-8.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
              />
            </Button>
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

              {/* Lọc theo Kho */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Kho hàng
                </label>
                <SearchSelect
                  placeholder="Tất cả kho hàng..."
                  options={allKhoOptions}
                  value={khoFilter}
                  onChange={(val) => setKhoFilter(val ? String(val) : "")}
                  isLoading={isLoadingKhos}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Lọc cảnh báo nếu ở tab tồn kho */}
              {activeTab === "stock" && (
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    Cảnh báo mức tồn
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs">
                    {warningOptions.map((opt) => {
                      const isSelected = warningFilter === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => setWarningFilter(opt.key)}
                          className={`px-2 py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                            isSelected
                              ? `bg-card shadow-xs ${opt.color}`
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {opt.label} ({opt.count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* === GIAO DIỆN MÀN HÌNH LỚN (Desktop >= lg) === */}
        <div className="hidden lg:flex items-center justify-between gap-2.5 w-full">
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 text-xs bg-background/80 w-full"
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

            {/* Chọn Kho */}
            <div className="w-60 shrink-0">
              <SearchSelect
                placeholder="Tất cả kho hàng..."
                options={allKhoOptions}
                value={khoFilter}
                onChange={(val) => setKhoFilter(val ? String(val) : "")}
                isLoading={isLoadingKhos}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Right: Quick Warning Filter buttons & Reload */}
          <div className="flex items-center gap-2 shrink-0">
            {activeTab === "stock" && (
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
                <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
                {warningOptions.map((opt) => {
                  const isSelected = warningFilter === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setWarningFilter(opt.key)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                        isSelected
                          ? `bg-background shadow-xs ${opt.color}`
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label} ({opt.count})
                    </button>
                  );
                })}
              </div>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isFetching}
              title="Tải lại dữ liệu"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
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

export default InventoryFilterBar;
