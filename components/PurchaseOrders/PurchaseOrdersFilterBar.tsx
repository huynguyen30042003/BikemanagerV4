"use client";

import React, { useMemo, useState } from "react";
import {
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Search,
  X,
  Filter,
  Building2,
  Warehouse,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { PurchaseNavTabs } from "@/components/Common/PurchaseNavTabs";

export interface PurchaseOrdersFilterBarProps {
  searchInput: string;
  onSearch: (val: string) => void;
  supplierFilter: string;
  onSupplierFilterChange: (val: string) => void;
  supplierOptions: SelectOption[];
  isLoadingSuppliers?: boolean;
  khoFilter: string;
  onKhoFilterChange: (val: string) => void;
  khoOptions: SelectOption[];
  isLoadingKhos?: boolean;
  statusFilter: number | null;
  onStatusFilterChange: (val: number | null) => void;
  orderStatusOptions: SelectOption[];
  isLoadingStatuses?: boolean;
  onOpenCreate: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

interface ActiveChip {
  key: string;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  onRemove: () => void;
}

export const PurchaseOrdersFilterBar: React.FC<
  PurchaseOrdersFilterBarProps
> = ({
  searchInput,
  onSearch,
  supplierFilter,
  onSupplierFilterChange,
  supplierOptions,
  isLoadingSuppliers = false,
  khoFilter,
  onKhoFilterChange,
  khoOptions,
  isLoadingKhos = false,
  statusFilter,
  onStatusFilterChange,
  orderStatusOptions,
  isLoadingStatuses = false,
  onOpenCreate,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filterSupplierOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả nhà cung cấp --" },
      ...supplierOptions,
    ];
  }, [supplierOptions]);

  const filterKhoOptions: SelectOption[] = useMemo(() => {
    return [{ value: "", label: "-- Tất cả kho tiếp nhận --" }, ...khoOptions];
  }, [khoOptions]);

  const filterStatusOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "-- Tất cả trạng thái đơn nhập --" },
      ...orderStatusOptions.map((opt) => ({
        value: String(opt.value),
        label: opt.label,
      })),
    ];
  }, [orderStatusOptions]);

  const currentSupplierLabel = useMemo(() => {
    if (!supplierFilter) return "";
    const found = supplierOptions.find(
      (s) => String(s.value) === String(supplierFilter),
    );
    return found ? found.label : `NCC #${supplierFilter.substring(0, 8)}`;
  }, [supplierFilter, supplierOptions]);

  const currentKhoLabel = useMemo(() => {
    if (!khoFilter) return "";
    const found = khoOptions.find((k) => String(k.value) === String(khoFilter));
    return found ? found.label : `Kho #${khoFilter.substring(0, 8)}`;
  }, [khoFilter, khoOptions]);

  const currentStatusLabel = useMemo(() => {
    if (statusFilter === null) return "";
    const found = orderStatusOptions.find(
      (st) => Number(st.value) === Number(statusFilter),
    );
    return found ? found.label : `Trạng thái #${statusFilter}`;
  }, [statusFilter, orderStatusOptions]);

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    if (supplierFilter) count++;
    if (khoFilter) count++;
    if (statusFilter !== null) count++;
    return count;
  }, [supplierFilter, khoFilter, statusFilter]);

  // Active filter chips dùng .map()
  const activeChips: ActiveChip[] = useMemo(() => {
    const list: ActiveChip[] = [];

    if (searchInput) {
      list.push({
        key: "search",
        label: `Từ khóa: "${searchInput}"`,
        icon: Search,
        colorClass: "bg-muted text-foreground border-border/60",
        onRemove: () => onSearch(""),
      });
    }

    if (supplierFilter) {
      list.push({
        key: "supplier",
        label: `NCC: ${currentSupplierLabel}`,
        icon: Building2,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onSupplierFilterChange(""),
      });
    }

    if (khoFilter) {
      list.push({
        key: "kho",
        label: `Kho: ${currentKhoLabel}`,
        icon: Warehouse,
        colorClass:
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        onRemove: () => onKhoFilterChange(""),
      });
    }

    if (statusFilter !== null) {
      list.push({
        key: "status",
        label: `Trạng thái: ${currentStatusLabel}`,
        icon: CheckCircle2,
        colorClass:
          "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        onRemove: () => onStatusFilterChange(null),
      });
    }

    return list;
  }, [
    searchInput,
    supplierFilter,
    currentSupplierLabel,
    khoFilter,
    currentKhoLabel,
    statusFilter,
    currentStatusLabel,
    onSearch,
    onSupplierFilterChange,
    onKhoFilterChange,
    onStatusFilterChange,
  ]);

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
              <span>Kho & Vận hành</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Đơn nhập hàng (PO)</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Đơn nhập hàng & Nhập kho PO
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý mua hàng từ nhà cung cấp, chi phí vận chuyển, công nợ
                  và duyệt nhập kho xe thực tế
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              title="Tải lại dữ liệu"
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

            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Tạo đơn nhập hàng</span>
            </Button>
          </div>
        </div>

        {/* Purchase Navigation Tabs */}
        <div className="pt-1 max-w-full">
          <PurchaseNavTabs activeTab="orders" />
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
              placeholder="Tìm mã đơn nhập, hóa đơn, ghi chú..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 text-xs bg-background/90 w-full"
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

              {/* Lọc theo Nhà cung cấp */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Nhà cung cấp
                </label>
                <SearchSelect
                  placeholder="Tất cả nhà cung cấp..."
                  options={filterSupplierOptions}
                  value={supplierFilter}
                  onChange={(val) => onSupplierFilterChange(String(val))}
                  isLoading={isLoadingSuppliers}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Lọc theo Kho tiếp nhận */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Kho tiếp nhận
                </label>
                <SearchSelect
                  placeholder="Tất cả kho tiếp nhận..."
                  options={filterKhoOptions}
                  value={khoFilter}
                  onChange={(val) => onKhoFilterChange(String(val))}
                  isLoading={isLoadingKhos}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Lọc theo Trạng thái đơn */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái đơn nhập
                </label>
                <SearchSelect
                  placeholder="Tất cả trạng thái..."
                  options={filterStatusOptions}
                  value={statusFilter !== null ? Number(statusFilter) : ""}
                  onChange={(val) =>
                    onStatusFilterChange(val ? Number(val) : null)
                  }
                  isLoading={isLoadingStatuses}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>
            </div>
          )}
        </div>

        {/* === GIAO DIỆN MÀN HÌNH LỚN (Desktop >= lg) === */}
        <div className="hidden lg:flex items-center justify-between gap-2.5 w-full">
          <div className="flex items-center gap-2 flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Tìm mã đơn nhập, hóa đơn, ghi chú..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 text-xs bg-background/90 w-full"
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

            {/* Lọc theo Nhà cung cấp */}
            <div className="w-52 shrink-0">
              <SearchSelect
                placeholder="Tất cả nhà cung cấp"
                options={filterSupplierOptions}
                value={supplierFilter}
                onChange={(val) => onSupplierFilterChange(String(val))}
                isLoading={isLoadingSuppliers}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Lọc theo Kho tiếp nhận */}
            <div className="w-52 shrink-0">
              <SearchSelect
                placeholder="Tất cả kho nhận"
                options={filterKhoOptions}
                value={khoFilter}
                onChange={(val) => onKhoFilterChange(String(val))}
                isLoading={isLoadingKhos}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Right: Trạng thái & Tải lại */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-52 shrink-0">
              <SearchSelect
                placeholder="Tất cả trạng thái"
                options={filterStatusOptions}
                value={statusFilter !== null ? Number(statusFilter) : ""}
                onChange={(val) =>
                  onStatusFilterChange(val ? Number(val) : null)
                }
                isLoading={isLoadingStatuses}
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

export default PurchaseOrdersFilterBar;
