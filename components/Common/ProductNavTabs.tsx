"use client";

import React from "react";
import { Barcode, Boxes, ImageIcon, Package, Tags } from "lucide-react";
import { useGetProductNavTabs } from "@/hooks/SanPham/useSanPhamApi";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type ProductTabKey = "brands" | "products" | "variants" | "images" | "serials";

interface ProductNavTabsProps {
  activeTab: ProductTabKey;
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

  const navTabs: NavTabItem<ProductTabKey>[] = React.useMemo(
    () => [
      {
        key: "brands",
        label: "Thương hiệu",
        href: "/admin/brands",
        icon: Tags,
        count: countBrands,
      },
      {
        key: "products",
        label: "Sản phẩm & Dòng xe",
        href: "/admin/products",
        icon: Package,
        count: countProducts,
      },
      {
        key: "variants",
        label: "Biến thể sản phẩm",
        href: "/admin/product-variants",
        icon: Boxes,
        count: countVariants,
      },
      {
        key: "images",
        label: "Gallery Hình ảnh",
        href: "/admin/product-images",
        icon: ImageIcon,
        count: countImages,
      },
      {
        key: "serials",
        label: "Số Serial & Khung",
        href: "/admin/product-serials",
        icon: Barcode,
        count: countSerials,
      },
    ],
    [countBrands, countProducts, countVariants, countImages, countSerials],
  );

  return (
    <BaseNavTabs
      items={navTabs}
      activeTab={activeTab}
      isLoading={isLoading}
      className={className}
    />
  );
}
