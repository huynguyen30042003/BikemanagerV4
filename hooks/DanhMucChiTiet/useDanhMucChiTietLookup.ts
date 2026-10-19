"use client";

import { useMemo } from "react";
import { useGetDanhMucChiTiet } from "./useDanhMucChiTietApi";
import { DM_DanhMucChiTiet } from "@/types/danhMucChiTiet";

export interface StatusBadgeInfo {
  label: string;
  color: "emerald" | "blue" | "amber" | "rose" | "purple" | "cyan" | "slate";
  bgClass: string;
  textClass: string;
  borderClass: string;
  className: string;
}

/**
 * Tự động xác định màu sắc hiển thị Badge dựa vào tên trạng thái nghiệp vụ
 */
export function resolveBadgeInfo(name?: string | null): StatusBadgeInfo {
  const safeName = (name || "Chưa xác định").trim();
  const lower = safeName.toLowerCase();

  let color: StatusBadgeInfo["color"] = "slate";
  let bgClass = "bg-slate-500/10 dark:bg-slate-500/20";
  let textClass = "text-slate-700 dark:text-slate-300";
  let borderClass = "border-slate-500/20";

  if (
    lower.includes("hủy") ||
    lower.includes("từ chối") ||
    lower.includes("lỗi") ||
    lower.includes("hỏng") ||
    lower.includes("mất") ||
    lower.includes("thất thoát") ||
    lower.includes("hết hạn")
  ) {
    color = "rose";
    bgClass = "bg-rose-500/10 dark:bg-rose-500/20";
    textClass = "text-rose-700 dark:text-rose-400";
    borderClass = "border-rose-500/20";
  } else if (
    lower.includes("hoàn thành") ||
    lower.includes("đã nhận") ||
    lower.includes("cân bằng") ||
    lower.includes("trong kho") ||
    lower.includes("tồn kho") ||
    lower.includes("hiệu lực") ||
    lower.includes("thanh toán đủ") ||
    lower.includes("đã nhập kho")
  ) {
    color = "emerald";
    bgClass = "bg-emerald-500/10 dark:bg-emerald-500/20";
    textClass = "text-emerald-700 dark:text-emerald-400";
    borderClass = "border-emerald-500/20";
  } else if (
    lower.includes("vận chuyển") ||
    lower.includes("giao hàng") ||
    lower.includes("đã bán") ||
    lower.includes("sửa chữa") ||
    lower.includes("kiểm đếm")
  ) {
    color = "blue";
    bgClass = "bg-blue-500/10 dark:bg-blue-500/20";
    textClass = "text-blue-700 dark:text-blue-400";
    borderClass = "border-blue-500/20";
  } else if (
    lower.includes("chờ") ||
    lower.includes("lưu tạm") ||
    lower.includes("tiếp nhận") ||
    lower.includes("đang tạo") ||
    lower.includes("đang kiểm") ||
    lower.includes("chưa") ||
    lower.includes("đặt cọc")
  ) {
    color = "amber";
    bgClass = "bg-amber-500/10 dark:bg-amber-500/20";
    textClass = "text-amber-700 dark:text-amber-400";
    borderClass = "border-amber-500/20";
  } else if (
    lower.includes("bảo hành") ||
    lower.includes("đổi mới") ||
    lower.includes("gửi hãng") ||
    lower.includes("nâng cấp")
  ) {
    color = "purple";
    bgClass = "bg-purple-500/10 dark:bg-purple-500/20";
    textClass = "text-purple-700 dark:text-purple-400";
    borderClass = "border-purple-500/20";
  }

  return {
    label: safeName,
    color,
    bgClass,
    textClass,
    borderClass,
    className: `${bgClass} ${textClass} ${borderClass}`,
  };
}

/**
 * Hook truy vấn động danh mục chi tiết theo DanhMucID cha
 * Phục vụ toàn bộ các dropdown, status options, badges, labels
 */
export function useDanhMucChiTietLookup(danhMucId: number, options?: { enabled?: boolean }) {
  const isEnabled = options?.enabled ?? (typeof danhMucId === "number" && danhMucId > 0);

  const { data, isLoading, refetch } = useGetDanhMucChiTiet({
    DanhMucID: danhMucId,
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const items: DM_DanhMucChiTiet[] = useMemo(() => {
    return (data?.data ?? data?.items ?? []) as DM_DanhMucChiTiet[];
  }, [data]);

  const selectOptions = useMemo(() => {
    return items.map((item) => ({
      value: item.danhMucChiTietID,
      label: item.ten,
    }));
  }, [items]);

  const mapById = useMemo(() => {
    const map = new Map<number, DM_DanhMucChiTiet>();
    items.forEach((item) => {
      map.set(item.danhMucChiTietID, item);
    });
    return map;
  }, [items]);

  const getLabel = (id?: number | null) => {
    if (id === undefined || id === null) return "Chưa thiết lập";
    const item = mapById.get(Number(id));
    return item ? item.ten : `Mục #${id}`;
  };

  const getBadge = (id?: number | null): StatusBadgeInfo => {
    if (id === undefined || id === null) {
      return {
        label: "Chưa thiết lập",
        color: "slate",
        bgClass: "bg-slate-500/10 dark:bg-slate-500/20",
        textClass: "text-slate-500 dark:text-slate-400",
        borderClass: "border-slate-500/20",
        className: "bg-slate-500/10 text-slate-500 border-slate-500/20",
      };
    }
    const item = mapById.get(Number(id));
    return resolveBadgeInfo(item ? item.ten : `Trạng thái #${id}`);
  };

  return {
    items,
    options: selectOptions,
    mapById,
    getLabel,
    getBadge,
    isLoading,
    refetch,
  };
}
