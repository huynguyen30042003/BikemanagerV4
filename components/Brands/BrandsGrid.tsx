"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  Tags,
  Plus,
  SquarePen,
  Trash2,
  FolderOpen,
  Globe,
  Package,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pagination } from "@/components/Common/Pagination";
import { SP_ThuongHieu } from "@/types/thuongHieu";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface BrandsGridProps {
  items: SP_ThuongHieu[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: SP_ThuongHieu) => void;
  onDelete: (item: SP_ThuongHieu) => void;
  onOpenAdd: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const BrandsGrid: React.FC<BrandsGridProps> = ({
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
          Không tìm thấy thương hiệu phù hợp
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
          {hasActiveFilters
            ? "Không có kết quả nào tương ứng với điều kiện tìm kiếm hoặc bộ lọc hiện tại."
            : "Chưa có thương hiệu nào được tạo trong hệ thống."}
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
            <Plus className="w-4 h-4 mr-1" /> Thêm thương hiệu mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((brand, idx) => {
          const logoUrl = getImageUrl(brand.duongDanLogo);

          return (
            <motion.div
              key={brand.thuongHieuID}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: Math.min(idx * 0.03, 0.3),
              }}
            >
              <Card className="rounded-xl p-4 border border-border/80 bg-card hover:border-blue-500/40 hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col h-full gap-3">
                {/* Top Bar: Brand Code & Status Pill */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/70">
                    {brand.maThuongHieu ? brand.maThuongHieu.toUpperCase() : "N/A"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      brand.trangThai
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        brand.trangThai
                          ? "bg-emerald-500 animate-pulse"
                          : "bg-zinc-400"
                      }`}
                    />
                    {brand.trangThai ? "Hoạt động" : "Tạm khóa"}
                  </span>
                </div>

                {/* Logo Canvas Showcase */}
                <div className="flex items-center justify-center bg-muted/20 rounded-xl py-3 relative border border-border/40">
                  <div className="w-20 h-20 rounded-xl bg-background border border-border/70 flex items-center justify-center p-2 shadow-2xs group-hover:scale-105 transition-transform duration-200 overflow-hidden">
                    {logoUrl ? (
                      <Image
                        src={logoUrl}
                        alt={brand.tenThuongHieu}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    ) : (
                      <Tags className="w-8 h-8 text-muted-foreground/40 stroke-[1.5]" />
                    )}
                  </div>
                </div>

                {/* Info Body */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {brand.tenThuongHieu}
                    </h3>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">
                      slug: /{brand.duongDan}
                    </p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60">
                        <Globe className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        {brand.quocGia || "Toàn cầu"}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-0.5 rounded bg-muted/60 border border-border/60 font-mono">
                        Thứ tự: {brand.thuTu ?? 0}
                      </span>
                    </div>

                    {brand.moTa && (
                      <p className="text-xs text-muted-foreground/90 mt-2 line-clamp-2 leading-relaxed">
                        {brand.moTa}
                      </p>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <Link
                      href={`/admin/products?brandId=${brand.thuongHieuID}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline py-1 px-1.5 rounded hover:bg-blue-500/10 transition-colors"
                      title="Xem các sản phẩm của thương hiệu"
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Xem sản phẩm</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </Link>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onEdit(brand)}
                        title="Chỉnh sửa thông tin"
                        className="h-7 w-7 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-md cursor-pointer"
                      >
                        <SquarePen className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => onDelete(brand)}
                        title="Xóa thương hiệu"
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
        itemName="thương hiệu"
      />
    </div>
  );
};
