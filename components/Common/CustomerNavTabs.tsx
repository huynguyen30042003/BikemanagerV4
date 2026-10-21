"use client";

import React from "react";
import { Award, Bike, History, Users } from "lucide-react";
import { useGetKhachHangNavTabs } from "@/hooks/KhachHang/useKhachHangApi";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type CustomerTabKey = "customer" | "statistics" | "vehicles" | "ownerships";

interface CustomerNavTabsProps {
  activeTab: CustomerTabKey;
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

  const navTabs: NavTabItem<CustomerTabKey>[] = React.useMemo(
    () => [
      {
        key: "customer",
        label: "Hồ sơ khách hàng",
        href: "/admin/customer",
        icon: Users,
        count: countCustomer,
      },
      {
        key: "statistics",
        label: "Xếp hạng & Thống kê",
        href: "/admin/customer/statistics",
        icon: Award,
        count: countStatistics,
      },
      {
        key: "vehicles",
        label: "Phương tiện của khách",
        href: "/admin/customer/vehicles",
        icon: Bike,
        count: countVehicles,
      },
      {
        key: "ownerships",
        label: "Lịch sử sở hữu & Sang tên",
        href: "/admin/customer/ownerships",
        icon: History,
        count: countOwnerships,
      },
    ],
    [countCustomer, countStatistics, countVehicles, countOwnerships],
  );

  return (
    <BaseNavTabs
      items={navTabs}
      activeTab={activeTab}
      isLoading={isLoading}
      className={className}
    />
  );
}
