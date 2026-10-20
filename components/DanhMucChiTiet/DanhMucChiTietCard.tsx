"use client";

import React, { memo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FolderTree, SquarePen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DM_DanhMucChiTiet } from "@/types/danhMucChiTiet";

export interface DanhMucChiTietCardProps {
  item: DM_DanhMucChiTiet;
  index: number;
  onEdit: (item: DM_DanhMucChiTiet) => void;
  onDelete: (item: DM_DanhMucChiTiet) => void;
  parentCategoryMap: Map<number, string>;
}

export const DanhMucChiTietCard = memo(function DanhMucChiTietCard({
  item,
  index,
  onEdit,
  onDelete,
  parentCategoryMap,
}: DanhMucChiTietCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const parentName =
    item.tenDanhMuc ||
    item.tenDanhMucChung ||
    (item.danhMucID ? parentCategoryMap.get(Number(item.danhMucID)) : "") ||
    `Danh mục #${item.danhMucID || 0}`;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
      }}
    >
      <Card className="rounded-xl border border-border/80 bg-card p-3.5 sm:p-4 shadow-2xs hover:shadow-md hover:border-purple-500/40 transition-all flex flex-col justify-between gap-2.5 sm:gap-3 h-full">
        <div>
          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 mb-1.5 sm:mb-2">
            <span className="font-mono text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border/60">
              #{item.danhMucChiTietID}
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

          {/* Title & SKU code */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1 hover:text-purple-600 transition-colors">
              {item.ten}
            </h3>
            {item.maSo && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                {item.maSo}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">
            {item.moTa || (
              <span className="text-muted-foreground/50 italic">
                Chưa có mô tả chi tiết
              </span>
            )}
          </p>
        </div>

        {/* Card Bottom Meta & Actions */}
        <div className="pt-2.5 sm:pt-3 border-t border-border/60 flex items-center justify-between gap-2">
          <Link
            href={`/admin/danhMucChung?search=${encodeURIComponent(parentName)}`}
            title={`Danh mục cha: ${parentName}`}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-500/20 max-w-[185px] xs:max-w-[210px] truncate shadow-2xs hover:bg-purple-500/20 transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
            <span className="truncate">{parentName}</span>
          </Link>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onEdit(item)}
              title="Chỉnh sửa mục chi tiết"
              className="h-8 w-8 text-muted-foreground hover:text-purple-600 cursor-pointer"
            >
              <SquarePen className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => onDelete(item)}
              title="Xóa mục chi tiết"
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
