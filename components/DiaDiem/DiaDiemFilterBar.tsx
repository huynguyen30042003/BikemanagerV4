"use client";

import React, { useState } from "react";
import {
  Store,
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

interface DiaDiemFilterBarProps {
  totalDiaDiem: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
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
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
}

export const DiaDiemFilterBar: React.FC<DiaDiemFilterBarProps> = ({
  totalDiaDiem,
  totalHoatDong,
  totalNgungHoatDong,
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
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
}) => {
  // Mobile filter dropdown toggle per Section 14.3.1
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasActiveFilters = Boolean(
    searchInput || tinhFilter || statusFilter !== "all"
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
              <span className="text-foreground">Địa bàn & Cơ sở</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Chi nhánh & Showroom
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý mạng lưới showroom bán hàng, trạm dịch vụ kỹ thuật và kho chi nhánh
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
              title="Tải lại danh sách cơ sở"
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
              <span className="text-xs font-medium">Thêm cơ sở</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher with Horizontal Scroll */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <LocationNavTabs activeTab="diaDiem" total_DiaDiem={totalDiaDiem} />
        </div>
      </div>

      {/* 2. Toolbar: Search, Province Select, Status Filter & View Toggle */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Ô tìm kiếm từ khóa & Bộ lọc Tỉnh */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo tên cơ sở, địa chỉ..."
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
              className="h-8 px-2.5 gap-1.5 text-xs border-border/80"
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Menu className="w-3.5 h-3.5" />
              )}
              <span>Bộ lọc trạng thái</span>
            </Button>

            {/* View Switcher on mobile */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5">
                <button
                  type="button"
                  onClick={() => onViewModeChange("grid")}
                  className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${
                    viewMode === "grid"
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground"
                  }`}
                  title="Xem dạng lưới"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("table")}
                  className={`flex items-center justify-center w-7 h-7 rounded-md transition-all ${
                    viewMode === "table"
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground"
                  }`}
                  title="Xem dạng bảng"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isFetching || isLoadingKPI}
                className="h-8 w-8"
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
            {/* Status Segment Control */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
              <button
                type="button"
                onClick={() => onStatusFilterChange("all")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === "all"
                    ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tất cả ({totalDiaDiem})
              </button>
              <button
                type="button"
                onClick={() => onStatusFilterChange("active")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === "active"
                    ? "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Hoạt động ({totalHoatDong})
              </button>
              <button
                type="button"
                onClick={() => onStatusFilterChange("inactive")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Đóng ({totalNgungHoatDong})
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Chế độ xem lưới thẻ (Showcase Grid)"
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                title="Chế độ xem bảng chi tiết (Data Table)"
                className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-background text-foreground shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
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

        {/* Khối bộ lọc mở rộng trên Mobile khi nhấn nút 3 gạch */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pt-2 border-t border-border/60 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Trạng thái hoạt động:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onStatusFilterChange("all");
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                  statusFilter === "all"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-600 font-semibold"
                    : "border-border/60 bg-muted/40 text-muted-foreground"
                }`}
              >
                Tất cả ({totalDiaDiem})
              </button>
              <button
                type="button"
                onClick={() => {
                  onStatusFilterChange("active");
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                  statusFilter === "active"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 font-semibold"
                    : "border-border/60 bg-muted/40 text-muted-foreground"
                }`}
              >
                Hoạt động ({totalHoatDong})
              </button>
              <button
                type="button"
                onClick={() => {
                  onStatusFilterChange("inactive");
                  setIsMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                  statusFilter === "inactive"
                    ? "bg-slate-500/15 border-slate-500/30 text-slate-700 font-semibold"
                    : "border-border/60 bg-muted/40 text-muted-foreground"
                }`}
              >
                Đóng ({totalNgungHoatDong})
              </button>
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
            {tinhFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium">
                <Building2 className="w-3 h-3" />
                Tỉnh: {currentProvinceName}
                <button
                  type="button"
                  onClick={() => onTinhFilterChange("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Bỏ lọc tỉnh"
                >
                  ✕
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái:{" "}
                {statusFilter === "active" ? "Đang hoạt động" : "Đã đóng"}
                <button
                  type="button"
                  onClick={() => onStatusFilterChange("all")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Bỏ lọc trạng thái"
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
