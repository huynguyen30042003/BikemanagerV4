"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bike,
  Boxes,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FolderTree,
  Globe,
  Hash,
  ImageIcon,
  Layers,
  Package,
  QrCode,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  SquarePen,
  Tag,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SP_SanPhamDetail } from "@/types/sanPham";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import { ProductHeroMediaItem } from "@/hooks/SanPham/useProductDetail";
import {
  formatCurrency,
  formatDateStr,
} from "@/components/Products/Detail/ProductDetailUtils";
import { takeImage } from "@/utils";

export interface ProductDetailHeaderProps {
  product: SP_SanPhamDetail;
  brand: SP_ThuongHieu | null;
  heroMediaList: ProductHeroMediaItem[];
  activeHeroMedia: ProductHeroMediaItem | null;
  onSelectHeroMedia: (id: string) => void;
  minPrice: number;
  maxPrice: number;
  isFetching: boolean;
  onRefresh: () => void;
  onOpenEdit: () => void;
}

interface MetaSummaryItem {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  highlight?: boolean;
}

export const ProductDetailHeader: React.FC<ProductDetailHeaderProps> =
  React.memo(
    ({
      product,
      brand,
      heroMediaList,
      activeHeroMedia,
      onSelectHeroMedia,
      minPrice,
      maxPrice,
      isFetching,
      onRefresh,
      onOpenEdit,
    }) => {
      const thumbStripRef = useRef<HTMLDivElement | null>(null);

      const activeHeroIndex = useMemo(() => {
        if (!activeHeroMedia || heroMediaList.length === 0) return 0;
        const idx = heroMediaList.findIndex((m) => m.id === activeHeroMedia.id);
        return idx >= 0 ? idx : 0;
      }, [activeHeroMedia, heroMediaList]);

      const scrollThumbIntoView = (index: number) => {
        const container = thumbStripRef.current;
        if (!container) return;
        const targetBtn = container.children[index] as HTMLElement | undefined;
        if (targetBtn) {
          targetBtn.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      };

      const handleStepHeroMedia = (direction: -1 | 1) => {
        if (heroMediaList.length <= 1) return;
        const nextIndex =
          (activeHeroIndex + direction + heroMediaList.length) %
          heroMediaList.length;
        const nextItem = heroMediaList[nextIndex];
        if (nextItem) {
          onSelectHeroMedia(nextItem.id);
          scrollThumbIntoView(nextIndex);
        }
      };

      const handleScrollThumbStrip = (direction: -1 | 1) => {
        if (thumbStripRef.current) {
          thumbStripRef.current.scrollBy({
            left: direction * 220,
            behavior: "smooth",
          });
        }
        handleStepHeroMedia(direction);
      };

      const activeHeroImageUrl = activeHeroMedia?.path
        ? takeImage(activeHeroMedia.path, 1280, activeHeroMedia.maxSize)
        : null;

      const brandLogoUrl = brand?.duongDanLogo
        ? takeImage(brand.duongDanLogo, 480, brand.maxSize)
        : null;

      const priceRangeLabel = useMemo(() => {
        if (minPrice <= 0 && maxPrice <= 0) return "Theo biến thể";
        if (minPrice === maxPrice) return formatCurrency(minPrice);
        return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`;
      }, [minPrice, maxPrice]);

      const metaSummaryItems = useMemo<MetaSummaryItem[]>(
        () => [
          {
            id: "category",
            label: "Danh mục ngành hàng",
            value: product.tenDanhMucChiTiet || "Chưa phân loại",
            icon: FolderTree,
          },
          {
            id: "unit",
            label: "Đơn vị tính",
            value: product.tenDonViTinh || "Chiếc",
            icon: Layers,
          },
          {
            id: "warranty",
            label: "Bảo hành tiêu chuẩn",
            value: `${product.soThangBaoHanhMacDinh ?? 12} tháng`,
            icon: ShieldCheck,
            highlight: true,
          },
          {
            id: "price-range",
            label: "Khung giá niêm yết",
            value: priceRangeLabel,
            icon: Tag,
            highlight: true,
          },
          {
            id: "slug",
            label: "Đường dẫn định danh (Slug)",
            value: `/${product.duongDan || "-"}`,
            icon: Globe,
          },
          {
            id: "created-at",
            label: "Ngày khởi tạo",
            value: formatDateStr(product.ngayTao),
            icon: Calendar,
          },
        ],
        [
          product.tenDanhMucChiTiet,
          product.tenDonViTinh,
          product.soThangBaoHanhMacDinh,
          product.duongDan,
          product.ngayTao,
          priceRangeLabel,
        ],
      );

      const quickNavLinks = useMemo(
        () => [
          {
            id: "variants",
            href: `/admin/product-variants?productId=${product.sanPhamID}`,
            label: "Quản lý Biến thể",
            icon: Boxes,
          },
          {
            id: "images",
            href: `/admin/product-images?productId=${product.sanPhamID}`,
            label: "Quản lý Ảnh",
            icon: ImageIcon,
          },
          {
            id: "serials",
            href: `/admin/product-serials`,
            label: "Quản lý Serial",
            icon: QrCode,
          },
        ],
        [product.sanPhamID],
      );

      return (
        <div className="space-y-4">
          {/* Thanh điều hướng & Thao tác nhanh */}
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <Link href="/admin/products">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer h-9 px-3 rounded-xl border-border/80"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                <span>Danh sách sản phẩm</span>
              </Button>
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {quickNavLinks.map((item) => {
                const IconComp = item.icon;
                return (
                  <Link key={item.id} href={item.href}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer h-9 px-3 rounded-xl text-xs border-border/80 hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <IconComp className="w-3.5 h-3.5 mr-1.5" />
                      <span>{item.label}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
                    </Button>
                  </Link>
                );
              })}

              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isFetching}
                className="cursor-pointer h-9 px-3 rounded-xl border-border/80"
                title="Làm mới dữ liệu từ máy chủ"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 mr-1.5 ${isFetching ? "animate-spin" : ""}`}
                />
                <span>Làm mới</span>
              </Button>

              <Button
                size="sm"
                onClick={onOpenEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer h-9 px-3.5 rounded-xl shadow-xs"
              >
                <SquarePen className="w-3.5 h-3.5 mr-1.5" />
                <span>Chỉnh sửa hồ sơ xe</span>
              </Button>
            </div>
          </div>

          {/* Thẻ Hero Showcase: Ảnh trực quan + Thông tin gốc & Thương hiệu */}
          <Card className="rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Cột Trái (5/12): Khung trưng bày Hình ảnh & Dải Thumbnail */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative aspect-16/11 w-full rounded-xl bg-muted/30 border border-border/70 flex items-center justify-center overflow-hidden group">
                  {activeHeroImageUrl ? (
                    <Image
                      src={activeHeroImageUrl}
                      alt={activeHeroMedia?.caption || product.tenSanPham}
                      width={640}
                      height={440}
                      priority
                      className="w-full h-full object-contain p-2 transition-all duration-300"
                      unoptimized
                    />
                  ) : product.laPhuongTien ? (
                    <div className="flex flex-col items-center gap-2 text-sky-600 dark:text-sky-400">
                      <div className="w-20 h-20 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                        <Bike className="w-10 h-10" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Chưa tải lên ảnh đại diện phương tiện
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <div className="w-20 h-20 rounded-2xl bg-muted/70 flex items-center justify-center border border-border/60">
                        <Package className="w-10 h-10" />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Chưa có hình ảnh sản phẩm
                      </span>
                    </div>
                  )}

                  {/* Nút qua trái / phải trực tiếp trên khung ảnh lớn */}
                  {heroMediaList.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleStepHeroMedia(-1)}
                        title="Ảnh trước"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900/65 hover:bg-zinc-900/90 text-white flex items-center justify-center backdrop-blur-md shadow-sm opacity-85 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStepHeroMedia(1)}
                        title="Ảnh tiếp theo"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900/65 hover:bg-zinc-900/90 text-white flex items-center justify-center backdrop-blur-md shadow-sm opacity-85 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-zinc-900/70 text-white text-[10px] font-mono font-semibold backdrop-blur-md">
                        {activeHeroIndex + 1} / {heroMediaList.length}
                      </div>
                    </>
                  )}

                  {/* Nhãn chú thích ảnh đang chọn */}
                  {activeHeroMedia && (
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/75 text-white backdrop-blur-md text-[11px]">
                      <span className="truncate font-medium">
                        {activeHeroMedia.caption}
                      </span>
                      {activeHeroMedia.isPrimary && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded bg-amber-500/90 text-white font-semibold text-[10px]">
                          Ảnh chính
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Dải Thumbnail chuyển đổi nhanh (kèm nút điều hướng Trái/Phải cho Desktop) */}
                {heroMediaList.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleScrollThumbStrip(-1)}
                      title="Cuộn qua trái / Ảnh trước"
                      className="w-7 h-12 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div
                      ref={thumbStripRef}
                      className="flex-1 flex items-center gap-2 max-w-full overflow-x-auto no-scrollbar scroll-smooth py-0.5"
                    >
                      {heroMediaList.map((media, idx) => {
                        const thumbUrl = takeImage(
                          media.path,
                          480,
                          media.maxSize,
                        );
                        const isSelected = activeHeroMedia?.id === media.id;
                        return (
                          <button
                            key={media.id}
                            type="button"
                            onClick={() => {
                              onSelectHeroMedia(media.id);
                              scrollThumbIntoView(idx);
                            }}
                            title={media.caption}
                            className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                              isSelected
                                ? "border-blue-600 ring-2 ring-blue-500/20 scale-[1.02]"
                                : "border-border/70 opacity-75 hover:opacity-100"
                            }`}
                          >
                            {thumbUrl ? (
                              <Image
                                src={thumbUrl}
                                alt={media.caption}
                                width={64}
                                height={48}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleScrollThumbStrip(1)}
                      title="Cuộn qua phải / Ảnh tiếp theo"
                      className="w-7 h-12 rounded-lg border border-border/80 bg-muted/40 hover:bg-muted text-foreground flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Cột Phải (7/12): Định danh sản phẩm, Thương hiệu & Thông tin cốt lõi */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Dải Badge phân loại & trạng thái */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-muted text-foreground border border-border/80">
                      <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                      {product.maSanPham
                        ? product.maSanPham.toUpperCase()
                        : "N/A"}
                    </span>

                    {product.laPhuongTien ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25">
                        <Bike className="w-3.5 h-3.5" />
                        Xe nguyên chiếc
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25">
                        <Package className="w-3.5 h-3.5" />
                        Phụ tùng & Linh kiện
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        product.trangThai
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25"
                          : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/25"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.trangThai
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-zinc-400"
                        }`}
                      />
                      {product.trangThai ? "Đang kinh doanh" : "Tạm ngừng bán"}
                    </span>

                    {product.daXuatBan && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/25">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Hiển thị POS & Web
                      </span>
                    )}
                  </div>

                  {/* Thẻ H1 duy nhất trên toàn trang theo chuẩn SEO & Semantic HTML */}
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
                    {product.tenSanPham}
                  </h1>

                  {product.moTaNgan && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {product.moTaNgan}
                    </p>
                  )}
                </div>

                {/* Thẻ nhận diện Thương hiệu (Hãng sản xuất) */}
                {brand && (
                  <div className="p-3.5 rounded-xl bg-muted/35 border border-border/70 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-background border border-border/80 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                        {brandLogoUrl ? (
                          <Image
                            src={brandLogoUrl}
                            alt={brand.tenThuongHieu}
                            width={44}
                            height={44}
                            className="w-full h-full object-contain p-1"
                            unoptimized
                          />
                        ) : (
                          <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
                            {brand.tenThuongHieu.slice(0, 3).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            Thương hiệu / Hãng xe:
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {brand.tenThuongHieu}
                          </span>
                          {brand.maThuongHieu && brand.maThuongHieu !== "-" && (
                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/70">
                              {brand.maThuongHieu}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                          {brand.quocGia && (
                            <span>Xuất xứ: {brand.quocGia}</span>
                          )}
                          {brand.moTa && (
                            <span className="line-clamp-1">• {brand.moTa}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/admin/brands"
                      className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                    >
                      Xem thương hiệu
                    </Link>
                  </div>
                )}

                {/* Lưới thông tin định danh & thương mại (render qua .map()) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {metaSummaryItems.map((meta) => {
                    const IconComp = meta.icon;
                    return (
                      <div
                        key={meta.id}
                        className="p-2.5 rounded-xl bg-muted/25 border border-border/60 flex items-start gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] text-muted-foreground truncate">
                            {meta.label}
                          </div>
                          <div
                            className={`text-xs font-semibold truncate mt-0.5 ${
                              meta.highlight
                                ? "text-blue-600 dark:text-blue-400 font-bold"
                                : "text-foreground"
                            }`}
                            title={meta.value}
                          >
                            {meta.value}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>
      );
    },
  );

ProductDetailHeader.displayName = "ProductDetailHeader";
