"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductDetail } from "@/hooks/SanPham/useProductDetail";
import { ProductDetailHeader } from "@/components/Products/Detail/ProductDetailHeader";
import { ProductDetailKpiGrid } from "@/components/Products/Detail/ProductDetailKpiGrid";
import { ProductDetailTabsBar } from "@/components/Products/Detail/ProductDetailTabsBar";
import { ProductVariantsTab } from "@/components/Products/Detail/ProductVariantsTab";
import { ProductGalleryTab } from "@/components/Products/Detail/ProductGalleryTab";
import { ProductSpecsBrandTab } from "@/components/Products/Detail/ProductSpecsBrandTab";
import { ProductSerialsStockTab } from "@/components/Products/Detail/ProductSerialsStockTab";
import { ProductDetailEditModalWrapper } from "@/components/Products/Detail/ProductDetailEditModalWrapper";

export interface ProductDetailAdminViewProps {
  sanPhamId: string;
}

export function ProductDetailAdminView({
  sanPhamId,
}: ProductDetailAdminViewProps) {
  const {
    product,
    brand,
    variants,
    filteredGalleryImages,
    filteredSerials,
    serialStatusOptions,
    getSerialStatusBadge,
    isLoadingSerialStatuses,
    parsedSpecs,
    heroMediaList,
    activeHeroMedia,
    setSelectedHeroMediaId,
    metrics,
    activeTab,
    setActiveTab,
    selectedVariantId,
    setSelectedVariantId,
    selectedSerialStatusId,
    setSelectedSerialStatusId,
    openEditModal,
    setOpenEditModal,
    isLoading,
    isFetching,
    refetch,
  } = useProductDetail(sanPhamId);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center space-y-4 my-12">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <Bike className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          Không tìm thấy thông tin sản phẩm / phương tiện
        </h1>
        <p className="text-xs text-muted-foreground">
          Mã định danh sản phẩm không tồn tại hoặc đã bị xóa khỏi hệ thống.
        </p>
        <Link href="/admin/products">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Quay lại danh sách sản phẩm</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-5 sm:space-y-6 min-h-screen">
      {/* 1. Thanh công cụ & Thẻ Hero Showcase (Ảnh + Thương hiệu + Định danh gốc) */}
      <ProductDetailHeader
        product={product}
        brand={brand}
        heroMediaList={heroMediaList}
        activeHeroMedia={activeHeroMedia}
        onSelectHeroMedia={setSelectedHeroMediaId}
        minPrice={metrics.minPrice}
        maxPrice={metrics.maxPrice}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        onOpenEdit={() => setOpenEditModal(true)}
      />

      {/* 2. Dải thẻ KPI Tổng quan (KpiRibbon chuẩn hóa qua .map()) */}
      <ProductDetailKpiGrid
        totalVariants={metrics.totalVariants}
        activeVariants={metrics.activeVariants}
        totalStock={metrics.totalStock}
        totalGalleryImages={metrics.totalGalleryImages}
        totalSerials={metrics.totalSerials}
        inStockSerialsCount={metrics.inStockSerialsCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
      />

      {/* 3. Thanh điều hướng Tabs cuộn ngang */}
      <ProductDetailTabsBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        variantsCount={metrics.totalVariants}
        galleryCount={metrics.totalGalleryImages}
        specsCount={parsedSpecs.length}
        serialsCount={filteredSerials.length}
      />

      {/* 4. Nội dung từng Tab */}
      {activeTab === "variants" && (
        <ProductVariantsTab
          sanPhamId={product.sanPhamID}
          variants={variants}
          onFilterByVariant={(variantId, targetTab) => {
            setSelectedVariantId(variantId);
            setActiveTab(targetTab);
          }}
        />
      )}

      {activeTab === "gallery" && (
        <ProductGalleryTab
          sanPhamId={product.sanPhamID}
          images={filteredGalleryImages}
          variants={variants}
          selectedVariantId={selectedVariantId}
          setSelectedVariantId={setSelectedVariantId}
          onSelectHeroMedia={setSelectedHeroMediaId}
        />
      )}

      {activeTab === "specs-brand" && (
        <ProductSpecsBrandTab
          product={product}
          brand={brand}
          parsedSpecs={parsedSpecs}
          onOpenEdit={() => setOpenEditModal(true)}
        />
      )}

      {activeTab === "serials-stock" && (
        <ProductSerialsStockTab
          variants={variants}
          serials={filteredSerials}
          selectedVariantId={selectedVariantId}
          setSelectedVariantId={setSelectedVariantId}
          selectedSerialStatusId={selectedSerialStatusId}
          setSelectedSerialStatusId={setSelectedSerialStatusId}
          serialStatusOptions={serialStatusOptions}
          isLoadingSerialStatuses={isLoadingSerialStatuses}
          getSerialStatusBadge={getSerialStatusBadge}
        />
      )}

      {/* 5. SlideOver chỉnh sửa sản phẩm (Chỉ mount & gọi API phụ thuộc khi mở) */}
      {openEditModal && (
        <ProductDetailEditModalWrapper
          open={openEditModal}
          onClose={() => setOpenEditModal(false)}
          product={product}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
