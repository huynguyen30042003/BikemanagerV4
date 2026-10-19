"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ProductNavTabs } from "@/components/Common/ProductNavTabs";
import { useHinhAnhSanPham } from "@/hooks/HinhAnhSanPham/useHinhAnhSanPham";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";
import {
  ImageIcon,
  Plus,
  RefreshCw,
  Trash2,
  FolderOpen,
  Upload,
  Star,
  Check,
  Maximize2,
  X,
  Layers,
  Sparkles,
  Package,
  Boxes,
  Eye,
} from "lucide-react";

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

    openAdd,
    setOpenAdd,
    dataAdd,
    setDataAdd,
    handleOpenAdd,
    handleSubmitAdd,
    isAdding,

    openDelete,
    setOpenDelete,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,
  } = useHinhAnhSanPham(initialSanPhamId);

  const [previewUpload, setPreviewUpload] = useState<string | null>(null);
  const [zoomImage, setZoomImage] = useState<SP_HinhAnhSanPham | null>(null);

  const shouldReduceMotion = useReducedMotion();

  // Metrics
  const coverCount = useMemo(
    () => items.filter((i) => i.laAnhDaiDien === true).length,
    [items]
  );
  const variantImagesCount = useMemo(
    () => items.filter((i) => Boolean(i.bienTheSanPhamID)).length,
    [items]
  );
  const generalImagesCount = useMemo(
    () => items.filter((i) => !i.bienTheSanPhamID).length,
    [items]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataAdd((prev) => ({ ...prev, file }));
      setPreviewUpload(URL.createObjectURL(file));
    }
  };

  const handleClearUpload = () => {
    setDataAdd((prev) => ({ ...prev, file: null }));
    setPreviewUpload(null);
  };

  const selectedProductTitle = useMemo(() => {
    const found = productOptions.find(
      (p: { value: string | number; label: string }) =>
        String(p.value) === String(selectedSanPhamId)
    );
    return found ? found.label : "Chưa chọn sản phẩm";
  }, [productOptions, selectedSanPhamId]);

  return (
    <div className="p-4 md:p-8 min-h-screen space-y-6">
      {/* 1. Header */}
      {isLoadingProducts ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-4 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
                <span>Hệ thống</span>
                <span className="text-muted-foreground/30">/</span>
                <span>Kinh doanh</span>
                <span className="text-muted-foreground/30">/</span>
                <span className="text-foreground">Gallery Hình ảnh</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    Bộ sưu tập Hình ảnh Sản phẩm
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Quản lý gallery ảnh chụp đa góc độ, ảnh chi tiết linh kiện và ảnh riêng của từng màu xe
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
                className="h-9 px-3.5 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer shadow-2xs"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-500" : ""}`}
                />
                <span className="text-xs font-medium">Làm mới</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setPreviewUpload(null);
                  handleOpenAdd();
                }}
                disabled={!selectedSanPhamId}
                className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs font-medium">Thêm ảnh vào album</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <ProductNavTabs activeTab="images" />
          </div>
        </div>
      )}

      {/* 2. KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <Card className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tổng số hình ảnh
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-foreground">
            {isLoading ? <Skeleton className="h-7 w-12" /> : items.length}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Trong album sản phẩm hiện tại
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Ảnh đại diện (Cover)
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {isLoading ? <Skeleton className="h-7 w-12" /> : coverCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Hiển thị chính tại danh mục xe
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Ảnh theo biến thể màu
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {isLoading ? <Skeleton className="h-7 w-12" /> : variantImagesCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Gán riêng cho từng mã SKU xe
          </p>
        </Card>

        <Card className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Ảnh chung dòng xe
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? <Skeleton className="h-7 w-12" /> : generalImagesCount}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Khung xe, đồng hồ, phụ tùng chung
          </p>
        </Card>
      </div>

      {/* 3. Selector Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 flex-wrap">
            <div className="w-full sm:w-72">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Chọn dòng sản phẩm:
              </label>
              <SearchSelect
                options={productOptions}
                value={selectedSanPhamId}
                onChange={(val) => {
                  setSelectedSanPhamId(String(val));
                  setSelectedBienTheId("");
                }}
                placeholder="Chọn sản phẩm"
                isLoading={isLoadingProducts}
                className="h-9.5 text-xs"
              />
            </div>

            <div className="w-full sm:w-72">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Lọc theo biến thể màu:
              </label>
              <SearchSelect
                options={variantOptions}
                value={selectedBienTheId}
                onChange={(val) => setSelectedBienTheId(String(val))}
                placeholder="Tất cả biến thể"
                isLoading={isLoadingVariants}
                disabled={!selectedSanPhamId}
                className="h-9.5 text-xs"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground self-end md:self-center">
            Đang xem: <strong className="text-foreground">{selectedProductTitle}</strong>
          </div>
        </div>
      </div>

      {/* 4. Gallery Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} className="aspect-4/3 rounded-xl w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <FolderOpen className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Chưa có hình ảnh trong bộ sưu tập
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {selectedSanPhamId
              ? "Sản phẩm này chưa có ảnh nào trong album gallery. Hãy bấm nút tải lên ảnh ngay!"
              : "Vui lòng chọn một dòng sản phẩm để xem bộ sưu tập hình ảnh."}
          </p>
          {selectedSanPhamId && (
            <Button
              size="sm"
              onClick={() => {
                setPreviewUpload(null);
                handleOpenAdd();
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs font-medium"
            >
              <Plus className="w-4 h-4 mr-1" /> Tải lên ảnh đầu tiên
            </Button>
          )}
        </div>
      ) : (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {items.map((img) => (
            <Card
              key={img.hinhAnhID}
              className="group relative rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col"
            >
              {/* Media Preview */}
              <div className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden flex items-center justify-center">
                {img.duongDanAnh && getImageUrl(img.duongDanAnh) ? (
                  <Image
                    src={getImageUrl(img.duongDanAnh)}
                    alt={img.tieuDe || "Ảnh sản phẩm"}
                    width={320}
                    height={240}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground/60">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                {/* Cover Badge */}
                {img.laAnhDaiDien && (
                  <div className="absolute top-2 left-2 bg-amber-500/95 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 border border-amber-400/40">
                    <Star className="w-3 h-3 fill-white" />
                    Ảnh đại diện
                  </div>
                )}

                {/* Order Badge */}
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-1.5 py-0.2 rounded">
                  #{img.thuTu}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomImage(img)}
                    title="Xem chi tiết ảnh"
                    className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-zinc-900 flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-95"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDelete(img.hinhAnhID)}
                    title="Xóa hình ảnh này"
                    className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Caption Footer */}
              <div className="p-2.5 flex flex-col gap-1 border-t border-border/60 text-xs">
                <span className="font-semibold text-foreground truncate" title={img.tieuDe || ""}>
                  {img.tieuDe || "Không có tiêu đề"}
                </span>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>Thứ tự: {img.thuTu}</span>
                  {img.tenBienThe ? (
                    <span className="truncate max-w-[110px] text-indigo-600 dark:text-indigo-400 font-medium">
                      {img.tenBienThe}
                    </span>
                  ) : (
                    <span>Ảnh chung</span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* 5. SlideOver: THÊM ẢNH MỚI */}
      <SlideOver
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        title="Tải lên Hình ảnh Gallery"
        description="Bổ sung hình ảnh sản phẩm hoặc ảnh biến thể màu sắc"
        icon={Upload}
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setOpenAdd(false)}
              disabled={isAdding}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-semibold"
              onClick={handleSubmitAdd}
              disabled={isAdding}
            >
              {isAdding ? <RefreshCw className="w-4 h-4 animate-spin mr-1.5" /> : null}
              Tải lên ngay
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Áp dụng cho đối tượng</label>
            <SearchSelect
              options={variantOptions}
              value={dataAdd.BienTheSanPhamID}
              onChange={(val) => setDataAdd((prev) => ({ ...prev, BienTheSanPhamID: String(val) }))}
              placeholder="Chọn đối tượng áp dụng"
              className="h-9.5 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Tiêu đề / Chú thích ảnh</label>
            <Input
              value={dataAdd.TieuDe}
              onChange={(e) => setDataAdd((prev) => ({ ...prev, TieuDe: e.target.value }))}
              placeholder="Ví dụ: Góc chụp chính diện, Cụm đồng hồ LCD..."
              className="rounded-lg text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Thứ tự hiển thị trong album</label>
            <Input
              type="number"
              min={1}
              value={dataAdd.ThuTuSapXep}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  ThuTuSapXep: parseInt(e.target.value) || 1,
                }))
              }
              className="rounded-lg font-mono text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-foreground">Chọn tệp hình ảnh</label>
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
              {previewUpload ? (
                <div className="relative aspect-4/3 w-48 rounded-lg overflow-hidden border border-border shadow-xs mb-3">
                  <Image
                    src={previewUpload}
                    alt="Preview"
                    width={192}
                    height={144}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground mb-2">
                  <Upload className="w-6 h-6" />
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                  {previewUpload ? "Chọn ảnh khác" : "Chọn tệp từ thiết bị"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                {previewUpload && (
                  <button
                    type="button"
                    onClick={handleClearUpload}
                    className="text-xs text-rose-600 hover:underline cursor-pointer"
                  >
                    Xóa ảnh
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Hỗ trợ định dạng JPG, PNG, WEBP tối đa 5MB
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/70 bg-muted/20">
            <div>
              <p className="text-xs font-medium text-foreground">Đặt làm ảnh đại diện chính</p>
              <p className="text-[11px] text-muted-foreground">Ảnh chính được hiển thị tại danh sách xe</p>
            </div>
            <Switch
              id="isCoverImage"
              checked={dataAdd.LaAnhDaiDien}
              onCheckedChange={(checked) => setDataAdd((prev) => ({ ...prev, LaAnhDaiDien: checked }))}
            />
          </div>
        </div>
      </SlideOver>

      {/* 6. LightBox Modal: XEM CHI TIẾT ẢNH */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-card rounded-2xl border border-border overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 border-b border-border/70 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  {zoomImage.tieuDe || "Hình ảnh sản phẩm"}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  Thứ tự #{zoomImage.thuTu} • {zoomImage.tenBienThe || "Ảnh chung sản phẩm"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setZoomImage(null)}
                className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-16/10 w-full bg-black/90 flex items-center justify-center p-2 overflow-hidden">
              {zoomImage.duongDanAnh && getImageUrl(zoomImage.duongDanAnh) ? (
                <Image
                  src={getImageUrl(zoomImage.duongDanAnh)}
                  alt={zoomImage.tieuDe || "Preview"}
                  width={900}
                  height={600}
                  className="w-auto h-full max-h-full max-w-full object-contain"
                  unoptimized
                />
              ) : null}
            </div>

            <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span>Đường dẫn: {zoomImage.duongDanAnh}</span>
              {zoomImage.laAnhDaiDien && (
                <span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Ảnh đại diện chính
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Modal Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa hình ảnh"
        description="Bạn có chắc chắn muốn xóa hình ảnh này khỏi bộ sưu tập gallery không?"
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function ImagesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96" />
        </div>
      }
    >
      <ImagesContent />
    </Suspense>
  );
}
