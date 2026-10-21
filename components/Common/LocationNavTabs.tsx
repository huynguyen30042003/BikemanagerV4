"use client";

import React from "react";
import { Building2, Compass, Globe, Store } from "lucide-react";
import { useGetDiaDiemNavTabs } from "@/hooks/DiaDiem/useDiaDiemApi";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type LocationTabKey = "quocGia" | "tinh" | "xa" | "diaDiem";

interface LocationNavTabsProps {
  activeTab: LocationTabKey;
  className?: string;
  total_QuocGia?: number;
  total_DiaPhuongCapTinh?: number;
  total_DiaPhuongCapXa?: number;
  total_DiaDiem?: number;
}

export function LocationNavTabs({
  activeTab,
  className,
  total_QuocGia,
  total_DiaPhuongCapTinh,
  total_DiaPhuongCapXa,
  total_DiaDiem,
}: LocationNavTabsProps) {
  const { data: navData, isLoading } = useGetDiaDiemNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/DiaDiemApi/NavTabs
  const countQuocGia = total_QuocGia ?? navData?.total_QuocGia;
  const countTinh = total_DiaPhuongCapTinh ?? navData?.total_DiaPhuongCapTinh;
  const countXa = total_DiaPhuongCapXa ?? navData?.total_DiaPhuongCapXa;
  const countDiaDiem = total_DiaDiem ?? navData?.total_DiaDiem;

  const navTabs: NavTabItem<LocationTabKey>[] = React.useMemo(
    () => [
      {
        key: "quocGia",
        label: "Quốc gia",
        href: "/admin/quocGia",
        icon: Globe,
        count: countQuocGia,
      },
      {
        key: "tinh",
        label: "Tỉnh / Thành phố",
        href: "/admin/diaPhuongCapTinh",
        icon: Building2,
        count: countTinh,
      },
      {
        key: "xa",
        label: "Xã / Phường",
        href: "/admin/diaPhuongCapXa",
        icon: Compass,
        count: countXa,
      },
      {
        key: "diaDiem",
        label: "Chi nhánh & Showroom",
        href: "/admin/diaDiem",
        icon: Store,
        count: countDiaDiem,
      },
    ],
    [countQuocGia, countTinh, countXa, countDiaDiem],
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
