"use client";

import React, { useState, useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGetDashboardOverview } from "@/hooks/Dashboard/useDashboardApi";
import { useGetKho } from "@/hooks/Kho/useKhoApi";
import { useGetDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { DashboardOverviewFilter, TimeRangeType } from "@/types/dashboard";
import { KHO_Kho } from "@/types/kho";
import { DM_DiaDiem } from "@/types/diaDiem";
import { SelectOption } from "@/components/ui/selectSearch";
import {
  getFilterDates,
  DashboardFilterBar,
  DashboardKpiGrid,
  DashboardRevenueChart,
  DashboardOrderStatusCard,
  DashboardRecentOrdersTable,
  DashboardTopSellingProducts,
  DashboardStockWarning,
} from "@/components/Dashboard";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<TimeRangeType>("tat_ca");
  const [selectedKhoId, setSelectedKhoId] = useState<string>("");
  const [selectedDiaDiemId, setSelectedDiaDiemId] = useState<string>("");

  // Tạo filter query tự động theo preset thời gian và chi nhánh / kho
  const filter: DashboardOverviewFilter = useMemo(() => {
    const { TuNgay, DenNgay } = getFilterDates(timeRange);
    return {
      TuNgay,
      DenNgay,
      KhoID: selectedKhoId || null,
      DiaDiemID: selectedDiaDiemId || null,
      loaiThoiGian: timeRange,
    };
  }, [timeRange, selectedKhoId, selectedDiaDiemId]);

  // Fetch dữ liệu tổng quan
  const {
    data: dashboard,
    isLoading,
    isFetching,
    refetch,
  } = useGetDashboardOverview(filter);

  // Danh mục kho & chi nhánh phục vụ bộ lọc
  const { data: khoData, isLoading: isLoadingKho } = useGetKho({
    PageIndex: 1,
    PageSize: 100,
  });
  const { data: diaDiemData, isLoading: isLoadingDiaDiem } = useGetDiaDiem({
    PageIndex: 1,
    PageSize: 100,
  });

  const khoList: KHO_Kho[] = useMemo(() => {
    if (Array.isArray(khoData?.data)) return khoData.data;
    if (Array.isArray(khoData?.items)) return khoData.items;
    if (Array.isArray(khoData)) return khoData;
    return [];
  }, [khoData]);

  const diaDiemList: DM_DiaDiem[] = useMemo(() => {
    if (Array.isArray(diaDiemData?.data)) return diaDiemData.data;
    if (Array.isArray(diaDiemData?.items)) return diaDiemData.items;
    if (Array.isArray(diaDiemData)) return diaDiemData;
    return [];
  }, [diaDiemData]);

  const diaDiemOptions: SelectOption[] = useMemo(() => {
    return [
      { value: "", label: "🏬 Tất cả chi nhánh" },
      ...diaDiemList.map((dd: DM_DiaDiem) => ({
        value: dd.diaDiemID,
        label: `📍 ${dd.tenDiaDiem}${dd.diaChiSo ? ` - ${dd.diaChiSo}` : ""}`,
      })),
    ];
  }, [diaDiemList]);

  const khoOptions: SelectOption[] = useMemo(() => {
    const filteredKhos = selectedDiaDiemId
      ? khoList.filter(
          (k: KHO_Kho) => !k.diaDiemID || k.diaDiemID === selectedDiaDiemId
        )
      : khoList;

    return [
      { value: "", label: "🏢 Tất cả kho" },
      ...filteredKhos.map((kho: KHO_Kho) => ({
        value: kho.khoID,
        label: `📦 ${kho.tenKho} (${kho.maKho})`,
      })),
    ];
  }, [khoList, selectedDiaDiemId]);

  // Khi đổi chi nhánh, tự động reset kho nếu kho hiện tại không thuộc chi nhánh đó
  const handleSelectDiaDiem = (nextVal: string) => {
    setSelectedDiaDiemId(nextVal);
    if (nextVal && selectedKhoId) {
      const currentKho = khoList.find((k: KHO_Kho) => k.khoID === selectedKhoId);
      if (currentKho?.diaDiemID && currentKho.diaDiemID !== nextVal) {
        setSelectedKhoId("");
      }
    }
  };

  // Giới hạn max value cho cột biểu đồ ngày
  const maxDayChartValue = useMemo(() => {
    if (!dashboard?.doanhThuTheoNgay || dashboard.doanhThuTheoNgay.length === 0)
      return 10000000;
    const maxVal = Math.max(
      ...dashboard.doanhThuTheoNgay.map((d) => d.doanhThu)
    );
    return maxVal > 0 ? maxVal * 1.15 : 10000000;
  }, [dashboard]);

  return (
    <div className="p-3 sm:p-5 lg:p-7 space-y-5 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Bộ lọc chi nhánh, kho bãi, khoảng thời gian */}
      <DashboardFilterBar
        user={user}
        selectedDiaDiemId={selectedDiaDiemId}
        selectedKhoId={selectedKhoId}
        timeRange={timeRange}
        diaDiemOptions={diaDiemOptions}
        khoOptions={khoOptions}
        isLoadingDiaDiem={isLoadingDiaDiem}
        isLoadingKho={isLoadingKho}
        isFetching={isFetching}
        onSelectDiaDiem={handleSelectDiaDiem}
        onSelectKho={setSelectedKhoId}
        onChangeTimeRange={setTimeRange}
        onRefresh={() => refetch()}
      />

      {/* 2. Grid 6 KPI Thẻ Card chính (Render đồng nhất qua hàm .map() & Responsive) */}
      <DashboardKpiGrid kpi={dashboard?.kpi} isLoading={isLoading} />

      {/* 3. Phân tích doanh thu & Cơ cấu trạng thái đơn hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <DashboardRevenueChart
          dashboard={dashboard}
          kpi={dashboard?.kpi}
          maxDayChartValue={maxDayChartValue}
        />
        <DashboardOrderStatusCard
          dashboard={dashboard}
          kpi={dashboard?.kpi}
        />
      </div>

      {/* 4. Danh sách nghiệp vụ: Đơn hàng mới nhất & Top sản phẩm bán chạy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <DashboardRecentOrdersTable dashboard={dashboard} />
        <DashboardTopSellingProducts dashboard={dashboard} />
      </div>

      {/* 5. Cảnh báo tồn kho an toàn & Phụ tùng sắp hết */}
      <DashboardStockWarning dashboard={dashboard} />
    </div>
  );
}
