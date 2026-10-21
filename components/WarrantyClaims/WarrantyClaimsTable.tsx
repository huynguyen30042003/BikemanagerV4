"use client";

import React from "react";
import { Column, Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleGuard } from "@/components/Common/RoleGuard";
import { Pagination } from "@/components/Common/Pagination";
import { BH_PhieuBaoHanh } from "@/types/baoHanh";
import {
  FileText,
  User,
  Trash2,
  FolderOpen,
  Plus,
  Eye,
  Calendar,
} from "lucide-react";

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface WarrantyClaimsTableProps {
  items: BH_PhieuBaoHanh[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
  onPageSizeChange: (size: number | ((prev: number) => number)) => void;
  onViewDetail: (item: BH_PhieuBaoHanh) => void;
  onDelete: (item: BH_PhieuBaoHanh) => void;
  onAddNew: () => void;
  getClaimStatusBadge: (statusId: number) => { label: string; className: string };
  getActionBadge: (actionId: number) => { label: string; className: string };
}

export function WarrantyClaimsTable({
  items,
  isLoading,
  page,
  pageSize,
  totalPages,
  totalCount,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onDelete,
  onAddNew,
  getClaimStatusBadge,
  getActionBadge,
}: WarrantyClaimsTableProps) {
  const columns: Column<BH_PhieuBaoHanh>[] = [
    {
      key: "maPhieuBaoHanh",
      title: "Mã Phiếu BH",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "khachHang",
      title: "Khách hàng & Xe",
      classNameHeader: "min-w-[180px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {row.tenKhachHang || "Khách hàng"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            SĐT: {row.dienThoaiKhachHang || "—"}
          </span>
          {row.soKhung && (
            <span className="text-[10px] font-mono text-muted-foreground/80">
              VIN: {row.soKhung}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "moTaLoi",
      title: "Triệu chứng lỗi & Hiện tượng",
      classNameHeader: "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (v) => (
        <span className="text-xs text-foreground line-clamp-2">
          {String(v || "—")}
        </span>
      ),
    },
    {
      key: "huongXuLyID",
      title: "Hướng xử lý",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getActionBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "trangThaiID",
      title: "Trạng thái phiếu",
      classNameHeader: "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getClaimStatusBadge(Number(v));
        return (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.className}`}
          >
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "ngayTiepNhan",
      title: "Ngày nhận / Hẹn",
      classNameHeader: "w-36 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-500" />
            Nhận: {formatDate(row.ngayTiepNhan)}
          </span>
          {row.ngayHenTra && (
            <span className="text-[11px]">Hẹn: {formatDate(row.ngayHenTra)}</span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader: "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onViewDetail(row)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
            title="Xem chi tiết phiếu & linh kiện BH"
          >
            <Eye className="w-3.5 h-3.5" />
          </Button>

          <RoleGuard allowedRoles={["Administrator", "AdminAccess"]}>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(row)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
              title="Xóa phiếu tiếp nhận"
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
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="p-3 flex flex-col gap-3 w-full">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <FolderOpen className="w-10 h-10 mb-2 stroke-[1.5]" />
            <p className="font-semibold text-foreground">Không có yêu cầu bảo hành nào</p>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
              Không tìm thấy phiếu bảo hành phù hợp với bộ lọc hiện tại.
            </p>
            <RoleGuard
              allowedRoles={[
                "Administrator",
                "AdminAccess",
                "TechnicalAccess",
              ]}
            >
              <Button
                size="sm"
                onClick={onAddNew}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-1" /> Lập phiếu tiếp nhận mới
              </Button>
            </RoleGuard>
          </div>
        ) : (
          <>
            <Table<BH_PhieuBaoHanh>
              data={items}
              columns={columns}
              showIndex
              startIndex={(page - 1) * pageSize}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              setPage={onPageChange}
              setPageSize={onPageSizeChange}
              itemName="phiếu bảo hành"
            />
          </>
        )}
      </div>
    </div>
  );
}
