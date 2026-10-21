"use client";

import React, { useState, useMemo } from "react";
import {
  Award,
  RefreshCw,
  Search,
  Filter,
  X,
  Sparkles,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";

export type ViewMode = "table" | "grid";

export interface CustomerStatisticsFilterBarProps {
  totalThongKeKhachHang: number;
  searchInput: string;
  onSearch: (val: string) => void;
  tierFilter: string;
  onTierFilterChange: (tier: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
}

interface TierOption {
  key: string;
  label: string;
  activeColor: string;
}

const TIER_OPTIONS: TierOption[] = [
  {
    key: "all",
    label: "Tất cả hạng",
    activeColor: "text-amber-600 dark:text-amber-400 font-semibold",
  },
  {
    key: "BinhThuong",
    label: "Chuẩn",
    activeColor: "text-slate-700 dark:text-slate-300 font-semibold",
  },
  {
    key: "Bac",
    label: "Bạc",
    activeColor: "text-slate-700 dark:text-slate-300 font-semibold",
  },
  {
    key: "Vang",
    label: "Vàng",
    activeColor: "text-amber-600 dark:text-amber-400 font-semibold",
  },
  {
    key: "KimCuong",
    label: "Kim Cương",
    activeColor: "text-violet-600 dark:text-violet-400 font-semibold",
  },
];

const VIEW_MODE_OPTIONS = [
  {
    key: "table" as const,
    label: "Bảng dữ liệu",
    icon: List,
    title: "Chế độ xem bảng",
  },
  {
    key: "grid" as const,
    label: "Lưới thẻ",
    icon: LayoutGrid,
    title: "Chế độ xem lưới",
  },
];

interface ActiveChip {
  key: string;
  label: React.ReactNode;
  icon: React.ElementType;
  colorClass: string;
  onRemove: () => void;
}

export const CustomerStatisticsFilterBar: React.FC<
  CustomerStatisticsFilterBarProps
> = ({
  totalThongKeKhachHang,
  searchInput,
  onSearch,
  tierFilter,
  onTierFilterChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Danh sách các chip đang lọc (Dùng .map để render sạch sẽ)
  const activeChips: ActiveChip[] = useMemo(() => {
    const chips: ActiveChip[] = [];

    if (searchInput) {
      chips.push({
        key: "search",
        label: `Từ khóa: "${searchInput}"`,
        icon: Search,
        colorClass: "bg-muted text-foreground border-border/60",
        onRemove: () => onSearch(""),
      });
    }

    if (tierFilter !== "all") {
      const activeTier = TIER_OPTIONS.find((t) => t.key === tierFilter);
      chips.push({
        key: "tier",
        label: `Hạng: ${activeTier?.label || tierFilter}`,
        icon: Sparkles,
        colorClass:
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        onRemove: () => onTierFilterChange("all"),
      });
    }

    return chips;
  }, [searchInput, tierFilter, onSearch, onTierFilterChange]);

  const hasActiveFilters = activeChips.length > 0;
  const mobileFilterCount = tierFilter !== "all" ? 1 : 0;

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions Hub */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1 flex-wrap">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Kinh doanh</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Xếp hạng & Thống kê</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs ring-4 ring-amber-500/5">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Xếp hạng & Thống kê Khách hàng
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Theo dõi tích lũy điểm thưởng, hạng thành viên, công nợ mua chịu và chu kỳ dịch vụ
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons on Header */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              title="Làm mới dữ liệu thống kê"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-amber-500" : ""
                }`}
              />
              <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
              <span className="text-xs font-medium xs:hidden">Reload</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher */}
        <div className="pt-1 max-w-full">
          <CustomerNavTabs
            activeTab="statistics"
            totalStatistics={totalThongKeKhachHang}
          />
        </div>
      </div>

      {/* 2. Toolbar: Search, Tier Filter & View Mode Switcher */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên khách hàng hoặc mã..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-amber-500/20"
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
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-600 text-white">
                  {mobileFilterCount}
                </span>
              )}
            </Button>

            {/* View Switcher on mobile via .map() */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shadow-2xs">
                {VIEW_MODE_OPTIONS.map((opt) => {
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
                          ? "bg-background text-amber-600 dark:text-amber-400 shadow-2xs font-semibold"
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
                    isFetching || isLoadingKPI ? "animate-spin text-amber-500" : ""
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
                  <Filter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Bộ lọc chi tiết
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              {/* Lọc theo Hạng thành viên */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Hạng thẻ thành viên
                </label>
                <div className="grid grid-cols-3 gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs">
                  {TIER_OPTIONS.map((opt) => {
                    const isActive = tierFilter === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => onTierFilterChange(opt.key)}
                        className={`px-2 py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                          isActive
                            ? `bg-card shadow-xs ${opt.activeColor}`
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
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
          {/* Left: Ô tìm kiếm */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên khách hàng hoặc mã..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-amber-500/20"
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

          {/* Right: Tier Segment Control & View Mode Switcher & Reload */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Tier Segment Control via .map() */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
              {TIER_OPTIONS.map((btn) => {
                const isActive = tierFilter === btn.key;
                return (
                  <button
                    key={btn.key}
                    type="button"
                    onClick={() => onTierFilterChange(btn.key)}
                    className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      isActive
                        ? `bg-background shadow-xs ${btn.activeColor}`
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop View Mode Switcher via .map() */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              {VIEW_MODE_OPTIONS.map((opt) => {
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
                        ? "bg-background text-amber-600 dark:text-amber-400 shadow-2xs font-semibold"
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
                  isFetching || isLoadingKPI ? "animate-spin text-amber-500" : ""
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
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-medium cursor-pointer ml-auto"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerStatisticsFilterBar;
