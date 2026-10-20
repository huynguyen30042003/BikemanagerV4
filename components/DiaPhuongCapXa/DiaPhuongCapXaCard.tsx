"use client";

import React, { memo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Compass,
  Building2,
  Tag,
  SquarePen,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DM_DiaPhuongCapXa } from "@/types/diaPhuongCapXa";

export interface DiaPhuongCapXaCardProps {
  item: DM_DiaPhuongCapXa;
  index: number;
  onEdit: (item: DM_DiaPhuongCapXa) => void;
  onDelete: (item: DM_DiaPhuongCapXa) => void;
  provinceMap: Map<number, string>;
  onSelectProvince?: (tinhId: string) => void;
}

export const DiaPhuongCapXaCard = memo(function DiaPhuongCapXaCard({
  item,
  index,
  onEdit,
  onDelete,
  provinceMap,
  onSelectProvince,
}: DiaPhuongCapXaCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success(`Đã sao chép mã xã: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getLoaiXaBadge = (loai?: number | null) => {
    if (loai === 2) {
      return {
        label: "Phường",
        bgClass:
          "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25",
        icon: <Building2 className="w-2.5 h-2.5" />,
      };
    }
    if (loai === 3) {
      return {
        label: "Thị trấn",
        bgClass:
          "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25",
        icon: <Tag className="w-2.5 h-2.5" />,
      };
    }
    return {
      label: "Xã",
      bgClass:
        "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25",
      icon: <Compass className="w-2.5 h-2.5" />,
    };
  };

  const badge = getLoaiXaBadge(item.loai);
  const parentProvince =
    item.tenTinh ||
    provinceMap.get(Number(item.tinhID)) ||
    `Tỉnh #${item.tinhID}`;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.03, 0.3),
      }}
    >
      <Card className="group rounded-xl border border-border/80 bg-card p-4 pb-1.5 shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all flex flex-col justify-between gap-3 relative h-full">
        <div className="space-y-3">
          {/* Top Bar: Loai Badge & Status Badge */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${badge.bgClass}`}
            >
              {badge.icon}
              {badge.label}
            </span>

            {item.trangThai ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Sử dụng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Khóa
              </span>
            )}
          </div>

          {/* Main Header */}
          <div>
            <h3
              onClick={() => onEdit(item)}
              className="text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
              title={item.ten}
            >
              {item.ten}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {item.tenKhongDau || "Chưa có tên không dấu"}
            </p>
          </div>

          {/* Parent Province Link Badge */}
          <button
            type="button"
            onClick={() => onSelectProvince?.(String(item.tinhID))}
            title="Lọc nhanh danh sách theo tỉnh này"
            className="w-full inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/20 truncate transition-colors cursor-pointer text-left shadow-2xs"
          >
            <Building2 className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{parentProvince}</span>
          </button>

          {/* Meta Chips: Mã Xã & Thứ tự */}
          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            <button
              type="button"
              onClick={(e) => handleCopyCode(item.maXa, e)}
              title="Nhấn để sao chép mã xã"
              className="group/code inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-xs bg-muted/70 hover:bg-muted text-foreground border border-border/60 transition-colors cursor-pointer shadow-2xs"
            >
              <span className="text-muted-foreground text-[10px]">Mã:</span>
              <span className="font-semibold">{item.maXa}</span>
              {copiedId === item.maXa ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 opacity-40 group-hover/code:opacity-100 transition-opacity" />
              )}
            </button>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-muted/50 text-muted-foreground border border-border/40">
              <span>#</span>
              <span>{item.thuTu ?? 0}</span>
            </span>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
          >
            <SquarePen className="w-3.5 h-3.5" />
            <span>Sửa</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa</span>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
});
