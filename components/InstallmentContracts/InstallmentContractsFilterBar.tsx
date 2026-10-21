"use client";

import React, { useMemo, useState } from "react";
import {
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  X,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { InstallmentNavTabs } from "@/components/Common/InstallmentNavTabs";

export interface InstallmentContractsFilterBarProps {
  totalContracts: number;
  searchInput: string;
  setSearchInput: (value: string) => void;
  providerFilter: string;
  setProviderFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  disbursementFilter: string;
  setDisbursementFilter: (value: string) => void;
  providerOptions: SelectOption[];
  isFetching: boolean;
  onRefresh: () => void;
  onOpenAdd: () => void;
}

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả trạng thái thẩm định" },
  { value: "110", label: "Chờ thẩm định (110)" },
  { value: "111", label: "Đã duyệt vay (111)" },
  { value: "112", label: "Từ chối hồ sơ (112)" },
  { value: "113", label: "Đã ký hợp đồng (113)" },
  { value: "114", label: "Đang trả góp (114)" },
  { value: "115", label: "Đã tất toán (115)" },
];

const DISBURSEMENT_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả giải ngân" },
  { value: "120", label: "Chưa giải ngân (120)" },
  { value: "121", label: "Đã giải ngân về shop (121)" },
];

export const InstallmentContractsFilterBar: React.FC<
  InstallmentContractsFilterBarProps
> = ({
  totalContracts,
  searchInput,
  setSearchInput,
  providerFilter,
  setProviderFilter,
  statusFilter,
  setStatusFilter,
  disbursementFilter,
  setDisbursementFilter,
  providerOptions,
  isFetching,
  onRefresh,
  onOpenAdd,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toàn bộ options cho Provider gồm mục Tất cả
  const allProviderOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "Tất cả đối tác tài chính" },
      ...providerOptions,
    ];
  }, [providerOptions]);

  // Đếm số lượng bộ lọc dropdown đang áp dụng
  const activeCount = useMemo(() => {
    let count = 0;
    if (providerFilter) count++;
    if (statusFilter && statusFilter !== "all") count++;
    if (disbursementFilter && disbursementFilter !== "all") count++;
    return count;
  }, [providerFilter, statusFilter, disbursementFilter]);

  // Danh sách các chip bộ lọc đang active
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; onClear: () => void }[] = [];

    if (searchInput.trim()) {
      chips.push({
        id: "search",
        label: `Tìm: "${searchInput}"`,
        onClear: () => setSearchInput(""),
      });
    }

    if (providerFilter) {
      const match = providerOptions.find((p) => p.value === providerFilter);
      chips.push({
        id: "provider",
        label: `Đối tác: ${match?.label || providerFilter}`,
        onClear: () => setProviderFilter(""),
      });
    }

    if (statusFilter && statusFilter !== "all") {
      const match = STATUS_FILTER_OPTIONS.find((s) => s.value === statusFilter);
      chips.push({
        id: "status",
        label: `Thẩm định: ${match?.label || statusFilter}`,
        onClear: () => setStatusFilter("all"),
      });
    }

    if (disbursementFilter && disbursementFilter !== "all") {
      const match = DISBURSEMENT_FILTER_OPTIONS.find(
        (d) => d.value === disbursementFilter
      );
      chips.push({
        id: "disbursement",
        label: `Giải ngân: ${match?.label || disbursementFilter}`,
        onClear: () => setDisbursementFilter("all"),
      });
    }

    return chips;
  }, [
    searchInput,
    providerFilter,
    statusFilter,
    disbursementFilter,
    providerOptions,
    setSearchInput,
    setProviderFilter,
    setStatusFilter,
    setDisbursementFilter,
  ]);

  const hasActiveFilters = activeChips.length > 0;

  const handleClearAllFilters = () => {
    setSearchInput("");
    setProviderFilter("");
    setStatusFilter("all");
    setDisbursementFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* 1. Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2 truncate">
              Hợp Đồng & Hồ Sơ Mua Xe Trả Góp
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
              Theo dõi các gói vay mua xe điện, tiến độ duyệt thẩm định tín dụng
              và giải ngân về tài khoản showroom
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs flex-1 sm:flex-initial justify-center"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
            <span className="text-xs font-medium">Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenAdd}
            className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium flex-1 sm:flex-initial justify-center"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Lập hồ sơ trả góp</span>
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="pt-1 max-w-full">
        <InstallmentNavTabs
          activeTab="contracts"
          totalContracts={totalContracts}
        />
      </div>

      {/* 3. Filter Toolbar Card */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm theo số HĐ, tên khách hàng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-8 h-9.5 text-xs w-full bg-background/80 focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
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
              className={`h-8.5 px-3 gap-1.5 text-xs font-medium border-border/80 cursor-pointer transition-colors ${
                activeCount > 0
                  ? "border-blue-500/50 bg-blue-50/50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
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

            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
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
                    onClick={handleClearAllFilters}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                  >
                    Đặt lại bộ lọc
                  </button>
                )}
              </div>

              {/* 1. Chọn Đối tác cho vay */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Đối tác cho vay
                </label>
                <SearchSelect
                  placeholder="Tất cả đối tác..."
                  options={allProviderOptions}
                  value={providerFilter}
                  onChange={(val) => setProviderFilter(String(val))}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* 2. Chọn Tiến độ thẩm định */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Tiến độ thẩm định
                </label>
                <SearchSelect
                  placeholder="Tất cả tiến độ..."
                  options={STATUS_FILTER_OPTIONS}
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(String(val))}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* 3. Chọn Trạng thái giải ngân */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái giải ngân
                </label>
                <SearchSelect
                  placeholder="Tất cả trạng thái..."
                  options={DISBURSEMENT_FILTER_OPTIONS}
                  value={disbursementFilter}
                  onChange={(val) => setDisbursementFilter(String(val))}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>
            </div>
          )}
        </div>

        {/* === GIAO DIỆN MÀN HÌNH LỚN (Desktop >= lg) === */}
        <div className="hidden lg:flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-2.5 flex-1 flex-wrap">
            {/* Ô tìm kiếm từ khóa */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Tìm theo số HĐ, tên khách hàng..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-8 h-9.5 text-xs bg-background/80 focus-visible:ring-blue-500/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Chọn Đối tác cho vay */}
            <div className="w-56">
              <SearchSelect
                placeholder="Đối tác cho vay..."
                options={allProviderOptions}
                value={providerFilter}
                onChange={(val) => setProviderFilter(String(val))}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Chọn Tiến độ thẩm định */}
            <div className="w-56">
              <SearchSelect
                placeholder="Tiến độ thẩm định..."
                options={STATUS_FILTER_OPTIONS}
                value={statusFilter}
                onChange={(val) => setStatusFilter(String(val))}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Chọn Trạng thái giải ngân */}
            <div className="w-52">
              <SearchSelect
                placeholder="Giải ngân về shop..."
                options={DISBURSEMENT_FILTER_OPTIONS}
                value={disbursementFilter}
                onChange={(val) => setDisbursementFilter(String(val))}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={onRefresh}
            disabled={isFetching}
            title="Tải lại dữ liệu"
            className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
          </Button>
        </div>

        {/* 4. Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/60 text-xs">
            <span className="text-muted-foreground font-medium text-[11px] mr-1">
              Đang lọc:
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onClear}
                  className="hover:text-red-500 p-0.5 rounded-full cursor-pointer transition-colors"
                  title="Gỡ bộ lọc này"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={handleClearAllFilters}
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
export default InstallmentContractsFilterBar;

