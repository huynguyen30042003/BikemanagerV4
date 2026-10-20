"use client";

import React, { useState } from "react";
import {
  ListTree,
  Plus,
  RefreshCw,
  Search,
  Filter,
  LayoutGrid,
  List,
  Menu,
  X,
  FolderTree,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CategoryNavTabs } from "@/components/Common/CategoryNavTabs";

interface DanhMucChiTietFilterBarProps {
  totalDanhMucChiTiet: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalDanhMucChung: number;
  parentCategoryFilter: string | number;
  onParentCategoryChange: (val: string | number) => void;
  filterParentOptions: SelectOption[];
  currentParentName: string;
  isLoadingParent: boolean;
  searchInput: string;
  onSearch: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onOpenCreate: () => void;
  onSync: () => void;
  isSyncing: boolean;
  onRefresh: () => void;
  isFetching: boolean;
  onResetFilters: () => void;
}

export const DanhMucChiTietFilterBar: React.FC<DanhMucChiTietFilterBarProps> = ({
  totalDanhMucChiTiet,
  totalHoatDong,
  totalNgungHoatDong,
  totalDanhMucChung,
  parentCategoryFilter,
  onParentCategoryChange,
  filterParentOptions,
  currentParentName,
  isLoadingParent,
  searchInput,
  onSearch,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onSync,
  isSyncing,
  onRefresh,
  isFetching,
  onResetFilters,
}) => {
  // Mobile filter dropdown toggle per Rule 14.3.1
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || parentCategoryFilter
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
              <span className="text-foreground">Quản lý danh mục</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20 shadow-xs ring-4 ring-purple-500/5">
                <ListTree className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Danh mục chi tiết
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Phân loại phụ trợ, thông số và linh kiện gán trực tiếp vào từng danh mục chung
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
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              title="Đồng bộ danh mục từ dữ liệu chuẩn"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-purple-500" : ""}`}
              />
              <span className="text-xs font-medium hidden xs:inline">Đồng bộ</span>
              <span className="text-xs font-medium xs:hidden">Sync</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-3.5 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm mới</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher with Horizontal Scroll */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <CategoryNavTabs
            activeTab="chiTiet"
            totalChung={totalDanhMucChung}
            totalChiTiet={totalDanhMucChiTiet}
          />
        </div>
      </div>

      {/* 2. Toolbar: Search, Parent Select, Status Filter & View Toggle */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Ô tìm kiếm từ khóa & Bộ chọn danh mục cha */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo tên mục chi tiết..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-purple-500/20"
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

            {/* Parent Category SearchSelect */}
            <div className="w-full sm:w-[220px]">
              <SearchSelect
                value={parentCategoryFilter ? String(parentCategoryFilter) : ""}
                options={filterParentOptions}
                placeholder="📁 Lọc danh mục cha..."
                isLoading={isLoadingParent}
                onChange={(val) => onParentCategoryChange(val ? String(val) : "")}
              />
            </div>
          </div>

          {/* Nút 3 gạch mở rộng bộ lọc trên Mobile */}
          <div className="sm:hidden flex items-center justify-between gap-2 pt-1 border-t border-border/40">
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
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isFetching}
                className="h-8 w-8"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-purple-500" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Dải bộ lọc trạng thái & View Mode: trên desktop luôn hiện, trên mobile ẩn/hiện theo nút 3 gạch */}
          <div
            className={`${
              isMobileMenuOpen ? "flex" : "hidden"
            } sm:flex flex-wrap items-center gap-2`}
          >
            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0 overflow-x-auto max-w-full">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0 hidden xs:inline" />
              <button
                type="button"
                onClick={() => onStatusFilterChange("all")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer shrink-0 ${
                  statusFilter === "all"
                    ? "bg-background shadow-xs text-purple-600 dark:text-purple-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tất cả ({totalDanhMucChiTiet})
              </button>
              <button
                type="button"
                onClick={() => onStatusFilterChange("active")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer shrink-0 ${
                  statusFilter === "active"
                    ? "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sử dụng ({totalHoatDong})
              </button>
              <button
                type="button"
                onClick={() => onStatusFilterChange("inactive")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer shrink-0 ${
                  statusFilter === "inactive"
                    ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Khóa ({totalNgungHoatDong})
              </button>
            </div>

            {/* Desktop View Switcher & Reload */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onViewModeChange("grid")}
                  title="Dạng lưới thẻ"
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
                  title="Dạng bảng chi tiết"
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
                disabled={isFetching}
                title="Tải lại dữ liệu"
                className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-purple-500" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {parentCategoryFilter && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                <FolderTree className="w-3 h-3 text-purple-500" />
                <span>{currentParentName}</span>
                <button
                  type="button"
                  onClick={() => onParentCategoryChange("")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                >
                  ✕
                </button>
              </span>
            )}
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
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                Trạng thái: {statusFilter === "active" ? "Đang sử dụng" : "Đã khóa"}
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
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium cursor-pointer ml-auto"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
