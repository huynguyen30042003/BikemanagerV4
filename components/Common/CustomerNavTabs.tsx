"use client";

import React from "react";
import Link from "next/link";
import { Award, Bike, History, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetKhachHangNavTabs } from "@/hooks/KhachHang/useKhachHangApi";

interface CustomerNavTabsProps {
  activeTab: "customer" | "statistics" | "vehicles" | "ownerships";
  className?: string;
  totalCustomer?: number;
  totalStatistics?: number;
  totalVehicles?: number;
  totalOwnerships?: number;
  totalKhachHang?: number;
  totalThongKeKhachHang?: number;
  totalPhuongTienKhachHang?: number;
  totalLichSuSoHuuPhuongTien?: number;
}

export function CustomerNavTabs({
  activeTab,
  className,
  totalCustomer,
  totalStatistics,
  totalVehicles,
  totalOwnerships,
  totalKhachHang,
  totalThongKeKhachHang,
  totalPhuongTienKhachHang,
  totalLichSuSoHuuPhuongTien,
}: CustomerNavTabsProps) {
  const { data: navData, isLoading } = useGetKhachHangNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/KhachHangApi/NavTabs
  const countCustomer =
    totalCustomer ?? totalKhachHang ?? navData?.total_KhachHang;
  const countStatistics =
    totalStatistics ?? totalThongKeKhachHang ?? navData?.total_ThongKeKhachHang;
  const countVehicles =
    totalVehicles ?? totalPhuongTienKhachHang ?? navData?.total_PhuongTienKhachHang;
  const countOwnerships =
    totalOwnerships ?? totalLichSuSoHuuPhuongTien ?? navData?.total_LichSuSoHuuPhuongTien;


  const renderBadge = (count?: number, isActive?: boolean) => {
    if (count !== undefined) {
      return (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.2 rounded-full font-mono font-semibold transition-colors",
            isActive
              ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
              : "bg-muted text-muted-foreground group-hover:text-foreground"
          )}
        >
          {count}
        </span>
      );
    }
    if (isLoading) {
      return <span className="w-5 h-3.5 rounded-full bg-muted/60 animate-pulse" />;
    }
    return null;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center p-1 rounded-xl bg-muted/70 border border-border/80 shadow-2xs gap-1 flex-wrap",
        className
      )}
    >
      <Link
        href="/admin/customer"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "customer"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Users className="w-3.5 h-3.5 shrink-0" />
        <span>Hồ sơ khách hàng</span>
        {renderBadge(countCustomer, activeTab === "customer")}
      </Link>

      <Link
        href="/admin/customer/statistics"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "statistics"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Award className="w-3.5 h-3.5 shrink-0" />
        <span>Xếp hạng & Thống kê</span>
        {renderBadge(countStatistics, activeTab === "statistics")}
      </Link>

      <Link
        href="/admin/customer/vehicles"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "vehicles"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <Bike className="w-3.5 h-3.5 shrink-0" />
        <span>Phương tiện của khách</span>
        {renderBadge(countVehicles, activeTab === "vehicles")}
      </Link>

      <Link
        href="/admin/customer/ownerships"
        className={cn(
          "group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
          activeTab === "ownerships"
            ? "bg-background text-foreground font-semibold shadow-xs border border-border/50 text-blue-600 dark:text-blue-400"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        <History className="w-3.5 h-3.5 shrink-0" />
        <span>Lịch sử sở hữu & Sang tên</span>
        {renderBadge(countOwnerships, activeTab === "ownerships")}
      </Link>
    </div>
  );
}
