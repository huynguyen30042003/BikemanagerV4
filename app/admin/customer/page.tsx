"use client";

import React, { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useKhachHang } from "@/hooks/KhachHang/useKhachHang";
import {
  KH_KhachHang,
  KhachHangKPI,
  CreateKhachHangPayload,
  UpdateKhachHangPayload,
} from "@/types/khachHang";
import {
  CustomerFilterBar,
  CustomerKpiGrid,
  CustomerGrid,
  CustomerTable,
  CustomerSkeleton,
  CreateCustomerSlideOver,
  UpdateCustomerSlideOver,
  ViewMode,
} from "@/components/Customer";

function CustomerContent() {
  const searchParams = useSearchParams();
  const initialTinhId = searchParams.get("tinhId") || undefined;

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    // Phân trang & Tìm kiếm & Bộ lọc
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    loaiFilter,
    setLoaiFilter,
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    // Dữ liệu danh sách
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    // KPI data
    kpiData,
    isLoadingKPI,
    refetchKPI,

    // Tỉnh/Thành & Xã/Phường
    provinceOptions,
    isLoadingTinh,
    communeOptionsAdd,
    isLoadingXaAdd,
    communeOptionsUpdate,
    isLoadingXaUpdate,

    // Modal Thêm mới
    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmit,
    isCreating,

    // Modal Cập nhật
    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating,

    // Modal Xóa
    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,

    errors,
  } = useKhachHang(initialTinhId);

  // File upload previews
  const [avatarPreviewAdd, setAvatarPreviewAdd] = useState<string | null>(null);
  const [logoPreviewAdd, setLogoPreviewAdd] = useState<string | null>(null);
  const [avatarPreviewUpdate, setAvatarPreviewUpdate] = useState<string | null>(
    null,
  );
  const [logoPreviewUpdate, setLogoPreviewUpdate] = useState<string | null>(
    null,
  );

  // Metrics (Derived KPI metrics - Ưu tiên lấy từ API GetKPI hoặc fallback lọc cục bộ)
  const individualCount = useMemo(
    () => items.filter((i: KH_KhachHang) => i.loaiKhachHang === 1).length,
    [items],
  );
  const businessCount = useMemo(
    () => items.filter((i: KH_KhachHang) => i.loaiKhachHang === 2).length,
    [items],
  );
  const activeCount = useMemo(
    () => items.filter((i: KH_KhachHang) => i.trangThai === true).length,
    [items],
  );

  const kpi = kpiData as unknown as
    | (KhachHangKPI & { data?: KhachHangKPI })
    | undefined;

  const total_KhachHang =
    kpi?.data?.total_KhachHang ?? kpi?.total_KhachHang ?? totalCount;
  const total_CaNhan =
    kpi?.data?.total_CaNhan ?? kpi?.total_CaNhan ?? individualCount;
  const total_ToChuc =
    kpi?.data?.total_ToChuc ?? kpi?.total_ToChuc ?? businessCount;
  const total_HoatDong =
    kpi?.data?.total_HoatDong ?? kpi?.total_HoatDong ?? activeCount;

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  const handleAvatarChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataAdd((prev: CreateKhachHangPayload) => ({
        ...prev,
        anhChanDung: file,
      }));
      setAvatarPreviewAdd(URL.createObjectURL(file));
    }
  };

  const handleLogoChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataAdd((prev: CreateKhachHangPayload) => ({
        ...prev,
        anhBieuTrung: file,
      }));
      setLogoPreviewAdd(URL.createObjectURL(file));
    }
  };

  const handleAvatarChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataUpdate((prev: UpdateKhachHangPayload) => ({
        ...prev,
        anhChanDung: file,
        XoaAnhChanDung: false,
      }));
      setAvatarPreviewUpdate(URL.createObjectURL(file));
    }
  };

  const handleLogoChangeUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDataUpdate((prev: UpdateKhachHangPayload) => ({
        ...prev,
        anhBieuTrung: file,
        XoaAnhBieuTrung: false,
      }));
      setLogoPreviewUpdate(URL.createObjectURL(file));
    }
  };

  const hasActiveFilters = Boolean(
    searchInput || statusFilter !== "all" || loaiFilter !== "all" || tinhFilter,
  );

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setLoaiFilter("all");
    setTinhFilter("");
    setPage(1);
  };

  const handleOpenEditWrapper = (customer: KH_KhachHang) => {
    setAvatarPreviewUpdate(null);
    setLogoPreviewUpdate(null);
    handleOpenEdit(customer);
  };

  const handleOpenAddWrapper = () => {
    setAvatarPreviewAdd(null);
    setLogoPreviewAdd(null);
    handleModalAdd();
  };

  return (
    <div className="p-3 sm:p-4 md:p-8 min-h-screen space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      {/* 1. Header & Thanh lọc tìm kiếm (Tối ưu Responsive Nút 3 gạch trên Mobile) */}
      <CustomerFilterBar
        totalKhachHang={total_KhachHang}
        totalCaNhan={total_CaNhan}
        totalToChuc={total_ToChuc}
        totalHoatDong={total_HoatDong}
        searchInput={searchInput}
        onSearch={handleSearch}
        tinhFilter={tinhFilter}
        onTinhFilterChange={(val) => {
          setTinhFilter(val);
          setPage(1);
        }}
        provinceOptions={provinceOptions}
        isLoadingTinh={isLoadingTinh}
        loaiFilter={loaiFilter}
        onLoaiFilterChange={(val) => {
          setLoaiFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={handleOpenAddWrapper}
        onRefresh={handleReload}
        isFetching={isFetching}
        isLoadingKPI={isLoadingKPI}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* 2. Dải KPI Ribbon Thống Kê (Render động qua KpiRibbon) */}
      <CustomerKpiGrid
        totalKhachHang={total_KhachHang}
        totalCaNhan={total_CaNhan}
        totalToChuc={total_ToChuc}
        totalHoatDong={total_HoatDong}
        loaiFilter={loaiFilter}
        setLoaiFilter={setLoaiFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setPage={setPage}
        isLoading={isLoading}
        isLoadingKPI={isLoadingKPI}
      />

      {/* 3. Nội dung dữ liệu chính (Lưới Showcase Grid hoặc Bảng Table Anti-Blowout) */}
      {isLoading ? (
        <CustomerSkeleton viewMode={viewMode} />
      ) : viewMode === "grid" ? (
        <CustomerGrid
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={handleOpenEditWrapper}
          onDelete={handleOpenDelete}
          onOpenCreate={handleOpenAddWrapper}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      ) : (
        <CustomerTable
          items={items}
          totalCount={totalCount}
          totalPages={totalPages}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={handleOpenEditWrapper}
          onDelete={handleOpenDelete}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onOpenCreate={handleOpenAddWrapper}
        />
      )}

      {/* Slide-over Drawer: THÊM MỚI KHÁCH HÀNG */}
      <CreateCustomerSlideOver
        open={open}
        onClose={() => setOpen(false)}
        dataAdd={dataAdd}
        setDataAdd={setDataAdd}
        handleSubmit={handleSubmit}
        isCreating={isCreating}
        errors={errors}
        provinceOptions={provinceOptions}
        isLoadingTinh={isLoadingTinh}
        communeOptionsAdd={communeOptionsAdd}
        isLoadingXaAdd={isLoadingXaAdd}
        avatarPreviewAdd={avatarPreviewAdd}
        logoPreviewAdd={logoPreviewAdd}
        handleAvatarChangeAdd={handleAvatarChangeAdd}
        handleLogoChangeAdd={handleLogoChangeAdd}
      />

      {/* Slide-over Drawer: CẬP NHẬT HỒ SƠ KHÁCH HÀNG */}
      <UpdateCustomerSlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        handleSubmitUpdate={handleSubmitUpdate}
        isUpdating={isUpdating}
        errors={errors}
        provinceOptions={provinceOptions}
        isLoadingTinh={isLoadingTinh}
        communeOptionsUpdate={communeOptionsUpdate}
        isLoadingXaUpdate={isLoadingXaUpdate}
        avatarPreviewUpdate={avatarPreviewUpdate}
        logoPreviewUpdate={logoPreviewUpdate}
        handleAvatarChangeUpdate={handleAvatarChangeUpdate}
        handleLogoChangeUpdate={handleLogoChangeUpdate}
      />

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa khách hàng"
        variant="danger"
        isLoading={isDeleting}
        confirmText="Xác nhận xóa"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa khách hàng &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác. Nếu khách hàng đang có đơn hàng,
              hợp đồng trả góp hoặc phương tiện xe liên kết, hệ thống sẽ từ chối
              xóa để bảo toàn dữ liệu nghiệp vụ.
            </span>
          </div>
        }
      />
    </div>
  );
}

export default function CustomerPage() {
  return (
    <Suspense
      fallback={
        <div className="p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6 max-w-full">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      }
    >
      <CustomerContent />
    </Suspense>
  );
}
