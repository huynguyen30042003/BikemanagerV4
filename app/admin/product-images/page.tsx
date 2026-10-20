"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  useHinhAnhSanPham,
  useDeleteHinhAnh,
} from "@/hooks/HinhAnhSanPham/useHinhAnhSanPham";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import {
  ProductImagesKpiGrid,
  ProductImagesFilterBar,
  ProductImagesGallery,
  UploadProductImageSlideOver,
  ProductImageViewerModal,
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
  } = useHinhAnhSanPham(initialSanPhamId);

  const [zoomImage, setZoomImage] = useState<SP_HinhAnhSanPham | null>(null);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const deleteMutation = useDeleteHinhAnh();

  const selectedProductTitle = useMemo(() => {
    const found = productOptions.find(
      (p: { value: string | number; label: string }) =>
        String(p.value) === String(selectedSanPhamId)
    );
    return found ? found.label : "Chưa chọn sản phẩm";
  }, [productOptions, selectedSanPhamId]);

  // KPI Metrics prioritization (Backend KPI first, fallback to current dataset)
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
      kpiData?.total_AnhChung ??
      items.filter((i) => !i.bienTheSanPhamID).length
    );
  }, [kpiData?.total_AnhChung, items]);

  const handleDeleteConfirm = async () => {
    if (!deletingImageId) return;
    try {
      await deleteMutation.mutateAsync(deletingImageId);
      setDeletingImageId(null);
      refetchKPI();
    } catch {
      // Toast notification is handled in mutation
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen space-y-6 max-w-[1600px] mx-auto">
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

      {/* 2. Interactive KPI Cards Grid (.map() based, responsive down to 390px) */}
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

      {/* 3. Main Data Content: Gallery Grid */}
      <ProductImagesGallery
        items={items}
        selectedSanPhamId={selectedSanPhamId}
        isLoading={isLoading}
        onOpenAdd={() => setOpenAdd(true)}
        onZoom={(img) => setZoomImage(img)}
        onDelete={(id) => setDeletingImageId(id)}
      />

      {/* 4. SlideOver: Tải lên hình ảnh mới (State Isolation) */}
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

      {/* 5. Lightbox Modal: Xem chi tiết ảnh */}
      <ProductImageViewerModal
        image={zoomImage}
        onClose={() => setZoomImage(null)}
      />

      {/* 6. Modal xác nhận xóa ảnh */}
      <ConfirmModal
        open={Boolean(deletingImageId)}
        onClose={() => setDeletingImageId(null)}
        onConfirm={handleDeleteConfirm}
        title="Xác nhận xóa hình ảnh"
        description="Bạn có chắc chắn muốn xóa hình ảnh này khỏi bộ sưu tập gallery không?"
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default function ImagesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <ImagesContent />
    </Suspense>
  );
}
