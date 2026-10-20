"use client";

import React, { useState } from "react";
import {
  Award,
  RefreshCw,
  Search,
  Filter,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";

interface CustomerStatisticsFilterBarProps {
  totalThongKeKhachHang: number;
  searchInput: string;
  onSearch: (val: string) => void;
  tierFilter: string;
  onTierFilterChange: (tier: string) => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
}

const TIER_BUTTONS = [
  { value: "all", label: "Tất cả hạng" },
  { value: "BinhThuong", label: "Chuẩn" },
  { value: "Bac", label: "Bạc" },
  { value: "Vang", label: "Vàng" },
  { value: "KimCuong", label: "Kim Cương" },
];

export const CustomerStatisticsFilterBar: React.FC<CustomerStatisticsFilterBarProps> = ({
  totalThongKeKhachHang,
  searchInput,
  onSearch,
  tierFilter,
  onTierFilterChange,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasActiveFilters = Boolean(searchInput || tierFilter !== "all");

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case "BinhThuong":
        return "Chuẩn";
      case "Bac":
        return "Bạc";
      case "Vang":
        return "Vàng";
      case "KimCuong":
        return "Kim Cương";
      default:
        return tier;
    }
  };

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
              <span className="text-foreground">Xếp hạng & Thống kê</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-xs ring-4 ring-amber-500/5">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Xếp hạng & Thống kê Khách hàng
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Theo dõi tích lũy điểm thưởng, hạng thành viên, công nợ mua chịu và chu kỳ dịch vụ
                </p>
              </div>
            </div>
          </div>

          {/* Action button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching || isLoadingKPI}
            className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs self-start sm:self-auto"
            title="Làm mới dữ liệu thống kê"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-amber-500" : ""}`}
            />
            <span className="text-xs font-medium">Làm mới dữ liệu</span>
          </Button>
        </div>

        {/* Quick Tab Switcher with Horizontal Scroll */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <CustomerNavTabs activeTab="statistics" totalStatistics={totalThongKeKhachHang} />
        </div>
      </div>

      {/* 2. Toolbar: Search & Tier Filter */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Ô tìm kiếm */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên khách hàng hoặc mã..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-amber-500/20"
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
              className="h-8 px-2.5 gap-1.5 text-xs border-border/80"
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Menu className="w-3.5 h-3.5" />
              )}
              <span>Lọc theo hạng thẻ</span>
            </Button>
          </div>

          {/* Desktop Tier Segment Control (hidden on mobile) */}
          <div className="hidden sm:flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
            {TIER_BUTTONS.map((btn) => {
              const isSelected = tierFilter === btn.value;
              return (
                <button
                  key={btn.value}
                  type="button"
                  onClick={() => onTierFilterChange(btn.value)}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                    isSelected
                      ? btn.value === "all"
                        ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                        : btn.value === "Vang"
                        ? "bg-background shadow-xs text-amber-600 dark:text-amber-400 font-semibold"
                        : btn.value === "KimCuong"
                        ? "bg-background shadow-xs text-violet-600 dark:text-violet-400 font-semibold"
                        : "bg-background shadow-xs text-foreground font-semibold"
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
          <div className="sm:hidden pt-2 border-t border-border/60 space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
            <span className="text-[11px] font-medium text-muted-foreground block">
              Lọc theo hạng thẻ thành viên:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {TIER_BUTTONS.map((btn) => {
                const isSelected = tierFilter === btn.value;
                return (
                  <button
                    key={btn.value}
                    type="button"
                    onClick={() => {
                      onTierFilterChange(btn.value);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-600 font-semibold"
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
            {tierFilter !== "all" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">
                <Sparkles className="w-3 h-3" />
                Hạng: {getTierLabel(tierFilter)}
                <button
                  type="button"
                  onClick={() => onTierFilterChange("all")}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Bỏ lọc hạng"
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
