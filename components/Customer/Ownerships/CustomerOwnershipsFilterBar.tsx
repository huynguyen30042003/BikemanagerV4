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
  Menu,
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

const LY_DO_OPTIONS = [
  {
    value: "all",
    label: "Tất cả lý do",
    activeClass: "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold",
    mobileActiveClass: "bg-blue-500/10 border-blue-500/30 text-blue-600 font-semibold",
  },
  {
    value: "SangTen",
    label: "Sang tên xe",
    activeClass: "bg-background shadow-xs text-indigo-600 dark:text-indigo-400 font-semibold",
    mobileActiveClass: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 font-semibold",
  },
  {
    value: "ThuCuDoiMoi",
    label: "Thu cũ đổi mới",
    activeClass: "bg-background shadow-xs text-amber-600 dark:text-amber-400 font-semibold",
    mobileActiveClass: "bg-amber-500/10 border-amber-500/30 text-amber-600 font-semibold",
  },
];

const VIEW_MODE_OPTIONS = [
  { id: "table" as const, title: "Chế độ xem bảng", icon: List },
  { id: "grid" as const, title: "Chế độ xem thẻ", icon: LayoutGrid },
];

export const CustomerOwnershipsFilterBar: React.FC<CustomerOwnershipsFilterBarProps> = ({
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
    const found = vehicleOptions.find((v) => String(v.value) === String(vehicleFilter));
    return found ? found.label : `Xe #${vehicleFilter.substring(0, 8)}`;
  }, [vehicleFilter, vehicleOptions]);

  const currentCustomerLabel = useMemo(() => {
    if (!customerFilter) return "";
    const found = customerOptions.find((c) => String(c.value) === String(customerFilter));
    return found ? found.label : `Khách #${customerFilter.substring(0, 8)}`;
  }, [customerFilter, customerOptions]);

  // Danh sách filter chips đang kích hoạt để dùng .map()
  const activeChips = useMemo(() => {
    const chips: {
      id: string;
      label: string;
      icon?: React.ElementType;
      colorClass?: string;
      onRemove: () => void;
    }[] = [];

    if (searchInput) {
      chips.push({
        id: "search",
        label: `Từ khóa: "${searchInput}"`,
        onRemove: () => onSearch(""),
      });
    }
    if (vehicleFilter) {
      chips.push({
        id: "vehicle",
        label: `Xe: ${currentVehicleLabel}`,
        icon: Bike,
        colorClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        onRemove: () => onVehicleFilterChange(""),
      });
    }
    if (customerFilter) {
      chips.push({
        id: "customer",
        label: `Khách: ${currentCustomerLabel}`,
        icon: User,
        colorClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onCustomerFilterChange(""),
      });
    }
    if (lyDoFilter !== "all") {
      chips.push({
        id: "lyDo",
        label: `Lý do: ${lyDoFilter === "SangTen" ? "Sang tên xe" : "Thu cũ đổi mới"}`,
        icon: Tag,
        colorClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
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

  return (
    <div className="space-y-4">
      {/* 1. Header & Actions Hub */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
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
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
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
                className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-indigo-500" : ""}`}
              />
              <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenTransfer}
              className="h-9 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span className="text-xs font-medium">Chuyển quyền / Sang tên</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher with Horizontal Scroll */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <CustomerNavTabs activeTab="ownerships" totalOwnerships={totalLichSuSoHuu} />
        </div>
      </div>

      {/* 2. Toolbar: Search, Vehicle Select, Customer Select, Reason Filter, ViewMode */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Ô tìm kiếm & Bộ lọc Xe & Khách */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 flex-wrap">
            {/* Search Box */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
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
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Xe */}
            <div className="w-full sm:w-56">
              <SearchSelect
                options={filterVehicleOptions}
                value={vehicleFilter}
                onChange={(val) => onVehicleFilterChange(String(val))}
                placeholder={isLoadingVehicles ? "Đang tải xe..." : "Lọc theo xe..."}
                className="h-9.5 text-xs"
              />
            </div>

            {/* Filter Khách hàng */}
            <div className="w-full sm:w-56">
              <SearchSelect
                options={filterCustomerOptions}
                value={customerFilter}
                onChange={(val) => onCustomerFilterChange(String(val))}
                placeholder={isLoadingCustomers ? "Đang tải khách..." : "Lọc theo khách hàng..."}
                className="h-9.5 text-xs"
              />
            </div>
          </div>

          {/* View Mode & Reason Controls */}
          <div className="flex items-center justify-between lg:justify-end gap-2 pt-1 lg:pt-0 border-t lg:border-t-0 border-border/40">
            {/* Mobile Reason Menu Toggle Button */}
            <div className="lg:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="h-8 px-2.5 gap-1.5 text-xs border-border/80"
              >
                {isMobileMenuOpen ? (
                  <X className="w-3.5 h-3.5" />
                ) : (
                  <Menu className="w-3.5 h-3.5" />
                )}
                <span>Lọc lý do</span>
              </Button>
            </div>

            {/* Desktop Reason Segment Control (.map based) */}
            <div className="hidden lg:flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
              {LY_DO_OPTIONS.map((btn) => {
                const isSelected = lyDoFilter === btn.value;
                return (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => onLyDoFilterChange(btn.value)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      isSelected
                        ? btn.activeClass
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            {/* View Mode Switcher (.map based) */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 shrink-0">
              {VIEW_MODE_OPTIONS.map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => onViewModeChange(mode.id)}
                    title={mode.title}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                      viewMode === mode.id
                        ? "bg-background text-indigo-600 dark:text-indigo-400 shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Khối bộ lọc mở rộng trên Mobile (.map based) */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pt-2 border-t border-border/60 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Lọc theo nghiệp vụ:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {LY_DO_OPTIONS.map((btn) => {
                const isSelected = lyDoFilter === btn.value;
                return (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => {
                      onLyDoFilterChange(btn.value);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                      isSelected
                        ? btn.mobileActiveClass
                        : "border-border/60 bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filter Chips (.map based) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {activeChips.map((chip) => {
              const IconComponent = chip.icon;
              return (
                <span
                  key={chip.id}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-foreground ${
                    chip.colorClass || "bg-muted border-border/60"
                  }`}
                >
                  {IconComponent && <IconComponent className="w-3 h-3" />}
                  <span>{chip.label}</span>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="hover:text-rose-500 cursor-pointer ml-0.5"
                    title={`Xóa ${chip.id}`}
                  >
                    <X className="w-3 h-3" />
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
