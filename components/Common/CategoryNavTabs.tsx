"use client";

import React from "react";
import { FolderTree, ListTree } from "lucide-react";
import { useGetDanhMucChungNavTabs } from "@/hooks/DanhMucChung/useDanhMucChungApi";
import { BaseNavTabs, NavTabItem } from "@/components/Common/BaseNavTabs";

export type CategoryTabKey = "chung" | "chiTiet";

interface CategoryNavTabsProps {
  activeTab: CategoryTabKey;
  className?: string;
  totalChung?: number;
  totalChiTiet?: number;
  totalDanhMucChung?: number;
  totalDanhMucChiTiet?: number;
}

export function CategoryNavTabs({
  activeTab,
  className,
  totalChung,
  totalChiTiet,
  totalDanhMucChung,
  totalDanhMucChiTiet,
}: CategoryNavTabsProps) {
  const { data: navData, isLoading } = useGetDanhMucChungNavTabs();

  // Ưu tiên props truyền vào nếu có, fallback về data tự động từ API /api/DanhMucChungApi/NavTabs
  const countChung = totalChung ?? totalDanhMucChung ?? navData?.total_DanhMucChung;
  const countChiTiet = totalChiTiet ?? totalDanhMucChiTiet ?? navData?.total_DanhMucChiTiet;

  const navTabs: NavTabItem<CategoryTabKey>[] = React.useMemo(
    () => [
      {
        key: "chung",
        label: "Danh mục dùng chung",
        href: "/admin/danhMucChung",
        icon: FolderTree,
        count: countChung,
      },
      {
        key: "chiTiet",
        label: "Danh mục chi tiết",
        href: "/admin/danhMucChiTiet",
        icon: ListTree,
        count: countChiTiet,
      },
    ],
    [countChung, countChiTiet],
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
