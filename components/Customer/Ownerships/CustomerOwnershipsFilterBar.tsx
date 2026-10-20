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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";

interface CustomerOwnershipsFilterBarProps {
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
  onOpenTransfer: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
}

const LY_DO_BUTTONS = [
  { value: "all", label: "Tất cả lý do" },
  { value: "SangTen", label: "Sang tên xe" },
  { value: "ThuCuDoiMoi", label: "Thu cũ đổi mới" },
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
  onOpenTransfer,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
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

  const hasActiveFilters = Boolean(
    searchInput || vehicleFilter || customerFilter || lyDoFilter !== "all"
  );

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

      {/* 2. Toolbar: Search, Vehicle Select, Customer Select, Reason Filter */}
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
                  ✕
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

          {/* Nút 3 gạch mở rộng bộ lọc trên Mobile */}
          <div className="lg:hidden flex items-center justify-between gap-2 pt-1 border-t border-border/40">
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
              <span>Lọc lý do sở hữu</span>
            </Button>
          </div>

          {/* Desktop Reason Segment Control (hidden on mobile, visible on lg+) */}
          <div className="hidden lg:flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
            <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
            {LY_DO_BUTTONS.map((btn) => {
              const isSelected = lyDoFilter === btn.value;
              return (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => onLyDoFilterChange(btn.value)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    isSelected
                      ? btn.value === "all"
                        ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                        : btn.value === "SangTen"
                        ? "bg-background shadow-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                        : "bg-background shadow-xs text-amber-600 dark:text-amber-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Khối bộ lọc mở rộng trên Mobile khi nhấn nút 3 gạch */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pt-2 border-t border-border/60 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Lọc theo nghiệp vụ:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {LY_DO_BUTTONS.map((btn) => {
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
                        ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 font-semibold"
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

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {searchInput && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Từ khóa: &quot;{searchInput}&quot;
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              </span>
            )}
            {vehicleFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 font-medium">
                <Bike className="w-3 h-3" />
                Xe: {currentVehicleLabel}
                <button
                  type="button"
                  onClick={() => onVehicleFilterChange("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Bỏ lọc xe"
                >
                  ✕
                </button>
              </span>
            )}
            {customerFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium">
                <User className="w-3 h-3" />
                Khách: {currentCustomerLabel}
                <button
                  type="button"
                  onClick={() => onCustomerFilterChange("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Bỏ lọc khách hàng"
                >
                  ✕
                </button>
              </span>
            )}
            {lyDoFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                <Tag className="w-3 h-3" />
                Lý do: {lyDoFilter === "SangTen" ? "Sang tên xe" : "Thu cũ đổi mới"}
                <button
                  type="button"
                  onClick={() => onLyDoFilterChange("all")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Bỏ lọc lý do"
                >
                  ✕
                </button>
              </span>
            )}
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
