"use client";

import React from "react";
import Image from "next/image";
import { takeImage } from "@/utils";
import {
  Search,
  X,
  Package,
  Bike,
  Sparkles,
  Plus,
  AlertCircle,
  ShoppingBag,
  Gift,
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
  onAddToCart: (item: VariantItem, asGift?: boolean) => void;
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 max-h-none overflow-visible lg:max-h-[640px] lg:overflow-y-auto p-1 scrollbar-thin">
          {isLoadingVariants ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="rounded-xl overflow-hidden border border-border/60 flex flex-col"
              >
                <Skeleton className="aspect-4/3 w-full rounded-none" />
                <div className="p-2.5 sm:p-3 space-y-2">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-3 w-1/2 rounded-md" />
                  <div className="flex justify-between items-center pt-1">
                    <Skeleton className="h-5 w-20 rounded-md" />
                    <Skeleton className="h-7 w-7 rounded-lg" />
                  </div>
                </div>
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
              const imgUrl = v.anhDaiDien
                ? takeImage(v.anhDaiDien, 480, v.maxSize)
                : null;

              return (
                <div
                  key={v.value}
                  onClick={() => {
                    if (!isOutOfStock) onAddToCart(v);
                  }}
                  className={`group relative rounded-xl border transition-all text-left flex flex-col justify-between overflow-hidden shadow-2xs select-none ${
                    isOutOfStock
                      ? "border-border/50 bg-muted/30 opacity-70 cursor-not-allowed"
                      : "border-border/80 hover:border-blue-500/60 bg-card hover:bg-blue-500/5 cursor-pointer hover:shadow-md"
                  }`}
                >
                  {/* Media Section: Image or Icon */}
                  <div className="relative aspect-4/3 w-full bg-muted/30 overflow-hidden flex items-center justify-center p-2 border-b border-border/50">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={v.name || v.tenBienThe || "Ảnh sản phẩm"}
                        width={240}
                        height={180}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                        unoptimized
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-muted/70 flex items-center justify-center text-muted-foreground/50 border border-border/40">
                        {isXeDien ? (
                          <Bike className="w-6 h-6 text-blue-600/60 dark:text-blue-400/60" />
                        ) : (
                          <Sparkles className="w-6 h-6 text-amber-500/60" />
                        )}
                      </div>
                    )}

                    {/* Top-Right Badge: Số lượng đã thêm vào giỏ */}
                    {inCartItem && (
                      <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs z-10 animate-in fade-in">
                        x{inCartItem.soLuong}
                      </div>
                    )}

                    {/* Top-Left Badge: SKU */}
                    <div className="absolute top-2 left-2 z-10 max-w-[70%]">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-background/90 backdrop-blur-sm text-foreground border border-border/70 shadow-2xs truncate block">
                        {v.sku || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between gap-2.5">
                    <div className="space-y-1">
                      <h4
                        className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug"
                        title={v.name}
                      >
                        {v.name}
                      </h4>

                      {/* Hiển thị tồn kho khả dụng từ biến thể & badge serial */}
                      <div className="flex items-center justify-between gap-1 pt-0.5 flex-wrap">
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
                        {v.quanLyTheoSerial && (
                          <span className="text-[9px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                            Số khung
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50 gap-1 min-w-0">
                      <span className="font-mono text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 truncate min-w-0">
                        {formatCurrency(v.defaultPrice)}
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) onAddToCart(v, true);
                          }}
                          className={`h-7 px-1.5 sm:px-2 rounded-lg flex items-center gap-1 text-[10px] sm:text-[11px] font-medium transition-all ${
                            isOutOfStock
                              ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                              : "bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-300 hover:bg-purple-600 hover:text-white active:scale-95 cursor-pointer shadow-2xs"
                          }`}
                          title={
                            isOutOfStock
                              ? "Hết hàng"
                              : "Thêm vào đơn làm quà tặng kèm (0 đ)"
                          }
                        >
                          <Gift className="w-3.5 h-3.5" />
                          <span>Tặng</span>
                        </button>

                        <button
                          type="button"
                          disabled={isOutOfStock}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isOutOfStock) onAddToCart(v, false);
                          }}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                            isOutOfStock
                              ? "bg-muted text-muted-foreground/50 cursor-not-allowed"
                              : "bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 hover:bg-blue-600 hover:text-white active:scale-95 cursor-pointer shadow-2xs"
                          }`}
                          title={isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
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
