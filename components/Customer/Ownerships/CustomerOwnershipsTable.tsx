"use client";

import React from "react";
import {
  Bike,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { KH_LichSuSoHuuPhuongTien } from "@/types/lichSuSoHuuPhuongTien";

interface CustomerOwnershipsTableProps {
  items: KH_LichSuSoHuuPhuongTien[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onTransfer: (vehicleId: string) => void;
  onOpenTransfer: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

function formatDate(val?: string | null): string {
  if (!val) return "Hiện tại";
  try {
    const d = new Date(val);
    return d.toLocaleDateString("vi-VN");
  } catch {
    return val;
  }
}

export const CustomerOwnershipsTable: React.FC<CustomerOwnershipsTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onTransfer,
  onOpenTransfer,
  onResetFilters,
  hasActiveFilters,
}) => {
  const renderLyDoBadge = (lyDo?: string | null) => {
    switch (lyDo) {
      case "MuaMoi":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
            Mua mới
          </span>
        );
      case "SangTen":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
            Sang tên đổi chủ
          </span>
        );
      case "ThuCuDoiMoi":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            Thu cũ đổi mới
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border/60">
            {lyDo || "Khác"}
          </span>
        );
    }
  };

  const columns: Column<KH_LichSuSoHuuPhuongTien>[] = [
    {
      key: "phuongTienKhachHangID",
      title: "Phương tiện xe",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/20">
            <Bike className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">
              {row.tenModel ||
                "Phương tiện #" + row.phuongTienKhachHangID.substring(0, 8)}
            </span>
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
              {row.bienSo || "Chưa có biển số"}
            </span>
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
          <span className="font-semibold text-foreground">
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
      key: "ngayBatDauSoHuu",
      title: "Thời gian sở hữu",
      classNameHeader:
        "w-48 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex flex-col items-center text-xs">
          <span className="font-mono text-foreground font-medium">
            {formatDate(row.ngayBatDauSoHuu)} →{" "}
            {formatDate(row.ngayKetThucSoHuu)}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            {row.laChuSoHuuHienTai ? "Đang sở hữu" : "Đã sang tên"}
          </span>
        </div>
      ),
    },
    {
      key: "lyDo",
      title: "Lý do ghi nhận",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <div className="flex justify-center">{renderLyDoBadge(String(v))}</div>
      ),
    },
    {
      key: "laChuSoHuuHienTai",
      title: "Trạng thái",
      classNameHeader:
        "w-36 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Chủ hiện tại
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <Clock className="w-3 h-3 text-slate-400" />
              Đã chuyển nhượng
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "w-28 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex justify-center">
          {row.laChuSoHuuHienTai ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTransfer(row.phuongTienKhachHangID)}
              title="Sang tên đổi chủ xe này"
              className="h-8 px-2.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg cursor-pointer flex items-center gap-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Sang tên</span>
            </Button>
          ) : (
            <span className="text-[11px] text-muted-foreground/60">—</span>
          )}
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
          Chưa có bản ghi lịch sử sở hữu nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {hasActiveFilters
            ? "Không tìm thấy dữ liệu nào khớp với bộ lọc tìm kiếm. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
            : "Chưa có lượt sở hữu hoặc sang tên xe nào được ghi nhận."}
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
            onClick={onOpenTransfer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-medium"
          >
            <ArrowRightLeft className="w-4 h-4 mr-1" /> Chuyển quyền / Sang tên
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="min-w-[850px] p-3 flex flex-col gap-3 w-full">
          <Table<KH_LichSuSoHuuPhuongTien>
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
            itemName="lượt sở hữu"
          />
        </div>
      </div>
    </div>
  );
};
