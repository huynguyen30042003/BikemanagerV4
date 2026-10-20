"use client";

import React, { useState, useMemo } from "react";
import {
  Bike,
  Plus,
  RefreshCw,
  Search,
  Filter,
  User,
  Menu,
  X,
  LayoutGrid,
  List,
  LucideIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";

export type ViewMode = "table" | "grid";

export interface CustomerVehiclesFilterBarProps {
  totalPhuongTien: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  searchInput: string;
  onSearch: (val: string) => void;
  khachHangFilter: string;
  onKhachHangFilterChange: (val: string) => void;
  customerOptions: SelectOption[];
  isLoadingCustomers?: boolean;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenCreate: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
}

interface StatusOption {
  value: string;
  label: string;
  count: number;
  activeClass: string;
  mobileActiveClass: string;
}

const VIEW_MODE_OPTIONS: { mode: ViewMode; label: string; icon: LucideIcon }[] = [
  { mode: "table", label: "Bảng", icon: List },
  { mode: "grid", label: "Lưới thẻ", icon: LayoutGrid },
];

export const CustomerVehiclesFilterBar: React.FC<CustomerVehiclesFilterBarProps> = ({
  totalPhuongTien,
  totalHoatDong,
  totalNgungHoatDong,
  searchInput,
  onSearch,
  khachHangFilter,
  onKhachHangFilterChange,
  customerOptions,
  isLoadingCustomers = false,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filterCustomerOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả khách hàng --" },
      ...customerOptions,
    ];
  }, [customerOptions]);

  const currentCustomerLabel = useMemo(() => {
    if (!khachHangFilter) return "";
    const found = customerOptions.find((c) => String(c.value) === String(khachHangFilter));
    return found ? found.label : `Khách #${khachHangFilter.substring(0, 8)}`;
  }, [khachHangFilter, customerOptions]);

  // Cấu hình các nút lọc trạng thái qua mảng để dùng .map()
  const statusOptions: StatusOption[] = useMemo(
    () => [
      {
        value: "all",
        label: "Tất cả",
        count: totalPhuongTien,
        activeClass: "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold",
        mobileActiveClass: "bg-blue-500/10 border-blue-500/30 text-blue-600 font-semibold",
      },
      {
        value: "active",
        label: "Đang sử dụng",
        count: totalHoatDong,
        activeClass: "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold",
        mobileActiveClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-semibold",
      },
      {
        value: "inactive",
        label: "Ngừng hoạt động",
        count: totalNgungHoatDong,
        activeClass: "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold",
        mobileActiveClass: "bg-slate-500/10 border-slate-500/30 text-slate-700 font-semibold",
      },
    ],
    [totalPhuongTien, totalHoatDong, totalNgungHoatDong]
  );

  // Danh sách các chip đang lọc (Dùng .map() render sạch sẽ)
  const activeChips = useMemo(() => {
    const chips: {
      id: string;
      label: React.ReactNode;
      onRemove: () => void;
    }[] = [];

    if (searchInput) {
      chips.push({
        id: "search",
        label: (
          <span>
            Từ khóa: <strong className="font-semibold">&quot;{searchInput}&quot;</strong>
          </span>
        ),
        onRemove: () => onSearch(""),
      });
    }

    if (khachHangFilter) {
      chips.push({
        id: "customer",
        label: (
          <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300">
            <User className="w-3 h-3" />
            Khách: <strong className="font-semibold">{currentCustomerLabel}</strong>
          </span>
        ),
        onRemove: () => onKhachHangFilterChange(""),
      });
    }

    if (statusFilter !== "all") {
      const opt = statusOptions.find((s) => s.value === statusFilter);
      chips.push({
        id: "status",
        label: (
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Trạng thái: <strong className="font-semibold">{opt?.label || statusFilter}</strong>
          </span>
        ),
        onRemove: () => onStatusFilterChange("all"),
      });
    }

    return chips;
  }, [
    searchInput,
    khachHangFilter,
    statusFilter,
    currentCustomerLabel,
    statusOptions,
    onSearch,
    onKhachHangFilterChange,
    onStatusFilterChange,
  ]);

  const hasActiveFilters = activeChips.length > 0;

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
              <span className="text-foreground">Phương tiện</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Quản lý Phương tiện Khách hàng
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Hồ sơ xe máy, xe điện, thông số kỹ thuật và số khung/số pin
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
              title="Tải lại danh sách phương tiện"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Đăng ký xe mới</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher with Horizontal Scroll */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <CustomerNavTabs activeTab="vehicles" totalVehicles={totalPhuongTien} />
        </div>
      </div>

      {/* 2. Toolbar: Search, Customer Filter, Status Filter & View Mode Switcher */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Ô tìm kiếm & Bộ lọc khách hàng */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo biển số, model, số khung, số pin..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-blue-500/20"
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

            {/* Filter Khách hàng */}
            <div className="w-full sm:w-64 lg:w-72">
              <SearchSelect
                options={filterCustomerOptions}
                value={khachHangFilter}
                onChange={(val) => onKhachHangFilterChange(String(val))}
                placeholder={isLoadingCustomers ? "Đang tải khách hàng..." : "Lọc theo khách hàng..."}
                className="h-9.5 text-xs"
              />
            </div>
          </div>

          {/* Controls row for Mobile */}
          <div className="lg:hidden flex items-center justify-between gap-2 pt-1 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="h-8 px-2.5 gap-1.5 text-xs border-border/80 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Menu className="w-3.5 h-3.5" />
              )}
              <span>Bộ lọc trạng thái</span>
            </Button>

            {/* ViewMode toggle on Mobile */}
            <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border/60">
              {VIEW_MODE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = viewMode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => onViewModeChange(opt.mode)}
                    className={`p-1.5 rounded-md transition-all cursor-pointer ${
                      isSelected
                        ? "bg-background shadow-xs text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={`Chế độ xem ${opt.label}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Right Side: Status Segment Control & View Mode Switcher */}
          <div className="hidden lg:flex items-center gap-2 flex-wrap">
            {/* Desktop Status Segment Control */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
              {statusOptions.map((opt) => {
                const isSelected = statusFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onStatusFilterChange(opt.value)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                      isSelected
                        ? opt.activeClass
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                );
              })}
            </div>

            {/* Desktop View Mode Switcher (Bảng / Lưới thẻ) */}
            <div className="flex items-center bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              {VIEW_MODE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = viewMode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => onViewModeChange(opt.mode)}
                    className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={`Chế độ xem ${opt.label}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Khối bộ lọc mở rộng trên Mobile khi nhấn nút 3 gạch */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pt-2 border-t border-border/60 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Trạng thái phương tiện:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {statusOptions.map((opt) => {
                const isSelected = statusFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onStatusFilterChange(opt.value);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                      isSelected
                        ? opt.mobileActiveClass
                        : "border-border/60 bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {opt.label} ({opt.count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Filter Chips (Sử dụng .map()) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Bỏ lọc"
                >
                  ✕
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
