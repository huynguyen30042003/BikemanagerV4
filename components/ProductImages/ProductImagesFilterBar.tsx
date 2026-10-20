"use client";

import React from "react";
import { ImageIcon, Plus, RefreshCw, Package, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchSelect, SelectOption } from "@/components/ui/selectSearch";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";

interface ProductImagesFilterBarProps {
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
  return (
    <div className="space-y-4">
      {/* 1. Header Section */}
      <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/40">/</span>
              <span>Kinh doanh</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-foreground">Gallery Hình ảnh</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Bộ sưu tập Hình ảnh Sản phẩm
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 sm:line-clamp-none">
                  Quản lý gallery ảnh chụp đa góc độ, ảnh chi tiết linh kiện và
                  ảnh riêng của từng màu xe
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
              className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isFetching || isLoadingKPI ? "animate-spin text-blue-500" : ""
                }`}
              />
              <span className="text-xs font-medium hidden xs:inline">
                Làm mới
              </span>
            </Button>

            <Button
              size="sm"
              onClick={onOpenAdd}
              disabled={!selectedSanPhamId}
              className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm ảnh vào album</span>
            </Button>
          </div>
        </div>

        {/* Product Navigation Tabs */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto whitespace-nowrap">
          <ProductNavTabs activeTab="images" />
        </div>
      </div>

      {/* 2. Selector Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 sm:p-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            {/* Chọn dòng sản phẩm */}
            <div className="w-full sm:w-72">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Chọn dòng sản phẩm:
              </label>
              <SearchSelect
                options={productOptions}
                value={selectedSanPhamId}
                onChange={(val) => {
                  onSelectSanPhamId(String(val));
                  onSelectBienTheId("");
                }}
                placeholder="Chọn sản phẩm"
                isLoading={isLoadingProducts}
                className="h-9.5 text-xs"
              />
            </div>

            {/* Lọc theo biến thể màu */}
            <div className="w-full sm:w-72">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Lọc theo biến thể màu:
              </label>
              <SearchSelect
                options={variantOptions}
                value={selectedBienTheId}
                onChange={(val) => onSelectBienTheId(String(val))}
                placeholder="Tất cả biến thể"
                isLoading={isLoadingVariants}
                disabled={!selectedSanPhamId}
                className="h-9.5 text-xs"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground self-start md:self-center flex items-center gap-1.5 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/60">
            <Package className="w-3.5 h-3.5 text-muted-foreground" />
            <span>
              Đang xem:{" "}
              <strong className="text-foreground">{selectedProductTitle}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
