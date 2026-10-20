"use client";

import React, { useMemo } from "react";
import {
  Building2,
  Plus,
  RefreshCw,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { InstallmentNavTabs } from "@/components/Common/InstallmentNavTabs";

export interface InstallmentProvidersFilterBarProps {
  totalProviders: number;
  searchInput: string;
  setSearchInput: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  isFetching: boolean;
  onRefresh: () => void;
  onOpenAdd: () => void;
}

const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả trạng thái hợp tác" },
  { value: "active", label: "Đang hợp tác hoạt động" },
  { value: "inactive", label: "Tạm dừng xử lý hồ sơ" },
];

export const InstallmentProvidersFilterBar: React.FC<
  InstallmentProvidersFilterBarProps
> = ({
  totalProviders,
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  isFetching,
  onRefresh,
  onOpenAdd,
}) => {
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

    if (statusFilter && statusFilter !== "all") {
      const match = STATUS_FILTER_OPTIONS.find((s) => s.value === statusFilter);
      chips.push({
        id: "status",
        label: `Trạng thái: ${match?.label || statusFilter}`,
        onClear: () => setStatusFilter("all"),
      });
    }

    return chips;
  }, [searchInput, statusFilter, setSearchInput, setStatusFilter]);

  const handleClearAllFilters = () => {
    setSearchInput("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-2xs shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2 truncate">
              Đối Tác & Đơn Vị Cho Vay Trả Góp
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
              Quản lý danh mục các công ty tài chính / ngân hàng liên kết (HD Saison, FE Credit, Home Credit, Mirae Asset...)
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
            <span className="text-xs">Thêm đối tác</span>
          </Button>
        </div>
      </div>

      {/* 2. NavTabs */}
      <div className="pt-1">
        <InstallmentNavTabs
          activeTab="providers"
          totalProviders={totalProviders}
        />
      </div>

      {/* 3. Filter Toolbar */}
      <div className="p-3.5 sm:p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Ô tìm kiếm từ khóa */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Tìm theo mã đối tác, tên công ty tài chính, hotline..."
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

          {/* Chọn Trạng thái */}
          <div className="w-full sm:w-64">
            <SearchSelect
              placeholder="Lọc theo trạng thái..."
              options={STATUS_FILTER_OPTIONS}
              value={statusFilter}
              onChange={(val) => setStatusFilter(String(val))}
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
