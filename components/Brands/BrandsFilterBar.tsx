"use client";

import React, { useState } from "react";
import {
  Tags,
  Plus,
  RefreshCw,
  Search,
  Filter,
  LayoutGrid,
  List,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";

interface BrandsFilterBarProps {
  totalThuongHieu: number;
  activeCount: number;
  inactiveCount: number;
  searchInput: string;
  onSearch: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onOpenAdd: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const BrandsFilterBar: React.FC<BrandsFilterBarProps> = ({
  totalThuongHieu,
  activeCount,
  inactiveCount,
  searchInput,
  onSearch,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onOpenAdd,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/40">/</span>
              <span>Sản phẩm</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground">Thương hiệu</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Tags className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Hãng sản xuất & Thương hiệu
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Hồ sơ thương hiệu xe điện, phụ tùng và xuất xứ quốc gia được công nhận
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenAdd}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm thương hiệu</span>
            </Button>
          </div>
        </div>

        {/* Product Navigation Tabs with horizontal scroll */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <ProductNavTabs activeTab="brands" />
        </div>
      </div>

      {/* 2. Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên thương hiệu hoặc mã (HONDA, VINFAST...)..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/90 text-sm focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Status Menu Button */}
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
              <span>Lọc trạng thái</span>
            </Button>

            {/* View Mode on Mobile */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Chế độ xem lưới"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                title="Chế độ xem bảng"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Filter & Switcher Controls */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Status Filter Segment */}
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
                Tất cả ({totalThuongHieu})
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
                Sử dụng ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => onStatusFilterChange("inactive")}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  statusFilter === "inactive"
                    ? "bg-background shadow-xs text-zinc-700 dark:text-zinc-300 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Khóa ({inactiveCount})
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 shrink-0">
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Chế độ xem lưới thương hiệu"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("table")}
                title="Chế độ xem bảng dữ liệu"
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "table"
                    ? "bg-background text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile expanded status options */}
        {isMobileMenuOpen && (
          <div className="sm:hidden pt-2 border-t border-border/60 grid grid-cols-3 gap-1.5">
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
              Tất cả ({totalThuongHieu})
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
              Sử dụng ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => {
                onStatusFilterChange("inactive");
                setIsMobileMenuOpen(false);
              }}
              className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                statusFilter === "inactive"
                  ? "bg-zinc-500/10 border-zinc-500/30 text-zinc-700 dark:text-zinc-300 font-semibold"
                  : "border-border/60 bg-muted/40 text-muted-foreground"
              }`}
            >
              Khóa ({inactiveCount})
            </button>
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
                  className="hover:text-rose-500 cursor-pointer ml-0.5"
                  title="Xóa từ khóa"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                Trạng thái:{" "}
                {statusFilter === "active" ? "Đang áp dụng" : "Đã khóa"}
                <button
                  type="button"
                  onClick={() => onStatusFilterChange("all")}
                  className="hover:text-rose-500 cursor-pointer ml-0.5"
                  title="Xóa lọc trạng thái"
                >
                  <X className="w-3 h-3" />
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
