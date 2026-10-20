"use client";

import React, { useMemo } from "react";
import {
  Building2,
  User,
  Trash2,
  CheckCircle2,
  ArrowRightLeft,
  DollarSign,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { HopDongTraGop } from "@/types/traGop";
import {
  TRANG_THAI_GIAI_NGAN,
  getTrangThaiHopDongBadge,
} from "@/hooks/TraGop/useTraGop";
import { formatCurrency } from "./InstallmentContractsKpiGrid";

export interface InstallmentContractsTableProps {
  items: HopDongTraGop[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onApprove: (contract: HopDongTraGop) => void;
  onDisburse: (contract: HopDongTraGop) => void;
  onDelete: (contract: HopDongTraGop) => void;
  onOpenAdd: () => void;
}

export const InstallmentContractsTable: React.FC<
  InstallmentContractsTableProps
> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onApprove,
  onDisburse,
  onDelete,
  onOpenAdd,
}) => {
  // Cấu hình các cột bảng hợp đồng trả góp
  const columns: Column<HopDongTraGop>[] = useMemo(
    () => [
      {
        key: "soHopDong",
        title: "Hồ Sơ & Hợp Đồng",
        classNameHeader:
          "w-44 text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="py-1 space-y-0.5">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 block w-fit">
              {row.soHopDong || "—"}
            </span>
            {row.maHoSoOnline && (
              <span className="text-[10px] text-muted-foreground font-mono block">
                Mã online: {row.maHoSoOnline}
              </span>
            )}
          </div>
        ),
      },
      {
        key: "donViTraGopTen",
        title: "Đối Tác Cho Vay",
        classNameHeader:
          "min-w-[150px] text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="flex items-center gap-1.5 py-1">
            <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="font-semibold text-foreground text-xs line-clamp-1">
              {row.donViTraGopTen || "Công ty tài chính"}
            </span>
          </div>
        ),
      },
      {
        key: "khachHangTen",
        title: "Khách Hàng Mua Xe",
        classNameHeader:
          "min-w-[160px] text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="text-xs space-y-0.5">
            <div className="font-medium text-foreground flex items-center gap-1">
              <User className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="truncate">{row.khachHangTen || "Khách lẻ"}</span>
            </div>
            {row.khachHangDienThoai && (
              <div className="text-[11px] text-muted-foreground font-mono">
                {row.khachHangDienThoai}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "soTienVay",
        title: "Khoản Vay & Trả Trước",
        classNameHeader:
          "w-40 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right",
        render: (_v, row) => (
          <div className="text-xs space-y-0.5">
            <div className="font-mono font-bold text-foreground">
              Vay: {formatCurrency(Number(row.soTienVay))}
            </div>
            <div className="font-mono text-[11px] text-muted-foreground">
              Trả trước: {formatCurrency(Number(row.tienTraTruoc))}
            </div>
          </div>
        ),
      },
      {
        key: "soThangTraGop",
        title: "Kỳ Hạn & Góp Tháng",
        classNameHeader:
          "w-36 text-right text-xs font-semibold text-muted-foreground",
        classNameItem: "text-right",
        render: (_v, row) => (
          <div className="text-xs space-y-0.5">
            <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(Number(row.soTienTraHangThang))}/th
            </div>
            <div className="text-[11px] text-muted-foreground">
              {row.soThangTraGop} tháng · Lãi {row.laiSuat}%
            </div>
          </div>
        ),
      },
      {
        key: "trangThaiHopDongID",
        title: "Tiến Độ Thẩm Định",
        classNameHeader:
          "w-36 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (_v, row) => {
          const badge = getTrangThaiHopDongBadge(
            row.trangThaiHopDongID,
            row.trangThaiHopDong
          );
          let colorClasses =
            "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
          if (badge.color === "emerald") {
            colorClasses =
              "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20";
          } else if (badge.color === "rose") {
            colorClasses =
              "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20";
          } else if (badge.color === "blue" || badge.color === "indigo") {
            colorClasses =
              "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
          }

          return (
            <button
              type="button"
              onClick={() => onApprove(row)}
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer hover:opacity-85 transition active:scale-95 ${colorClasses}`}
              title="Bấm để cập nhật trạng thái thẩm định"
            >
              <span>{badge.label}</span>
              <ArrowRightLeft className="w-2.5 h-2.5 opacity-60" />
            </button>
          );
        },
      },
      {
        key: "trangThaiGiaiNganID",
        title: "Giải Ngân Về Shop",
        classNameHeader:
          "w-36 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (_v, row) => {
          const isDisbursed =
            row.trangThaiGiaiNganID === TRANG_THAI_GIAI_NGAN.DA_GIAI_NGAN;
          if (isDisbursed) {
            return (
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Đã giải ngân
                </span>
                {row.soTienGiaiNganThucTe && (
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {formatCurrency(Number(row.soTienGiaiNganThucTe))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Button
              variant="outline"
              size="xs"
              onClick={() => onDisburse(row)}
              className="text-[11px] h-6 px-2 text-blue-600 border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer font-medium active:scale-95"
              title="Bấm để xác nhận tiền giải ngân chuyển về showroom"
            >
              <DollarSign className="w-3 h-3 mr-0.5" />
              Nhận giải ngân
            </Button>
          );
        },
      },
      {
        key: "actions",
        title: "Thao tác",
        classNameHeader:
          "w-16 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (_v, row) => (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(row)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer active:scale-95"
            title="Hủy hồ sơ"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        ),
      },
    ],
    [onApprove, onDisburse, onDelete]
  );

  // Trường hợp không có dữ liệu
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-12 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground mb-3">
            <FolderOpen className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Chưa có hợp đồng trả góp nào
          </h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Không tìm thấy hồ sơ nào phù hợp với bộ lọc hiện tại hoặc hệ thống
            chưa ghi nhận khoản vay trả góp mua xe.
          </p>
          <Button
            size="sm"
            onClick={onOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Lập hồ sơ mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto min-w-0">
        <div className="min-w-[850px] p-3 flex flex-col gap-3 w-full">
          <Table<HopDongTraGop>
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
            itemName="hợp đồng"
          />
        </div>
      </div>
    </div>
  );
};
