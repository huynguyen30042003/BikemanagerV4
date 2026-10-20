"use client";

import React, { useState } from "react";
import {
  FolderTree,
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
import { CategoryNavTabs } from "@/components/Common/CategoryNavTabs";

interface DanhMucChungFilterBarProps {
  totalDanhMucChung: number;
  totalHoatDong: number;
  totalNgungHoatDong: number;
  totalDanhMucChiTiet: number;
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

export const DanhMucChungFilterBar: React.FC<DanhMucChungFilterBarProps> = ({
  totalDanhMucChung,
  totalHoatDong,
  totalNgungHoatDong,
  totalDanhMucChiTiet,
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
      count: totalDanhMucChung,
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
      title: "Dạng lưới thẻ trực quan",
    },
    {
      key: "table" as const,
      label: "Bảng dữ liệu",
      icon: List,
      title: "Dạng bảng chi tiết",
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
              <span className="text-foreground">Quản lý danh mục</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Danh mục dùng chung
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Quản lý và định nghĩa các nhóm danh mục phân loại mẹ trong toàn hệ thống
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
                className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium hidden xs:inline">Đồng bộ</span>
              <span className="text-xs font-medium xs:hidden">Sync</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm mới</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher with Horizontal Scroll */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <CategoryNavTabs
            activeTab="chung"
            totalChung={totalDanhMucChung}
            totalChiTiet={totalDanhMucChiTiet}
          />
        </div>
      </div>

      {/* 2. Toolbar: Search, Filters & View Toggle */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Ô tìm kiếm từ khóa */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên danh mục..."
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

          {/* Nút 3 gạch mở rộng bộ lọc trên Mobile */}
          <div className="sm:hidden flex items-center justify-between gap-2 pt-1 border-t border-border/40">
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
                disabled={isFetching}
                className="h-8 w-8 cursor-pointer"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
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
            {/* Status Filter Buttons via .map() */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0 overflow-x-auto max-w-full">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0 hidden xs:inline" />
              {statusOptions.map((opt) => {
                const isActive = statusFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onStatusFilterChange(opt.key)}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer shrink-0 ${
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

            {/* Desktop View Switcher & Reload via .map() */}
            <div className="hidden sm:flex items-center gap-2">
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
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
                />
              </Button>
            </div>
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
