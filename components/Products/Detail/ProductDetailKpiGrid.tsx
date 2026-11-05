"use client";

import React, { useMemo } from "react";
import {
  Boxes,
  ImageIcon,
  Layers,
  QrCode,
  LucideIcon,
} from "lucide-react";
import { KpiRibbon, KpiItem, KpiTone } from "@/components/Common/KpiRibbon";
import { ProductDetailTabKey } from "@/components/Products/Detail/ProductDetailUtils";

export interface ProductDetailKpiGridProps {
  totalVariants: number;
  activeVariants: number;
  totalStock: number;
  totalGalleryImages: number;
  totalSerials: number;
  inStockSerialsCount: number;
  activeTab: ProductDetailTabKey;
  setActiveTab: (tab: ProductDetailTabKey) => void;
  isLoading: boolean;
}

interface RawProductKpiDef {
  id: string;
  title: string;
  subtext: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone: KpiTone;
  isActive: boolean;
  onClick: () => void;
}

export const ProductDetailKpiGrid: React.FC<ProductDetailKpiGridProps> =
  React.memo(
    ({
      totalVariants,
      activeVariants,
      totalStock,
      totalGalleryImages,
      totalSerials,
      inStockSerialsCount,
      activeTab,
      setActiveTab,
      isLoading,
    }) => {
      const kpiDefinitions: RawProductKpiDef[] = useMemo(
        () => [
          {
            id: "variants",
            title: "Biến thể Màu & Pin",
            subtext: `${activeVariants} biến thể đang mở bán`,
            value: totalVariants.toLocaleString("vi-VN"),
            icon: Boxes,
            tone: "indigo",
            isActive: activeTab === "variants",
            onClick: () => setActiveTab("variants"),
          },
          {
            id: "stock",
            title: "Tổng số lượng hiện có",
            subtext: "Tổng số lượng các phiên bản",
            value: totalStock.toLocaleString("vi-VN"),
            icon: Layers,
            tone: "emerald",
            isActive: activeTab === "serials-stock",
            onClick: () => setActiveTab("serials-stock"),
          },
          {
            id: "serials",
            title: "Số khung / Serial (VIN)",
            subtext: `${inStockSerialsCount} xe đang có sẵn trong kho`,
            value: totalSerials.toLocaleString("vi-VN"),
            icon: QrCode,
            tone: "amber",
            isActive: activeTab === "serials-stock",
            onClick: () => setActiveTab("serials-stock"),
          },
          {
            id: "gallery",
            title: "Bộ sưu tập Hình ảnh",
            subtext: "Ảnh ngoại quan & góc chụp theo màu",
            value: totalGalleryImages.toLocaleString("vi-VN"),
            icon: ImageIcon,
            tone: "blue",
            isActive: activeTab === "gallery",
            onClick: () => setActiveTab("gallery"),
          },
        ],
        [
          totalVariants,
          activeVariants,
          totalStock,
          totalGalleryImages,
          totalSerials,
          inStockSerialsCount,
          activeTab,
          setActiveTab,
        ],
      );

      const kpiItems: KpiItem[] = useMemo(
        () =>
          kpiDefinitions.map((def) => ({
            title: def.title,
            value: def.value,
            subtext: def.subtext,
            icon: def.icon,
            tone: def.tone,
            isActive: def.isActive,
            onClick: def.onClick,
          })),
        [kpiDefinitions],
      );

      return <KpiRibbon items={kpiItems} isLoading={isLoading} />;
    },
  );

ProductDetailKpiGrid.displayName = "ProductDetailKpiGrid";
