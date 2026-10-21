"use client";

import React, { useState } from "react";
import {
  Clock,
  SquarePen,
  Trash2,
  FolderOpen,
  Plus,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { SC_DichVu } from "@/types/suaChua";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface RepairServicesTableProps {
  items: SC_DichVu[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  getServiceTypeLabel: (id?: number | null) => string;
  onEdit: (item: SC_DichVu) => void;
  onDelete: (item: SC_DichVu) => void;
  onOpenCreate: () => void;
}

export function RepairServicesTable({
  items,
  page,
  pageSize,
  totalCount,
  totalPages,
  setPage,
  setPageSize,
  getServiceTypeLabel,
  onEdit,
  onDelete,
  onOpenCreate,
}: RepairServicesTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 1500);
  };

  const columns: Column<SC_DichVu>[] = [
    {
      key: "maDichVu",
      title: "Mã Dịch Vụ",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const code = String(v || "—");
        const isCopied = copiedCode === code;
        return (
          <button
            type="button"
            onClick={(e) => handleCopy(code, e)}
            title="Nhấn để sao chép mã dịch vụ"
            className="group/btn inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 transition-all cursor-pointer"
          >
            <span>{code}</span>
            {isCopied ? (
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
            )}
          </button>
        );
      },
    },
    {
      key: "tenDichVu",
      title: "Tên Dịch Vụ & Mô Tả",
      classNameHeader:
        "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-sm">
            {row.tenDichVu}
          </span>
          {row.moTa && (
            <span className="text-xs text-muted-foreground line-clamp-1">
              {row.moTa}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "danhMucChiTietID",
      title: "Phân loại",
      classNameHeader:
        "w-44 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
          {getServiceTypeLabel(Number(v)) || "Dịch vụ chung"}
        </span>
      ),
    },
    {
      key: "giaCoBan",
      title: "Giá tiền công",
      classNameHeader:
        "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v, row) => (
        <div className="flex flex-col items-end gap-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {formatCurrency(Number(v))}
          </span>
          {row.giaKhuyenMai && row.giaKhuyenMai > 0 ? (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
              KM: {formatCurrency(row.giaKhuyenMai)}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "thoiGianDuKienPhut",
      title: "Thời gian làm",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Clock className="w-3.5 h-3.5 text-blue-500" /> {v} phút
        </span>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Kinh doanh
          </span>
        ) : (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">
            Tạm dừng
          </span>
        ),
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader:
        "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa dịch vụ"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
          >
            <SquarePen className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(row)}
            title="Xóa dịch vụ"
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-8 sm:p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4 text-muted-foreground">
          <FolderOpen className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="font-semibold text-base text-foreground mb-1">
          Chưa có dịch vụ nào trong bảng giá
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-4">
          Không tìm thấy dịch vụ sửa chữa phù hợp với bộ lọc hiện tại. Bạn có thể thêm dịch vụ mới hoặc làm mới bộ lọc.
        </p>
        <Button
          size="sm"
          onClick={onOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs h-9 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Thêm dịch vụ
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table<SC_DichVu>
          data={items}
          columns={columns}
          showIndex
          startIndex={(page - 1) * pageSize}
        />
      </div>

      <div className="p-3 border-t border-border/70">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          itemName="dịch vụ"
        />
      </div>
    </div>
  );
}
