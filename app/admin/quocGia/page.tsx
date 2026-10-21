"use client";

import React, { Suspense, useMemo, useState } from "react";
import { FolderOpen, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useQuocGia } from "@/hooks/QuocGia/useQuocGia";
import { DM_QuocGia, QuocGiaKPI } from "@/types/quocGia";
import {
  QuocGiaKpiGrid,
  QuocGiaFilterBar,
  QuocGiaTable,
  QuocGiaGrid,
  CreateQuocGiaSlideOver,
  UpdateQuocGiaSlideOver,
  QuocGiaSkeleton,
  ViewMode,
} from "@/components/QuocGia";

function QuocGiaContent() {
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DM_QuocGia | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,

    handleSync,
    isSyncing,
  } = useQuocGia();

  // Metrics derived from items or KPI data
  const activeCount = useMemo(
    () => items.filter((item) => item.trangThai === true).length,
    [items],
  );
  const inactiveCount = useMemo(
    () => items.filter((item) => item.trangThai === false).length,
    [items],
  );

  const kpi = kpiData as unknown as
    | (QuocGiaKPI & { data?: QuocGiaKPI })
    | undefined;

  const total_QuocGia =
    kpi?.data?.total_QuocGia ?? kpi?.total_QuocGia ?? totalCount;
  const total_HoatDong =
    kpi?.data?.total_HoatDong ?? kpi?.total_HoatDong ?? activeCount;
  const total_NgungHoatDong =
    kpi?.data?.total_NgungHoatDong ?? kpi?.total_NgungHoatDong ?? inactiveCount;

  const handleReload = () => {
    refetch();
    refetchKPI();
  };

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    toast.success(`Đã sao chép mã quốc gia: ${code}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const hasActiveFilters = Boolean(searchInput || statusFilter !== "all");

  const handleResetFilters = () => {
    handleSearch("");
    setStatusFilter("all");
    setPage(1);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-7 min-h-screen space-y-3 sm:space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* 1. Header Navigation & Toolbar */}
      <QuocGiaFilterBar
        total_QuocGia={total_QuocGia}
        total_HoatDong={total_HoatDong}
        total_NgungHoatDong={total_NgungHoatDong}
        searchInput={searchInput}
        onSearchChange={handleSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenCreate={() => setOpenCreate(true)}
        onReload={handleReload}
        onSync={handleSync}
        isSyncing={isSyncing}
        isFetching={isFetching || isLoadingKPI}
      />

      {/* 2. KPI Overview Cards (KpiRibbon + .map()) */}
      <QuocGiaKpiGrid
        total_QuocGia={total_QuocGia}
        total_HoatDong={total_HoatDong}
        total_NgungHoatDong={total_NgungHoatDong}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        isLoading={isLoadingKPI && isLoading}
      />

      {/* 3. Main Data Content Area */}
      {items.length === 0 && !isLoading ? (
        <div className="rounded-xl border border-border/80 bg-card p-12 flex flex-col items-center justify-center text-center text-muted-foreground shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-3 border border-border/50 shadow-2xs">
            <FolderOpen className="w-7 h-7 stroke-[1.5]" />
          </div>
          <p className="font-semibold text-base text-foreground">
            Không tìm thấy quốc gia nào
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {hasActiveFilters
              ? "Không có kết quả khớp với bộ lọc hiện tại. Hãy điều chỉnh từ khóa hoặc xóa bớt tiêu chí lọc."
              : "Chưa có danh mục quốc gia trong hệ thống. Hãy thêm mới hoặc nhấn Đồng bộ chuẩn!"}
          </p>
          <div className="flex items-center gap-2 mt-4 flex-wrap justify-center">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="cursor-pointer"
              >
                Xóa bộ lọc
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              className="cursor-pointer"
            >
              Đồng bộ ngay
            </Button>
            <Button
              size="sm"
              onClick={() => setOpenCreate(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm quốc gia mới
            </Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <QuocGiaGrid
          items={items}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(item) => handleOpenDelete(item)}
          copiedId={copiedId}
          onCopyCode={handleCopyCode}
        />
      ) : (
        <QuocGiaTable
          items={items}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          totalPages={totalPages}
          setPage={setPage}
          setPageSize={setPageSize}
          onEdit={(item) => setEditingItem(item)}
          onDelete={(item) => handleOpenDelete(item)}
          copiedId={copiedId}
          onCopyCode={handleCopyCode}
        />
      )}

      {/* 4. SlideOver: Thêm mới Quốc gia */}
      <CreateQuocGiaSlideOver
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        defaultThuTu={
          items.length > 0 ? Math.max(...items.map((i) => i.thuTu ?? 0)) + 1 : 1
        }
        onSuccess={handleReload}
      />

      {/* 5. SlideOver: Cập nhật Quốc gia */}
      <UpdateQuocGiaSlideOver
        open={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        data={editingItem}
        onSuccess={handleReload}
      />

      {/* 6. Modal Xác nhận xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa quốc gia"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa quốc gia &quot;
              <strong className="text-foreground">{selectItemName}</strong>
              &quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác nếu quốc gia này đang được liên
              kết với sản phẩm xe, xuất xứ hoặc nhà cung cấp.
            </span>
          </div>
        }
        confirmText="Xác nhận xóa"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function QuocGiaPage() {
  return (
    <Suspense fallback={<QuocGiaSkeleton />}>
      <QuocGiaContent />
    </Suspense>
  );
}
