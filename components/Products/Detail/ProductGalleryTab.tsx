"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Filter,
  ImageIcon,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchSelect } from "@/components/ui/selectSearch";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import { formatDateStr } from "@/components/Products/Detail/ProductDetailUtils";
import { takeImage } from "@/utils";

export interface ProductGalleryTabProps {
  sanPhamId: string;
  images: SP_HinhAnhSanPham[];
  variants: SP_BienTheSanPham[];
  selectedVariantId: string;
  setSelectedVariantId: (id: string) => void;
  onSelectHeroMedia: (heroId: string) => void;
}

export const ProductGalleryTab: React.FC<ProductGalleryTabProps> = React.memo(
  ({
    sanPhamId,
    images,
    variants,
    selectedVariantId,
    setSelectedVariantId,
    onSelectHeroMedia,
  }) => {
    const variantOptions = useMemo(
      () => [
        { label: "Tất cả hình ảnh sản phẩm & biến thể", value: "" },
        ...variants.map((v) => ({
          label: `${v.tenBienThe} (${v.maSKU})`,
          value: v.bienTheSanPhamID,
        })),
      ],
      [variants],
    );

    return (
      <div className="space-y-4">
        {/* Thanh lọc theo biến thể & Nút sang trang quản lý ảnh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Bộ sưu tập Hình ảnh ({images.length})
            </h2>
            <p className="text-xs text-muted-foreground">
              Hình ảnh ngoại quan chung và bộ ảnh chi tiết theo từng màu sắc biến
              thể
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {variants.length > 0 && (
              <div className="w-full sm:w-72">
                <SearchSelect
                  options={variantOptions}
                  value={selectedVariantId}
                  onChange={(val) => setSelectedVariantId(String(val ?? ""))}
                  placeholder="Lọc ảnh theo biến thể màu..."
                />
              </div>
            )}

            {selectedVariantId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVariantId("")}
                className="h-9 px-3 rounded-xl text-xs cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 mr-1" />
                <span>Bỏ lọc</span>
              </Button>
            )}

            <Link href={`/admin/product-images?productId=${sanPhamId}`}>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 rounded-xl text-xs cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-sky-600 dark:text-sky-400" />
                <span>Quản lý & Tải ảnh mới</span>
                <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Lưới hình ảnh */}
        {images.length === 0 ? (
          <Card className="rounded-2xl border border-border/80 bg-card p-10 text-center space-y-3 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              Chưa có hình ảnh trong bộ sưu tập
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {selectedVariantId
                ? "Biến thể đang chọn chưa có hình ảnh riêng biệt. Hãy chọn 'Tất cả hình ảnh' hoặc tải thêm ảnh mới."
                : "Sản phẩm này chưa có danh sách `hinhAnhs` trả về từ API hoặc chưa được tải lên thư viện ảnh."}
            </p>
            <div className="pt-2">
              <Link href={`/admin/product-images?productId=${sanPhamId}`}>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer rounded-xl"
                >
                  <ImageIcon className="w-4 h-4 mr-1.5" />
                  <span>Tải lên bộ sưu tập hình ảnh</span>
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => {
              const imgUrl = img.duongDanAnh
                ? takeImage(img.duongDanAnh, 480, img.maxSize)
                : null;

              return (
                <Card
                  key={img.hinhAnhID}
                  onClick={() => onSelectHeroMedia(`gallery-${img.hinhAnhID}`)}
                  className="rounded-xl border border-border/80 bg-card hover:border-blue-500/50 hover:shadow-md transition-all overflow-hidden group cursor-pointer flex flex-col justify-between gap-0"
                >
                  <div className="relative aspect-16/11 w-full bg-muted/30 flex items-center justify-center overflow-hidden border-b border-border/50">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={img.tieuDe || "Ảnh sản phẩm"}
                        width={400}
                        height={275}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    )}

                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-900/75 text-white text-[10px] font-mono font-bold backdrop-blur-md">
                        #{img.thuTu ?? 1}
                      </span>

                      {img.laAnhDaiDien && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-white text-[10px] font-bold shadow-xs">
                          <Star className="w-3 h-3 fill-white" />
                          Ảnh chính
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 space-y-1.5">
                    <div className="text-xs font-semibold text-foreground line-clamp-1">
                      {img.tieuDe || "Ảnh chi tiết sản phẩm"}
                    </div>

                    <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                      <span className="truncate font-medium text-indigo-600 dark:text-indigo-400">
                        {img.tenBienThe || "Dùng chung mọi màu"}
                      </span>
                      <span>{formatDateStr(img.ngayTao)}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

ProductGalleryTab.displayName = "ProductGalleryTab";

