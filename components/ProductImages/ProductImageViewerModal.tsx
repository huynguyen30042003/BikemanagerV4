"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  X,
  Star,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SP_HinhAnhSanPham } from "@/types/hinhAnhSanPham";
import { getImageUrl } from "@/shared/constants/apiConstants";

export interface ProductImageViewerModalProps {
  image: SP_HinhAnhSanPham | null;
  images?: SP_HinhAnhSanPham[];
  onClose: () => void;
  onNavigate?: (img: SP_HinhAnhSanPham) => void;
  onDelete?: (id: string) => void;
}

export const ProductImageViewerModal: React.FC<
  ProductImageViewerModalProps
> = ({ image, images = [], onClose, onNavigate, onDelete }) => {
  // Điểm chạm bắt đầu khi vuốt trên màn hình cảm ứng điện thoại
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Vị trí của ảnh hiện tại trong danh sách
  const currentIndex = useMemo(() => {
    if (!image || images.length === 0) return -1;
    return images.findIndex((img) => img.hinhAnhID === image.hinhAnhID);
  }, [image, images]);

  const hasPrev = images.length > 1 && currentIndex > 0;
  const hasNext = images.length > 1 && currentIndex >= 0 && currentIndex < images.length - 1;

  const handlePrev = React.useCallback(() => {
    if (hasPrev && onNavigate && images[currentIndex - 1]) {
      onNavigate(images[currentIndex - 1]);
    }
  }, [hasPrev, onNavigate, images, currentIndex]);

  const handleNext = React.useCallback(() => {
    if (hasNext && onNavigate && images[currentIndex + 1]) {
      onNavigate(images[currentIndex + 1]);
    }
  }, [hasNext, onNavigate, images, currentIndex]);

  // Lắng nghe bàn phím phím tắt (Escape, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };
    if (image) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose, handlePrev, handleNext]);

  if (!image) return null;

  const imgUrl = image.duongDanAnh ? getImageUrl(image.duongDanAnh) : null;

  // Xử lý vuốt trên điện thoại di động (Touch swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Vuốt sang trái > 45px -> Next
    if (diff > 45 && hasNext) {
      handleNext();
    }
    // Vuốt sang phải > 45px -> Prev
    else if (diff < -45 && hasPrev) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 select-none animate-in fade-in-50 duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-card rounded-2xl border border-border/80 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Modal Header */}
        <div className="p-3 sm:p-3.5 border-b border-border/70 flex items-center justify-between gap-2 bg-card/95">
          <div className="min-w-0 flex-1 pr-2">
            <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
              {image.tieuDe || "Hình ảnh sản phẩm"}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
              {currentIndex >= 0 && (
                <span className="font-semibold text-foreground bg-muted px-1.5 py-0.2 rounded">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
              <span>Thứ tự #{image.thuTu}</span>
              <span>•</span>
              <span className="truncate max-w-[150px] sm:max-w-none text-indigo-600 dark:text-indigo-400 font-medium">
                {image.tenBienThe || "Ảnh chung dòng xe"}
              </span>
            </div>
          </div>

          {/* Action buttons on header */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nút xem ảnh gốc */}
            {imgUrl && (
              <a
                href={imgUrl}
                target="_blank"
                rel="noreferrer"
                title="Mở ảnh gốc trong tab mới"
                className="w-8.5 h-8.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {/* Nút xóa ảnh ngay trong modal (Tiện lợi cho Mobile) */}
            {onDelete && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onDelete(image.hinhAnhID)}
                className="w-8.5 h-8.5 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 cursor-pointer"
                title="Xóa hình ảnh này"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            {/* Nút đóng modal */}
            <button
              type="button"
              onClick={onClose}
              className="w-8.5 h-8.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Đóng xem ảnh"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Image Preview Canvas */}
        <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-black/95 flex items-center justify-center p-2 overflow-hidden touch-pan-y">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={image.tieuDe || "Preview"}
              width={1000}
              height={700}
              className="w-auto h-full max-h-full max-w-full object-contain"
              unoptimized
              priority
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center text-muted-foreground/40">
              <ImageIcon className="w-8 h-8" />
            </div>
          )}

          {/* Nút mũi tên lùi (Prev) */}
          {hasPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              title="Ảnh trước đó (Phím ←)"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-all active:scale-90 cursor-pointer z-20 border border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Nút mũi tên tiến (Next) */}
          {hasNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              title="Ảnh tiếp theo (Phím →)"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-sm shadow-md transition-all active:scale-90 cursor-pointer z-20 border border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground gap-2 flex-wrap">
          <div className="flex items-center gap-2 truncate">
            {image.laAnhDaiDien && (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Ảnh đại diện chính
              </span>
            )}
            <span className="truncate max-w-xs sm:max-w-md font-mono text-[11px]">
              {image.duongDanAnh}
            </span>
          </div>

          {/* Nút hành động xóa ảnh nổi bật trên Mobile */}
          {onDelete && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onDelete(image.hinhAnhID)}
              className="h-8 px-2.5 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10 sm:hidden cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Xóa ảnh</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductImageViewerModal;
