"use client";

import React, { useState } from "react";
import {
  Wrench,
  Plus,
  Eye,
  ArrowRight,
  Receipt,
  Trash2,
  Bike,
  User,
  Copy,
  Check,
  FolderOpen,
  SquarePen,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { SC_PhieuSuaChua } from "@/types/suaChua";

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

interface RepairTicketsTableProps {
  items: SC_PhieuSuaChua[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  getRepairStatusBadge: (id?: number | null) => {
    label: string;
    className: string;
  };
  getPaymentStatusBadge: (id?: number | null) => {
    label: string;
    className: string;
  };
  onDetail: (item: SC_PhieuSuaChua) => void;
  onEdit?: (item: SC_PhieuSuaChua) => void;
  onStatusChange: (item: SC_PhieuSuaChua) => void;
  onDeliverVehicle?: (item: SC_PhieuSuaChua) => void;
  onPayment: (item: SC_PhieuSuaChua) => void;
  onDelete: (item: SC_PhieuSuaChua) => void;
  onOpenCreate: () => void;
}

export function RepairTicketsTable({
  items,
  page,
  pageSize,
  totalCount,
  totalPages,
  setPage,
  setPageSize,
  getRepairStatusBadge,
  getPaymentStatusBadge,
  onDetail,
  onEdit,
  onStatusChange,
  onDeliverVehicle,
  onPayment,
  onDelete,
  onOpenCreate,
}: RepairTicketsTableProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 1500);
  };

  const columns: Column<SC_PhieuSuaChua>[] = [
    {
      key: "maPhieuSuaChua",
      title: "Mã Phiếu",
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
            title="Nhấn để sao chép mã phiếu"
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
      key: "khachHang",
      title: "Khách hàng & Xe vào xưởng",
      classNameHeader:
        "w-50 text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-xs flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            {row.tenKhachHang || "Khách vãng lai"}
          </span>
          <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
            <Bike className="w-3 h-3 shrink-0" />
            {row.tenModelXe || "Xe ngoài"}{" "}
            {row.bienSoXe ? `[${row.bienSoXe}]` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "loaiDichVuID",
      title: "Phân loại",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <span className="inline-flex text-xs font-medium px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
          {row.tenLoaiDichVu || "Sửa chữa"}
        </span>
      ),
    },
    {
      key: "trangThaiID",
      title: "Tiến độ sửa",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => {
        const badge = getRepairStatusBadge(Number(v));
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
      title: "Tổng chi phí",
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
      title: "Đã thu / Còn nợ",
      classNameHeader:
        "w-40 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 text-xs font-mono">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Thu: {formatCurrency(row.daThanhToan)}
          </span>
          <span
            className={
              (row.conNo || 0) > 0
                ? "text-rose-600 dark:text-rose-400 font-bold"
                : "text-muted-foreground"
            }
          >
            Nợ: {formatCurrency(row.conNo)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      title: "Thao tác",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const isCompleted = row.trangThaiID === 112;
        const isCancelled = row.trangThaiID === 113;
        const isLocked = isCompleted || isCancelled;
        const isReadyToDeliver = row.trangThaiID === 111;
        const isFullyPaid = (row.conNo || 0) <= 0;

        return (
          <div className="flex items-center justify-center gap-1">
            {/* 1. Chi tiết */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDetail(row)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer"
              title="Xem chi tiết phiếu & phụ tùng SC"
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>

            {/* 2. Chỉnh sửa (Khóa khi 112 hoặc 113) */}
            {onEdit && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => !isLocked && onEdit(row)}
                disabled={isLocked}
                className={`text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 ${
                  isLocked
                    ? "opacity-30 cursor-not-allowed pointer-events-none"
                    : "cursor-pointer"
                }`}
                title={
                  isCompleted
                    ? "Phiếu đã bàn giao xe và trừ kho (Đã khóa)"
                    : isCancelled
                    ? "Phiếu đã hủy (Đã khóa)"
                    : "Chỉnh sửa phiếu sửa chữa"
                }
              >
                <SquarePen className="w-3.5 h-3.5" />
              </Button>
            )}

            {/* 3. Tiến độ sửa chữa (107 -> 108 -> 109 -> 110 -> 111 -> 113) */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => !isLocked && onStatusChange(row)}
              disabled={isLocked}
              className={`text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 ${
                isLocked
                  ? "opacity-30 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              title={
                isLocked
                  ? "Phiếu đã kết thúc quy trình sửa chữa"
                  : "Đổi tiến độ sửa chữa"
              }
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>

            {/* 4. Hoàn thành & Bàn giao xe (Trigger xuất kho trừ phụ tùng thực tế) */}
            {onDeliverVehicle && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => !isLocked && onDeliverVehicle(row)}
                disabled={isLocked}
                className={`text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 ${
                  isReadyToDeliver
                    ? "ring-1 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 font-bold"
                    : ""
                } ${
                  isLocked
                    ? "opacity-30 cursor-not-allowed pointer-events-none"
                    : "cursor-pointer"
                }`}
                title={
                  isCompleted
                    ? "Xe đã được bàn giao và trừ tồn kho phụ tùng"
                    : isCancelled
                    ? "Phiếu đã hủy"
                    : isReadyToDeliver
                    ? "Xe đã sẵn sàng! Bấm để bàn giao và trừ tồn kho"
                    : "Bàn giao xe & Trừ tồn kho phụ tùng"
                }
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </Button>
            )}

            {/* 5. Thu tiền */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => !isCancelled && !isFullyPaid && onPayment(row)}
              disabled={isCancelled || isFullyPaid}
              className={`text-teal-600 hover:text-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/50 ${
                isCancelled || isFullyPaid
                  ? "opacity-30 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              title={
                isCancelled
                  ? "Phiếu đã hủy"
                  : isFullyPaid
                  ? "Phiếu đã thanh toán đủ 100%"
                  : "Thu tiền dịch vụ sửa chữa"
              }
            >
              <Receipt className="w-3.5 h-3.5" />
            </Button>

            {/* 6. Hủy phiếu (Khóa khi 112 hoặc 113) */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => !isLocked && onDelete(row)}
              disabled={isLocked}
              className={`text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 ${
                isLocked
                  ? "opacity-30 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
              }`}
              title={
                isCompleted
                  ? "Không thể hủy phiếu đã hoàn thành"
                  : isCancelled
                  ? "Phiếu đã hủy"
                  : "Hủy phiếu sửa chữa"
              }
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-8 sm:p-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4 text-muted-foreground">
          <FolderOpen className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="font-semibold text-base text-foreground mb-1">
          Chưa có xe nào đang sửa chữa
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-4">
          Hiện tại không tìm thấy phiếu sửa chữa nào theo bộ lọc tìm kiếm. Bạn
          có thể tiếp nhận xe mới hoặc làm mới bộ lọc.
        </p>
        <Button
          size="sm"
          onClick={onOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer text-xs h-9 px-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Tiếp nhận xe mới
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <Table<SC_PhieuSuaChua>
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
          itemName="phiếu sửa chữa"
        />
      </div>
    </div>
  );
}
