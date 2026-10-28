"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Boxes,
  Plus,
  SquarePen,
  Trash2,
  FolderOpen,
  Barcode,
  BatteryCharging,
  Zap,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/Common/Pagination";
import { SP_BienTheSanPham } from "@/types/bienTheSanPham";
import { takeImage } from "@/utils";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface ProductVariantsGridProps {
  items: SP_BienTheSanPham[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: SP_BienTheSanPham) => void;
  onDelete: (item: SP_BienTheSanPham) => void;
  onOpenAdd: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const ProductVariantsGrid: React.FC<ProductVariantsGridProps> = ({
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
      <div className="rounded-xl border border-border/80 bg-card p-8 sm:p-12 text-center shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h2 className="font-semibold text-base text-foreground">
          Không tìm thấy biến thể phù hợp
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          {hasActiveFilters
            ? "Không có biến thể nào tương ứng với điều kiện tìm kiếm hoặc bộ lọc dòng sản phẩm hiện tại."
            : "Chưa có biến thể SKU nào được tạo trong hệ thống."}
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
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
            <Plus className="w-4 h-4 mr-1" /> Thêm biến thể mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid of Variant Cards */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4"
      >
        {items.map((variant) => {
          const imgUrl = variant.hinhAnh ? takeImage(variant.hinhAnh,480) : null;

          return (
            <Card
              key={variant.bienTheSanPhamID}
              className="group relative rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col"
            >
              {/* Media Section */}
              <div className="relative aspect-4/3 w-full bg-muted/30 overflow-hidden flex items-center justify-center p-3">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={variant.tenBienThe}
                    width={320}
                    height={240}
                    className="w-auto h-full max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground/50 border border-border/40">
                    <Boxes className="w-8 h-8" />
                  </div>
                )}

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap max-w-[70%]">
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-sm text-foreground border border-border/70 shadow-2xs truncate">
                    {variant.maSKU}
                  </span>
                  {variant.quanLyTheoSerial && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/15 backdrop-blur-sm text-indigo-700 dark:text-indigo-300 border border-indigo-500/25">
                      <Barcode className="w-3 h-3" />
                      Serial
                    </span>
                  )}
                </div>

                {/* Status Pill */}
                <div className="absolute top-2.5 right-2.5">
                  {variant.trangThai ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 backdrop-blur-sm text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Kinh doanh
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-500/15 backdrop-blur-sm text-slate-700 dark:text-slate-300 border border-slate-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Ngừng bán
                    </span>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3 border-t border-border/60">
                <div>
                  <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 truncate mb-0.5">
                    <Package className="w-3 h-3 shrink-0 text-muted-foreground/70" />
                    <span className="truncate">
                      {variant.tenSanPham ||
                        `Dòng xe #${variant.sanPhamID.substring(0, 8)}`}
                    </span>
                  </div>

                  <h3
                    className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-blue-600 transition-colors"
                    title={variant.tenBienThe}
                  >
                    {variant.tenBienThe}
                  </h3>

                  {/* Spec Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {variant.mauSac && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        {variant.mauSac}
                      </span>
                    )}
                    {variant.dungLuongPin && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                        <BatteryCharging className="w-3 h-3" />
                        {variant.dungLuongPin}
                      </span>
                    )}
                    {variant.congSuatDongCo && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                        <Zap className="w-3 h-3" />
                        {variant.congSuatDongCo}
                      </span>
                    )}
                    {variant.soThangBaoHanh != null &&
                      variant.soThangBaoHanh > 0 && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
                          <ShieldCheck className="w-3 h-3 text-blue-500" />
                          {variant.soThangBaoHanh}T
                        </span>
                      )}
                  </div>
                </div>

                {/* Pricing & Footer Actions */}
                <div className="pt-2 border-t border-border/50">
                  <div className="flex items-baseline justify-between mb-3">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                        Giá niêm yết
                      </span>
                      <span className="font-mono text-base font-bold text-foreground">
                        {formatCurrency(variant.giaBan)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-1">
                    <Link
                      href={`/admin/product-serials?variantId=${variant.bienTheSanPhamID}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-lg border border-border/80 bg-background hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-muted-foreground hover:text-indigo-600 text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                      title="Quản lý danh sách Serial / Số khung của biến thể"
                    >
                      <Barcode className="w-3.5 h-3.5" />
                      <span>Kho Serial</span>
                    </Link>

                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => onEdit(variant)}
                      title="Chỉnh sửa biến thể"
                      className="h-8 w-8 text-muted-foreground hover:text-blue-600 cursor-pointer"
                    >
                      <SquarePen className="w-3.5 h-3.5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => onDelete(variant)}
                      title="Xóa biến thể"
                      className="h-8 w-8 text-muted-foreground hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </motion.div>

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        itemName="biến thể"
      />
    </div>
  );
};
