"use client";

import React, { useMemo } from "react";
import {
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  X,
  Building2,
  SlidersHorizontal,
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
  // Toàn bộ options cho Provider gồm mục Tất cả
  const allProviderOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "Tất cả đối tác tài chính" },
      ...providerOptions,
    ];
  }, [providerOptions]);

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

        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
            />
            <span className="text-xs font-medium">Làm mới</span>
          </Button>

          <Button
            size="sm"
            onClick={onOpenAdd}
            className="h-9 px-4 flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="text-xs">Lập hồ sơ trả góp</span>
          </Button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="pt-1">
        <InstallmentNavTabs
          activeTab="contracts"
          totalContracts={totalContracts}
        />
      </div>

      {/* 3. Filter Toolbar Card */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
          {/* Ô tìm kiếm từ khóa */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Tìm theo số HĐ, tên khách hàng..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs"
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
          <div>
            <SearchSelect
              placeholder="Đối tác cho vay..."
              options={allProviderOptions}
              value={providerFilter}
              onChange={(val) => setProviderFilter(String(val))}
            />
          </div>

          {/* Chọn Tiến độ thẩm định */}
          <div>
            <SearchSelect
              placeholder="Tiến độ thẩm định..."
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(val) => setStatusFilter(String(val))}
            />
          </div>

          {/* Chọn Trạng thái giải ngân */}
          <div>
            <SearchSelect
              placeholder="Giải ngân về shop..."
              options={DISBURSEMENT_FILTER_OPTIONS}
              value={disbursementFilter}
              onChange={(val) => setDisbursementFilter(String(val))}
            />
          </div>
        </div>

        {/* 4. Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-border/60 text-xs">
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
              onClick={handleClearAllFilters}
              className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1 cursor-pointer transition-colors"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
