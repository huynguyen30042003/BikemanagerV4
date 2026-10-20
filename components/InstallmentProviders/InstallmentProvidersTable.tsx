"use client";

import React, { useMemo } from "react";
import {
  Phone,
  Mail,
  MapPin,
  User,
  SquarePen,
  Trash2,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { DonViTraGop } from "@/types/traGop";

export interface InstallmentProvidersTableProps {
  items: DonViTraGop[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DonViTraGop) => void;
  onDelete: (item: DonViTraGop) => void;
  onOpenAdd: () => void;
}

export const InstallmentProvidersTable: React.FC<
  InstallmentProvidersTableProps
> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  onOpenAdd,
}) => {
  const columns: Column<DonViTraGop>[] = useMemo(
    () => [
      {
        key: "maDonVi",
        title: "Mã Đơn Vị",
        classNameHeader:
          "w-32 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (v, row) => (
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20 inline-block">
            {String(v || row.maDonVi || "—")}
          </span>
        ),
      },
      {
        key: "tenDonVi",
        title: "Tên Đơn Vị Trả Góp",
        classNameHeader:
          "min-w-[220px] text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => {
          const name = row.tenDonVi || row.ten || "—";
          return (
            <div className="flex items-center gap-2.5 py-1">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span
                  className="font-semibold text-foreground text-sm block truncate"
                  title={name}
                >
                  {name}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-blue-500 shrink-0" />{" "}
                  {row.dienThoai || "—"}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "tenNguoiLienHe",
        title: "Nhân Sự Phụ Trách",
        classNameHeader:
          "min-w-[180px] text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="text-xs space-y-0.5">
            <div className="font-medium text-foreground flex items-center gap-1">
              <User className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="truncate">
                {row.tenNguoiLienHe || "Chưa phân công"}
              </span>
            </div>
            {row.sdtNguoiLienHe && (
              <div className="text-[11px] text-muted-foreground font-mono">
                {row.sdtNguoiLienHe}
              </div>
            )}
          </div>
        ),
      },
      {
        key: "email",
        title: "Email & Địa Chỉ",
        classNameHeader:
          "min-w-[200px] text-left text-xs font-semibold text-muted-foreground",
        classNameItem: "text-left",
        render: (_v, row) => (
          <div className="text-xs space-y-0.5 max-w-xs">
            {row.email && (
              <div
                className="flex items-center gap-1 text-muted-foreground truncate"
                title={row.email}
              >
                <Mail className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate">{row.email}</span>
              </div>
            )}
            {row.diaChi && (
              <div
                className="flex items-center gap-1 text-[11px] text-muted-foreground/80 truncate"
                title={row.diaChi}
              >
                <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                <span className="truncate">{row.diaChi}</span>
              </div>
            )}
            {!row.email && !row.diaChi && (
              <span className="text-muted-foreground">—</span>
            )}
          </div>
        ),
      },
      {
        key: "dangHoatDong",
        title: "Trạng Thái",
        classNameHeader:
          "w-32 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (v) =>
          v ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Đang hợp tác
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Tạm dừng
            </span>
          ),
      },
      {
        key: "actions",
        title: "Thao tác",
        classNameHeader:
          "w-24 text-center text-xs font-semibold text-muted-foreground",
        classNameItem: "text-center",
        render: (_v, row) => (
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(row)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 cursor-pointer active:scale-95"
              title="Chỉnh sửa thông tin đối tác"
            >
              <SquarePen className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(row)}
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer active:scale-95"
              title="Xóa đối tác"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card shadow-xs p-12 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground mb-3">
            <FolderOpen className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Chưa có đối tác trả góp nào
          </h3>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Không tìm thấy đơn vị đối tác nào phù hợp với bộ lọc hiện tại hoặc hệ thống chưa liên kết ngân hàng tài chính.
          </p>
          <Button
            size="sm"
            onClick={onOpenAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-medium shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Thêm đối tác mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto min-w-0">
        <div className="min-w-[850px] p-3 flex flex-col gap-3 w-full">
          <Table<DonViTraGop>
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
            itemName="đối tác"
          />
        </div>
      </div>
    </div>
  );
};
