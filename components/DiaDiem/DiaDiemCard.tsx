"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  Store,
  SquarePen,
  Trash2,
  Building2,
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DM_DiaDiem } from "@/types/diaDiem";
import { getImageUrl } from "@/shared/constants/apiConstants";

export interface DiaDiemCardProps {
  item: DM_DiaDiem;
  index: number;
  onEdit: (item: DM_DiaDiem) => void;
  onDelete: (item: DM_DiaDiem) => void;
  provinceMap: Map<number, string>;
  getLoaiBadge: (loaiId?: number | null) => React.ReactNode;
}

export const DiaDiemCard = memo(function DiaDiemCard({
  item,
  index,
  onEdit,
  onDelete,
  provinceMap,
  getLoaiBadge,
}: DiaDiemCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Đã sao chép mã cơ sở!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const imgUrl = getImageUrl(item.anhDaiDien);
  const tName =
    item.tenTinh ||
    provinceMap.get(Number(item.tinhID)) ||
    (item.tinhID ? `Tỉnh #${item.tinhID}` : "");

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
      }}
    >
      <Card className="gap-0 p-0 group rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between h-full">
        <div>
          {/* Card Thumbnail Banner */}
          <div className="relative h-36 sm:h-40 w-full bg-muted/40 overflow-hidden border-b border-border/50">
            {imgUrl ? (
              <>
                <Image
                  unoptimized
                  src={imgUrl}
                  alt={item.tenDiaDiem}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-muted/40 to-indigo-500/10 flex items-center justify-center">
                <div className="w-12 h-12 rounded-xl bg-background/80 shadow-2xs border border-border/60 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                  <Store className="w-6 h-6 stroke-[1.5]" />
                </div>
              </div>
            )}

            {/* Floating Header Badges */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
              {getLoaiBadge(item.loaiDiaDiemID)}

              {item.trangThai ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white backdrop-blur-md shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Hoạt động
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-200 backdrop-blur-md shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Tạm đóng
                </span>
              )}
            </div>

            {/* ID Chip bottom overlay */}
            <div className="absolute bottom-2 left-2.5 z-10">
              <button
                type="button"
                onClick={(e) => handleCopyId(item.diaDiemID, e)}
                title="Nhấn để sao chép mã cơ sở"
                className="group/btn inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md bg-background/90 hover:bg-background text-foreground border border-border/70 backdrop-blur-md transition-colors shadow-2xs cursor-pointer"
              >
                <span>#{item.diaDiemID.slice(0, 8)}</span>
                {copiedId === item.diaDiemID ? (
                  <Check className="w-2.5 h-2.5 text-emerald-500" />
                ) : (
                  <Copy className="w-2.5 h-2.5 opacity-60 group-hover/btn:opacity-100" />
                )}
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-3 sm:p-3.5 space-y-2 sm:space-y-2.5">
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 hover:text-blue-600 transition-colors">
                {item.tenDiaDiem}
              </h3>

              {item.diaDiemCapChaID && (
                <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                  <Layers className="w-3 h-3 text-muted-foreground/70" />
                  <span className="truncate">
                    Trực thuộc: {item.tenDiaDiemCha || "Cơ sở cấp trên"}
                  </span>
                </div>
              )}
            </div>

            {/* Regional Tags */}
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              {tName && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 font-medium border border-blue-500/20 text-[11px]">
                  <Building2 className="w-3 h-3" />
                  {tName}
                </span>
              )}
              {item.tenXa && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-500/20 text-[11px]">
                  <Compass className="w-3 h-3" />
                  {item.tenXa}
                </span>
              )}
            </div>

            {/* Specific Address */}
            <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span className="line-clamp-2">
                {item.diaChiSo || "Chưa cập nhật địa chỉ chi tiết"}
              </span>
            </div>

            {/* GPS Coordinates with Direct Map Link */}
            {item.kinhDo != null && item.viDo != null && (
              <div className="pt-0.5">
                <a
                  href={`https://www.google.com/maps?q=${item.viDo},${item.kinhDo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-[11px] font-mono border border-border/60 transition-colors"
                  title="Mở Google Maps"
                >
                  <Navigation className="w-3 h-3 text-emerald-500" />
                  <span>
                    {item.viDo.toFixed(4)}, {item.kinhDo.toFixed(4)}
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
                </a>
              </div>
            )}

            {/* Description */}
            {item.moTa && (
              <p className="text-xs text-muted-foreground/80 line-clamp-2 pt-1 border-t border-border/40">
                {item.moTa}
              </p>
            )}
          </div>
        </div>

        {/* Card Actions Footer */}
        <div className="p-2.5 sm:p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(item)}
            className="flex-1 h-8 text-xs cursor-pointer flex items-center justify-center gap-1.5 hover:text-blue-600 hover:border-blue-500/40"
          >
            <SquarePen className="w-3.5 h-3.5" />
            <span>Chỉnh sửa</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer shrink-0"
            title="Xóa cơ sở"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});
