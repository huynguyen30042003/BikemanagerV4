"use client";

import React, { useState, useMemo } from "react";
import {
  History,
  ArrowRightLeft,
  RefreshCw,
  Search,
  Filter,
  Bike,
  User,
  Tag,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";

export type ViewMode = "table" | "grid";

export interface CustomerOwnershipsFilterBarProps {
  totalLichSuSoHuu: number;
  searchInput: string;
  onSearch: (val: string) => void;
  vehicleFilter: string;
  onVehicleFilterChange: (val: string) => void;
  vehicleOptions: SelectOption[];
  isLoadingVehicles?: boolean;
  customerFilter: string;
  onCustomerFilterChange: (val: string) => void;
  customerOptions: SelectOption[];
  isLoadingCustomers?: boolean;
  lyDoFilter: string;
  onLyDoFilterChange: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenTransfer: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
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

const LY_DO_OPTIONS = [
  {
    key: "all",
    label: "Tất cả",
    activeColor: "text-indigo-600 dark:text-indigo-400 font-semibold",
  },
  {
    key: "SangTen",
    label: "Sang tên xe",
    activeColor: "text-blue-600 dark:text-blue-400 font-semibold",
  },
  {
    key: "ThuCuDoiMoi",
    label: "Thu cũ đổi mới",
    activeColor: "text-amber-600 dark:text-amber-400 font-semibold",
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
    title: "Chế độ xem thẻ",
  },
];

export const CustomerOwnershipsFilterBar: React.FC<
  CustomerOwnershipsFilterBarProps
> = ({
  totalLichSuSoHuu,
  searchInput,
  onSearch,
  vehicleFilter,
  onVehicleFilterChange,
  vehicleOptions,
  isLoadingVehicles = false,
  customerFilter,
  onCustomerFilterChange,
  customerOptions,
  isLoadingCustomers = false,
  lyDoFilter,
  onLyDoFilterChange,
  viewMode,
  onViewModeChange,
  onOpenTransfer,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filterVehicleOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả phương tiện --" },
      ...vehicleOptions,
    ];
  }, [vehicleOptions]);

  const filterCustomerOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả khách hàng --" },
      ...customerOptions,
    ];
  }, [customerOptions]);

  const currentVehicleLabel = useMemo(() => {
    if (!vehicleFilter) return "";
    const found = vehicleOptions.find(
      (v) => String(v.value) === String(vehicleFilter),
    );
    return found ? found.label : `Xe #${vehicleFilter.substring(0, 8)}`;
  }, [vehicleFilter, vehicleOptions]);

  const currentCustomerLabel = useMemo(() => {
    if (!customerFilter) return "";
    const found = customerOptions.find(
      (c) => String(c.value) === String(customerFilter),
    );
    return found ? found.label : `Khách #${customerFilter.substring(0, 8)}`;
  }, [customerFilter, customerOptions]);

  // Active filter chips dùng .map()
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

    if (vehicleFilter) {
      chips.push({
        key: "vehicle",
        label: `Phương tiện: ${currentVehicleLabel}`,
        icon: Bike,
        colorClass:
          "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        onRemove: () => onVehicleFilterChange(""),
      });
    }

    if (customerFilter) {
      chips.push({
        key: "customer",
        label: `Khách hàng: ${currentCustomerLabel}`,
        icon: User,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onCustomerFilterChange(""),
      });
    }

    if (lyDoFilter !== "all") {
      const matchLyDo = LY_DO_OPTIONS.find((l) => l.key === lyDoFilter);
      chips.push({
        key: "lyDo",
        label: `Nghiệp vụ: ${matchLyDo ? matchLyDo.label : lyDoFilter}`,
        icon: Tag,
        colorClass:
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        onRemove: () => onLyDoFilterChange("all"),
      });
    }

    return chips;
  }, [
    searchInput,
    vehicleFilter,
    currentVehicleLabel,
    customerFilter,
    currentCustomerLabel,
    lyDoFilter,
    onSearch,
    onVehicleFilterChange,
    onCustomerFilterChange,
    onLyDoFilterChange,
  ]);

  const mobileFilterCount =
    (vehicleFilter ? 1 : 0) +
    (customerFilter ? 1 : 0) +
    (lyDoFilter !== "all" ? 1 : 0);

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
              <span className="text-foreground">Lịch sử sở hữu xe</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-xs ring-4 ring-indigo-500/5">
                <History className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Lịch sử Sở hữu & Sang tên xe
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Truy vết nguồn gốc, các đời chủ sở hữu và nghiệp vụ sang tên, đổi mới xe
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              title="Tải lại dữ liệu lịch sử"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-indigo-500" : ""
                }`}
              />
              <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
              <span className="text-xs font-medium xs:hidden">Reload</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenTransfer}
              className="h-9 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Sang tên xe</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher */}
        <div className="pt-1 max-w-full">
          <CustomerNavTabs
            activeTab="ownerships"
            totalOwnerships={totalLichSuSoHuu}
          />
        </div>
      </div>

      {/* 2. Toolbar: Search, Vehicle Select, Customer Select, Reason Filter, ViewMode */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo biển số, model, tên khách..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-indigo-500/20"
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
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
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
                          ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold"
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
                    isFetching || isLoadingKPI ? "animate-spin text-indigo-500" : ""
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
                  <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Bộ lọc chi tiết
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              {/* Lọc theo Phương tiện */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Phương tiện / Xe
                </label>
                <SearchSelect
                  options={filterVehicleOptions}
                  value={vehicleFilter}
                  onChange={(val) => onVehicleFilterChange(String(val))}
                  placeholder={
                    isLoadingVehicles ? "Đang tải xe..." : "Lọc theo xe..."
                  }
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Lọc theo Khách hàng */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Khách hàng sở hữu
                </label>
                <SearchSelect
                  options={filterCustomerOptions}
                  value={customerFilter}
                  onChange={(val) => onCustomerFilterChange(String(val))}
                  placeholder={
                    isLoadingCustomers
                      ? "Đang tải khách..."
                      : "Lọc theo khách hàng..."
                  }
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Lọc theo Nghiệp vụ */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nghiệp vụ chuyển quyền
                </label>
                <div className="grid grid-cols-3 gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs">
                  {LY_DO_OPTIONS.map((opt) => {
                    const isActive = lyDoFilter === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => onLyDoFilterChange(opt.key)}
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
          {/* Left: Ô tìm kiếm & Bộ lọc Xe & Khách */}
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo biển số, model, tên khách..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-indigo-500/20"
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

            {/* Filter Xe */}
            <div className="w-52 shrink-0">
              <SearchSelect
                options={filterVehicleOptions}
                value={vehicleFilter}
                onChange={(val) => onVehicleFilterChange(String(val))}
                placeholder={
                  isLoadingVehicles ? "Đang tải xe..." : "Lọc theo xe..."
                }
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Filter Khách hàng */}
            <div className="w-52 shrink-0">
              <SearchSelect
                options={filterCustomerOptions}
                value={customerFilter}
                onChange={(val) => onCustomerFilterChange(String(val))}
                placeholder={
                  isLoadingCustomers
                    ? "Đang tải khách..."
                    : "Lọc theo khách hàng..."
                }
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Right: Reason Segment & View Mode & Reload */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop Reason Segment Control via .map() */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
              {LY_DO_OPTIONS.map((opt) => {
                const isActive = lyDoFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onLyDoFilterChange(opt.key)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      isActive
                        ? `bg-background shadow-xs ${opt.activeColor}`
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop View Switcher via .map() */}
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
                        ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold"
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
                  isFetching || isLoadingKPI ? "animate-spin text-indigo-500" : ""
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
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer ml-auto"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOwnershipsFilterBar;
