"use client";

import React, { useMemo, useState } from "react";
import {
  Globe,
  Plus,
  RefreshCw,
  Search,
  Filter,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationNavTabs } from "@/components/Common/LocationNavTabs";

export type ViewMode = "grid" | "table";

interface QuocGiaFilterBarProps {
  total_QuocGia: number;
  total_HoatDong: number;
  total_NgungHoatDong: number;

  searchInput: string;
  onSearchChange: (val: string) => void;

  statusFilter: string;
  onStatusFilterChange: (val: string) => void;

  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;

  onOpenCreate: () => void;
  onReload: () => void;
  onSync: () => void;

  isSyncing?: boolean;
  isFetching?: boolean;
}

export function QuocGiaFilterBar({
  total_QuocGia,
  total_HoatDong,
  total_NgungHoatDong,
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onReload,
  onSync,
  isSyncing,
  isFetching,
}: QuocGiaFilterBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cấu hình các status options dùng .map()
  const statusOptions = useMemo(
    () => [
      {
        id: "all",
        label: "Tất cả",
        count: total_QuocGia,
        activeClass:
          "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold",
      },
      {
        id: "active",
        label: "Sử dụng",
        count: total_HoatDong,
        activeClass:
          "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold",
      },
      {
        id: "inactive",
        label: "Khóa",
        count: total_NgungHoatDong,
        activeClass:
          "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold",
      },
    ],
    [total_QuocGia, total_HoatDong, total_NgungHoatDong],
  );

  const activeCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== "all") count++;
    return count;
  }, [statusFilter]);

  // Cấu hình active filter chips dùng .map()
  const activeChips = useMemo(() => {
    const chips: Array<{ id: string; label: string; onClear: () => void }> = [];

    if (searchInput) {
      chips.push({
        id: "search",
        label: `Từ khóa: "${searchInput}"`,
        onClear: () => onSearchChange(""),
      });
    }

    if (statusFilter !== "all") {
      chips.push({
        id: "status",
        label: `Trạng thái: ${statusFilter === "active" ? "Đang sử dụng" : "Đã khóa"}`,
        onClear: () => onStatusFilterChange("all"),
      });
    }

    return chips;
  }, [searchInput, statusFilter, onSearchChange, onStatusFilterChange]);

  const hasActiveFilters = activeChips.length > 0;

  const handleResetAllFilters = () => {
    onSearchChange("");
    onStatusFilterChange("all");
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Navigation & Action Hub */}
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70 mb-2 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Địa bàn & Cơ sở</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Danh mục Quốc gia
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  Quản lý danh sách quốc gia chuẩn ISO dùng cho xuất nhập khẩu
                  phụ tùng và liên kết địa bàn
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={onSync}
              disabled={isSyncing}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs active:scale-95"
              title="Đồng bộ danh mục quốc gia từ nguồn dữ liệu chuẩn"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium">Đồng bộ chuẩn</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm mới</span>
            </Button>
          </div>
        </div>

        {/* Location Nav Tabs */}
        <div className="pt-1 max-w-full">
          <LocationNavTabs activeTab="quocGia" total_QuocGia={total_QuocGia} />
        </div>
      </div>

      {/* 2. Toolbar: Search Box, Filter Segment, View Mode & Refresh */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-3">
        {/* MOBILE/TABLET VIEW (lg:hidden) */}
        <div className="lg:hidden space-y-2">
          {/* Search Box Full Width */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên quốc gia hoặc mã (VN, US, JP...)..."
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-xs sm:text-sm focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Toolbar row on mobile */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`h-8.5 px-3 text-xs flex items-center gap-1.5 cursor-pointer border-border/80 transition-colors ${
                activeCount > 0
                  ? "border-blue-500/50 bg-blue-50/50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300 font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              )}
              <span>Bộ lọc</span>
              {activeCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-blue-600 text-white dark:bg-blue-500 text-[10px] flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-1.5">
              {/* View Mode Switcher */}
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => onViewModeChange("grid")}
                  title="Chế độ xem lưới thẻ"
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
                  title="Chế độ xem bảng chi tiết"
                  className={`flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "table"
                      ? "bg-background text-foreground shadow-2xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reload Button */}
              <Button
                variant="outline"
                size="icon"
                onClick={onReload}
                disabled={isFetching}
                title="Tải lại dữ liệu"
                className="h-8.5 w-8.5 shrink-0 cursor-pointer shadow-2xs active:scale-95"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Collapsible Panel on Mobile */}
          {isMobileMenuOpen && (
            <div className="p-3 bg-muted/30 rounded-xl border border-border/80 space-y-3 mt-2 animate-in fade-in-50 slide-in-from-top-1">
              <div className="flex items-center justify-between pb-1 border-b border-border/60">
                <span className="text-xs font-semibold text-foreground">
                  Trạng thái hoạt động
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetAllFilters}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {statusOptions.map((opt) => {
                  const isActive = statusFilter === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onStatusFilterChange(opt.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`py-2 px-2 rounded-lg text-xs font-medium text-center border transition-all cursor-pointer ${
                        isActive
                          ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-semibold"
                          : "border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {opt.label} ({opt.count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP VIEW (hidden lg:flex) */}
        <div className="hidden lg:flex items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên quốc gia hoặc mã (VN, US, JP...)..."
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-xs sm:text-sm focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status Segment Control (Rendered via .map) */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
              {statusOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onStatusFilterChange(opt.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer whitespace-nowrap text-xs ${
                    statusFilter === opt.id
                      ? opt.activeClass
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label} ({opt.count})
                </button>
              ))}
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
              onClick={onReload}
              disabled={isFetching}
              title="Tải lại dữ liệu"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs active:scale-95"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* 3. Active Filter Chips (Mapped via .map) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 pt-2 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium text-[11px] mr-1">
              Đang lọc:
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60 text-xs"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onClear}
                  className="hover:text-red-500 cursor-pointer ml-0.5 p-0.5 rounded"
                  title="Xóa tiêu chí này"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleResetAllFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer ml-auto"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
