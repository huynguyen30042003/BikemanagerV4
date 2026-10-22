"use client";

import React, { Suspense, useState, useMemo } from "react";
import { PackagePlus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { WarehouseNavTabs } from "@/components/Common/WarehouseNavTabs";
import { useGetKho } from "@/hooks/Kho/useKhoApi";
import { useGetBienTheSanPham } from "@/hooks/BienTheSanPham/useBienTheSanPhamApi";
import { useGetTonKhoKPI } from "@/hooks/TonKho/useTonKhoApi";
import {
  OpeningStockKpiGrid,
  OpeningStockFormCard,
  OpeningStockReferenceTable,
} from "@/components/OpeningStock";

function OpeningStockContent() {
  const [selectedKhoId, setSelectedKhoId] = useState<string>("");
  const [presetVariantId, setPresetVariantId] = useState<string>("");
  const [soLuongToiThieu, setSoLuongToiThieu] = useState<number>(5);

  // 1. Lấy danh sách kho hàng
  const { data: dataKhos, isLoading: isLoadingKhos } = useGetKho({
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const khoOptions = useMemo(() => {
    const list = dataKhos?.data ?? dataKhos?.items ?? [];
    return list.map(
      (k: {
        khoID: string;
        tenKho: string;
        maKho: string;
        diaDiemID?: string;
      }) => ({
        value: k.khoID,
        label: `${k.tenKho} [${k.maKho}]`,
        diaDiemID: k.diaDiemID,
      }),
    );
  }, [dataKhos]);

  // 2. Lấy danh sách biến thể xe / sản phẩm
  const { data: dataVariants, isLoading: isLoadingVariants } =
    useGetBienTheSanPham({
      PageIndex: 1,
      PageSize: 200,
      DangHoatDong: true,
    });

  const variantList = useMemo(() => {
    return dataVariants?.data ?? dataVariants?.items ?? [];
  }, [dataVariants]);

  // 3. Lấy KPI tổng quan tồn kho
  const { data: tonKhoKpi, isLoading: isLoadingKPI } = useGetTonKhoKPI();

  const handleSelectVariantFromTable = (
    bienTheId: string,
    khoId?: string,
    soLuongToiThieu?: number,
  ) => {
    setPresetVariantId(bienTheId);
    if (khoId) setSelectedKhoId(khoId);
    if (soLuongToiThieu) setSoLuongToiThieu(soLuongToiThieu);

    // Scroll smoothly to form
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <section className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-4 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4 pb-2 sm:pb-4 border-b border-border/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span>Vận hành & Kho</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Tồn kho đầu kỳ</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs ring-4 ring-blue-500/5">
                <PackagePlus className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Khởi Tạo Tồn Kho Đầu Kỳ
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Thiết lập số dư ban đầu, cập nhật số lượng tồn thực tế, giá
                  vốn và danh sách số Serial/Khung cho các kho bãi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="pt-1">
          <WarehouseNavTabs activeTab="opening-stock" />
        </div>
      </div>

      {/* 2. Dải Thẻ KPI Tồn Kho */}
      <OpeningStockKpiGrid
        kpiData={tonKhoKpi}
        isLoading={isLoadingKPI}
        totalItems={variantList.length}
      />

      {/* 3. Biểu Mẫu Nhập Tồn Đầu Kỳ (Cô lập State chống Re-render) */}
      <OpeningStockFormCard
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        variantList={variantList}
        isLoadingVariants={isLoadingVariants}
        selectedKhoId={selectedKhoId}
        onSelectKhoId={setSelectedKhoId}
        presetVariantId={presetVariantId}
        soLuongToiThieu={soLuongToiThieu}
        setSoLuongToiThieu={setSoLuongToiThieu}
      />

      {/* 4. Bảng Tra Cứu Tồn Kho Hiện Tại Để Đối Chiếu */}
      <OpeningStockReferenceTable
        khoFilter={selectedKhoId}
        onKhoFilterChange={setSelectedKhoId}
        khoOptions={khoOptions}
        isLoadingKhos={isLoadingKhos}
        onSelectVariant={handleSelectVariantFromTable}
      />
    </section>
  );
}

export default function OpeningStockPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 md:p-8 space-y-6">
          <Skeleton className="h-8 w-64 rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <OpeningStockContent />
    </Suspense>
  );
}
