"use client";

import React from "react";
import { Column, Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/Common/RoleGuard";
import { Pagination } from "@/components/Common/Pagination";
import { NH_NhaCungCap } from "@/types/nhaCungCap";
import {
  Phone,
  Mail,
  MapPin,
  CreditCard,
  SquarePen,
  Trash2,
  FolderOpen,
  Plus,
} from "lucide-react";

interface SuppliersTableProps {
  items: NH_NhaCungCap[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (item: NH_NhaCungCap) => void;
  onDelete: (item: NH_NhaCungCap) => void;
  onAddNew: () => void;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

export function SuppliersTable({
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
}: SuppliersTableProps) {
  const columns: Column<NH_NhaCungCap>[] = [
    {
      key: "maNhaCungCap",
      title: "Mã NCC",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "tenNhaCungCap",
      title: "Nhà cung cấp & Liên hệ",
      classNameHeader:
        "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
            {row.tenNhaCungCap}
          </span>
          {row.nguoiLienHe && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Người LH:{" "}
              <strong className="text-foreground">{row.nguoiLienHe}</strong>
            </span>
          )}
          {row.maSoThue && (
            <span className="text-[11px] text-muted-foreground font-mono">
              MST: {row.maSoThue}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "dienThoai",
      title: "Thông tin liên lạc",
      classNameHeader:
        "w-48 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {row.dienThoai && (
            <div className="flex items-center gap-1 text-foreground font-medium">
              <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>{row.dienThoai}</span>
            </div>
          )}
          {row.hopThu && (
            <div className="flex items-center gap-1 truncate max-w-[180px]">
              <Mail className="w-3 h-3 text-blue-500 shrink-0" />
              <span>{row.hopThu}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "diaChi",
      title: "Khu vực & Ngân hàng",
      classNameHeader:
        "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          {(row.diaChi || row.tenQuocGia) && (
            <div
              className="flex items-center gap-1 truncate"
              title={row.diaChi || ""}
            >
              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
              <span>
                {row.tenQuocGia ? `[${row.tenQuocGia}] ` : ""}
                {row.diaChi || "Chưa có địa chỉ"}
              </span>
            </div>
          )}
          {row.soTaiKhoanNganHang && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
              <CreditCard className="w-3 h-3 text-purple-500 shrink-0" />
              <span>
                {row.soTaiKhoanNganHang} ({row.tenNganHang || "NH"})
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "congNoHienTai",
      title: "Công nợ phải trả",
      classNameHeader:
        "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => {
        const debt = Number(v) || 0;
        return (
          <span
            className={`font-semibold font-mono text-xs ${
              debt > 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {formatCurrency(debt)}
          </span>
        );
      },
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            v
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {v ? "Đang giao dịch" : "Tạm ngưng"}
        </span>
      ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <RoleGuard
            allowedRoles={[
              "Administrator",
              "AdminAccess",
              "PurchaseAccess",
            ]}
          >
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(row)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
              title="Chỉnh sửa thông tin"
            >
              <SquarePen className="w-3.5 h-3.5" />
            </Button>
          </RoleGuard>

          <RoleGuard allowedRoles={["Administrator", "AdminAccess"]}>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(row)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
              title="Xóa nhà cung cấp"
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
              Không tìm thấy nhà cung cấp nào
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Chưa có nhà cung cấp phù hợp với bộ lọc tìm kiếm hiện tại.
            </p>
            <RoleGuard
              allowedRoles={[
                "Administrator",
                "AdminAccess",
                "PurchaseAccess",
              ]}
            >
              <Button
                size="sm"
                onClick={onAddNew}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium"
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm nhà cung cấp mới
              </Button>
            </RoleGuard>
          </div>
        ) : (
          <>
            <Table<NH_NhaCungCap>
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
                itemName="nhà cung cấp"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SuppliersTable;
