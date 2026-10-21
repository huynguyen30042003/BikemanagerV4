"use client";

import React from "react";
import { Check, Copy, Flag, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { DM_QuocGia } from "@/types/quocGia";

interface QuocGiaTableProps {
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

export function QuocGiaTable({
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
}: QuocGiaTableProps) {
  const columns: Column<DM_QuocGia>[] = [
    {
      key: "quocGiaID",
      title: "ID",
      classNameHeader:
        "w-16 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-medium px-2 py-0.5 rounded-md bg-muted/60 border border-border/50 text-muted-foreground">
          #{v}
        </span>
      ),
    },
    {
      key: "maQuocGia",
      title: "Mã Quốc gia",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <button
          type="button"
          onClick={(e) => onCopyCode(String(v || ""), e)}
          title="Nhấn để sao chép mã quốc gia"
          className="group/btn inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/25 transition-all cursor-pointer shadow-2xs"
        >
          <Flag className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>{v ? String(v).toUpperCase() : "—"}</span>
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
      title: "Tên Quốc gia",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span
            onClick={() => onEdit(row)}
            className="font-semibold text-foreground text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {row.ten}
          </span>
          {row.tenKhongDau && (
            <span className="text-xs text-muted-foreground">
              {row.tenKhongDau}
            </span>
          )}
        </div>
      ),
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
            title="Chỉnh sửa quốc gia"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa quốc gia"
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
      <div className="p-3 flex flex-col gap-3 w-full overflow-x-auto min-w-0">
        <Table<DM_QuocGia>
          data={items}
          columns={columns}
          showIndex
          startIndex={(page - 1) * pageSize}
        />

        {/* Standardized Pagination */}
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
    </div>
  );
}
