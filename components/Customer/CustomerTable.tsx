"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Bike,
  Award,
  SquarePen,
  Trash2,
  Copy,
  Check,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KH_KhachHang } from "@/types/khachHang";
import { getImageUrl } from "@/shared/constants/apiConstants";
import { toast } from "sonner";

export interface CustomerTableProps {
  items: KH_KhachHang[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (customer: KH_KhachHang) => void;
  onDelete: (customer: KH_KhachHang) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  onOpenCreate?: () => void;
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  onResetFilters,
  hasActiveFilters = false,
  onOpenCreate,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success(`Đã sao chép mã khách hàng: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: Column<KH_KhachHang>[] = [
    {
      key: "maKhachHang",
      title: "Mã KH",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <button
          type="button"
          onClick={(e) => handleCopyCode(String(v || ""), e)}
          title="Nhấn để sao chép mã khách hàng"
          className="group/btn inline-flex items-center gap-1.5 font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted/80 hover:bg-muted text-foreground border border-border/60 transition-all cursor-pointer shadow-2xs"
        >
          <span>{v || "KH—"}</span>
          {copiedId === v ? (
            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 opacity-40 group-hover/btn:opacity-100 transition-opacity" />
          )}
        </button>
      ),
    },
    {
      key: "tenKhachHang",
      title: "Khách hàng & Liên hệ",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-3 py-1">
          {/* Avatar or Logo */}
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20 font-bold overflow-hidden shadow-2xs">
            {(row.anhChanDung || row.anhBieuTrung) &&
            getImageUrl(row.anhChanDung || row.anhBieuTrung) ? (
              <Image
                src={getImageUrl(row.anhChanDung || row.anhBieuTrung)}
                alt={row.tenKhachHang}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : row.loaiKhachHang === 2 ? (
              <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>

          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span
                onClick={() => onEdit(row)}
                className="font-semibold text-foreground text-sm truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                {row.tenKhachHang}
              </span>
              {row.loaiKhachHang === 2 ? (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                  Doanh nghiệp
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                  Cá nhân
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <a
                href={`tel:${row.dienThoai}`}
                className="flex items-center gap-1 font-mono text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
              >
                <Phone className="w-3 h-3 shrink-0" />
                {row.dienThoai}
              </a>
              {row.hopThu && (
                <a
                  href={`mailto:${row.hopThu}`}
                  className="flex items-center gap-1 truncate max-w-[180px] hover:underline"
                >
                  <Mail className="w-3 h-3 shrink-0" />
                  {row.hopThu}
                </a>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "maDinhDanh",
      title: "CCCD / MST",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const val = row.loaiKhachHang === 2 ? row.maSoThue : row.maDinhDanh;
        return val ? (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs font-medium px-2 py-0.5 rounded bg-muted/60 border border-border/50 text-foreground">
              {val}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {row.loaiKhachHang === 2 ? "Mã số thuế" : "Số CCCD"}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground/60 text-xs">—</span>
        );
      },
    },
    {
      key: "diaChi",
      title: "Địa chỉ liên hệ",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-start gap-1.5 py-0.5 text-xs text-muted-foreground max-w-xs">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
          <span className="line-clamp-2">
            {row.diaChi || "Chưa cập nhật địa chỉ"}
          </span>
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Hoạt động
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Đã khóa
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "text-center w-36 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Link
            href={`/admin/customer/vehicles?khachHangId=${row.khachHangID}`}
            title="Xem danh sách xe của khách"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <Bike className="w-4 h-4" />
          </Link>

          <Link
            href={`/admin/customer/statistics`}
            title="Xem xếp hạng & công nợ"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <Award className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa hồ sơ"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa khách hàng"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <p className="font-semibold text-base text-foreground">
          Không tìm thấy khách hàng nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {hasActiveFilters
            ? "Không có kết quả khớp với điều kiện lọc. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
            : "Chưa có hồ sơ khách hàng trong hệ thống. Hãy thêm mới khách hàng ngay!"}
        </p>
        <div className="flex items-center gap-2 mt-4">
          {hasActiveFilters && onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer text-xs"
            >
              Xóa bộ lọc
            </Button>
          )}
          {onOpenCreate && (
            <Button
              size="sm"
              onClick={onOpenCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm khách hàng mới
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="p-2 sm:p-3 flex flex-col gap-3 w-full overflow-x-auto no-scrollbar">
        <div className="min-w-[760px]">
          <Table<KH_KhachHang>
            data={items}
            columns={columns}
            showIndex
            startIndex={(page - 1) * pageSize}
          />
        </div>

        {/* Centralized Pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          itemName="khách hàng"
        />
      </div>
    </div>
  );
};
