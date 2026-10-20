"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, Star, ImageIcon } from "lucide-react";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface ProductImageViewerModalProps {
  image: SP_HinhAnhSanPham | null;
  onClose: () => void;
}

export const ProductImageViewerModal: React.FC<
  ProductImageViewerModalProps
> = ({ image, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (image) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  const imgUrl = image.duongDanAnh ? getImageUrl(image.duongDanAnh) : null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-card rounded-2xl border border-border overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-3.5 border-b border-border/70 flex items-center justify-between">
          <div className="min-w-0 pr-2">
            <h3 className="font-bold text-sm text-foreground truncate">
              {image.tieuDe || "Hình ảnh sản phẩm"}
            </h3>
            <p className="text-[11px] text-muted-foreground truncate">
              Thứ tự #{image.thuTu} •{" "}
              {image.tenBienThe || "Ảnh chung sản phẩm"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Đóng xem ảnh"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Preview Canvas */}
        <div className="relative aspect-16/10 w-full bg-black/95 flex items-center justify-center p-2 overflow-hidden">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={image.tieuDe || "Preview"}
              width={900}
              height={600}
              className="w-auto h-full max-h-full max-w-full object-contain"
              unoptimized
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground/40">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground gap-2 flex-wrap">
          <span className="truncate max-w-md font-mono text-[11px]">
            Đường dẫn: {image.duongDanAnh}
          </span>
          {image.laAnhDaiDien && (
            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Ảnh đại diện chính
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
