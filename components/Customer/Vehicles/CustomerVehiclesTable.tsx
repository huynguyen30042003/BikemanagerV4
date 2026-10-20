"use client";

import React from "react";
import Link from "next/link";
import {
  Bike,
  BatteryCharging,
  Gauge,
  History,
  SquarePen,
  Trash2,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KH_PhuongTienKhachHang } from "@/types/phuongTienKhachHang";

interface CustomerVehiclesTableProps {
  items: KH_PhuongTienKhachHang[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: KH_PhuongTienKhachHang) => void;
  onDelete: (item: KH_PhuongTienKhachHang) => void;
  onOpenCreate: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const CustomerVehiclesTable: React.FC<CustomerVehiclesTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  onOpenCreate,
  onResetFilters,
  hasActiveFilters,
}) => {
  const columns: Column<KH_PhuongTienKhachHang>[] = [
    {
      key: "bienSo",
      title: "Biển số xe",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex justify-center">
          <div className="inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-md bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-2xs font-mono font-bold tracking-wider text-xs">
            {v ? String(v).toUpperCase() : "CHƯA ĐĂNG KÝ"}
          </div>
        </div>
      ),
    },
    {
      key: "tenModel",
      title: "Dòng xe & Model",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20">
            <Bike className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
              {row.tenModel}
            </span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {row.mauSac && <span>Màu: {row.mauSac}</span>}
              {row.soPin && (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                  <BatteryCharging className="w-3 h-3" />
                  {row.soPin}
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "khachHangID",
      title: "Chủ sở hữu",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs py-1">
          <span className="font-medium text-foreground hover:text-blue-600">
            {row.tenKhachHang || "Khách #" + row.khachHangID.substring(0, 8)}
          </span>
          {row.dienThoaiKhachHang && (
            <span className="font-mono text-muted-foreground text-[11px]">
              {row.dienThoaiKhachHang}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "soKmHienTai",
      title: "Số Km (ODO)",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex items-center justify-center gap-1 font-mono text-xs font-semibold text-foreground">
          <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{v != null ? Number(v).toLocaleString("vi-VN") : 0} km</span>
        </div>
      ),
    },
    {
      key: "soKhung",
      title: "Số Khung / Máy",
      classNameHeader:
        "w-40 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col text-[11px] font-mono text-muted-foreground">
          {row.soKhung && <span>Khung: {row.soKhung}</span>}
          {row.soMay && <span>Máy: {row.soMay}</span>}
          {!row.soKhung && !row.soMay && <span>—</span>}
        </div>
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
              Đã bán/Hỏng
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Link
            href={`/admin/customer/ownerships?vehicleId=${row.id}`}
            title="Lịch sử sở hữu & Sang tên xe"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
          </Link>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa xe"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa phương tiện"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
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
          Chưa có phương tiện nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {hasActiveFilters
            ? "Không tìm thấy phương tiện nào khớp với bộ lọc tìm kiếm. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
            : "Chưa có phương tiện nào được đăng ký trong hệ thống. Hãy tạo hồ sơ phương tiện đầu tiên!"}
        </p>
        <div className="flex items-center gap-2 mt-4">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="cursor-pointer"
            >
              Xóa bộ lọc
            </Button>
          )}
          <Button
            size="sm"
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
          >
            <Plus className="w-4 h-4 mr-1" /> Đăng ký xe mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="min-w-[850px] p-3 flex flex-col gap-3 w-full">
          <Table<KH_PhuongTienKhachHang>
            data={items}
            columns={columns}
            showIndex
            startIndex={(page - 1) * pageSize}
          />

          {/* Standard Pagination Component */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="phương tiện"
          />
        </div>
      </div>
    </div>
  );
};
