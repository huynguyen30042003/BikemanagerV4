"use client";

import React, { useState } from "react";
import { RefreshCw, LayoutDashboard, Menu, X, Filter } from "lucide-react";
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
  // Mobile filter dropdown toggle (theo quy tắc nút 3 gạch trên mobile)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between border-b border-border/60 pb-4">
      {/* 1. Header & Welcome Message */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
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
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Xin chào{" "}
              <span className="font-semibold text-foreground">
                {user?.fullName || user?.username || "Quản trị viên"}
              </span>
              , số liệu được tổng hợp trực tiếp từ hệ thống bán xe, xưởng dịch vụ và kho bãi.
            </p>
          </div>
        </div>

        {/* Nút 3 gạch thu gọn/mở rộng bộ lọc trên màn hình nhỏ (Mobile XS Max, 12 Pro Max) */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Thu gọn hoặc mở bộ lọc"
            className="h-9 px-2.5 gap-1.5 text-xs border-border/80 shadow-xs hover:bg-muted/70"
          >
            {isMobileMenuOpen ? (
              <X className="w-4 h-4 text-foreground" />
            ) : (
              <Menu className="w-4 h-4 text-foreground" />
            )}
            <span className="text-xs font-medium">Bộ lọc</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 w-9 p-0 border-border/80 shadow-xs hover:bg-muted/70"
            title="Làm mới"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* 2. Bộ lọc địa điểm, kho hàng & khoảng thời gian */}
      {/* Trên Desktop: luôn hiển thị (lg:flex). Trên Mobile: ẩn/hiện theo nút 3 gạch isMobileMenuOpen */}
      <div
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } lg:flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 pt-2 lg:pt-0 animate-in fade-in-50 duration-200`}
      >
        {/* Chọn Chi nhánh / Showroom */}
        <div className="w-full sm:w-[200px] lg:w-[220px]">
          <SearchSelect
            value={selectedDiaDiemId}
            options={diaDiemOptions}
            placeholder="🏬 Chọn chi nhánh..."
            isLoading={isLoadingDiaDiem}
            onChange={(val) => onSelectDiaDiem(String(val || ""))}
          />
        </div>

        {/* Chọn Kho hàng */}
        <div className="w-full sm:w-[200px] lg:w-[220px]">
          <SearchSelect
            value={selectedKhoId}
            options={khoOptions}
            placeholder="🏢 Chọn kho hàng..."
            isLoading={isLoadingKho}
            onChange={(val) => onSelectKho(String(val || ""))}
          />
        </div>

        {/* Nút lọc khoảng thời gian (scroll ngang mượt mà trên mobile) */}
        <div className="bg-muted/60 p-1 rounded-lg border border-border/70 flex items-center gap-1 shadow-xs overflow-x-auto max-w-full">
          {TIME_RANGE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeTimeRange(tab.key)}
              className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-all shrink-0 cursor-pointer ${
                timeRange === tab.key
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Nút làm mới (Hiển thị trên Desktop) */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="hidden lg:flex gap-1.5 text-xs font-medium h-9 border-border/80 shadow-xs hover:bg-muted/70 cursor-pointer shrink-0"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
          />
          <span>Làm mới</span>
        </Button>
      </div>
    </div>
  );
}

export default DashboardFilterBar;
