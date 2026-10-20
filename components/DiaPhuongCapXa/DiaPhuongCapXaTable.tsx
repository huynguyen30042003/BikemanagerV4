"use client";

import React, { useState } from "react";
import {
  Compass,
  Building2,
  Tag,
  SquarePen,
  Trash2,
  Copy,
  Check,
  FolderOpen,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { DM_DiaPhuongCapXa } from "@/types/diaPhuongCapXa";

export interface DiaPhuongCapXaTableProps {
  items: DM_DiaPhuongCapXa[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DM_DiaPhuongCapXa) => void;
  onDelete: (item: DM_DiaPhuongCapXa) => void;
  provinceMap: Map<number, string>;
  onSelectProvince?: (tinhId: string) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  onOpenCreate?: () => void;
  onSync?: () => void;
  searchInput?: string;
}

export const DiaPhuongCapXaTable: React.FC<DiaPhuongCapXaTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  provinceMap,
  onSelectProvince,
  onResetFilters,
  hasActiveFilters,
  onOpenCreate,
  onSync,
  searchInput: _searchInput,
}) => {
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

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-8 sm:p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <p className="font-semibold text-base text-foreground">
          Không tìm thấy xã / phường nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {hasActiveFilters
            ? "Không có kết quả khớp với bộ lọc hiện tại. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
            : "Chưa có dữ liệu xã / phường nào trong hệ thống. Hãy thêm mới hoặc nhấn Đồng bộ chuẩn!"}
        </p>
        <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
          {hasActiveFilters && onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer"
            >
              Xóa bộ lọc
            </Button>
          )}
          {onSync && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSync}
              className="cursor-pointer"
            >
              Đồng bộ ngay
            </Button>
          )}
          {onOpenCreate && (
            <Button
              size="sm"
              onClick={onOpenCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm xã / phường mới
            </Button>
          )}
        </div>
      </div>
    );
  }

  const columns: Column<DM_DiaPhuongCapXa>[] = [
    {
      key: "maXa",
      title: "Mã Xã",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <button
          type="button"
          onClick={(e) => handleCopyCode(String(v || ""), e)}
          title="Nhấn để sao chép mã xã"
          className="group/btn inline-flex items-center gap-1.5 font-mono text-xs font-medium px-2.5 py-1 rounded-md bg-muted/70 hover:bg-muted border border-border/60 hover:border-border text-foreground transition-all cursor-pointer shadow-2xs"
        >
          <span>{v || "-"}</span>
          {copiedId === v ? (
            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
          )}
        </button>
      ),
    },
    {
      key: "ten",
      title: "Tên Xã / Phường",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => {
        const badge = getLoaiXaBadge(row.loai);
        return (
          <div className="flex flex-col gap-0.5 py-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                onClick={() => onEdit(row)}
                className="font-semibold text-foreground text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                {row.ten}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${badge.bgClass}`}
              >
                {badge.icon}
                {badge.label}
              </span>
            </div>
            {row.tenKhongDau && (
              <span className="text-xs text-muted-foreground">
                {row.tenKhongDau}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: "tinhID",
      title: "Trực thuộc Tỉnh / TP",
      classNameHeader:
        "w-56 text-left text-xs font-semibold text-muted-foreground",
      render: (tinhId, row) => {
        const tName =
          row.tenTinh || provinceMap.get(Number(tinhId)) || `Tỉnh #${tinhId}`;
        return (
          <button
            type="button"
            onClick={() => onSelectProvince?.(String(tinhId))}
            title="Lọc nhanh danh sách theo tỉnh này"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/20 max-w-[210px] truncate shadow-2xs transition-colors cursor-pointer text-left"
          >
            <Building2 className="w-3.5 h-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{tName}</span>
          </button>
        );
      },
    },
    {
      key: "thuTu",
      title: "Thứ tự",
      classNameHeader:
        "text-center w-20 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="inline-flex items-center justify-center min-w-7 px-2 py-0.5 rounded text-xs font-mono bg-muted/80 text-foreground border border-border/60">
          {v ?? 0}
        </span>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "text-center w-32 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sử dụng
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Khóa
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa xã / phường"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa xã / phường"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="min-w-[700px] p-3 flex flex-col gap-3 w-full">
          <Table<DM_DiaPhuongCapXa>
            data={items}
            columns={columns}
            showIndex
            startIndex={(page - 1) * pageSize}
          />

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="xã/phường"
          />
        </div>
      </div>
    </div>
  );
};
