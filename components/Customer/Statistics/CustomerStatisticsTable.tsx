"use client";

import React from "react";
import {
  Award,
  Crown,
  Sparkles,
  ShoppingBag,
  Wrench,
  SquarePen,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KH_ThongKeKhachHang } from "@/types/thongKeKhachHang";

interface CustomerStatisticsTableProps {
  items: KH_ThongKeKhachHang[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: KH_ThongKeKhachHang) => void;
}

function formatCurrency(val: number | null | undefined): string {
  if (val == null) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(val);
}

function formatDate(val?: string | null): string {
  if (!val) return "Chưa có";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("vi-VN");
  } catch {
    return val;
  }
}

export const CustomerStatisticsTable: React.FC<CustomerStatisticsTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
}) => {
  const renderTierBadge = (tier: string) => {
    switch (tier) {
      case "KimCuong":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            Kim Cương
          </span>
        );
      case "Vang":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 shadow-2xs">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Hạng Vàng
          </span>
        );
      case "Bac":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            Hạng Bạc
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border/60">
            Chuẩn
          </span>
        );
    }
  };

  const columns: Column<KH_ThongKeKhachHang>[] = [
    {
      key: "khachHangID",
      title: "Khách hàng",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5 py-1">
          <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
            {row.tenKhachHang || "Hồ sơ #" + row.khachHangID.substring(0, 8)}
          </span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
            {row.maKhachHang && (
              <span className="px-1.5 py-0.2 rounded bg-muted border border-border/50 text-[10px]">
                {row.maKhachHang}
              </span>
            )}
            {row.dienThoai && <span>{row.dienThoai}</span>}
          </div>
        </div>
      ),
    },
    {
      key: "hangKhachHang",
      title: "Hạng thẻ",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex justify-center">{renderTierBadge(String(v))}</div>
      ),
    },
    {
      key: "diemTichLuy",
      title: "Điểm & Chiết khấu",
      classNameHeader:
        "w-32 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {row.diemTichLuy ?? 0} pts
          </span>
          {row.tyLeGiamGia > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/20">
              Giảm {row.tyLeGiamGia}%
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tongSoDonHang",
      title: "Đơn / Sửa chữa",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex items-center justify-center gap-2 text-xs">
          <span
            className="inline-flex items-center gap-1 font-mono font-medium text-foreground"
            title="Tổng số đơn mua hàng"
          >
            <ShoppingBag className="w-3 h-3 text-blue-500" />
            {row.tongSoDonHang ?? 0}
          </span>
          <span className="text-muted-foreground/30">/</span>
          <span
            className="inline-flex items-center gap-1 font-mono font-medium text-muted-foreground"
            title="Tổng lượt sửa chữa & bảo dưỡng"
          >
            <Wrench className="w-3 h-3 text-amber-500" />
            {row.tongSoLanSuaChua ?? 0}
          </span>
        </div>
      ),
    },
    {
      key: "tongTienDaChi",
      title: "Tổng chi tiêu",
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
      key: "congNoHienTai",
      title: "Công nợ hiện tại",
      classNameHeader:
        "w-36 text-right text-xs font-semibold text-muted-foreground",
      classNameItem: "text-right",
      render: (v) => {
        const debt = Number(v) || 0;
        return debt > 0 ? (
          <span className="font-mono text-xs font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
            {formatCurrency(debt)}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/80 font-mono">
            0 đ
          </span>
        );
      },
    },
    {
      key: "lanMuaHangGanNhat",
      title: "Giao dịch cuối",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col text-[11px] text-muted-foreground">
          <span title="Lần mua gần nhất">
            Mua: {formatDate(row.lanMuaHangGanNhat)}
          </span>
          <span title="Lần sửa gần nhất" className="text-[10px]">
            Sửa: {formatDate(row.lanSuaChuaGanNhat)}
          </span>
        </div>
      ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-20 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onEdit(row)}
          title="Điều chỉnh hạng thẻ & công nợ"
          className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
        >
          <SquarePen className="w-4 h-4" />
        </Button>
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
          Không có dữ liệu thống kê
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          Chưa có thông số tích lũy phù hợp với bộ lọc tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="min-w-[800px] p-3 flex flex-col gap-3 w-full">
          <Table<KH_ThongKeKhachHang>
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
            itemName="hồ sơ"
          />
        </div>
      </div>
    </div>
  );
};
