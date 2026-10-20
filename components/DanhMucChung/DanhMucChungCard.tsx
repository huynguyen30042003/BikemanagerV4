"use client";

import React, { memo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Layers, ArrowRight, SquarePen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DM_DanhMucChung } from "@/types/danhMucChung";

export interface DanhMucChungCardProps {
  item: DM_DanhMucChung;
  index: number;
  onEdit: (item: DM_DanhMucChung) => void;
  onDelete: (item: DM_DanhMucChung) => void;
}

export const DanhMucChungCard = memo(function DanhMucChungCard({
  item,
  index,
  onEdit,
  onDelete,
}: DanhMucChungCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
      }}
    >
      <Card className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between gap-2.5 sm:gap-3 h-full">
        <div>
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
            <span className="font-mono text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border/60">
              #{item.danhMucID}
            </span>

            {item.trangThai ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sử dụng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Khóa
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 hover:text-blue-600 transition-colors">
            {item.ten}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">
            {item.moTa || (
              <span className="text-muted-foreground/50 italic">
                Chưa có mô tả chi tiết
              </span>
            )}
          </p>
        </div>

        {/* Card Bottom Meta & Actions: Tối ưu hàng ngang cân đối cho màn hình 390px */}
        <div className="pt-2.5 sm:pt-3 border-t border-border/60 flex items-center justify-between gap-2">
          <Link
            href={`/admin/danhMucChiTiet?danhMucId=${item.danhMucID}`}
            title="Xem các mục chi tiết thuộc danh mục này"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/20 transition-colors text-xs font-medium truncate max-w-[190px] xs:max-w-[210px] group/link shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate">{item.soLuongChiTiet ?? 0} mục con</span>
            <ArrowRight className="w-3 h-3 text-blue-500 opacity-60 group-hover/link:translate-x-0.5 transition-transform shrink-0 hidden xs:inline" />
          </Link>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit(item)}
              title="Chỉnh sửa danh mục"
              className="h-8 w-8 text-muted-foreground hover:text-blue-600 cursor-pointer"
            >
              <SquarePen className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onDelete(item)}
              title="Xóa danh mục"
              className="h-8 w-8 text-muted-foreground hover:text-rose-600 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});
