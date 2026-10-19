"use client";

import React from "react";
import Link from "next/link";
import { Barcode, Boxes, ImageIcon, Package, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetProductNavTabs } from "@/hooks/SanPham/useSanPhamApi";

interface ProductNavTabsProps {
  activeTab: "brands" | "products" | "variants" | "images" | "serials";
  className?: string;
  totalBrands?: number;
  totalProducts?: number;
  totalVariants?: number;
  totalImages?: number;
  totalSerials?: number;
}

export function ProductNavTabs({
  activeTab,
  className,
  totalBrands,
  totalProducts,
  totalVariants,
  totalImages,
  totalSerials,
}: ProductNavTabsProps) {
  const { data: navData, isLoading } = useGetProductNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/SanPhamApi/NavTabs
  const countBrands = totalBrands ?? navData?.total_ThuongHieu ?? navData?.totalThuongHieu;
  const countProducts = totalProducts ?? navData?.total_SanPham ?? navData?.totalSanPham;
  const countVariants = totalVariants ?? navData?.total_BienTheSanPham ?? navData?.totalBienTheSanPham;
  const countImages = totalImages ?? navData?.total_HinhAnhSanPham ?? navData?.totalHinhAnhSanPham;
  const countSerials = totalSerials ?? navData?.total_SoSerial ?? navData?.totalSoSerial;

  const renderBadge = (count?: number, isActive?: boolean) => {
    if (count !== undefined) {
      return (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold transition-colors",
            isActive
              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
              : "bg-muted text-muted-foreground group-hover:text-foreground"
          )}
        >
          {count}
        </span>
      );
    }
    if (isLoading) {
      return <span className="w-5 h-3.5 rounded-full bg-muted/60 animate-pulse" />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1 flex-wrap",
        className
      )}
    >
      <Link
        href="/admin/brands"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "brands"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Tags className="w-3.5 h-3.5 shrink-0" />
        <span>Thương hiệu</span>
        {renderBadge(countBrands, activeTab === "brands")}
      </Link>

      <Link
        href="/admin/products"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "products"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Package className="w-3.5 h-3.5 shrink-0" />
        <span>Sản phẩm & Dòng xe</span>
        {renderBadge(countProducts, activeTab === "products")}
      </Link>

      <Link
        href="/admin/product-variants"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "variants"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Boxes className="w-3.5 h-3.5 shrink-0" />
        <span>Biến thể sản phẩm</span>
        {renderBadge(countVariants, activeTab === "variants")}
      </Link>

      <Link
        href="/admin/product-images"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "images"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <ImageIcon className="w-3.5 h-3.5 shrink-0" />
        <span>Gallery Hình ảnh</span>
        {renderBadge(countImages, activeTab === "images")}
      </Link>

      <Link
        href="/admin/product-serials"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "serials"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Barcode className="w-3.5 h-3.5 shrink-0" />
        <span>Số Serial & Khung</span>
        {renderBadge(countSerials, activeTab === "serials")}
      </Link>
    </div>
  );
}
