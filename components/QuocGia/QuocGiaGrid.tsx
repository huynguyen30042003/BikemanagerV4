"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Copy, Flag, SquarePen, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Common/Pagination";
import { DM_QuocGia } from "@/types/quocGia";

interface QuocGiaGridProps {
  items: DM_QuocGia[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DM_QuocGia) => void;
  onDelete: (item: DM_QuocGia) => void;
  copiedId: string | null;
  onCopyCode: (code: string, e: React.MouseEvent) => void;
}

export function QuocGiaGrid({
  items,
  page,
  pageSize,
  totalCount,
  totalPages,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  copiedId,
  onCopyCode,
}: QuocGiaGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="space-y-4">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {items.map((country: DM_QuocGia) => (
          <Card
            key={country.quocGiaID}
            className="group rounded-xl border border-border/80 bg-card p-4 pb-2 shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between gap-3 relative"
          >
            <div className="space-y-3">
              {/* Top Bar: Mã ISO Badge & Status Badge */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => onCopyCode(country.maQuocGia, e)}
                  title="Nhấn để sao chép mã quốc gia"
                  className="group/code inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-mono text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/25 transition-all cursor-pointer shadow-2xs"
                >
                  <Flag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold">
                    {country.maQuocGia ? country.maQuocGia.toUpperCase() : "—"}
                  </span>
                  {copiedId === country.maQuocGia ? (
                    <Check className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-40 group-hover/code:opacity-100 transition-opacity" />
                  )}
                </button>

                {country.trangThai ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Sử dụng
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Khóa
                  </span>
                )}
              </div>

              {/* Main Header */}
              <div>
                <h3
                  onClick={() => onEdit(country)}
                  className="text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                  title={country.ten}
                >
                  {country.ten}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {country.tenKhongDau || "Chưa có tên không dấu"}
                </p>
              </div>

              {/* Meta Chips: Thứ tự & ID */}
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-mono bg-muted/60 text-muted-foreground border border-border/50">
                  <span>Thứ tự:</span>
                  <span className="font-semibold text-foreground">
                    #{country.thuTu ?? 0}
                  </span>
                </span>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-muted/40 text-muted-foreground border border-border/40">
                  ID: {country.quocGiaID}
                </span>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(country)}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
              >
                <SquarePen className="w-3.5 h-3.5" />
                <span>Sửa</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(country)}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </Button>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Pagination Controls */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        itemName="quốc gia"
      />
    </div>
  );
}
