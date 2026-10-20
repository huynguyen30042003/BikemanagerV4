"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Bike,
  Award,
  SquarePen,
  Trash2,
  Copy,
  Check,
  Briefcase,
  CreditCard,
  ArrowRight,
  FolderOpen,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/Common/Pagination";
import { KH_KhachHang } from "@/types/khachHang";
import { getImageUrl } from "@/shared/constants/apiConstants";
import { toast } from "sonner";

export interface CustomerGridProps {
  items: KH_KhachHang[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  setPageSize: (size: number | ((prev: number) => number)) => void;
  onEdit: (customer: KH_KhachHang) => void;
  onDelete: (customer: KH_KhachHang) => void;
  onOpenCreate: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const CustomerGrid: React.FC<CustomerGridProps> = ({
  items,
  totalCount,
  totalPages,
  page,
  pageSize,
  setPage,
  setPageSize,
  onEdit,
  onDelete,
  onOpenCreate,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success(`Đã sao chép mã khách hàng: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
          <FolderOpen className="w-7 h-7 stroke-[1.5]" />
        </div>
        <p className="font-semibold text-base text-foreground">
          Không tìm thấy khách hàng nào
        </p>
        <p className="text-xs text-muted-foreground max-w-sm mt-1">
          {hasActiveFilters
            ? "Không có kết quả khớp với điều kiện lọc. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
            : "Chưa có hồ sơ khách hàng trong hệ thống. Hãy thêm mới khách hàng ngay!"}
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
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" /> Thêm khách hàng mới
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {items.map((cust: KH_KhachHang) => (
          <Card
            key={cust.khachHangID}
            className="group rounded-xl border border-border/80 bg-card p-4 pb-2 shadow-2xs hover:shadow-md hover:border-border transition-all flex flex-col justify-between gap-3 relative"
          >
            <div className="space-y-3">
              {/* Top Bar: Avatar/Logo + Customer Type + Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/20 font-bold overflow-hidden shadow-2xs">
                    {(cust.anhChanDung || cust.anhBieuTrung) &&
                    getImageUrl(cust.anhChanDung || cust.anhBieuTrung) ? (
                      <Image
                        src={getImageUrl(
                          cust.anhChanDung || cust.anhBieuTrung
                        )}
                        alt={cust.tenKhachHang}
                        width={44}
                        height={44}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    ) : cust.loaiKhachHang === 2 ? (
                      <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span
                      className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-semibold border truncate ${
                        cust.loaiKhachHang === 2
                          ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/25"
                          : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25"
                      }`}
                    >
                      {cust.loaiKhachHang === 2 ? "Doanh nghiệp" : "Cá nhân"}
                    </span>
                  </div>
                </div>

                {cust.trangThai ? (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-2xs shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    Khóa
                  </span>
                )}
              </div>

              {/* Customer Name & Code */}
              <div>
                <h3
                  onClick={() => onEdit(cust)}
                  className="text-sm sm:text-base font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
                  title={cust.tenKhachHang}
                >
                  {cust.tenKhachHang}
                </h3>

                {/* Mã KH click-to-copy */}
                <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={(e) =>
                      handleCopyCode(cust.maKhachHang || "", e)
                    }
                    title="Sao chép mã khách hàng"
                    className="group/code inline-flex items-center gap-1 font-mono text-[11px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md bg-muted/70 hover:bg-muted text-foreground border border-border/60 transition-colors cursor-pointer shadow-2xs"
                  >
                    <span className="text-muted-foreground text-[10px]">
                      Mã:
                    </span>
                    <span className="font-semibold">
                      {cust.maKhachHang || "KH—"}
                    </span>
                    {copiedId === cust.maKhachHang ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 opacity-40 group-hover/code:opacity-100 transition-opacity" />
                    )}
                  </button>

                  {/* CCCD or MST Chip */}
                  {(cust.maDinhDanh || cust.maSoThue) && (
                    <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md text-[10.5px] sm:text-[11px] font-mono bg-muted/40 text-muted-foreground border border-border/40 truncate max-w-[150px] sm:max-w-none">
                      {cust.loaiKhachHang === 2 ? (
                        <>
                          <Briefcase className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span className="truncate">{cust.maSoThue}</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3 h-3 text-blue-500 shrink-0" />
                          <span className="truncate">{cust.maDinhDanh}</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 pt-1 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <a
                    href={`tel:${cust.dienThoai}`}
                    className="font-mono text-foreground hover:text-blue-600 transition-colors truncate"
                  >
                    {cust.dienThoai}
                  </a>
                </div>
                {cust.hopThu && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <a
                      href={`mailto:${cust.hopThu}`}
                      className="hover:text-blue-600 transition-colors truncate"
                    >
                      {cust.hopThu}
                    </a>
                  </div>
                )}
                {cust.diaChi && (
                  <div className="flex items-start gap-2 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{cust.diaChi}</span>
                  </div>
                )}
              </div>

              {/* Hub Links: Xe sở hữu & Thống kê */}
              <div className="pt-2 border-t border-border/50 grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                <Link
                  href={`/admin/customer/vehicles?khachHangId=${cust.khachHangID}`}
                  className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-muted/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-border/50 hover:border-blue-500/30 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer group/link"
                  title="Xem danh sách xe của khách"
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                    <Bike className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span className="font-medium text-[10.5px] sm:text-[11px] truncate">
                      Xe sở hữu
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all shrink-0" />
                </Link>

                <Link
                  href={`/admin/customer/statistics`}
                  className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-muted/40 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-border/50 hover:border-amber-500/30 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 transition-all cursor-pointer group/link"
                  title="Xem xếp hạng & công nợ"
                >
                  <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-[10.5px] sm:text-[11px] truncate">
                      Xếp hạng
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all shrink-0" />
                </Link>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(cust)}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
              >
                <SquarePen className="w-3.5 h-3.5" />
                <span>Sửa</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(cust)}
                className="h-8 px-2.5 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer active:scale-95 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa</span>
              </Button>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Centralized Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        setPage={setPage}
        setPageSize={setPageSize}
        itemName="khách hàng"
      />
    </div>
  );
};
