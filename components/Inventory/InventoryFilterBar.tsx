"use client";

import React, { useMemo } from "react";
import {
  Layers,
  RefreshCw,
  Search,
  X,
  Package,
  Receipt,
  History,
  SlidersHorizontal,
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
  // Toàn bộ options cho Kho gồm mục Tất cả
  const allKhoOptions: SelectOption[] = useMemo(() => {
    return [{ value: "", label: "Tất cả kho hàng" }, ...khoOptions];
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
    [totalCount, totalLoChiPhis, totalAllGiaoDichs]
  );

  // Cấu hình các nút lọc cảnh báo tồn kho
  const warningOptions = useMemo(
    () => [
      {
        key: "all" as const,
        label: "Tất cả",
        count: stockItemsCount,
        color: "text-blue-600 dark:text-blue-400",
      },
      {
        key: "low" as const,
        label: "Sắp hết",
        count: lowStockCount,
        color: "text-amber-600 dark:text-amber-400",
      },
      {
        key: "out" as const,
        label: "Hết hàng",
        count: outOfStockCount,
        color: "text-rose-600 dark:text-rose-400",
      },
    ],
    [stockItemsCount, lowStockCount, outOfStockCount]
  );

  // Danh sách các chip bộ lọc đang active
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onClear: () => void }[] = [];

    if (searchInput.trim()) {
      chips.push({
        id: "search",
        label: `Tìm: "${searchInput}"`,
        onClear: () => onSearch(""),
      });
    }

    if (khoFilter) {
      const match = khoOptions.find((k) => k.value === khoFilter);
      chips.push({
        id: "kho",
        label: `Kho: ${match?.label || khoFilter}`,
        onClear: () => setKhoFilter(""),
      });
    }

    if (activeTab === "stock" && warningFilter !== "all") {
      chips.push({
        id: "warning",
        label: `Cảnh báo: ${warningFilter === "low" ? "Sắp hết hàng" : "Hết hàng"}`,
        onClear: () => setWarningFilter("all"),
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
    if (activeTab === "stock") {
      return "Tìm SKU, mã vạch, tên xe, phiên bản...";
    }
    if (activeTab === "costs") {
      return "Tìm mã SKU, số khung, mã lô chi phí...";
    }
    return "Tìm theo mã SKU, số serial, ghi chú...";
  }, [activeTab]);

  return (
    <div className="space-y-4">
      {/* 1. Header & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
            <span>Hệ thống</span>
            <span className="text-muted-foreground/30">/</span>
            <span>Vận hành & Kho</span>
            <span className="text-muted-foreground/30">/</span>
            <span className="text-foreground">Tồn kho & Thẻ kho</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
                Quản Lý Tồn Kho & Thẻ Kho
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                Theo dõi số lượng tồn thực tế, khả dụng bán, định mức an toàn và lịch sử xuất nhập thẻ kho
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
            <span className="text-xs font-medium">Làm mới</span>
          </Button>
        </div>
      </div>

      {/* 2. WarehouseNavTabs */}
      <div className="pt-1">
        <WarehouseNavTabs activeTab="inventory" totalInventory={totalCount} />
      </div>

      {/* 3. Sub-Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-3 overflow-x-auto min-w-0">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
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

      {/* 4. Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9 text-xs bg-background/80"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chọn Kho */}
            <div className="w-full sm:w-64">
              <SearchSelect
                placeholder="Tất cả kho hàng..."
                options={allKhoOptions}
                value={khoFilter}
                onChange={(val) => setKhoFilter(val ? String(val) : "")}
                isLoading={isLoadingKhos}
              />
            </div>
          </div>

          {/* Quick Warning Filter buttons on Stock tab */}
          {activeTab === "stock" && (
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg text-xs self-start md:self-auto flex-wrap">
              {warningOptions.map((opt) => {
                const isSelected = warningFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setWarningFilter(opt.key)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer text-xs ${
                      isSelected
                        ? `bg-background shadow-xs ${opt.color} font-semibold`
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground flex items-center gap-1 font-medium text-[11px] mr-1">
              <SlidersHorizontal className="w-3 h-3" />
              Đang lọc:
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onClear}
                  className="hover:text-blue-900 dark:hover:text-blue-100 p-0.5 rounded-full cursor-pointer transition-colors"
                  title="Gỡ bộ lọc này"
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
