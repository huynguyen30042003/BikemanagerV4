"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Package,
  Plus,
  SquarePen,
  Trash2,
  FolderOpen,
  Bike,
  ShoppingBag,
  ShieldCheck,
  Boxes,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/Common/Pagination";
import { SP_SanPham } from "@/types/sanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface ProductsGridProps {
  items: SP_SanPham[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: SP_SanPham) => void;
  onDelete: (item: SP_SanPham) => void;
  onOpenAdd: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProductsGrid: React.FC<ProductsGridProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  onOpenAdd,
  onResetFilters,
  hasActiveFilters,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h2 className="font-semibold text-base text-foreground">
          Không tìm thấy sản phẩm phù hợp
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          {hasActiveFilters
            ? "Không có kết quả nào tương ứng với điều kiện tìm kiếm hoặc bộ lọc hiện tại."
            : "Chưa có sản phẩm nào được tạo trong hệ thống."}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer"
            >
              Đặt lại bộ lọc
            </Button>
          )}
          <Button
            size="sm"
            onClick={onOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm sản phẩm mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((product, idx) => {
          const avatarUrl = getImageUrl(product.anhDaiDien);

          return (
            <motion.div
              key={product.sanPhamID}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: Math.min(idx * 0.03, 0.3),
              }}
            >
              <Card className="rounded-xl border border-border/80 bg-card hover:border-blue-500/40 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full gap-0">
                {/* Top Bar: Code & Category Tag */}
                <div className="px-3.5 py-2 flex items-center justify-between border-b border-border/40 bg-muted/20">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/70">
                    {product.maSanPham ? product.maSanPham.toUpperCase() : "N/A"}
                  </span>

                  {product.laPhuongTien ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20">
                      <Bike className="w-3 h-3" />
                      Xe nguyên chiếc
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border/60">
                      <Package className="w-3 h-3" />
                      Phụ tùng
                    </span>
                  )}
                </div>

                {/* Image Canvas Showcase */}
                <div className="relative aspect-16/10 w-full bg-muted/30 flex items-center justify-center overflow-hidden border-b border-border/40">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={product.tenSanPham}
                      width={400}
                      height={250}
                      className="w-auto h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : product.laPhuongTien ? (
                    <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                      <Bike className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground/60">
                      <Package className="w-8 h-8" />
                    </div>
                  )}

                  {/* Floating Status Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-md shadow-xs ${
                        product.trangThai
                          ? "bg-emerald-500/90 text-white"
                          : "bg-zinc-800/80 text-zinc-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {product.trangThai ? "Kinh doanh" : "Ngừng bán"}
                    </span>
                  </div>

                  {product.daXuatBan && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600/90 text-white shadow-xs backdrop-blur-md">
                        <ShoppingBag className="w-3 h-3" />
                        POS
                      </span>
                    </div>
                  )}
                </div>

                {/* Info Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {product.tenSanPham}
                    </h3>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {product.tenThuongHieu && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted/80 text-foreground border border-border/60">
                          {product.tenThuongHieu}
                        </span>
                      )}

                      {product.tenDanhMucChiTiet && (
                        <span className="text-xs text-muted-foreground">
                          {product.tenDanhMucChiTiet}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        BH: {product.soThangBaoHanhMacDinh ?? 12} tháng
                      </span>

                      {product.tenDonViTinh && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/80 px-2 py-0.5 rounded bg-muted/60 border border-border/60">
                          ĐVT: {product.tenDonViTinh}
                        </span>
                      )}

                      <span className="text-[11px] font-mono text-muted-foreground truncate max-w-[140px]">
                        /{product.duongDan}
                      </span>
                    </div>

                    {product.moTaNgan && (
                      <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed">
                        {product.moTaNgan}
                      </p>
                    )}
                  </div>

                  {/* Action Links & Buttons */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/product-variants?productId=${product.sanPhamID}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline py-1 px-1.5 rounded hover:bg-indigo-500/10 transition-colors"
                        title="Quản lý biến thể màu sắc và dung lượng pin"
                      >
                        <Boxes className="w-3.5 h-3.5" />
                        <span>Biến thể</span>
                      </Link>

                      <Link
                        href={`/admin/product-images?productId=${product.sanPhamID}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline py-1 px-1.5 rounded hover:bg-sky-500/10 transition-colors"
                        title="Quản lý bộ sưu tập ảnh"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Ảnh</span>
                      </Link>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onEdit(product)}
                        title="Chỉnh sửa sản phẩm"
                        className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-md cursor-pointer"
                      >
                        <SquarePen className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onDelete(product)}
                        title="Xóa sản phẩm"
                        className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 dark:hover:text-rose-400 rounded-md cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        itemName="sản phẩm"
      />
    </div>
  );
};
