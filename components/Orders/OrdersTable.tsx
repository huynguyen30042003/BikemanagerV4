"use client";

import React, { useMemo } from "react";
import {
  User,
  Eye,
  ArrowRight,
  Receipt,
  CheckCircle2,
  Trash2,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { DH_DonHang } from "@/types/donHang";
import { formatCurrency } from "./OrdersKpiGrid";

export interface OrdersTableProps {
  items: DH_DonHang[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  getOrderStatusBadge: (id: number) => { label: string; className: string };
  getPaymentStatusBadge: (id: number) => { label: string; className: string };
  onOpenDetail: (order: DH_DonHang) => void;
  onOpenStatusChange: (order: DH_DonHang) => void;
  onOpenPayment: (order: DH_DonHang) => void;
  onHoanThanhVaGiaoXe: (order: DH_DonHang) => void;
  onDelete: (order: DH_DonHang) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  getOrderStatusBadge,
  getPaymentStatusBadge,
  onOpenDetail,
  onOpenStatusChange,
  onOpenPayment,
  onHoanThanhVaGiaoXe,
  onDelete,
}) => {
  const columns: Column<DH_DonHang>[] = useMemo(
    () => [
      {
        key: "maDonHang",
        title: "Mã Đơn Hàng",
        classNameHeader:
          "w-32 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (v) => (
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 inline-block">
            {String(v || "—")}
          </span>
        ),
      },
      {
        key: "khachHang",
        title: "Khách hàng & Nhận hàng",
        classNameHeader:
          "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="flex flex-col gap-0.5 py-1">
            <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              {row.tenKhachHang || row.tenNguoiNhan || "Khách lẻ"}
            </span>
            <span className="text-xs text-muted-foreground">
              SĐT: {row.dienThoaiKhachHang || row.dienThoaiNguoiNhan || "—"}
            </span>
          </div>
        ),
      },
      {
        key: "loaiDonHang",
        title: "Phân loại",
        classNameHeader:
          "w-32 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (_v, row) => (
          <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            {row.tenLoaiDonHang || "Bán lẻ"}
          </span>
        ),
      },
      {
        key: "trangThaiDonHangID",
        title: "Trạng thái đơn",
        classNameHeader:
          "w-36 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (v) => {
          const badge = getOrderStatusBadge(Number(v));
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
        key: "trangThaiThanhToanID",
        title: "Thanh toán",
        classNameHeader:
          "w-36 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (v) => {
          const badge = getPaymentStatusBadge(Number(v));
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
        key: "tongTien",
        title: "Tổng tiền đơn",
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
        title: "Đã trả / Còn nợ",
        classNameHeader:
          "w-40 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right",
        render: (_v, row) => (
          <>
            {row?.trangThaiDonHangID !== 77 ? (
              <div className="flex flex-col gap-0.5 text-xs font-mono">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Đã trả: {formatCurrency(row.daThanhToan)}
                </span>
                <span
                  className={
                    (row.conNo || 0) > 0
                      ? "text-rose-600 dark:text-rose-400 font-bold"
                      : "text-muted-foreground"
                  }
                >
                  Còn nợ: {formatCurrency(row.conNo)}
                </span>
              </div>
            ) : (
              ""
            )}
          </>
        ),
      },
      {
        key: "actions",
        title: "Thao tác",
        classNameHeader:
          "w-44 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (_v, row) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onOpenDetail(row)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer active:scale-95"
              title="Xem chi tiết đơn hàng"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            {row.trangThaiDonHangID !== 76 && row.trangThaiDonHangID !== 77 && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onOpenStatusChange(row)}
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 cursor-pointer active:scale-95"
                title="Chuyển trạng thái đơn hàng"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            )}
            {row.conNo !== 0 && row.trangThaiDonHangID !== 77 && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onOpenPayment(row)}
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer active:scale-95"
                title="Ghi nhận thanh toán"
              >
                <Receipt className="w-3.5 h-3.5" />
              </Button>
            )}

            {row.trangThaiDonHangID !== 76 && row.trangThaiDonHangID !== 77 && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => onHoanThanhVaGiaoXe(row)}
                className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/50 cursor-pointer active:scale-95"
                title="Xác nhận hoàn thành & Bàn giao xe (Trừ kho, xuất BH)"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </Button>
            )}
            {row.trangThaiDonHangID !== 76 &&
              row.trangThaiDonHangID !== 77 &&
              row.daThanhToan == 0 && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onDelete(row)}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer active:scale-95"
                  title="Hủy đơn hàng"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
          </div>
        ),
      },
    ],
    [
      getOrderStatusBadge,
      getPaymentStatusBadge,
      onOpenDetail,
      onOpenStatusChange,
      onOpenPayment,
      onHoanThanhVaGiaoXe,
      onDelete,
    ],
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-12 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <FolderOpen className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Không tìm thấy đơn hàng nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            Chưa có đơn hàng nào khớp với các tiêu chí tìm kiếm hiện tại.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto min-w-0">
        <div className="min-w-[950px] p-3 flex flex-col gap-3 w-full">
          <Table<DH_DonHang>
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
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="đơn hàng"
          />
        </div>
      </div>
    </div>
  );
};
