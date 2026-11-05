"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, Cpu, FileText, Globe2, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SP_SanPhamDetail } from "@/types/sanPham";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import { ParsedSpecItem } from "@/components/Products/Detail/ProductDetailUtils";
import { takeImage } from "@/utils";

export interface ProductSpecsBrandTabProps {
  product: SP_SanPhamDetail;
  brand: SP_ThuongHieu | null;
  parsedSpecs: ParsedSpecItem[];
  onOpenEdit: () => void;
}

export const ProductSpecsBrandTab: React.FC<ProductSpecsBrandTabProps> =
  React.memo(({ product, brand, parsedSpecs, onOpenEdit }) => {
    const brandLogoUrl = brand?.duongDanLogo
      ? takeImage(brand.duongDanLogo, 480, brand.maxSize)
      : null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Cột Trái (7/12): Bảng thông số kỹ thuật chi tiết & Bài viết mô tả */}
        <div className="lg:col-span-7 space-y-5">
          <Card className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Bảng thông số kỹ thuật ({parsedSpecs.length})
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Thông số khung sườn, động cơ, hệ thống phanh, kích thước và
                    tiện ích
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onOpenEdit}
                className="h-8 px-2.5 rounded-xl text-xs cursor-pointer"
              >
                <SquarePen className="w-3.5 h-3.5 mr-1" />
                <span>Cập nhật thông số</span>
              </Button>
            </div>

            {parsedSpecs.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Chưa có dữ liệu thông số kỹ thuật (`thongSoKyThuatJson`) cho
                  sản phẩm này.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onOpenEdit}
                  className="h-8 text-xs rounded-xl cursor-pointer"
                >
                  Thêm thông số kỹ thuật JSON
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border/60 rounded-xl border border-border/70 overflow-hidden">
                {parsedSpecs.map((spec, idx) => (
                  <div
                    key={spec.id}
                    className={`grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 px-3.5 py-2.5 text-xs ${
                      idx % 2 === 0 ? "bg-muted/25" : "bg-card"
                    }`}
                  >
                    <div className="sm:col-span-5 font-semibold text-muted-foreground">
                      {spec.label}
                    </div>
                    <div className="sm:col-span-7 font-semibold text-foreground break-words">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Mô tả chi tiết sản phẩm */}
          <Card className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Mô tả chi tiết & Đặc điểm nổi bật
                </h2>
                <p className="text-xs text-muted-foreground">
                  Nội dung giới thiệu sản phẩm hiển thị trên trang tư vấn bán
                  hàng
                </p>
              </div>
            </div>

            {product.moTa ? (
              <div className="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                {product.moTa}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic py-4">
                Chưa có bài viết mô tả chi tiết (`moTa`) cho sản phẩm này.
              </p>
            )}
          </Card>
        </div>

        {/* Cột Phải (5/12): Hồ sơ Thương hiệu / Hãng sản xuất */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Hồ sơ Thương hiệu
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Thông tin nhà sản xuất & xuất xứ
                  </p>
                </div>
              </div>

              <Link href="/admin/brands">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Quản lý Hãng
                </Button>
              </Link>
            </div>

            {brand ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-muted/30 border border-border/70">
                  <div className="w-16 h-16 rounded-xl bg-background border border-border/80 flex items-center justify-center overflow-hidden shrink-0">
                    {brandLogoUrl ? (
                      <Image
                        src={brandLogoUrl}
                        alt={brand.tenThuongHieu}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain p-1.5"
                        unoptimized
                      />
                    ) : (
                      <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                        {brand.tenThuongHieu.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="text-base font-bold text-foreground truncate">
                      {brand.tenThuongHieu}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-mono px-2 py-0.5 rounded bg-muted text-foreground border border-border/70">
                        Mã: {brand.maThuongHieu || "-"}
                      </span>
                      {brand.quocGia && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-medium">
                          <Globe2 className="w-3 h-3" />
                          {brand.quocGia}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {brand.moTa && (
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-muted-foreground">
                      Giới thiệu thương hiệu:
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/60">
                      {brand.moTa}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-4">
                Chưa có thông tin thương hiệu đi kèm sản phẩm này.
              </p>
            )}
          </Card>
        </div>
      </div>
    );
  });

ProductSpecsBrandTab.displayName = "ProductSpecsBrandTab";
