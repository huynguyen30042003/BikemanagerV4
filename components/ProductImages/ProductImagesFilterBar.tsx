"use client";

import React, { useMemo, useState } from "react";
import { ImageIcon, Plus, RefreshCw, Package, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";

export interface ProductImagesFilterBarProps {
  selectedSanPhamId: string;
  onSelectSanPhamId: (id: string) => void;
  productOptions: SelectOption[];
  isLoadingProducts?: boolean;
  selectedBienTheId: string;
  onSelectBienTheId: (id: string) => void;
  variantOptions: SelectOption[];
  isLoadingVariants?: boolean;
  selectedProductTitle: string;
  onOpenAdd: () => void;
  onRefresh: () => void;
  isFetching: boolean;
  isLoadingKPI?: boolean;
}

interface ActiveChip {
  key: string;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  onRemove: () => void;
}

export const ProductImagesFilterBar: React.FC<ProductImagesFilterBarProps> = ({
  selectedSanPhamId,
  onSelectSanPhamId,
  productOptions,
  isLoadingProducts = false,
  selectedBienTheId,
  onSelectBienTheId,
  variantOptions,
  isLoadingVariants = false,
  selectedProductTitle,
  onOpenAdd,
  onRefresh,
  isFetching,
  isLoadingKPI = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Label biến thể đang chọn
  const currentVariantLabel = useMemo(() => {
    if (!selectedBienTheId) return "";
    const found = variantOptions.find(
      (v) => String(v.value) === String(selectedBienTheId),
    );
    return found
      ? found.label
      : `Biến thể #${selectedBienTheId.substring(0, 8)}`;
  }, [selectedBienTheId, variantOptions]);

  // Đếm số lượng bộ lọc nâng cao đang áp dụng
  const activeCount = useMemo(() => {
    let count = 0;
    if (selectedBienTheId) count++;
    return count;
  }, [selectedBienTheId]);

  // Danh sách active filter chips
  const activeChips = useMemo(() => {
    const chips: ActiveChip[] = [];
    if (selectedBienTheId) {
      chips.push({
        key: "variant",
        label: `Biến thể: ${currentVariantLabel}`,
        icon: Filter,
        colorClass:
          "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        onRemove: () => onSelectBienTheId(""),
      });
    }
    return chips;
  }, [selectedBienTheId, currentVariantLabel, onSelectBienTheId]);

  const hasActiveFilters = activeChips.length > 0;

  const handleResetFilters = () => {
    onSelectBienTheId("");
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70 mb-2 sm:mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="min-w-0">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1 flex-wrap">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Kinh doanh</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Gallery Hình ảnh</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                  Bộ sưu tập Hình ảnh Sản phẩm
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý gallery ảnh chụp đa góc độ, ảnh chi tiết linh kiện và
                  ảnh riêng của từng màu xe
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
              onClick={onOpenAdd}
              disabled={!selectedSanPhamId}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm ảnh</span>
            </Button>
          </div>
        </div>

        {/* Product Navigation Tabs */}
        <div className="pt-1 max-w-full">
          <ProductNavTabs activeTab="images" />
        </div>
      </div>

      {/* 2. Selector Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-2.5 sm:p-3 shadow-xs space-y-2.5">
        {/* === GIAO DIỆN MÀN HÌNH NHỎ (Mobile/Tablet < lg) === */}
        <div className="lg:hidden space-y-2">
          {/* Ô chọn sản phẩm chính full-width trên Mobile */}
          <div className="w-full">
            <SearchSelect
              options={productOptions}
              value={selectedSanPhamId}
              onChange={(val) => {
                onSelectSanPhamId(String(val));
                onSelectBienTheId("");
              }}
              placeholder="🚲 Chọn sản phẩm xe đạp... *"
              isLoading={isLoadingProducts}
              className="h-9.5 text-xs w-full"
              height={9.5}
            />
          </div>

          {/* Dòng điều khiển: Nút mở bộ lọc + Tag sản phẩm đang xem + Tải lại */}
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

            <div className="flex items-center gap-1.5">
              {selectedProductTitle && selectedSanPhamId && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-md border border-border/70 max-w-[170px] sm:max-w-xs truncate">
                  <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate text-foreground font-medium text-[11px]">
                    {selectedProductTitle}
                  </span>
                </div>
              )}

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
                    isFetching || isLoadingKPI
                      ? "animate-spin text-blue-500"
                      : ""
                  }`}
                />
              </Button>
            </div>
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

              {/* Lọc theo biến thể màu */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Biến thể màu xe
                </label>
                <SearchSelect
                  options={variantOptions}
                  value={selectedBienTheId}
                  onChange={(val) => onSelectBienTheId(String(val))}
                  placeholder="🎨 Tất cả biến thể màu..."
                  isLoading={isLoadingVariants}
                  disabled={!selectedSanPhamId}
                  className="h-9.5 text-xs w-full"
                  height={9.5}
                />
              </div>

              {/* Thông tin sản phẩm đang chọn */}
              {selectedProductTitle && (
                <div className="text-xs text-muted-foreground flex items-center gap-2 bg-background/80 p-2.5 rounded-lg border border-border/60">
                  <Package className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                      Sản phẩm đang chọn
                    </p>
                    <p className="text-xs font-semibold text-foreground truncate">
                      {selectedProductTitle}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* === GIAO DIỆN MÀN HÌNH LỚN (Desktop >= lg) === */}
        <div className="hidden lg:flex items-center justify-between gap-2.5 w-full">
          <div className="flex items-center gap-2.5 flex-1 max-w-2xl">
            {/* Chọn dòng sản phẩm */}
            <div className="flex-1 min-w-[240px]">
              <SearchSelect
                options={productOptions}
                value={selectedSanPhamId}
                onChange={(val) => {
                  onSelectSanPhamId(String(val));
                  onSelectBienTheId("");
                }}
                placeholder="🚲 Chọn sản phẩm xe đạp... *"
                isLoading={isLoadingProducts}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>

            {/* Lọc theo biến thể màu */}
            <div className="w-[260px] shrink-0">
              <SearchSelect
                options={variantOptions}
                value={selectedBienTheId}
                onChange={(val) => onSelectBienTheId(String(val))}
                placeholder="🎨 Tất cả biến thể màu..."
                isLoading={isLoadingVariants}
                disabled={!selectedSanPhamId}
                className="h-9.5 text-xs w-full"
                height={9.5}
              />
            </div>
          </div>

          {/* Tag trạng thái sản phẩm đang xem & Tải lại */}
          <div className="flex items-center gap-2 shrink-0">
            {selectedProductTitle && selectedSanPhamId && (
              <div className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/60 px-3 py-1.5 rounded-lg border border-border/70 max-w-sm truncate">
                <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">
                  Đang xem:{" "}
                  <strong className="text-foreground">
                    {selectedProductTitle}
                  </strong>
                </span>
              </div>
            )}

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
        {hasActiveFilters && (
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
};

export default ProductImagesFilterBar;
