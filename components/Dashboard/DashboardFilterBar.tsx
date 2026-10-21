"use client";

import React, { useState, useMemo } from "react";
import { RefreshCw, LayoutDashboard, X, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { TimeRangeType } from "@/types/dashboard";
import { UserProfile } from "@/types/auth";

interface DashboardFilterBarProps {
  user: UserProfile | null;
  selectedDiaDiemId: string;
  selectedKhoId: string;
  timeRange: TimeRangeType;
  diaDiemOptions: SelectOption[];
  khoOptions: SelectOption[];
  isLoadingDiaDiem: boolean;
  isLoadingKho: boolean;
  isFetching: boolean;
  onSelectDiaDiem: (val: string) => void;
  onSelectKho: (val: string) => void;
  onChangeTimeRange: (range: TimeRangeType) => void;
  onRefresh: () => void;
}

const TIME_RANGE_TABS: { key: TimeRangeType; label: string }[] = [
  { key: "tat_ca", label: "Tất cả" },
  { key: "hom_nay", label: "Hôm nay" },
  { key: "7_ngay", label: "7 ngày" },
  { key: "thang_nay", label: "Tháng này" },
  { key: "quy_nay", label: "Quý này" },
];

export function DashboardFilterBar({
  user,
  selectedDiaDiemId,
  selectedKhoId,
  timeRange,
  diaDiemOptions,
  khoOptions,
  isLoadingDiaDiem,
  isLoadingKho,
  isFetching,
  onSelectDiaDiem,
  onSelectKho,
  onChangeTimeRange,
  onRefresh,
}: DashboardFilterBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeCount = useMemo(() => {
    let count = 0;
    if (selectedDiaDiemId) count++;
    if (selectedKhoId) count++;
    if (timeRange !== "tat_ca") count++;
    return count;
  }, [selectedDiaDiemId, selectedKhoId, timeRange]);

  const handleResetFilters = () => {
    onSelectDiaDiem("");
    onSelectKho("");
    onChangeTimeRange("tat_ca");
  };

  return (
    <div className="space-y-3 pb-4 border-b border-border/70">
      {/* 1. Header & Welcome Message */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex flex-wrap items-center gap-2">
              <span>Tổng Quan Hoạt Động BikeManager</span>
              <Badge
                variant="outline"
                className="text-[11px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Đồng bộ Realtime
              </Badge>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
              Xin chào{" "}
              <span className="font-semibold text-foreground">
                {user?.fullName || user?.username || "Quản trị viên"}
              </span>
              , số liệu được tổng hợp trực tiếp từ hệ thống bán xe, xưởng dịch vụ và kho bãi.
            </p>
          </div>
        </div>

        {/* Nút hành động trên Header */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Nút bộ lọc trên mobile */}
          <div className="lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label="Thu gọn hoặc mở bộ lọc"
              className="h-8.5 px-3 gap-1.5 text-xs font-medium border-border/80 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 h-3.5" />
              ) : (
                <Filter className="w-3.5 h-3.5" />
              )}
              <span>Bộ lọc</span>
              {activeCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {activeCount}
                </span>
              )}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-8.5 sm:h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            title="Làm mới dữ liệu tổng quan"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
            <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
            <span className="text-xs font-medium xs:hidden">Reload</span>
          </Button>
        </div>
      </div>

      {/* 2. Bộ lọc chi tiết trên Mobile (Thu gọn / Mở rộng) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden flex flex-col gap-3 p-3 rounded-xl bg-muted/40 border border-border/70 animate-in fade-in-50 slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-1 border-b border-border/40">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Bộ lọc tổng quan
            </span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            )}
          </div>

          {/* Chọn Chi nhánh */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Chi nhánh / Showroom
            </label>
            <SearchSelect
              value={selectedDiaDiemId}
              options={diaDiemOptions}
              placeholder="🏬 Chọn chi nhánh..."
              isLoading={isLoadingDiaDiem}
              onChange={(val) => onSelectDiaDiem(String(val || ""))}
              className="h-9.5 text-xs w-full"
              height={9.5}
            />
          </div>

          {/* Chọn Kho hàng */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Kho hàng trực thuộc
            </label>
            <SearchSelect
              value={selectedKhoId}
              options={khoOptions}
              placeholder="🏢 Chọn kho hàng..."
              isLoading={isLoadingKho}
              onChange={(val) => onSelectKho(String(val || ""))}
              className="h-9.5 text-xs w-full"
              height={9.5}
            />
          </div>

          {/* Khoảng thời gian trên mobile */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              Khoảng thời gian
            </label>
            <div className="bg-background/80 p-1 rounded-lg border border-border/60 flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
              {TIME_RANGE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onChangeTimeRange(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all shrink-0 cursor-pointer ${
                    timeRange === tab.key
                      ? "bg-card text-foreground shadow-xs font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Bộ lọc địa điểm, kho hàng & khoảng thời gian trên Desktop (>= lg) */}
      <div className="hidden lg:flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2.5 flex-1 max-w-xl">
          {/* Chọn Chi nhánh / Showroom */}
          <div className="w-[220px] shrink-0">
            <SearchSelect
              value={selectedDiaDiemId}
              options={diaDiemOptions}
              placeholder="🏬 Chọn chi nhánh..."
              isLoading={isLoadingDiaDiem}
              onChange={(val) => onSelectDiaDiem(String(val || ""))}
              className="h-9.5 text-xs w-full"
              height={9.5}
            />
          </div>

          {/* Chọn Kho hàng */}
          <div className="w-[220px] shrink-0">
            <SearchSelect
              value={selectedKhoId}
              options={khoOptions}
              placeholder="🏢 Chọn kho hàng..."
              isLoading={isLoadingKho}
              onChange={(val) => onSelectKho(String(val || ""))}
              className="h-9.5 text-xs w-full"
              height={9.5}
            />
          </div>
        </div>

        {/* Nút lọc khoảng thời gian trên Desktop */}
        <div className="bg-muted/60 p-1 rounded-lg border border-border/70 flex items-center gap-1 shadow-xs shrink-0">
          {TIME_RANGE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTimeRange(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all shrink-0 cursor-pointer ${
                timeRange === tab.key
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardFilterBar;
