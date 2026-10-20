"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ImageIcon,
  Plus,
  Trash2,
  FolderOpen,
  Star,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface ProductImagesGalleryProps {
  items: SP_HinhAnhSanPham[];
  selectedSanPhamId: string;
  isLoading: boolean;
  onOpenAdd: () => void;
  onZoom: (img: SP_HinhAnhSanPham) => void;
  onDelete: (id: string) => void;
}

export const ProductImagesGallery: React.FC<ProductImagesGalleryProps> = ({
  items,
  selectedSanPhamId,
  isLoading,
  onOpenAdd,
  onZoom,
  onDelete,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="aspect-4/3 rounded-xl w-full" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-8 sm:p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <h2 className="font-semibold text-base text-foreground">
          Chưa có hình ảnh trong bộ sưu tập
        </h2>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {selectedSanPhamId
            ? "Sản phẩm này chưa có ảnh nào trong album gallery. Hãy bấm nút tải lên ảnh ngay!"
            : "Vui lòng chọn một dòng sản phẩm để xem bộ sưu tập hình ảnh."}
        </p>
        {selectedSanPhamId && (
          <Button
            size="sm"
            onClick={onOpenAdd}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs font-medium"
          >
            <Plus className="w-4 h-4 mr-1" /> Tải lên ảnh đầu tiên
          </Button>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
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
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
              #{img.thuTu}
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => onZoom(img)}
                title="Xem chi tiết ảnh"
                className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-zinc-900 flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-95"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(img.hinhAnhID)}
                title="Xóa hình ảnh này"
                className="w-8 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xs cursor-pointer transition-transform active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Caption Footer */}
          <div className="p-2.5 flex flex-col gap-1 border-t border-border/60 text-xs">
            <span
              className="font-semibold text-foreground truncate"
              title={img.tieuDe || ""}
            >
              {img.tieuDe || "Không có tiêu đề"}
            </span>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span>Thứ tự: {img.thuTu}</span>
              {img.tenBienThe ? (
                <span className="truncate max-w-[110px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {img.tenBienThe}
                </span>
              ) : (
                <span className="text-muted-foreground/80">Ảnh chung</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </motion.div>
  );
};
