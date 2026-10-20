"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Store,
  SquarePen,
  Trash2,
  Building2,
  MapPin,
  Compass,
  Navigation,
  ExternalLink,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Column, Table } from "@/components/ui/Table";
import { Pagination } from "@/components/Common/Pagination";
import { DM_DiaDiem } from "@/types/diaDiem";
import { getImageUrl } from "@/shared/constants/apiConstants";

interface DiaDiemTableProps {
  items: DM_DiaDiem[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (item: DM_DiaDiem) => void;
  onDelete: (item: DM_DiaDiem) => void;
  provinceMap: Map<number, string>;
  getLoaiBadge: (loaiId?: number | null) => React.ReactNode;
}

export const DiaDiemTable: React.FC<DiaDiemTableProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  provinceMap,
  getLoaiBadge,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Đã sao chép mã cơ sở!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns: Column<DM_DiaDiem>[] = [
    {
      key: "anhDaiDien",
      title: "Ảnh",
      classNameHeader:
        "w-16 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => {
        const imgUrl = getImageUrl(row.anhDaiDien);
        return (
          <div className="flex justify-center">
            {imgUrl ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border/60 relative bg-muted/40 shrink-0 shadow-2xs">
                <Image
                  unoptimized
                  src={imgUrl}
                  alt={row.tenDiaDiem}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg border border-border/60 bg-muted/50 flex items-center justify-center text-muted-foreground shrink-0 shadow-2xs">
                <Store className="w-4 h-4 text-muted-foreground/70" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "diaDiemID",
      title: "Mã",
      classNameHeader:
        "w-24 text-center text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) => (
        <button
          type="button"
          onClick={(e) => handleCopyId(String(v), e)}
          title="Nhấn để sao chép mã"
          className="group inline-flex items-center gap-1 font-mono text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted/60 hover:bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <span>#{String(v).substring(0, 6)}</span>
          {copiedId === String(v) ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <Copy className="w-3 h-3 opacity-0 group-hover:opacity-70 transition-opacity" />
          )}
        </button>
      ),
    },
    {
      key: "tenDiaDiem",
      title: "Tên cơ sở / Showroom",
      classNameHeader: "text-left text-xs font-semibold text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-1 py-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
              {row.tenDiaDiem}
            </span>
            {getLoaiBadge(row.loaiDiaDiemID)}
          </div>
          {row.diaDiemCapChaID && (
            <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Layers className="w-3 h-3 text-muted-foreground/70" />
              <span>Trực thuộc: {row.tenDiaDiemCha || "Cơ sở cấp trên"}</span>
            </div>
          )}
          {row.moTa && (
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-md">
              {row.moTa}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "tinhID",
      title: "Khu vực",
      classNameHeader:
        "w-52 text-left text-xs font-semibold text-muted-foreground",
      render: (tinhId, row) => {
        const tName =
          row.tenTinh ||
          provinceMap.get(Number(tinhId)) ||
          (tinhId ? `Tỉnh #${tinhId}` : "Chưa chọn tỉnh");
        return (
          <div className="flex flex-col gap-1 py-0.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium border border-blue-500/20 max-w-[190px] truncate shadow-2xs">
              <Building2 className="w-3 h-3 shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="truncate">{tName}</span>
            </div>
            {row.tenXa && (
              <div className="inline-flex items-center gap-1 text-[11px] text-muted-foreground pl-0.5">
                <Compass className="w-3 h-3 text-indigo-500/80" />
                <span className="truncate">{row.tenXa}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "diaChiSo",
      title: "Địa chỉ cụ thể & Bản đồ",
      classNameHeader:
        "text-left text-xs font-semibold text-muted-foreground max-w-xs",
      render: (v, row) => (
        <div className="flex flex-col gap-1 text-xs text-foreground max-w-xs">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span className="line-clamp-2">{v || "Chưa cập nhật địa chỉ"}</span>
          </div>
          {row.kinhDo != null && row.viDo != null && (
            <a
              href={`https://www.google.com/maps?q=${row.viDo},${row.kinhDo}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline pl-5"
              title="Mở Google Maps"
            >
              <Navigation className="w-3 h-3" />
              <span>
                {row.viDo.toFixed(4)}, {row.kinhDo.toFixed(4)}
              </span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader:
        "text-center w-32 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (v) =>
        v ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Hoạt động
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Tạm đóng
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader:
        "text-center w-28 text-xs font-semibold text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit(row)}
            title="Chỉnh sửa cơ sở"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(row)}
            title="Xóa cơ sở"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="min-w-[760px] p-3 flex flex-col gap-3 w-full">
          <Table<DM_DiaDiem>
            data={items}
            columns={columns}
            showIndex
            startIndex={(page - 1) * pageSize}
          />

          {/* Table Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            itemName="cơ sở"
          />
        </div>
      </div>
    </div>
  );
};
