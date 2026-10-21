"use client";

import React, { useMemo, useState } from "react";
import {
  Wrench,
  Plus,
  RefreshCw,
  Search,
  X,
  Filter,
  CheckCircle2,
  CreditCard,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { ServiceNavTabs } from "@/components/Common/ServiceNavTabs";

export interface RepairTicketsFilterBarProps {
  totalCount: number;
  totalRepairsTab?: number;
  searchInput: string;
  onSearchChange: (val: string) => void;
  statusFilter: number | null;
  onStatusFilterChange: (val: number | null) => void;
  repairStatusOptions: SelectOption[];
  isLoadingRepairStatuses?: boolean;
  paymentStatusFilter: number | null;
  onPaymentStatusFilterChange: (val: number | null) => void;
  paymentStatusOptions: SelectOption[];
  isLoadingPaymentStatuses?: boolean;
  serviceTypeFilter: number | null;
  onServiceTypeFilterChange: (val: number | null) => void;
  serviceTypeOptions: SelectOption[];
  isLoadingServiceTypes?: boolean;
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

export function RepairTicketsFilterBar({
  totalCount,
  totalRepairsTab,
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  repairStatusOptions,
  isLoadingRepairStatuses = false,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  paymentStatusOptions,
  isLoadingPaymentStatuses = false,
  serviceTypeFilter,
  onServiceTypeFilterChange,
  serviceTypeOptions,
  isLoadingServiceTypes = false,
  onOpenCreate,
  onReload,
  isFetching = false,
}: RepairTicketsFilterBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filterStatusOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả tiến độ sửa --" },
      ...repairStatusOptions,
    ];
  }, [repairStatusOptions]);

  const filterPaymentOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả thanh toán --" },
      ...paymentStatusOptions,
    ];
  }, [paymentStatusOptions]);

  const filterServiceTypeOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả loại dịch vụ --" },
      ...serviceTypeOptions,
    ];
  }, [serviceTypeOptions]);

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== null) count++;
    if (paymentStatusFilter !== null) count++;
    if (serviceTypeFilter !== null) count++;
    return count;
  }, [statusFilter, paymentStatusFilter, serviceTypeFilter]);

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

    if (statusFilter !== null) {
      const opt = repairStatusOptions.find(
        (o) => String(o.value) === String(statusFilter),
      );
      chips.push({
        key: "status",
        label: `Tiến độ: ${opt?.label || `#${statusFilter}`}`,
        icon: CheckCircle2,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onStatusFilterChange(null),
      });
    }

    if (paymentStatusFilter !== null) {
      const opt = paymentStatusOptions.find(
        (o) => String(o.value) === String(paymentStatusFilter),
      );
      chips.push({
        key: "payment",
        label: `Thanh toán: ${opt?.label || `#${paymentStatusFilter}`}`,
        icon: CreditCard,
        colorClass:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        onRemove: () => onPaymentStatusFilterChange(null),
      });
    }

    if (serviceTypeFilter !== null) {
      const opt = serviceTypeOptions.find(
        (o) => String(o.value) === String(serviceTypeFilter),
      );
      chips.push({
        key: "serviceType",
        label: `Loại DV: ${opt?.label || `#${serviceTypeFilter}`}`,
        icon: Tag,
        colorClass:
          "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
        onRemove: () => onServiceTypeFilterChange(null),
      });
    }

    return chips;
  }, [
    searchInput,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    repairStatusOptions,
    paymentStatusFilter,
    onPaymentStatusFilterChange,
    paymentStatusOptions,
    serviceTypeFilter,
    onServiceTypeFilterChange,
    serviceTypeOptions,
  ]);

  const hasActiveFilters = activeChips.length > 0;

  const handleResetFilters = () => {
    onSearchChange("");
    onStatusFilterChange(null);
    onPaymentStatusFilterChange(null);
    onServiceTypeFilterChange(null);
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
              <span className="text-foreground">Phiếu sửa chữa</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Wrench className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Phiếu Tiếp Nhận & Sửa Chữa Dịch Vụ
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý quy trình khám xe, báo giá công thợ, xuất kho phụ tùng thay thế và thanh toán
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
              title="Tải lại dữ liệu phiếu sửa"
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
              <span className="text-xs font-medium">Lập phiếu sửa chữa</span>
            </Button>
          </div>
        </div>

        {/* Service Nav Tabs */}
        <div className="pt-1 max-w-full">
          <ServiceNavTabs
            activeTab="repairs"
            totalRepairs={totalRepairsTab ?? totalCount}
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
              placeholder="Tìm theo mã phiếu, tên chủ xe, biển số..."
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

              {/* Tiến độ sửa */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Tiến độ sửa chữa
                </label>
                <SearchSelect
                  placeholder="Tất cả tiến độ..."
                  options={filterStatusOptions}
                  value={statusFilter !== null ? String(statusFilter) : ""}
                  onChange={(val) =>
                    onStatusFilterChange(val ? Number(val) : null)
                  }
                  isLoading={isLoadingRepairStatuses}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Thanh toán */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái thanh toán
                </label>
                <SearchSelect
                  placeholder="Tất cả thanh toán..."
                  options={filterPaymentOptions}
                  value={
                    paymentStatusFilter !== null
                      ? String(paymentStatusFilter)
                      : ""
                  }
                  onChange={(val) =>
                    onPaymentStatusFilterChange(val ? Number(val) : null)
                  }
                  isLoading={isLoadingPaymentStatuses}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Loại dịch vụ */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Phân loại dịch vụ
                </label>
                <SearchSelect
                  placeholder="Tất cả loại DV..."
                  options={filterServiceTypeOptions}
                  value={
                    serviceTypeFilter !== null ? String(serviceTypeFilter) : ""
                  }
                  onChange={(val) =>
                    onServiceTypeFilterChange(val ? Number(val) : null)
                  }
                  isLoading={isLoadingServiceTypes}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>
            </div>
          )}
        </div>

        {/* === GIAO DIỆN MÀN HÌNH LỚN (Desktop >= lg) === */}
        <div className="hidden lg:flex items-center justify-between gap-2.5 w-full">
          {/* Left: Search input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo mã phiếu, tên chủ xe, biển số..."
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

          {/* Right: Dropdown Filters & Reload */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Tiến độ sửa */}
            <div className="w-44 shrink-0">
              <SearchSelect
                placeholder="Tất cả tiến độ"
                options={filterStatusOptions}
                value={statusFilter !== null ? String(statusFilter) : ""}
                onChange={(val) =>
                  onStatusFilterChange(val ? Number(val) : null)
                }
                isLoading={isLoadingRepairStatuses}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Thanh toán */}
            <div className="w-44 shrink-0">
              <SearchSelect
                placeholder="Tất cả thanh toán"
                options={filterPaymentOptions}
                value={
                  paymentStatusFilter !== null
                    ? String(paymentStatusFilter)
                    : ""
                }
                onChange={(val) =>
                  onPaymentStatusFilterChange(val ? Number(val) : null)
                }
                isLoading={isLoadingPaymentStatuses}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Loại dịch vụ */}
            <div className="w-44 shrink-0">
              <SearchSelect
                placeholder="Tất cả loại DV"
                options={filterServiceTypeOptions}
                value={
                  serviceTypeFilter !== null ? String(serviceTypeFilter) : ""
                }
                onChange={(val) =>
                  onServiceTypeFilterChange(val ? Number(val) : null)
                }
                isLoading={isLoadingServiceTypes}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
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

export default RepairTicketsFilterBar;
