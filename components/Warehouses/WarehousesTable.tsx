"use client";

import React from "react";
import Link from "next/link";
import { Column, Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/Common/RoleGuard";
import { Pagination } from "@/components/Common/Pagination";
import { KHO_Kho } from "@/types/kho";
import {
  Star,
  Store,
  MapPin,
  Phone,
  Layers,
  SquarePen,
  Trash2,
  FolderOpen,
  Plus,
} from "lucide-react";

interface WarehousesTableProps {
  items: KHO_Kho[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: KHO_Kho) => void;
  onDelete: (item: KHO_Kho) => void;
  onAddNew: () => void;
  getLoaiKhoLabel: (id?: number | null) => string;
}

export function WarehousesTable({
  items,
  isLoading,
  page,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onAddNew,
  getLoaiKhoLabel,
}: WarehousesTableProps) {
  const columns: Column<KHO_Kho>[] = [
    {
      key: "maKho",
      title: "Mã kho",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v, row) => (
        <div className="flex items-center justify-center gap-1">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            {v ? String(v).toUpperCase() : "—"}
          </span>
          {row.laKhoMacDinh && (
            <span
              title="Kho mặc định bán hàng"
              className="inline-flex items-center"
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tenKho",
      title: "Tên kho hàng & Chi nhánh",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-xs text-foreground">
            {row.tenKho}
          </span>
          {row.tenDiaDiem ? (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Store className="w-3 h-3 text-blue-500" />
              Chi nhánh: {row.tenDiaDiem}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 italic">
              Kho độc lập / Trung tâm
            </span>
          )}
        </div>
      ),
    },
    {
      key: "loaiKhoID",
      title: "Loại kho",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground border border-border/60">
          {getLoaiKhoLabel(Number(v))}
        </span>
      ),
    },
    {
      key: "diaChi",
      title: "Địa chỉ & Liên hệ",
      classNameHeader:
        "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {row.diaChi && (
            <div
              className="flex items-center gap-1 truncate"
              title={row.diaChi}
            >
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="truncate">{row.diaChi}</span>
            </div>
          )}
          {row.dienThoai && (
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-muted-foreground shrink-0" />
              <span>{row.dienThoai}</span>
            </div>
          )}
          {!row.diaChi && !row.dienThoai && <span>—</span>}
        </div>
      ),
    },
    {
      key: "choPhepTonAm",
      title: "Chính sách xuất",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            Cho phép tồn âm
          </span>
        ) : (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Chặn xuất âm
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
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sử dụng
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Tạm khóa
          </span>
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
            href={`/admin/inventory?khoId=${row.khoID}`}
            title="Xem danh mục tồn kho tại kho này"
            className="inline-flex items-center justify-center h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
          </Link>

          <RoleGuard
            allowedRoles={[
              "Administrator",
              "AdminAccess",
              "WarehouseAccess",
            ]}
          >
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(row)}
              title="Chỉnh sửa kho hàng"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
            >
              <SquarePen className="w-3.5 h-3.5" />
            </Button>
          </RoleGuard>

          <RoleGuard allowedRoles={["Administrator", "AdminAccess"]}>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(row)}
              title="Xóa kho hàng"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </RoleGuard>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-10 w-full mb-3" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full mb-2" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs">
      <div className="p-3 flex flex-col gap-3 w-full">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
              <FolderOpen className="w-7 h-7 stroke-[1.5]" />
            </div>
            <p className="font-semibold text-base text-foreground">
              Không tìm thấy kho hàng nào
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Chưa có kho hàng phù hợp với bộ lọc tìm kiếm hiện tại.
            </p>
            <RoleGuard
              allowedRoles={[
                "Administrator",
                "AdminAccess",
                "WarehouseAccess",
              ]}
            >
              <Button
                size="sm"
                onClick={onAddNew}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm kho hàng mới
              </Button>
            </RoleGuard>
          </div>
        ) : (
          <>
            <Table<KHO_Kho>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            {/* Standardized Pagination Component */}
            <div className="pt-2">
              <Pagination
                page={page}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
                setPage={(p) =>
                  onPageChange(typeof p === "function" ? p(page) : p)
                }
                setPageSize={(s) =>
                  onPageSizeChange(typeof s === "function" ? s(pageSize) : s)
                }
                itemName="kho hàng"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WarehousesTable;
