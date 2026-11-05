"use client";

import React, { useMemo } from "react";
import { Boxes, Cpu, ImageIcon, QrCode, LucideIcon } from "lucide-react";
import { ProductDetailTabKey } from "@/components/Products/Detail/ProductDetailUtils";

export interface ProductDetailTabsBarProps {
  activeTab: ProductDetailTabKey;
  setActiveTab: (tab: ProductDetailTabKey) => void;
  variantsCount: number;
  galleryCount: number;
  specsCount: number;
  serialsCount: number;
}

interface TabDef {
  id: ProductDetailTabKey;
  label: string;
  count: number;
  icon: LucideIcon;
}

export const ProductDetailTabsBar: React.FC<ProductDetailTabsBarProps> =
  React.memo(
    ({
      activeTab,
      setActiveTab,
      variantsCount,
      galleryCount,
      specsCount,
      serialsCount,
    }) => {
      const tabDefinitions = useMemo<TabDef[]>(
        () => [
          {
            id: "variants",
            label: "Biến thể Màu sắc & Bảng giá",
            count: variantsCount,
            icon: Boxes,
          },
          {
            id: "gallery",
            label: "Bộ sưu tập Hình ảnh",
            count: galleryCount,
            icon: ImageIcon,
          },
          {
            id: "specs-brand",
            label: "Thông số kỹ thuật & Thương hiệu",
            count: specsCount,
            icon: Cpu,
          },
          {
            id: "serials-stock",
            label: "Danh sách Xe / Số Serial hiện có",
            count: serialsCount,
            icon: QrCode,
          },
        ],
        [variantsCount, galleryCount, specsCount, serialsCount],
      );

      return (
        <nav
          aria-label="Phân mục chi tiết sản phẩm"
          className="flex items-center gap-1.5 p-1.5 rounded-xl bg-muted/60 border border-border/70 max-w-full overflow-x-auto no-scrollbar scroll-smooth"
        >
          {tabDefinitions.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-muted text-foreground/80 border border-border/70"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      );
    },
  );

ProductDetailTabsBar.displayName = "ProductDetailTabsBar";
