"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  RefreshCw,
  Search,
  Filter,
  LayoutGrid,
  List,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";

export type ViewMode = "grid" | "table";

export interface CustomerFilterBarProps {
  totalKhachHang: number;
  totalCaNhan: number;
  totalToChuc: number;
  totalHoatDong: number;
  searchInput: string;
  onSearch: (val: string) => void;
  tinhFilter: string | number;
  onTinhFilterChange: (val: string | number) => void;
  provinceOptions: SelectOption[];
  isLoadingTinh: boolean;
  loaiFilter: string;
  onLoaiFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenCreate: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI: boolean;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  totalKhachHang,
  totalCaNhan,
  totalToChuc,
  totalHoatDong,
  searchInput,
  onSearch,
  tinhFilter,
  onTinhFilterChange,
  provinceOptions,
  isLoadingTinh,
  loaiFilter,
  onLoaiFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onRefresh,
  isFetching,
  isLoadingKPI,
  hasActiveFilters,
  onResetFilters,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Header & Navigation Hub */}
      <div className="flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Kinh doanh</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Khách hàng</span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Hồ sơ Khách hàng
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý khách hàng cá nhân & tổ chức doanh nghiệp, tích hợp
                  thông tin liên hệ và định danh
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs active:scale-95"
              title="Làm mới danh sách khách hàng và KPI"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium">Làm mới</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-3.5 sm:px-4 flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium whitespace-nowrap">
                Thêm khách hàng
              </span>
            </Button>
          </div>
        </div>

        <div className="w-full overflow-x-auto no-scrollbar pt-1">
          <CustomerNavTabs activeTab="customer" totalCustomer={totalKhachHang} />
        </div>
      </div>

      {/* 2. Toolbar: Tìm kiếm & Lọc & Chuyển chế độ xem */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Box & Mobile Quick Action Bar */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm tên, SĐT, CCCD/MST..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-xs sm:text-sm focus-visible:ring-blue-500/20"
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

            {/* Mobile Filter Toggle Button (3-gạch Menu) */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen((prev) => !prev)}
              className={`lg:hidden h-9.5 px-2.5 sm:px-3 flex items-center gap-1.5 border-border/80 cursor-pointer shadow-2xs shrink-0 transition-colors ${
                isMobileFilterOpen
                  ? "bg-blue-50 border-blue-500/40 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Mở rộng / Thu gọn bộ lọc"
            >
              {isMobileFilterOpen ? (
                <X className="w-4 h-4 text-rose-500" />
              ) : (
                <Menu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              )}
              <span className="text-xs font-medium hidden xs:inline">Bộ lọc</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              )}
            </Button>

            {/* Mobile View Mode & Reload */}
            <div className="flex items-center gap-1 lg:hidden shrink-0">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onViewModeChange("grid")}
                  title="Chế độ xem lưới"
                  className={`flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("table")}
                  title="Chế độ xem bảng"
                  className={`flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isFetching || isLoadingKPI}
                title="Tải lại"
                className="h-8.5 w-8.5 shrink-0 cursor-pointer shadow-2xs active:scale-95"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Detailed Filters: Always visible on Desktop (lg:flex), Collapsible on Mobile */}
          <div
            className={`flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-2.5 flex-wrap ${
              isMobileFilterOpen ? "flex" : "hidden lg:flex"
            }`}
          >
            {/* Tỉnh thành Filter */}
            <div className="w-full lg:w-48 shrink-0">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả Tỉnh/Thành" },
                  ...provinceOptions,
                ]}
                value={tinhFilter}
                onChange={(val) => onTinhFilterChange(val ?? "")}
                placeholder="Chọn Tỉnh/Thành"
                isLoading={isLoadingTinh}
                className="h-9.5 text-xs w-full"
              />
            </div>

            {/* Phân loại Tabs */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0 max-w-full overflow-x-auto no-scrollbar">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 hidden sm:block shrink-0" />
              <button
                type="button"
                onClick={() => onLoaiFilterChange("all")}
                className={`flex-1 sm:flex-initial px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap text-center ${
                  loaiFilter === "all"
                    ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tất cả ({totalKhachHang})
              </button>
              <button
                type="button"
                onClick={() => onLoaiFilterChange("1")}
                className={`flex-1 sm:flex-initial px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap text-center ${
                  loaiFilter === "1"
                    ? "bg-background shadow-xs text-sky-600 dark:text-sky-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Cá nhân ({totalCaNhan})
              </button>
              <button
                type="button"
                onClick={() => onLoaiFilterChange("2")}
                className={`flex-1 sm:flex-initial px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap text-center ${
                  loaiFilter === "2"
                    ? "bg-background shadow-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tổ chức ({totalToChuc})
              </button>
            </div>

            {/* Trạng thái filter */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0 max-w-full overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => onStatusFilterChange("all")}
                className={`flex-1 sm:flex-initial px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap text-center ${
                  statusFilter === "all"
                    ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => onStatusFilterChange("active")}
                className={`flex-1 sm:flex-initial px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap text-center ${
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
                className={`flex-1 sm:flex-initial px-2 sm:px-2.5 py-1.5 rounded-md font-medium text-[11px] sm:text-xs transition-all cursor-pointer whitespace-nowrap text-center ${
                  statusFilter === "inactive"
                    ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Khóa
              </button>
            </div>

            {/* Desktop View Mode & Reload */}
            <div className="hidden lg:flex items-center gap-1.5 ml-auto">
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

              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isFetching || isLoadingKPI}
                title="Tải lại danh sách và chỉ số KPI"
                className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs active:scale-95"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

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
                >
                  ✕
                </button>
              </span>
            )}
            {loaiFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Loại: {loaiFilter === "1" ? "Cá nhân" : "Doanh nghiệp"}
                <button
                  type="button"
                  onClick={() => onLoaiFilterChange("all")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {tinhFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Tỉnh/Thành:{" "}
                {provinceOptions.find((p) => String(p.value) === String(tinhFilter))?.label ||
                  tinhFilter}
                <button
                  type="button"
                  onClick={() => onTinhFilterChange("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái:{" "}
                {statusFilter === "active" ? "Đang hoạt động" : "Đã khóa"}
                <button
                  type="button"
                  onClick={() => onStatusFilterChange("all")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
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
