"use client";

import React, { useState } from "react";
import { Search, Filter, RefreshCw, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect } from "@/components/ui/selectSearch";

interface StockTransfersFilterBarProps {
  searchInput: string;
  onSearchChange: (val: string) => void;
  khoFilter: string;
  onKhoFilterChange: (val: string) => void;
  statusFilter: number | null;
  onStatusFilterChange: (val: number | null) => void;
  khoOptions: Array<{ value: string; label: string }>;
  isLoadingKhos: boolean;
  transferStatusOptions: Array<{ value: number | string; label: string }>;
  isLoadingStatusList: boolean;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  isFetching: boolean;
  onRefetch: () => void;
  onOpenCreate: () => void;
}

export const StockTransfersFilterBar: React.FC<StockTransfersFilterBarProps> = ({
  searchInput,
  onSearchChange,
  khoFilter,
  onKhoFilterChange,
  statusFilter,
  onStatusFilterChange,
  khoOptions,
  isLoadingKhos,
  transferStatusOptions,
  isLoadingStatusList,
  hasActiveFilters,
  onResetFilters,
  isFetching,
  onRefetch,
  onOpenCreate,
}) => {
  const [localSearch, setLocalSearch] = useState(searchInput);

  // Sync if searchInput resets externally
  React.useEffect(() => {
    setLocalSearch(searchInput);
  }, [searchInput]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearchChange("");
  };

  return (
    <div className="p-3 sm:p-4 rounded-xl border border-border/80 bg-card shadow-xs space-y-3">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Left Side: Search + Dropdowns */}
        <div className="flex flex-1 flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 min-w-[200px] sm:min-w-[240px]"
          >
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Tìm mã phiếu, tài xế, biển số xe..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearchChange(e.target.value);
              }}
              className="pl-9 pr-8 h-9 text-xs bg-background rounded-lg border-border/80 focus-visible:ring-1"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Lọc theo kho */}
          <div className="w-full sm:w-56 shrink-0">
            <SearchSelect
              placeholder="Tất cả kho hàng"
              options={[{ value: "", label: "Tất cả kho hàng" }, ...khoOptions]}
              value={khoFilter}
              onChange={(val) => onKhoFilterChange(val ? String(val) : "")}
              isLoading={isLoadingKhos}
              className="text-xs"
            />
          </div>

          {/* Lọc theo trạng thái */}
          <div className="w-full sm:w-52 shrink-0">
            <SearchSelect
              placeholder="Tất cả trạng thái"
              options={[
                { value: "", label: "Tất cả trạng thái" },
                ...transferStatusOptions.map((opt) => ({
                  value: String(opt.value),
                  label: opt.label,
                })),
              ]}
              value={statusFilter !== null ? String(statusFilter) : ""}
              onChange={(val) =>
                onStatusFilterChange(val ? Number(val) : null)
              }
              isLoading={isLoadingStatusList}
              className="text-xs"
            />
          </div>

          {/* Nút Xóa bộ lọc nếu có filter */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 px-2.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer shrink-0"
              title="Xóa tất cả điều kiện lọc"
            >
              <Filter className="w-3.5 h-3.5 mr-1" />
              Xóa lọc
            </Button>
          )}
        </div>

        {/* Right Side: Refresh + Create CTA */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefetch}
            disabled={isFetching}
            className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs text-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenCreate}
            className="h-9 px-3.5 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium text-xs rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo phiếu chuyển kho</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
