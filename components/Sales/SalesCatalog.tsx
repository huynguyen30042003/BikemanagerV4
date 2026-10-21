"use client";

import React from "react";
import {
  Search,
  X,
  Package,
  Bike,
  Sparkles,
  Plus,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchSelect } from "@/components/ui/selectSearch";
import {
  VariantItem,
  CartItem,
  CategoryTabItem,
  formatCurrency,
} from "./types";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SalesCatalogProps {
  mobileTab: "catalog" | "cart";
  categoryOptions?: SelectOption[];
  categoryTabs?: CategoryTabItem[];
  isLoadingCategories?: boolean;
  selectedCategoryTab: string;
  onCategoryTabChange: (key: string) => void;
  filterText: string;
  onFilterTextChange: (val: string) => void;
  selectedDiaDiemId: string;
  onDiaDiemChange: (val: string) => void;
  diaDiemOptions: SelectOption[];
  isLoadingDiaDiems: boolean;
  selectedKhoId: string;
  onKhoChange: (val: string) => void;
  khoOptions: SelectOption[];
  isLoadingKhos: boolean;
  selectedOrderTypeId?: string;
  onOrderTypeChange?: (val: string) => void;
  orderTypeOptions?: SelectOption[];
  isLoadingOrderTypes?: boolean;
  filteredVariants: VariantItem[];
  isLoadingVariants: boolean;
  cart: CartItem[];
  onAddToCart: (item: VariantItem) => void;
}

export const SalesCatalog: React.FC<SalesCatalogProps> = ({
  mobileTab,
  categoryOptions,
  categoryTabs,
  isLoadingCategories = false,
  selectedCategoryTab,
  onCategoryTabChange,
  filterText,
  onFilterTextChange,
  selectedDiaDiemId,
  onDiaDiemChange,
  diaDiemOptions,
  isLoadingDiaDiems,
  selectedKhoId,
  onKhoChange,
  khoOptions,
  isLoadingKhos,
  filteredVariants,
  isLoadingVariants,
  cart,
  onAddToCart,
}) => {
  // Chuẩn hóa danh sách options cho ô Select Danh Mục Sản Phẩm
  const categorySelectOptions: SelectOption[] = React.useMemo(() => {
    if (categoryOptions && categoryOptions.length > 0) {
      const hasAll = categoryOptions.some((c) => String(c.value) === "all");
      return hasAll
        ? categoryOptions
        : [{ value: "all", label: "Tất cả danh mục" }, ...categoryOptions];
    }
    if (categoryTabs && categoryTabs.length > 0) {
      return categoryTabs.map((t) => ({
        value: t.key,
        label: t.label,
      }));
    }
    return [{ value: "all", label: "Tất cả danh mục" }];
  }, [categoryOptions, categoryTabs]);

  return (
    <div
      className={`${
        mobileTab === "catalog" ? "block" : "hidden"
      } lg:block lg:col-span-7 space-y-3.5`}
    >
      <Card className="p-3.5 sm:p-4 rounded-2xl border border-border/80 bg-card shadow-xs space-y-3">
        {/* Top Toolbar: Search + Warehouse + Showroom + Category Select */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 items-center">
          {/* Search Box */}
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Tìm theo SKU, tên sản phẩm..."
              value={filterText}
              onChange={(e) => onFilterTextChange(e.target.value)}
              className="pl-9 pr-8 h-9.5 text-xs bg-background/80 w-full"
            />
            {filterText && (
              <button
                type="button"
                onClick={() => onFilterTextChange("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Chọn Cơ sở */}
          <div className="w-full">
            <SearchSelect
              placeholder="Chọn Showroom..."
              options={diaDiemOptions}
              value={selectedDiaDiemId}
              onChange={(val) => onDiaDiemChange(String(val || ""))}
              isLoading={isLoadingDiaDiems}
              height={9.5}
            />
          </div>

          {/* Chọn Kho xuất */}
          <div className="w-full">
            <SearchSelect
              placeholder="Chọn Kho xuất..."
              options={khoOptions}
              value={selectedKhoId}
              onChange={(val) => onKhoChange(String(val || ""))}
              isLoading={isLoadingKhos}
              height={9.5}
            />
          </div>

          {/* Chọn Danh mục sản phẩm (SearchSelect từ useDanhMucChiTietLookup) */}
          <div className="w-full">
            <SearchSelect
              placeholder="Tất cả danh mục..."
              options={categorySelectOptions}
              value={selectedCategoryTab}
              onChange={(val) => onCategoryTabChange(String(val || "all"))}
              isLoading={isLoadingCategories}
              height={9.5}
            />
          </div>
        </div>

        {/* Product Variant Grid from Biến Thể Sản Phẩm (kèm số lượng tồn) */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 max-h-[640px] overflow-y-auto p-1 scrollbar-thin">
          {isLoadingVariants ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="p-3.5 rounded-xl space-y-2 border border-border/60"
              >
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-1/2 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </Card>
            ))
          ) : filteredVariants.length === 0 ? (
            <div className="col-span-full py-16 text-center text-muted-foreground text-xs flex flex-col items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground/30 mb-2" />
              <p className="font-medium text-foreground">
                Không tìm thấy sản phẩm phù hợp
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Thử chọn danh mục khác hoặc nhập từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            filteredVariants.map((v) => {
              const inCartItem = cart.find(
                (i) => i.bienTheSanPhamID === v.value,
              );
              const isXeDien = (v.name || "").toLowerCase().includes("xe");
              const availableStock = v.soLuongKhaDung ?? v.soLuongTon ?? 0;
              const isOutOfStock = availableStock <= 0;

              return (
                <div
                  key={v.value}
                  onClick={() => {
                    if (!isOutOfStock) onAddToCart(v);
                  }}
                  className={`group relative p-3 sm:p-3.5 rounded-xl border transition-all text-left flex flex-col justify-between gap-3 shadow-2xs select-none ${
                    isOutOfStock
                      ? "border-border/50 bg-muted/30 opacity-70 cursor-not-allowed"
                      : "border-border/80 hover:border-blue-500/60 bg-card hover:bg-blue-500/5 cursor-pointer"
                  }`}
                >
                  {/* Badge số lượng trong giỏ */}
                  {inCartItem && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                      x{inCartItem.soLuong}
                    </div>
                  )}

                  <div className="space-y-1 pr-6">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                        {isXeDien ? (
                          <Bike className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono font-medium text-muted-foreground truncate">
                        {v.sku || "N/A"}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {v.name}
                    </h4>

                    {/* Hiển thị tồn kho khả dụng từ biến thể */}
                    <div className="flex items-center gap-1 pt-0.5">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                          <AlertCircle className="w-3 h-3" />
                          Hết hàng ({availableStock})
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          Khả dụng: <strong>{availableStock}</strong>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <span className="font-mono text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(v.defaultPrice)}
                    </span>

                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) onAddToCart(v);
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isOutOfStock
                          ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                          : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white active:scale-95 cursor-pointer"
                      }`}
                      title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
};

export default SalesCatalog;
