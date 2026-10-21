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

export const DanhMucChiTietFilterBar: React.FC<
  DanhMucChiTietFilterBarProps
> = ({
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Status Filter Definitions mapped via .map()
  const statusOptions = [
    {
      key: "all",
      label: "Tất cả",
      count: totalDanhMucChiTiet,
      activeColor: "text-purple-600 dark:text-purple-400 font-semibold",
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
      title: "Dạng lưới thẻ trực quan",
    },
    {
      key: "table" as const,
      label: "Bảng dữ liệu",
      icon: List,
      title: "Dạng bảng chi tiết",
    },
  ];

  interface ActiveChip {
    key: string;
    label: string;
    icon: React.ElementType;
    colorClass: string;
    onRemove: () => void;
  }

  const activeChips: ActiveChip[] = [];
  if (parentCategoryFilter) {
    activeChips.push({
      key: "parent",
      label: currentParentName,
      icon: FolderTree,
      colorClass:
        "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
      onRemove: () => onParentCategoryChange(""),
    });
  }
  if (searchInput) {
    activeChips.push({
      key: "search",
      label: `Từ khóa: "${searchInput}"`,
      icon: Search,
      colorClass: "bg-muted text-foreground border-border/60",
      onRemove: () => onSearch(""),
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
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70 mb-2 sm:mb-4">
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
                  Phân loại phụ trợ, thông số và linh kiện gán trực tiếp vào
                  từng danh mục chung
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
              <span className="text-xs font-medium hidden xs:inline">
                Đồng bộ
              </span>
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
        <div className="pt-1 max-w-full">
          <CategoryNavTabs
            activeTab="chiTiet"
            totalChung={totalDanhMucChung}
            totalChiTiet={totalDanhMucChiTiet}
          />
        </div>
      </div>

      {/* 2. Toolbar: Search, Parent Select, Status Filter & View Toggle */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
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
              {(parentCategoryFilter ? 1 : 0) +
                (statusFilter !== "all" ? 1 : 0) >
                0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-600 text-white">
                  {(parentCategoryFilter ? 1 : 0) +
                    (statusFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </Button>

            {/* View Switcher on mobile via .map() */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shadow-2xs">
                {viewModeOptions.map((opt) => {
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
                disabled={isFetching}
                title="Tải lại dữ liệu"
                className="h-8.5 w-8.5 cursor-pointer shadow-2xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-purple-500" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* KHUNG BỘ LỌC CHI TIẾT KHI MÀN HÌNH NHỎ (Thu gọn / Mở rộng) */}
          {isMobileMenuOpen && (
            <div className="flex flex-col gap-3 p-3 rounded-xl bg-muted/40 border border-border/70 animate-in fade-in-50 slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-border/40">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  Bộ lọc chi tiết
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="text-[11px] text-purple-600 dark:text-purple-400 hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              {/* 1. Lọc theo danh mục cha */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Danh mục chung (Cha)
                </label>
                <SearchSelect
                  value={
                    parentCategoryFilter ? String(parentCategoryFilter) : ""
                  }
                  options={filterParentOptions}
                  placeholder="📁 Tất cả danh mục cha..."
                  isLoading={isLoadingParent}
                  onChange={(val) =>
                    onParentCategoryChange(val ? String(val) : "")
                  }
                  height={9}
                />
              </div>

              {/* 2. Lọc theo trạng thái */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái sử dụng
                </label>
                <div className="grid grid-cols-3 gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs">
                  {statusOptions.map((opt) => {
                    const isActive = statusFilter === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => onStatusFilterChange(opt.key)}
                        className={`px-2 py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                          isActive
                            ? `bg-card shadow-xs ${opt.activeColor}`
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label} ({opt.count})
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
          {/* Left: Ô tìm kiếm từ khóa & Bộ chọn danh mục cha */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            {/* Search input */}
            <div className="relative flex-1">
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
            <div className="w-[220px] shrink-0">
              <SearchSelect
                value={parentCategoryFilter ? String(parentCategoryFilter) : ""}
                options={filterParentOptions}
                placeholder="📁 Lọc danh mục cha..."
                isLoading={isLoadingParent}
                onChange={(val) =>
                  onParentCategoryChange(val ? String(val) : "")
                }
                height={9}
              />
            </div>
          </div>

          {/* Right: Dải bộ lọc trạng thái & View Mode Switcher & Reload */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Status Filter Buttons via .map() */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
              {statusOptions.map((opt) => {
                const isActive = statusFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onStatusFilterChange(opt.key)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer shrink-0 ${
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

            {/* Desktop View Switcher via .map() */}
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
