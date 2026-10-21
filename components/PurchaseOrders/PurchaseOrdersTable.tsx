"use client";

import React, { useMemo } from "react";
import {
  Building2,
  Warehouse,
  Eye,
  CreditCard,
  Clock,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { NH_DonNhapHang } from "@/types/donNhapHang";
import { formatCurrency } from "./PurchaseOrdersKpiGrid";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export interface PurchaseOrdersTableProps {
  items: NH_DonNhapHang[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  getOrderStatusBadge: (statusId: number) => {
    bgClass: string;
    textClass: string;
    borderClass: string;
    label: string;
  };
  isCompletedStatus: (statusId?: number | null) => boolean;
  onOpenDetail: (order: NH_DonNhapHang) => void;
  onOpenPayment: (order: NH_DonNhapHang) => void;
  onOpenStatusChange: (order: NH_DonNhapHang) => void;
  onOpenCreate: () => void;
}

export const PurchaseOrdersTable: React.FC<PurchaseOrdersTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  getOrderStatusBadge,
  isCompletedStatus,
  onOpenDetail,
  onOpenPayment,
  onOpenStatusChange,
  onOpenCreate,
}) => {
  const columns: Column<NH_DonNhapHang>[] = useMemo(
    () => [
      {
        key: "maDonNhap",
        title: "Mã đơn nhập",
        classNameHeader:
          "w-36 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (v) => (
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            {String(v || "—")}
          </span>
        ),
      },
      {
        key: "nhaCungCapID",
        title: "Nhà cung cấp & Kho đích",
        classNameHeader:
          "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              {row.tenNhaCungCap || "NCC"}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Warehouse className="w-3 h-3 text-muted-foreground shrink-0" />
              Kho:{" "}
              <strong className="text-foreground">
                {row.tenKho || "Kho tiếp nhận"}
              </strong>
            </span>
            {row.soHoaDonChungTu && (
              <span className="text-[11px] text-muted-foreground font-mono">
                HĐ: {row.soHoaDonChungTu}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "ngayHoaDon",
        title: "Ngày chứng từ & Hạn",
        classNameHeader:
          "w-36 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
            <span>Ngày HĐ: {formatDate(row.ngayHoaDon)}</span>
            {row.hanThanhToan && (
              <span className="text-amber-600 dark:text-amber-400">
                Hạn TT: {formatDate(row.hanThanhToan)}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "tongTien",
        title: "Tổng tiền hàng",
        classNameHeader:
          "w-36 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right",
        render: (v) => (
          <span className="font-mono text-xs font-bold text-foreground">
            {formatCurrency(Number(v))}
          </span>
        ),
      },
      {
        key: "daThanhToan",
        title: "Đã thanh toán / Còn nợ",
        classNameHeader:
          "w-44 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5 text-xs font-mono">
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Đã trả: {formatCurrency(row.daThanhToan)}
            </span>
            <span
              className={
                row.conNo > 0
                  ? "text-rose-600 dark:text-rose-400 font-semibold"
                  : "text-muted-foreground"
              }
            >
              Nợ: {formatCurrency(row.conNo)}
            </span>
          </div>
        ),
      },
      {
        key: "trangThaiID",
        title: "Trạng thái",
        classNameHeader:
          "w-36 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (v) => {
          const badge = getOrderStatusBadge(Number(v));
          return (
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {badge.label}
            </span>
          );
        },
      },
      {
        key: "function",
        title: "Thao tác",
        classNameHeader:
          "w-28 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (_v, row) => (
          <div className="flex gap-1 justify-center items-center">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onOpenDetail(row)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
              title="Xem chi tiết đơn"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>

            {row.conNo > 0 && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onOpenPayment(row)}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
                title="Thanh toán tiền hàng"
              >
                <CreditCard className="w-3.5 h-3.5" />
              </Button>
            )}

            {isCompletedStatus(row.trangThaiID) ? (
              <span
                className="inline-flex items-center justify-center w-6 h-6 rounded text-muted-foreground/30 cursor-not-allowed"
                title="Đơn đã hoàn thành (nhập kho thành công), không thể thay đổi trạng thái"
              >
                <Clock className="w-3.5 h-3.5 opacity-30" />
              </span>
            ) : (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onOpenStatusChange(row)}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 cursor-pointer"
                title="Đổi trạng thái đơn"
              >
                <Clock className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        ),
      },
    ],
    [
      getOrderStatusBadge,
      isCompletedStatus,
      onOpenDetail,
      onOpenPayment,
      onOpenStatusChange,
    ]
  );

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      {items.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Không tìm thấy đơn nhập hàng nào</p>
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCreate}
            className="mt-3 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Tạo đơn nhập hàng mới
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto min-w-0">
          <Table<NH_DonNhapHang>
            data={items}
            columns={columns}
            showIndex
            startIndex={(page - 1) * pageSize}
          />
        </div>
      )}

      <div className="p-4 border-t border-border/60">
        <Pagination
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          itemName="đơn nhập"
        />
      </div>
    </div>
  );
};
export default PurchaseOrdersTable;
