"use client";

import React, { useMemo, useState } from "react";
import {
  Sparkles,
  Plus,
  RefreshCw,
  Search,
  X,
  Filter,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { ServiceNavTabs } from "@/components/Common/ServiceNavTabs";

export interface RepairServicesFilterBarProps {
  totalCount: number;
  totalServicesTab?: number;
  totalActive?: number;
  totalInactive?: number;
  searchInput: string;
  onSearchChange: (val: string) => void;
  categoryFilter: number | null;
  onCategoryFilterChange: (val: number | null) => void;
  serviceTypeOptions: SelectOption[];
  getServiceTypeLabel: (id?: number | null) => string;
  isLoadingServiceTypes?: boolean;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onOpenCreate: () => void;
  onReload: () => void;
  isFetching?: boolean;
}

interface ActiveChip {
  key: string;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  onRemove: () => void;
}

export function RepairServicesFilterBar({
  totalCount,
  totalServicesTab,
  totalActive = 0,
  totalInactive = 0,
  searchInput,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  serviceTypeOptions,
  getServiceTypeLabel,
  isLoadingServiceTypes = false,
  statusFilter,
  onStatusFilterChange,
  onOpenCreate,
  onReload,
  isFetching = false,
}: RepairServicesFilterBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cấu hình các status options dùng .map()
  const statusOptions = useMemo(
    () => [
      {
        key: "all",
        label: "Tất cả",
        count: totalCount,
        activeColor: "text-blue-600 dark:text-blue-400 font-semibold",
      },
      {
        key: "active",
        label: "Kinh doanh",
        count: totalActive,
        activeColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
      },
      {
        key: "inactive",
        label: "Tạm dừng",
        count: totalInactive,
        activeColor: "text-slate-700 dark:text-slate-300 font-semibold",
      },
    ],
    [totalCount, totalActive, totalInactive],
  );

  const filterCategoryOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả nhóm dịch vụ --" },
      ...serviceTypeOptions,
    ];
  }, [serviceTypeOptions]);

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    if (categoryFilter !== null) count++;
    if (statusFilter !== "all") count++;
    return count;
  }, [categoryFilter, statusFilter]);

  // Cấu hình active filter chips dùng .map()
  const activeChips: ActiveChip[] = useMemo(() => {
    const chips: ActiveChip[] = [];

    if (searchInput) {
      chips.push({
        key: "search",
        label: `Từ khóa: "${searchInput}"`,
        icon: Search,
        colorClass: "bg-muted text-foreground border-border/60",
        onRemove: () => onSearchChange(""),
      });
    }

    if (categoryFilter !== null) {
      chips.push({
        key: "category",
        label: `Nhóm: ${getServiceTypeLabel(categoryFilter) || `#${categoryFilter}`}`,
        icon: Tag,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onCategoryFilterChange(null),
      });
    }

    if (statusFilter !== "all") {
      const label =
        statusFilter === "active" ? "Đang kinh doanh" : "Ngừng kinh doanh";
      chips.push({
        key: "status",
        label: `Trạng thái: ${label}`,
        icon: CheckCircle2,
        colorClass:
          "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        onRemove: () => onStatusFilterChange("all"),
      });
    }

    return chips;
  }, [
    searchInput,
    onSearchChange,
    categoryFilter,
    getServiceTypeLabel,
    onCategoryFilterChange,
    statusFilter,
    onStatusFilterChange,
  ]);

  const hasActiveFilters = activeChips.length > 0;

  const handleResetFilters = () => {
    onSearchChange("");
    onCategoryFilterChange(null);
    onStatusFilterChange("all");
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1 flex-wrap">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Dịch vụ kỹ thuật</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Bảng giá dịch vụ</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Bảng Giá Tiền Công & Gói Dịch Vụ
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Cấu hình đơn giá tiền công bảo dưỡng định kỳ, sửa chữa cơ điện, cứu hộ xe điện
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onReload}
              disabled={isFetching}
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              title="Tải lại dữ liệu dịch vụ"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium hidden xs:inline">Làm mới</span>
              <span className="text-xs font-medium xs:hidden">Reload</span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm dịch vụ mới</span>
            </Button>
          </div>
        </div>

        {/* Service Nav Tabs */}
        <div className="pt-1 max-w-full">
          <ServiceNavTabs
            activeTab="services"
            totalServices={totalServicesTab ?? totalCount}
          />
        </div>
      </div>

      {/* 2. Main Filter Section */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Tìm theo tên dịch vụ, mã dịch vụ..."
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-8 h-9.5 text-xs w-full bg-background/80"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dòng điều khiển: Nút mở bộ lọc + Tải lại */}
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
              {activeCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {activeCount}
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onReload}
              disabled={isFetching}
              title="Tải lại dữ liệu"
              className="h-8.5 w-8.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
              />
            </Button>
          </div>

          {/* KHUNG BỘ LỌC CHI TIẾT KHI MÀN HÌNH NHỎ (Thu gọn / Mở rộng) */}
          {isMobileMenuOpen && (
            <div className="flex flex-col gap-3 p-3 rounded-xl bg-muted/40 border border-border/70 animate-in fade-in-50 slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-1 border-b border-border/40">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  Bộ lọc chi tiết
                </span>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              {/* Nhóm dịch vụ */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nhóm dịch vụ
                </label>
                <SearchSelect
                  placeholder="Tất cả nhóm dịch vụ..."
                  options={filterCategoryOptions}
                  value={categoryFilter !== null ? String(categoryFilter) : ""}
                  onChange={(val) =>
                    onCategoryFilterChange(val ? Number(val) : null)
                  }
                  isLoading={isLoadingServiceTypes}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Trạng thái sử dụng */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái kinh doanh
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
          {/* Left: Search Input & Category Select */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm theo tên dịch vụ, mã dịch vụ..."
                value={searchInput}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 pr-8 h-9.5 text-xs w-full bg-background/80"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                  title="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="w-56 shrink-0">
              <SearchSelect
                placeholder="Tất cả nhóm dịch vụ"
                options={filterCategoryOptions}
                value={categoryFilter !== null ? String(categoryFilter) : ""}
                onChange={(val) =>
                  onCategoryFilterChange(val ? Number(val) : null)
                }
                isLoading={isLoadingServiceTypes}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Right: Status Tabs via .map() & Reload */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
              {statusOptions.map((opt) => {
                const isActive = statusFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onStatusFilterChange(opt.key)}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
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

            <Button
              variant="outline"
              size="icon"
              onClick={onReload}
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

        {/* Active Filter Chips via .map() */}
        {hasActiveFilters && activeChips.length > 0 && (
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
              onClick={handleResetFilters}
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

export default RepairServicesFilterBar;
