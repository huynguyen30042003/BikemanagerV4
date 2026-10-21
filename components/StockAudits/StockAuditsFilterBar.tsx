"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  RefreshCw,
  Plus,
  Filter,
  Warehouse,
  RotateCcw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";

interface ActiveChip {
  key: string;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  onRemove: () => void;
}

interface StockAuditsFilterBarProps {
  searchInput: string;
  onSearchInputChange: (val: string) => void;
  onSearchSubmit: (val: string) => void;
  khoFilter: string;
  onKhoFilterChange: (val: string) => void;
  khoOptions: SelectOption[];
  isLoadingKhos: boolean;
  statusFilter: number | null;
  onStatusFilterChange: (val: number | null) => void;
  statusOptions: SelectOption[];
  isLoadingStatuses?: boolean;
  totalAudits?: number;
  inProgressCount?: number;
  balancedCount?: number;
  currentKhoName?: string;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  onOpenCreate: () => void;
}

export const StockAuditsFilterBar: React.FC<StockAuditsFilterBarProps> = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  khoFilter,
  onKhoFilterChange,
  khoOptions,
  isLoadingKhos,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  isLoadingStatuses = false,
  totalAudits,
  inProgressCount,
  balancedCount,
  currentKhoName,
  hasActiveFilters,
  onResetFilters,
  onRefresh,
  isFetching,
  onOpenCreate,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearchSubmit(searchInput);
    }
  };

  const fullKhoOptions: SelectOption[] = useMemo(
    () => [{ value: "", label: "Tất cả kho hàng" }, ...khoOptions],
    [khoOptions]
  );

  // Status pills configuration similar to DanhMucChiTiet
  const statusButtonList = useMemo(() => {
    const list = [
      {
        key: null as number | null,
        label: "Tất cả",
        count: totalAudits,
        activeColor: "text-blue-600 dark:text-blue-400 font-semibold",
      },
    ];

    statusOptions.forEach((opt) => {
      const numVal = Number(opt.value);
      const isProgress = numVal === 26 || numVal === 1;
      const isBalanced = numVal === 27 || numVal === 2;

      list.push({
        key: numVal,
        label: opt.label,
        count: isProgress ? inProgressCount : isBalanced ? balancedCount : undefined,
        activeColor: isProgress
          ? "text-amber-600 dark:text-amber-400 font-semibold"
          : isBalanced
          ? "text-emerald-600 dark:text-emerald-400 font-semibold"
          : "text-rose-600 dark:text-rose-400 font-semibold",
      });
    });

    return list;
  }, [totalAudits, inProgressCount, balancedCount, statusOptions]);

  // Active filter chips
  const activeChips: ActiveChip[] = useMemo(() => {
    const chips: ActiveChip[] = [];

    if (khoFilter) {
      const foundName =
        currentKhoName ||
        khoOptions.find((k) => String(k.value) === khoFilter)?.label ||
        `Kho #${khoFilter}`;
      chips.push({
        key: "kho",
        label: foundName,
        icon: Warehouse,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onKhoFilterChange(""),
      });
    }

    if (searchInput.trim()) {
      chips.push({
        key: "search",
        label: `Mã/Ghi chú: "${searchInput.trim()}"`,
        icon: Search,
        colorClass: "bg-muted text-foreground border-border/60",
        onRemove: () => {
          onSearchInputChange("");
          onSearchSubmit("");
        },
      });
    }

    if (statusFilter !== null) {
      const statusLabel =
        statusOptions.find((s) => Number(s.value) === statusFilter)?.label ||
        `Trạng thái #${statusFilter}`;
      chips.push({
        key: "status",
        label: `Trạng thái: ${statusLabel}`,
        icon: Filter,
        colorClass:
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        onRemove: () => onStatusFilterChange(null),
      });
    }

    return chips;
  }, [
    khoFilter,
    currentKhoName,
    khoOptions,
    searchInput,
    statusFilter,
    statusOptions,
    onKhoFilterChange,
    onSearchInputChange,
    onSearchSubmit,
    onStatusFilterChange,
  ]);

  const activeFiltersCount =
    (khoFilter ? 1 : 0) +
    (searchInput.trim() ? 1 : 0) +
    (statusFilter !== null ? 1 : 0);

  return (
    <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
      {/* === 1. GIAO DIỆN MOBILE & TABLET (< lg) === */}
      <div className="lg:hidden space-y-2">
        {/* Ô tìm kiếm từ khóa trên Mobile */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            placeholder="Tìm theo mã phiếu, ghi chú..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-xs focus-visible:ring-blue-500/20"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                onSearchInputChange("");
                onSearchSubmit("");
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dòng điều khiển: Nút mở bộ lọc + Tải lại + Tạo mới */}
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
            {activeFiltersCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-1.5">
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

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-8.5 px-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 text-xs font-medium shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo đợt</span>
            </Button>
          </div>
        </div>

        {/* Khung bộ lọc chi tiết khi mở rộng trên Mobile */}
        {isMobileMenuOpen && (
          <div className="flex flex-col gap-3 p-3 rounded-xl bg-muted/40 border border-border/70 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-1 border-b border-border/40">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                Bộ lọc kiểm kê chi tiết
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

            {/* 1. Lọc theo kho hàng */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Kho kiểm kê
              </label>
              <SearchSelect
                placeholder="Chọn kho kiểm kê..."
                options={fullKhoOptions}
                value={khoFilter}
                onChange={(val) => onKhoFilterChange(String(val || ""))}
                isLoading={isLoadingKhos}
                height={9}
              />
            </div>

            {/* 2. Lọc theo trạng thái kiểm kê */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Trạng thái đợt kiểm kê
              </label>
              <div className="grid grid-cols-2 gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs">
                {statusButtonList.map((opt) => {
                  const isActive = statusFilter === opt.key;
                  return (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => onStatusFilterChange(opt.key)}
                      className={`px-2 py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                        isActive
                          ? `bg-card shadow-xs ${opt.activeColor}`
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {opt.label} {opt.count !== undefined ? `(${opt.count})` : ""}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* === 2. GIAO DIỆN DESKTOP (>= lg) === */}
      <div className="hidden lg:flex items-center justify-between gap-3 w-full">
        {/* Left: Search input & Kho SearchSelect */}
        <div className="flex items-center gap-2.5 flex-1 max-w-2xl">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Tìm theo mã phiếu, ghi chú kiểm kê..."
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-xs focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  onSearchInputChange("");
                  onSearchSubmit("");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Kho SearchSelect */}
          <div className="w-[240px] shrink-0">
            <SearchSelect
              placeholder="Tất cả kho hàng..."
              options={fullKhoOptions}
              value={khoFilter}
              onChange={(val) => onKhoFilterChange(String(val || ""))}
              isLoading={isLoadingKhos}
              height={9.5}
            />
          </div>
        </div>

        {/* Right: Dải bộ lọc trạng thái Pills & Nút làm mới & Tạo mới */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Status Filter Buttons via .map() */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
            <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
            {statusButtonList.map((opt) => {
              const isActive = statusFilter === opt.key;
              return (
                <button
                  key={String(opt.key)}
                  type="button"
                  onClick={() => onStatusFilterChange(opt.key)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? `bg-background shadow-xs ${opt.activeColor}`
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label} {opt.count !== undefined ? `(${opt.count})` : ""}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isFetching}
            title="Làm mới dữ liệu"
            className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
          </Button>

          <Button
            size="sm"
            onClick={onOpenCreate}
            className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đợt kiểm kê</span>
          </Button>
        </div>
      </div>

      {/* === 3. ACTIVE FILTER CHIPS (Dải hiển thị tiêu chí đang lọc) === */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
          <span className="text-muted-foreground font-medium text-[11px]">
            Đang lọc:
          </span>
          {activeChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <span
                key={chip.key}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border text-xs ${chip.colorClass}`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-red-500 cursor-pointer ml-0.5 text-xs"
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
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer ml-auto flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Xóa tất cả bộ lọc</span>
          </button>
        </div>
      )}
    </div>
  );
};
