"use client";

import React from "react";
import Link from "next/link";
import { User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomerDetail } from "@/hooks/KhachHang/useCustomerDetail";
import { CustomerDetailHeader } from "@/components/Customer/Detail/CustomerDetailHeader";
import { CustomerDetailKpiGrid } from "@/components/Customer/Detail/CustomerDetailKpiGrid";
import { CustomerDetailTabsBar } from "@/components/Customer/Detail/CustomerDetailTabsBar";
import { CustomerVehiclesWarrantyTab } from "@/components/Customer/Detail/CustomerVehiclesWarrantyTab";
import { CustomerPurchasedOrdersTab } from "@/components/Customer/Detail/CustomerPurchasedOrdersTab";
import { CustomerWarrantyClaimsTab } from "@/components/Customer/Detail/CustomerWarrantyClaimsTab";

export interface CustomerDetailPublicViewProps {
  khachHangId: string;
  isAdminMode?: boolean;
}

export function CustomerDetailPublicView({
  khachHangId,
  isAdminMode = false,
}: CustomerDetailPublicViewProps) {
  const {
    activeTab,
    setActiveTab,
    previewPublic,
    setPreviewPublic,
    copiedLink,
    handleCopyPublicLink,
    customer,
    isLoadingCustomer,
    stats,
    vehicles,
    isLoadingVehicles,
    warranties,
    isLoadingWarranties,
    warrantyClaims,
    isLoadingClaims,
    orders,
    isLoadingOrders,
    enrichedVehicles,
    standaloneWarranties,
    activeWarrantiesCount,
  } = useCustomerDetail(khachHangId, isAdminMode);

  if (isLoadingCustomer) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 max-w-3xl mx-auto text-center space-y-4 my-12">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-foreground">
          Không tìm thấy thông tin khách hàng
        </h1>
        <p className="text-xs text-muted-foreground">
          Mã hồ sơ khách hàng không tồn tại hoặc đã bị xóa khỏi hệ thống.
        </p>
        {isAdminMode && (
          <Link href="/admin/customer">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Quay lại danh sách khách hàng</span>
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-5 sm:space-y-6 min-h-screen">
      {/* 1. Thanh công cụ & Thẻ định danh Khách hàng (Digital Passport) */}
      <CustomerDetailHeader
        customer={customer}
        stats={stats}
        orders={orders}
        isAdminMode={isAdminMode}
        previewPublic={previewPublic}
        setPreviewPublic={setPreviewPublic}
        copiedLink={copiedLink}
        onCopyPublicLink={handleCopyPublicLink}
      />

      {/* 2. Dải thẻ KPI Tổng quan (KpiRibbon chuẩn hóa qua .map()) */}
      <CustomerDetailKpiGrid
        vehiclesCount={vehicles.length}
        activeWarrantiesCount={activeWarrantiesCount}
        totalWarrantiesCount={warranties.length}
        ordersCount={orders.length || stats?.tongSoDonHang || 0}
        claimsCount={warrantyClaims.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={
          isLoadingVehicles ||
          isLoadingWarranties ||
          isLoadingOrders ||
          isLoadingClaims
        }
      />

      {/* 3. Thanh điều hướng Tabs cuộn ngang */}
      <CustomerDetailTabsBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        vehiclesAndStandaloneCount={
          vehicles.length + standaloneWarranties.length
        }
        ordersCount={orders.length}
        claimsCount={warrantyClaims.length}
      />

      {/* 4. Nội dung từng Tab */}
      {activeTab === "vehicles-warranty" && (
        <CustomerVehiclesWarrantyTab
          enrichedVehicles={enrichedVehicles}
          standaloneWarranties={standaloneWarranties}
          isLoading={isLoadingVehicles || isLoadingWarranties}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "purchased-orders" && (
        <CustomerPurchasedOrdersTab
          orders={orders}
          isLoading={isLoadingOrders}
        />
      )}

      {activeTab === "warranty-claims" && (
        <CustomerWarrantyClaimsTab
          warrantyClaims={warrantyClaims}
          isLoading={isLoadingClaims}
        />
      )}
    </div>
  );
}
