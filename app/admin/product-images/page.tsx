"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useHinhAnhSanPham } from "@/hooks/HinhAnhSanPham/useHinhAnhSanPham";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import {
  ProductImagesKpiGrid,
  ProductImagesFilterBar,
  ProductImagesGallery,
  UploadProductImageSlideOver,
  ProductImageViewerModal,
  ProductImagesSkeleton,
} from "@/components/ProductImages";

function ImagesContent() {
  const searchParams = useSearchParams();
  const initialSanPhamId = searchParams.get("productId") || undefined;

  const {
    selectedSanPhamId,
    setSelectedSanPhamId,
    selectedBienTheId,
    setSelectedBienTheId,

    productOptions,
    isLoadingProducts,
    variantOptions,
    isLoadingVariants,

    items,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,

    openAdd,
    setOpenAdd,
    handleDelete,
  } = useHinhAnhSanPham(initialSanPhamId);

  const [zoomImage, setZoomImage] = useState<SP_HinhAnhSanPham | null>(null);

  const selectedProductTitle = useMemo(() => {
    const found = productOptions.find(
      (p: { value: string | number; label: string }) =>
        String(p.value) === String(selectedSanPhamId),
    );
    return found ? found.label : "Chưa chọn sản phẩm";
  }, [productOptions, selectedSanPhamId]);

  // Thống kê KPI ưu tiên từ Backend API GetKPI, fallback sang dataset hiện hành
  const totalHinhAnhSanPham = useMemo(() => {
    return kpiData?.total_HinhAnhSanPham ?? items.length;
  }, [kpiData?.total_HinhAnhSanPham, items.length]);

  const totalAnhDaiDien = useMemo(() => {
    return (
      kpiData?.total_AnhDaiDien ??
      items.filter((i) => i.laAnhDaiDien === true).length
    );
  }, [kpiData?.total_AnhDaiDien, items]);

  const totalAnhBienThe = useMemo(() => {
    return (
      kpiData?.total_AnhBienThe ??
      items.filter((i) => Boolean(i.bienTheSanPhamID)).length
    );
  }, [kpiData?.total_AnhBienThe, items]);

  const totalAnhChung = useMemo(() => {
    return (
      kpiData?.total_AnhChung ?? items.filter((i) => !i.bienTheSanPhamID).length
    );
  }, [kpiData?.total_AnhChung, items]);

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header, Navigation Tabs & Product Selectors */}
      <ProductImagesFilterBar
        selectedSanPhamId={selectedSanPhamId}
        onSelectSanPhamId={setSelectedSanPhamId}
        productOptions={productOptions}
        isLoadingProducts={isLoadingProducts}
        selectedBienTheId={selectedBienTheId}
        onSelectBienTheId={setSelectedBienTheId}
        variantOptions={variantOptions}
        isLoadingVariants={isLoadingVariants}
        selectedProductTitle={selectedProductTitle}
        onOpenAdd={() => setOpenAdd(true)}
        onRefresh={() => {
          refetch();
          refetchKPI();
        }}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
      />

      {/* 2. Dải KPI Ribbon tương tác (.map() based, dùng KpiRibbon chuẩn) */}
      <ProductImagesKpiGrid
        totalHinhAnhSanPham={totalHinhAnhSanPham}
        totalAnhDaiDien={totalAnhDaiDien}
        totalAnhBienThe={totalAnhBienThe}
        totalAnhChung={totalAnhChung}
        selectedBienTheId={selectedBienTheId}
        onSelectTotal={() => setSelectedBienTheId("")}
        isLoadingKPI={isLoadingKPI}
        isLoading={isLoading}
      />

      {/* 3. Nội dung dữ liệu chính: Album Gallery Grid (Responsive 2 đến 5 cột) */}
      <ProductImagesGallery
        items={items}
        selectedSanPhamId={selectedSanPhamId}
        isLoading={isLoading}
        onOpenAdd={() => setOpenAdd(true)}
        onZoom={(img) => setZoomImage(img)}
        onDelete={handleDelete}
      />

      {/* 4. SlideOver: Tải lên hình ảnh mới (State Form cô lập hoàn toàn) */}
      <UploadProductImageSlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        selectedSanPhamId={selectedSanPhamId}
        variantOptions={variantOptions}
        defaultBienTheId={selectedBienTheId}
        nextOrderIndex={items.length + 1}
        onSuccess={() => {
          refetch();
          refetchKPI();
        }}
      />

      {/* 5. Lightbox Modal: Xem chi tiết ảnh phóng to (Hỗ trợ Touch Swipe, Next/Prev và Xóa ảnh trên Mobile) */}
      <ProductImageViewerModal
        image={zoomImage}
        images={items}
        onClose={() => setZoomImage(null)}
        onNavigate={(nextImg) => setZoomImage(nextImg)}
        onDelete={async (img) => {
          setZoomImage(null);
          await handleDelete(img);
        }}
      />
    </div>
  );
}

export default function ImagesPage() {
  return (
    <Suspense fallback={<ProductImagesSkeleton />}>
      <ImagesContent />
    </Suspense>
  );
}
