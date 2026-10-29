"use client";

import React, { useMemo, useState } from "react";
import {
  ShoppingCart,
  Plus,
  RefreshCw,
  Search,
  Filter,
  X,
  CreditCard,
  Warehouse,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { OrderNavTabs } from "@/components/Common/OrderNavTabs";

export interface OrdersFilterBarProps {
  totalCount: number;
  searchInput: string;
  onSearch: (val: string) => void;
  statusFilter: number | null;
  setStatusFilter: (val: number | null) => void;
  orderStatusOptions: SelectOption[];
  isLoadingOrderStatuses: boolean;
  paymentStatusFilter: number | null;
  setPaymentStatusFilter: (val: number | null) => void;
  paymentStatusOptions: SelectOption[];
  isLoadingPaymentStatuses: boolean;
  orderTypeFilter: number | null;
  setOrderTypeFilter: (val: number | null) => void;
  orderTypeOptions: SelectOption[];
  isLoadingOrderTypes: boolean;
  khoFilter: string;
  setKhoFilter: (val: string) => void;
  khoOptions: SelectOption[];
  isLoadingKhos: boolean;
  isFetching: boolean;
  isLoadingKPI: boolean;
  onRefresh: () => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

interface ActiveChip {
  key: string;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  onRemove: () => void;
}

export const OrdersFilterBar: React.FC<OrdersFilterBarProps> = ({
  totalCount,
  searchInput,
  onSearch,
  statusFilter,
  setStatusFilter,
  orderStatusOptions,
  isLoadingOrderStatuses,
  paymentStatusFilter,
  setPaymentStatusFilter,
  paymentStatusOptions,
  isLoadingPaymentStatuses,
  orderTypeFilter,
  setOrderTypeFilter,
  orderTypeOptions,
  isLoadingOrderTypes,
  khoFilter,
  setKhoFilter,
  khoOptions,
  isLoadingKhos,
  isFetching,
  isLoadingKPI,
  onRefresh,
  hasActiveFilters,
  onResetFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // All options wrappers
  const allOrderStatusOptions = useMemo(
    () => [
      { value: "", label: "-- Tất cả trạng thái đơn --" },
      ...orderStatusOptions,
    ],
    [orderStatusOptions],
  );

  const allPaymentStatusOptions = useMemo(
    () => [
      { value: "", label: "-- Tất cả thanh toán --" },
      ...paymentStatusOptions,
    ],
    [paymentStatusOptions],
  );

  const allOrderTypeOptions = useMemo(
    () => [{ value: "", label: "-- Tất cả loại đơn --" }, ...orderTypeOptions],
    [orderTypeOptions],
  );

  const allKhoOptions = useMemo(
    () => [{ value: "", label: "-- Tất cả kho xuất --" }, ...khoOptions],
    [khoOptions],
  );

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== null) count++;
    if (paymentStatusFilter !== null) count++;
    if (orderTypeFilter !== null) count++;
    if (khoFilter) count++;
    return count;
  }, [statusFilter, paymentStatusFilter, orderTypeFilter, khoFilter]);

  // Danh sách các chip bộ lọc đang active (.map based)
  const activeChips: ActiveChip[] = useMemo(() => {
    const chips: ActiveChip[] = [];

    if (searchInput.trim()) {
      chips.push({
        key: "search",
        label: `Từ khóa: "${searchInput}"`,
        icon: Search,
        colorClass: "bg-muted text-foreground border-border/60",
        onRemove: () => onSearch(""),
      });
    }

    if (statusFilter !== null) {
      const match = orderStatusOptions.find(
        (s) => Number(s.value) === statusFilter,
      );
      chips.push({
        key: "status",
        label: `Trạng thái: ${match?.label || statusFilter}`,
        icon: CheckCircle2,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => setStatusFilter(null),
      });
    }

    if (paymentStatusFilter !== null) {
      const match = paymentStatusOptions.find(
        (p) => Number(p.value) === paymentStatusFilter,
      );
      chips.push({
        key: "payment",
        label: `Thanh toán: ${match?.label || paymentStatusFilter}`,
        icon: CreditCard,
        colorClass:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        onRemove: () => setPaymentStatusFilter(null),
      });
    }

    if (orderTypeFilter !== null) {
      const match = orderTypeOptions.find(
        (t) => Number(t.value) === orderTypeFilter,
      );
      chips.push({
        key: "type",
        label: `Loại đơn: ${match?.label || orderTypeFilter}`,
        icon: Tag,
        colorClass:
          "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
        onRemove: () => setOrderTypeFilter(null),
      });
    }

    if (khoFilter) {
      const match = khoOptions.find((k) => k.value === khoFilter);
      chips.push({
        key: "kho",
        label: `Kho: ${match?.label || khoFilter}`,
        icon: Warehouse,
        colorClass:
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        onRemove: () => setKhoFilter(""),
      });
    }

    return chips;
  }, [
    searchInput,
    statusFilter,
    paymentStatusFilter,
    orderTypeFilter,
    khoFilter,
    orderStatusOptions,
    paymentStatusOptions,
    orderTypeOptions,
    khoOptions,
    onSearch,
    setStatusFilter,
    setPaymentStatusFilter,
    setOrderTypeFilter,
    setKhoFilter,
  ]);

  return (
    <div className="space-y-4">
      {/* 1. Header & Action buttons */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1 flex-wrap">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Kinh doanh</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Đơn hàng & Bán hàng</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Quản Lý Đơn Hàng & Bán Hàng
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Theo dõi quy trình bán xe điện, phụ tùng, xuất kho serial và
                  tiến độ thanh toán
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
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              title="Tải lại dữ liệu đơn hàng"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
              />
              <span className="text-xs font-medium hidden xs:inline">
                Làm mới
              </span>
              <span className="text-xs font-medium xs:hidden">Reload</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher */}
        <div className="pt-1 max-w-full">
          <OrderNavTabs activeTab="orders" totalOrders={totalCount} />
        </div>
      </div>

      {/* 2. Filter Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách, số điện thoại..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 text-xs bg-background/80 w-full"
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
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              title="Tải lại dữ liệu"
              className="h-8.5 w-8.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
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
                    onClick={onResetFilters}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              {/* 1. Trạng thái đơn */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái đơn hàng
                </label>
                <SearchSelect
                  placeholder="Tất cả trạng thái..."
                  options={allOrderStatusOptions}
                  value={statusFilter !== null ? Number(statusFilter) : ""}
                  onChange={(val) => setStatusFilter(val ? Number(val) : null)}
                  isLoading={isLoadingOrderStatuses}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* 2. Thanh toán */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái thanh toán
                </label>
                <SearchSelect
                  placeholder="Tất cả thanh toán..."
                  options={allPaymentStatusOptions}
                  value={
                    paymentStatusFilter !== null
                      ? Number(paymentStatusFilter)
                      : ""
                  }
                  onChange={(val) =>
                    setPaymentStatusFilter(val ? Number(val) : null)
                  }
                  isLoading={isLoadingPaymentStatuses}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* 3. Loại đơn */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Phân loại đơn hàng
                </label>
                <SearchSelect
                  placeholder="Tất cả loại đơn..."
                  options={allOrderTypeOptions}
                  value={
                    orderTypeFilter !== null ? Number(orderTypeFilter) : ""
                  }
                  onChange={(val) =>
                    setOrderTypeFilter(val ? Number(val) : null)
                  }
                  isLoading={isLoadingOrderTypes}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* 4. Kho xuất */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Kho xuất hàng
                </label>
                <SearchSelect
                  placeholder="Tất cả kho xuất..."
                  options={allKhoOptions}
                  value={khoFilter}
                  onChange={(val) => setKhoFilter(val ? String(val) : "")}
                  isLoading={isLoadingKhos}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>
            </div>
          )}
        </div>

        {/* === GIAO DIỆN MÀN HÌNH LỚN (Desktop >= lg) === */}
        <div className="hidden lg:flex items-center justify-between gap-2.5 w-full">
          {/* Left: Ô tìm kiếm & Trạng thái */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm mã đơn, tên khách, số điện thoại..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 text-xs bg-background/80 w-full"
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

            <div className="w-44 shrink-0">
              <SearchSelect
                placeholder="Trạng thái đơn..."
                options={allOrderStatusOptions}
                value={statusFilter !== null ? Number(statusFilter) : ""}
                onChange={(val) => setStatusFilter(val ? Number(val) : null)}
                isLoading={isLoadingOrderStatuses}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Right: Thanh toán, Loại đơn, Kho xuất & Tải lại */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-40 shrink-0">
              <SearchSelect
                placeholder="Thanh toán..."
                options={allPaymentStatusOptions}
                value={
                  paymentStatusFilter !== null
                    ? Number(paymentStatusFilter)
                    : ""
                }
                onChange={(val) =>
                  setPaymentStatusFilter(val ? Number(val) : null)
                }
                isLoading={isLoadingPaymentStatuses}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            <div className="w-38 shrink-0">
              <SearchSelect
                placeholder="Loại đơn..."
                options={allOrderTypeOptions}
                value={orderTypeFilter !== null ? Number(orderTypeFilter) : ""}
                onChange={(val) => setOrderTypeFilter(val ? Number(val) : null)}
                isLoading={isLoadingOrderTypes}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            <div className="w-40 shrink-0">
              <SearchSelect
                placeholder="Kho xuất..."
                options={allKhoOptions}
                value={khoFilter}
                onChange={(val) => setKhoFilter(val ? String(val) : "")}
                isLoading={isLoadingKhos}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              title="Tải lại dữ liệu"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
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

export default OrdersFilterBar;
