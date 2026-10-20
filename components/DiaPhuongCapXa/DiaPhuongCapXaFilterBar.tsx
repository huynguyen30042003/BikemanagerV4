"use client";

import React, { useState } from "react";
import {
  Compass,
  Plus,
  RefreshCw,
  Search,
  Filter,
  LayoutGrid,
  List,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { LocationNavTabs } from "@/components/Common/LocationNavTabs";

interface DiaPhuongCapXaFilterBarProps {
  totalDiaPhuongCapXa: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalDiaPhuongCapTinh: number;
  searchInput: string;
  onSearch: (val: string) => void;
  tinhFilter: string | number;
  onTinhFilterChange: (val: string | number) => void;
  filterProvinceOptions: SelectOption[];
  currentProvinceName: string;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onOpenCreate: () => void;
  onSync: () => void;
  isSyncing: boolean;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
}

export const DiaPhuongCapXaFilterBar: React.FC<DiaPhuongCapXaFilterBarProps> = ({
  totalDiaPhuongCapXa,
  totalHoatDong,
  totalNgungHoatDong,
  totalDiaPhuongCapTinh,
  searchInput,
  onSearch,
  tinhFilter,
  onTinhFilterChange,
  filterProvinceOptions,
  currentProvinceName,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onSync,
  isSyncing,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Status Filter Definitions mapped via .map()
  const statusOptions = [
    {
      key: "all",
      label: "Tất cả",
      count: totalDiaPhuongCapXa,
      activeColor: "text-blue-600 dark:text-blue-400 font-semibold",
    },
    {
      key: "active",
      label: "Sử dụng",
      count: totalHoatDong,
      activeColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
    },
    {
      key: "inactive",
      label: "Khóa",
      count: totalNgungHoatDong,
      activeColor: "text-slate-700 dark:text-slate-300 font-semibold",
    },
  ];

  // View Mode Definitions mapped via .map()
  const viewModeOptions = [
    {
      key: "grid" as const,
      label: "Lưới thẻ",
      icon: LayoutGrid,
      title: "Chế độ xem lưới thẻ (Showcase Grid)",
    },
    {
      key: "table" as const,
      label: "Bảng dữ liệu",
      icon: List,
      title: "Chế độ xem bảng chi tiết (Data Table)",
    },
  ];

  // Active filter chips mapped via .map()
  interface ActiveChip {
    key: string;
    label: string;
    icon: React.ElementType;
    colorClass: string;
    onRemove: () => void;
  }

  const activeChips: ActiveChip[] = [];
  if (searchInput) {
    activeChips.push({
      key: "search",
      label: `Từ khóa: "${searchInput}"`,
      icon: Search,
      colorClass: "bg-muted text-foreground border-border/60",
      onRemove: () => onSearch(""),
    });
  }
  if (tinhFilter) {
    activeChips.push({
      key: "province",
      label: `Tỉnh: ${currentProvinceName}`,
      icon: Building2,
      colorClass:
        "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 font-medium",
      onRemove: () => onTinhFilterChange(""),
    });
  }
  if (statusFilter !== "all") {
    activeChips.push({
      key: "status",
      label: `Trạng thái: ${
        statusFilter === "active" ? "Đang sử dụng" : "Đã khóa"
      }`,
      icon: Filter,
      colorClass:
        "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
      onRemove: () => onStatusFilterChange("all"),
    });
  }

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
              <span className="text-foreground">Địa bàn & Cơ sở</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Cấp Xã & Phường
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Quản lý danh mục địa phương cấp xã / phường / thị trấn trực thuộc các tỉnh thành
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onSync}
              disabled={isSyncing}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs active:scale-[0.98] transition-transform"
              title="Đồng bộ danh sách xã/phường từ dữ liệu chuẩn"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium hidden xs:inline">Đồng bộ chuẩn</span>
              <span className="text-xs font-medium xs:hidden">Sync</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm mới</span>
            </Button>
          </div>
        </div>

        {/* Location Navigation Hub */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <LocationNavTabs
            activeTab="xa"
            total_DiaPhuongCapXa={totalDiaPhuongCapXa}
            total_DiaPhuongCapTinh={totalDiaPhuongCapTinh}
          />
        </div>
      </div>

      {/* 2. Toolbar: Search, Province Filter, Status Filter & View Toggle */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Ô tìm kiếm từ khóa & Bộ lọc Tỉnh */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã xã..."
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

            {/* Filter Tỉnh / Thành phố */}
            <div className="w-full sm:w-60 lg:w-64">
              <SearchSelect
                options={filterProvinceOptions}
                value={tinhFilter}
                onChange={(val) => onTinhFilterChange(val)}
                placeholder="Lọc theo Tỉnh / TP..."
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
              className="h-8 px-2.5 gap-1.5 text-xs border-border/80 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Menu className="w-3.5 h-3.5" />
              )}
              <span>Bộ lọc trạng thái</span>
            </Button>

            {/* View Switcher on mobile via .map() */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5">
                {viewModeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = viewMode === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => onViewModeChange(opt.key)}
                      title={opt.title}
                      className={`flex items-center justify-center w-7 h-7 rounded-md transition-all cursor-pointer ${
                        isActive
                          ? "bg-background text-foreground shadow-2xs font-semibold"
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
                className="h-8 w-8 cursor-pointer"
                title="Tải lại"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Desktop Controls (hidden on mobile, visible on lg+) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {/* Status Filter Buttons via .map() */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
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

            {/* View Mode Switcher via .map() */}
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

            {/* Reload Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              title="Tải lại dữ liệu"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Khối bộ lọc mở rộng trên Mobile khi nhấn nút 3 gạch via .map() */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pt-2 border-t border-border/60 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Trạng thái hoạt động:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {statusOptions.map((opt) => {
                const isActive = statusFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      onStatusFilterChange(opt.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                      isActive
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-600 font-semibold"
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

        {/* Active Filter Chips via .map() */}
        {hasActiveFilters && (
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
