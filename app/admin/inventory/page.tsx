"use client";

import React, { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTonKho } from "@/hooks/TonKho/useTonKho";
import { useGetTonKhoKPI } from "@/hooks/TonKho/useTonKhoApi";
import {
  InventoryKpiGrid,
  InventoryFilterBar,
  InventoryStockTable,
  InventoryCostsTable,
  InventoryTransactionsTable,
  UpdateDinhMucSlideOver,
  TheKhoSlideOver,
  InventorySkeleton,
} from "@/components/Inventory";

function InventoryContent() {
  const searchParams = useSearchParams();
  const initialKhoId = searchParams.get("khoId") || undefined;

  const {
    activeTab,
    setActiveTab,
    page,
    setPage,
    pageSize,
    setPageSize,
    khoFilter,
    setKhoFilter,
    warningFilter,
    setWarningFilter,
    searchInput,
    handleSearch,

    khoOptions,
    isLoadingKhos,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    loChiPhiItems,
    totalLoChiPhis,
    isLoadingLoChiPhis,

    allGiaoDichItems,
    totalAllGiaoDichs,
    isLoadingAllGiaoDichs,

    openDinhMuc,
    setOpenDinhMuc,
    selectedItem,
    handleOpenDinhMuc,
    handleSubmitDinhMuc,
    isUpdatingDinhMuc,

    openTheKho,
    setOpenTheKho,
    theKhoItems,
    isLoadingTheKho,
    handleOpenTheKho,
  } = useTonKho(initialKhoId);

  const { data: tonKhoKpi, isLoading: isLoadingKPI } = useGetTonKhoKPI();

  // Thống kê nhanh
  const lowStockCount = useMemo(
    () =>
      items.filter(
        (i) =>
          i.soLuongToiThieu != null &&
          i.soLuongKhaDung <= i.soLuongToiThieu &&
          i.soLuongKhaDung > 0,
      ).length,
    [items],
  );

  const outOfStockCount = useMemo(
    () => items.filter((i) => i.soLuongKhaDung <= 0).length,
    [items],
  );

  const totalAvailable = useMemo(
    () => items.reduce((sum, i) => sum + (i.soLuongKhaDung || 0), 0),
    [items],
  );

  const hasActiveFilters = Boolean(
    searchInput ||
    khoFilter ||
    (activeTab === "stock" && warningFilter !== "all"),
  );

  const handleResetFilters = () => {
    handleSearch("");
    setKhoFilter("");
    setWarningFilter("all");
    setPage(1);
  };

  const handleSelectWarning = (filter: "all" | "low" | "out") => {
    setWarningFilter(filter);
    setPage(1);
  };

  const handleChangeTab = (tab: "stock" | "costs" | "transactions") => {
    setActiveTab(tab);
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header, SubTabs switcher & Filter Toolbar */}
      <InventoryFilterBar
        totalCount={totalCount}
        activeTab={activeTab}
        setActiveTab={handleChangeTab}
        totalLoChiPhis={totalLoChiPhis}
        totalAllGiaoDichs={totalAllGiaoDichs}
        searchInput={searchInput}
        onSearch={handleSearch}
        khoFilter={khoFilter}
        setKhoFilter={(val) => {
          setKhoFilter(val);
          setPage(1);
        }}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        warningFilter={warningFilter}
        setWarningFilter={handleSelectWarning}
        lowStockCount={lowStockCount}
        outOfStockCount={outOfStockCount}
        stockItemsCount={items.length}
        isFetching={isFetching}
        onRefresh={refetch}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 2. Dải KPI Ribbon - Hiển thị khi ở tab Tồn kho thực tế */}
      {activeTab === "stock" && (
        <InventoryKpiGrid
          kpiData={tonKhoKpi}
          totalCount={totalCount}
          totalAvailable={totalAvailable}
          lowStockCount={lowStockCount}
          outOfStockCount={outOfStockCount}
          warningFilter={warningFilter}
          onSelectWarning={handleSelectWarning}
          isLoadingKPI={isLoadingKPI}
          isLoading={isLoading}
        />
      )}

      {/* 3. Bảng dữ liệu chính tùy theo SubTab */}
      {activeTab === "stock" &&
        (isLoading ? (
          <InventorySkeleton />
        ) : (
          <InventoryStockTable
            items={items}
            totalCount={totalCount}
            totalPages={totalPages}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            onOpenTheKho={handleOpenTheKho}
            onOpenDinhMuc={handleOpenDinhMuc}
          />
        ))}

      {activeTab === "costs" &&
        (isLoadingLoChiPhis ? (
          <InventorySkeleton />
        ) : (
          <InventoryCostsTable
            loChiPhiItems={loChiPhiItems}
            totalLoChiPhis={totalLoChiPhis}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        ))}

      {activeTab === "transactions" &&
        (isLoadingAllGiaoDichs ? (
          <InventorySkeleton />
        ) : (
          <InventoryTransactionsTable
            allGiaoDichItems={allGiaoDichItems}
            totalAllGiaoDichs={totalAllGiaoDichs}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        ))}

      {/* 4. SlideOver Cập nhật Định mức tồn tối thiểu & Vị trí kệ */}
      <UpdateDinhMucSlideOver
        open={openDinhMuc}
        onClose={() => setOpenDinhMuc(false)}
        selectedItem={selectedItem}
        onSubmit={handleSubmitDinhMuc}
        isUpdating={isUpdatingDinhMuc}
      />

      {/* 5. SlideOver Xem Thẻ kho / Lịch sử giao dịch biến động */}
      <TheKhoSlideOver
        open={openTheKho}
        onClose={() => setOpenTheKho(false)}
        selectedItem={selectedItem}
        theKhoItems={theKhoItems}
        isLoadingTheKho={isLoadingTheKho}
      />
    </div>
  );
}

export default function InventoryPage() {
  return (
    <Suspense fallback={<InventorySkeleton />}>
      <InventoryContent />
    </Suspense>
  );
}
