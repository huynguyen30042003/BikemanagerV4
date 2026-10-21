"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Plus,
  RefreshCw,
  Search,
  Filter,
  LayoutGrid,
  List,
  Menu,
  X,
  LucideIcon,
  MapPin,
  CheckCircle2,
  Building2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { CustomerNavTabs } from "@/components/Common/CustomerNavTabs";

export type ViewMode = "grid" | "table";

export interface CustomerFilterBarProps {
  totalKhachHang: number;
  totalCaNhan: number;
  totalToChuc: number;
  totalHoatDong: number;
  searchInput: string;
  onSearch: (val: string) => void;
  tinhFilter: string | number;
  onTinhFilterChange: (val: string | number) => void;
  provinceOptions: SelectOption[];
  isLoadingTinh: boolean;
  loaiFilter: string;
  onLoaiFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenCreate: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI: boolean;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
  activeClass: string;
}

const VIEW_MODE_OPTIONS: { mode: ViewMode; label: string; icon: LucideIcon }[] = [
  { mode: "grid", label: "Lưới thẻ", icon: LayoutGrid },
  { mode: "table", label: "Bảng", icon: List },
];

export const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({
  totalKhachHang,
  totalCaNhan,
  totalToChuc,
  totalHoatDong,
  searchInput,
  onSearch,
  tinhFilter,
  onTinhFilterChange,
  provinceOptions,
  isLoadingTinh,
  loaiFilter,
  onLoaiFilterChange,
  statusFilter,
  onStatusFilterChange,
  viewMode,
  onViewModeChange,
  onOpenCreate,
  onRefresh,
  isFetching,
  isLoadingKPI,
  onResetFilters,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Cấu hình phân loại khách hàng qua mảng để dùng .map()
  const loaiOptions: FilterOption[] = useMemo(
    () => [
      {
        value: "all",
        label: `Tất cả (${totalKhachHang})`,
        activeClass: "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold",
      },
      {
        value: "1",
        label: `Cá nhân (${totalCaNhan})`,
        activeClass: "bg-background shadow-xs text-sky-600 dark:text-sky-400 font-semibold",
      },
      {
        value: "2",
        label: `Tổ chức (${totalToChuc})`,
        activeClass: "bg-background shadow-xs text-indigo-600 dark:text-indigo-400 font-semibold",
      },
    ],
    [totalKhachHang, totalCaNhan, totalToChuc]
  );

  // Cấu hình trạng thái khách hàng qua mảng để dùng .map()
  const statusOptions: FilterOption[] = useMemo(
    () => [
      {
        value: "all",
        label: "Tất cả",
        activeClass: "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold",
      },
      {
        value: "active",
        label: `Hoạt động (${totalHoatDong})`,
        activeClass: "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold",
      },
      {
        value: "inactive",
        label: "Khóa",
        activeClass: "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold",
      },
    ],
    [totalHoatDong]
  );

  // Đếm số lượng bộ lọc nâng cao
  const activeCount = useMemo(() => {
    let count = 0;
    if (tinhFilter) count++;
    if (loaiFilter !== "all") count++;
    if (statusFilter !== "all") count++;
    return count;
  }, [tinhFilter, loaiFilter, statusFilter]);

  // Danh sách các chip đang lọc (Dùng .map() render sạch sẽ)
  const activeChips = useMemo(() => {
    const chips: {
      id: string;
      label: React.ReactNode;
      onRemove: () => void;
    }[] = [];

    if (searchInput) {
      chips.push({
        id: "search",
        label: (
          <span>
            Từ khóa: <strong className="font-semibold">&quot;{searchInput}&quot;</strong>
          </span>
        ),
        onRemove: () => onSearch(""),
      });
    }

    if (loaiFilter !== "all") {
      chips.push({
        id: "loai",
        label: (
          <span className="flex items-center gap-1 text-blue-700 dark:text-blue-300">
            {loaiFilter === "2" ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
            Loại: <strong className="font-semibold">{loaiFilter === "1" ? "Cá nhân" : "Doanh nghiệp"}</strong>
          </span>
        ),
        onRemove: () => onLoaiFilterChange("all"),
      });
    }

    if (tinhFilter) {
      const selectedProvince = provinceOptions.find(
        (p) => String(p.value) === String(tinhFilter)
      );
      chips.push({
        id: "tinh",
        label: (
          <span className="flex items-center gap-1 text-amber-700 dark:text-amber-300">
            <MapPin className="w-3 h-3" />
            Tỉnh/Thành: <strong className="font-semibold">{selectedProvince?.label || tinhFilter}</strong>
          </span>
        ),
        onRemove: () => onTinhFilterChange(""),
      });
    }

    if (statusFilter !== "all") {
      chips.push({
        id: "status",
        label: (
          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            Trạng thái: <strong className="font-semibold">{statusFilter === "active" ? "Đang hoạt động" : "Đã khóa"}</strong>
          </span>
        ),
        onRemove: () => onStatusFilterChange("all"),
      });
    }

    return chips;
  }, [
    searchInput,
    loaiFilter,
    tinhFilter,
    statusFilter,
    provinceOptions,
    onSearch,
    onLoaiFilterChange,
    onTinhFilterChange,
    onStatusFilterChange,
  ]);

  const hasActiveFilters = activeChips.length > 0;

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* 1. Header & Navigation Hub */}
      <div className="flex flex-col gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Kinh doanh</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Khách hàng</span>
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Hồ sơ Khách hàng
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý khách hàng cá nhân & tổ chức doanh nghiệp, tích hợp thông tin liên hệ và định danh
                </p>
              </div>
            </div>
          </div>

          {/* Action Button: Thêm khách hàng mới */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Button
              size="sm"
              onClick={onOpenCreate}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm khách hàng</span>
            </Button>
          </div>
        </div>

        {/* Quick Tab Switcher with Horizontal Scroll */}
        <div className="pt-1 max-w-full">
          <CustomerNavTabs activeTab="customer" totalCustomer={totalKhachHang} />
        </div>
      </div>

      {/* 2. Toolbar: Search, Filters & View Mode Switcher */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô tìm kiếm từ khóa trên Mobile */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm theo tên, mã KH, số điện thoại, email, CCCD/MST..."
              value={searchInput}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-xs sm:text-sm focus-visible:ring-blue-500/20"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => onSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dòng điều khiển: Nút mở bộ lọc + Chuyển đổi View + Tải lại */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen((prev) => !prev)}
              className={`h-8.5 px-3 gap-1.5 text-xs font-medium border-border/80 cursor-pointer transition-colors ${
                activeCount > 0
                  ? "border-blue-500/50 bg-blue-50/50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                  : "text-muted-foreground"
              }`}
            >
              {isMobileFilterOpen ? (
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

            {/* Mobile View Mode & Reload */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shadow-2xs">
                {VIEW_MODE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = viewMode === opt.mode;
                  return (
                    <button
                      key={opt.mode}
                      type="button"
                      onClick={() => onViewModeChange(opt.mode)}
                      title={`Chế độ xem ${opt.label}`}
                      className={`flex items-center justify-center w-7.5 h-7.5 rounded-md transition-all cursor-pointer ${
                        isSelected
                          ? "bg-background text-foreground shadow-2xs font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={onRefresh}
                disabled={isFetching || isLoadingKPI}
                title="Tải lại"
                className="h-8.5 w-8.5 shrink-0 cursor-pointer shadow-2xs active:scale-95"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* KHUNG BỘ LỌC CHI TIẾT KHI MÀN HÌNH NHỎ (Thu gọn / Mở rộng) */}
          {isMobileFilterOpen && (
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

              {/* 1. Lọc theo Tỉnh/Thành */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Tỉnh / Thành phố
                </label>
                <SearchSelect
                  options={[
                    { value: "", label: "Tất cả Tỉnh/Thành" },
                    ...provinceOptions,
                  ]}
                  value={tinhFilter}
                  onChange={(val) => onTinhFilterChange(val ?? "")}
                  placeholder="Chọn Tỉnh/Thành..."
                  isLoading={isLoadingTinh}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* 2. Phân loại khách hàng */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Phân loại đối tượng
                </label>
                <div className="grid grid-cols-3 gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs">
                  {loaiOptions.map((opt) => {
                    const isSelected = loaiFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onLoaiFilterChange(opt.value)}
                        className={`px-2 py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                          isSelected
                            ? `bg-card shadow-xs ${opt.activeClass}`
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Trạng thái hoạt động */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Trạng thái hoạt động
                </label>
                <div className="grid grid-cols-3 gap-1 bg-background/80 p-1 rounded-lg border border-border/60 text-xs">
                  {statusOptions.map((opt) => {
                    const isSelected = statusFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => onStatusFilterChange(opt.value)}
                        className={`px-2 py-1.5 rounded-md font-medium text-center transition-all cursor-pointer ${
                          isSelected
                            ? `bg-card shadow-xs ${opt.activeClass}`
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt.label}
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
          {/* Ô tìm kiếm & Bộ lọc Tỉnh */}
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Tìm theo tên, mã KH, số điện thoại, email, CCCD/MST..."
                value={searchInput}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm focus-visible:ring-blue-500/20"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => onSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                  title="Xóa tìm kiếm"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tỉnh thành Filter */}
            <div className="w-48 shrink-0">
              <SearchSelect
                options={[
                  { value: "", label: "Tất cả Tỉnh/Thành" },
                  ...provinceOptions,
                ]}
                value={tinhFilter}
                onChange={(val) => onTinhFilterChange(val ?? "")}
                placeholder="Chọn Tỉnh/Thành"
                isLoading={isLoadingTinh}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Desktop Right Side: Segment Controls & View Mode & Reload */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Phân loại Tabs (Sử dụng .map()) */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5 shrink-0" />
              {loaiOptions.map((opt) => {
                const isSelected = loaiFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onLoaiFilterChange(opt.value)}
                    className={`px-2.5 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap text-center ${
                      isSelected
                        ? opt.activeClass
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Trạng thái filter (Sử dụng .map()) */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
              {statusOptions.map((opt) => {
                const isSelected = statusFilter === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onStatusFilterChange(opt.value)}
                    className={`px-2.5 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer whitespace-nowrap text-center ${
                      isSelected
                        ? opt.activeClass
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Desktop View Mode & Reload */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/60 p-0.5 shrink-0 shadow-2xs">
              {VIEW_MODE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = viewMode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => onViewModeChange(opt.mode)}
                    title={`Chế độ xem ${opt.label}`}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                      isSelected
                        ? "bg-background text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isFetching || isLoadingKPI}
              title="Tải lại danh sách và chỉ số KPI"
              className="h-9 w-9 shrink-0 cursor-pointer shadow-2xs active:scale-95"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""}`}
              />
            </Button>
          </div>
        </div>

        {/* Active Filter Chips (Sử dụng .map()) */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 text-xs flex-wrap">
            <span className="text-muted-foreground font-medium">Đang lọc:</span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-red-500 cursor-pointer ml-0.5"
                  title="Bỏ lọc"
                >
                  ✕
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
