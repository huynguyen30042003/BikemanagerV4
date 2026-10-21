"use client";

import React from "react";
import { Search, X, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchSelect } from "@/components/ui/selectSearch";

interface OptionItem {
  value: string | number;
  label: string;
}

interface WarrantyClaimsFilterBarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  statusFilter: number | null;
  onStatusFilterChange: (value: number | null) => void;
  actionFilter: number | null;
  onActionFilterChange: (value: number | null) => void;
  claimStatusOptions: OptionItem[];
  isLoadingClaimStatuses?: boolean;
  actionOptions: OptionItem[];
  isLoadingActions?: boolean;
}

export function WarrantyClaimsFilterBar({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  actionFilter,
  onActionFilterChange,
  claimStatusOptions,
  isLoadingClaimStatuses = false,
  actionOptions,
  isLoadingActions = false,
}: WarrantyClaimsFilterBarProps) {
  const hasActiveFilters = Boolean(
    searchInput.trim() || statusFilter !== null || actionFilter !== null
  );

  const handleReset = () => {
    onSearchChange("");
    onStatusFilterChange(null);
    onActionFilterChange(null);
  };

  return (
    <div className="p-4 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Tìm theo mã phiếu, tên khách, SĐT, mô tả lỗi..."
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-52">
            <SearchSelect
              placeholder="Trạng thái phiếu..."
              options={[
                { value: "", label: "Tất cả trạng thái" },
                ...claimStatusOptions,
              ]}
              value={statusFilter !== null ? String(statusFilter) : ""}
              onChange={(val) => onStatusFilterChange(val ? Number(val) : null)}
              isLoading={isLoadingClaimStatuses}
            />
          </div>

          <div className="w-full sm:w-52">
            <SearchSelect
              placeholder="Hướng xử lý..."
              options={[
                { value: "", label: "Tất cả hướng xử lý" },
                ...actionOptions,
              ]}
              value={actionFilter !== null ? String(actionFilter) : ""}
              onChange={(val) => onActionFilterChange(val ? Number(val) : null)}
              isLoading={isLoadingActions}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
