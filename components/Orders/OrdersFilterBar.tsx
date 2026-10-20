"use client";

import React, { useMemo } from "react";
import {
  ShoppingCart,
  Plus,
  RefreshCw,
  Search,
  X,
  SlidersHorizontal,
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
  onOpenCreate: () => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
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
  onOpenCreate,
  hasActiveFilters,
  onResetFilters,
}) => {
  // All options wrappers
  const allOrderStatusOptions = useMemo(
    () => [{ value: "", label: "Tất cả trạng thái đơn" }, ...orderStatusOptions],
    [orderStatusOptions]
  );

  const allPaymentStatusOptions = useMemo(
    () => [{ value: "", label: "Tất cả thanh toán" }, ...paymentStatusOptions],
    [paymentStatusOptions]
  );

  const allOrderTypeOptions = useMemo(
    () => [{ value: "", label: "Tất cả loại đơn" }, ...orderTypeOptions],
    [orderTypeOptions]
  );

  const allKhoOptions = useMemo(
    () => [{ value: "", label: "Tất cả kho xuất" }, ...khoOptions],
    [khoOptions]
  );

  // Danh sách các chip bộ lọc đang active
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onClear: () => void }[] = [];

    if (searchInput.trim()) {
      chips.push({
        id: "search",
        label: `Tìm: "${searchInput}"`,
        onClear: () => onSearch(""),
      });
    }

    if (statusFilter !== null) {
      const match = orderStatusOptions.find(
        (s) => Number(s.value) === statusFilter
      );
      chips.push({
        id: "status",
        label: `Trạng thái: ${match?.label || statusFilter}`,
        onClear: () => setStatusFilter(null),
      });
    }

    if (paymentStatusFilter !== null) {
      const match = paymentStatusOptions.find(
        (p) => Number(p.value) === paymentStatusFilter
      );
      chips.push({
        id: "payment",
        label: `Thanh toán: ${match?.label || paymentStatusFilter}`,
        onClear: () => setPaymentStatusFilter(null),
      });
    }

    if (orderTypeFilter !== null) {
      const match = orderTypeOptions.find(
        (t) => Number(t.value) === orderTypeFilter
      );
      chips.push({
        id: "type",
        label: `Loại đơn: ${match?.label || orderTypeFilter}`,
        onClear: () => setOrderTypeFilter(null),
      });
    }

    if (khoFilter) {
      const match = khoOptions.find((k) => k.value === khoFilter);
      chips.push({
        id: "kho",
        label: `Kho: ${match?.label || khoFilter}`,
        onClear: () => setKhoFilter(""),
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs shrink-0">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2 truncate">
              Quản Lý Đơn Hàng & Bán Hàng
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
              Theo dõi quy trình bán xe điện, phụ tùng, xuất kho serial và tiến độ thanh toán
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching || isLoadingKPI}
            className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
              }`}
            />
            <span className="text-xs font-medium">Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenCreate}
            className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Tạo đơn hàng mới</span>
          </Button>
        </div>
      </div>

      {/* 2. OrderNavTabs */}
      <div className="pt-1">
        <OrderNavTabs activeTab="orders" totalOrders={totalCount} />
      </div>

      {/* 3. Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Ô tìm kiếm từ khóa */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Tìm theo mã đơn, tên khách, số điện thoại..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs bg-background/80"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Nhóm Select bộ lọc */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Trạng thái đơn..."
                options={allOrderStatusOptions}
                value={statusFilter !== null ? Number(statusFilter) : ""}
                onChange={(val) =>
                  setStatusFilter(val ? Number(val) : null)
                }
                isLoading={isLoadingOrderStatuses}
              />
            </div>

            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Thanh toán..."
                options={allPaymentStatusOptions}
                value={paymentStatusFilter !== null ? String(paymentStatusFilter) : ""}
                onChange={(val) =>
                  setPaymentStatusFilter(val ? Number(val) : null)
                }
                isLoading={isLoadingPaymentStatuses}
              />
            </div>

            <div className="w-full sm:w-40">
              <SearchSelect
                placeholder="Phân loại đơn..."
                options={allOrderTypeOptions}
                value={orderTypeFilter !== null ? String(orderTypeFilter) : ""}
                onChange={(val) =>
                  setOrderTypeFilter(val ? Number(val) : null)
                }
                isLoading={isLoadingOrderTypes}
              />
            </div>

            <div className="w-full sm:w-44">
              <SearchSelect
                placeholder="Kho xuất hàng..."
                options={allKhoOptions}
                value={khoFilter}
                onChange={(val) => setKhoFilter(val ? String(val) : "")}
                isLoading={isLoadingKhos}
              />
            </div>
          </div>
        </div>

        {/* 4. Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/50 text-xs">
            <span className="text-muted-foreground flex items-center gap-1 font-medium text-[11px] mr-1">
              <SlidersHorizontal className="w-3 h-3" />
              Đang lọc:
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onClear}
                  className="hover:text-blue-900 dark:hover:text-blue-100 p-0.5 rounded-full cursor-pointer transition-colors"
                  title="Gỡ bộ lọc này"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
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
