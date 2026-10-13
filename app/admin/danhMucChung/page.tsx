"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Column, Table } from "@/components/ui/Table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Check,
  FolderTree,
  Plus,
  RefreshCw,
  Search,
  SquarePen,
  Trash,
  FolderOpen,
  Filter,
} from "lucide-react";
import { useDanhMucChung } from "@/hooks/DanhMucChung/useDanhMucChung";
import { DM_DanhMucChung } from "@/types/danhMucChung";
import { SlideOver } from "@/components/ui/SlideOver";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function DanhMucChungPageClient() {
  const {
    // Pagination & Search
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    handleSearch,
    statusFilter,
    setStatusFilter,

    // Data query
    dataDanhMucChung,
    items: hookItems,
    totalCount: hookTotalCount,
    totalPages: hookTotalPages,
    isLoading,
    isFetching,
    refetch,

    // Add state & actions
    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmit,
    isCreating,

    // Update state & actions
    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating,

    // Delete state & actions
    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting,

    // Sync
    handleSync,
    isSyncing,

    // Validation
    errors,
  } = useDanhMucChung();

  const items = hookItems ?? dataDanhMucChung?.data ?? [];
  const totalCount =
    hookTotalCount ??
    dataDanhMucChung?.pagination?.totalItems ??
    dataDanhMucChung?.recordsTotal ??
    0;
  const totalPages =
    hookTotalPages ?? dataDanhMucChung?.pagination?.totalPages ?? 1;

  // Derived KPI metrics for Brandkit overview
  const activeCount = React.useMemo(
    () => items.filter((item: DM_DanhMucChung) => item.trangThai === true).length,
    [items]
  );
  const inactiveCount = React.useMemo(
    () => items.filter((item: DM_DanhMucChung) => item.trangThai === false).length,
    [items]
  );
  const totalSubCategories = React.useMemo(
    () =>
      items.reduce(
        (acc: number, item: DM_DanhMucChung) => acc + (item.soLuongChiTiet || 0),
        0
      ),
    [items]
  );
  
  // Table columns definition
  const danhMucChungColumns: Column<DM_DanhMucChung>[] = [
    {
      key: "ten",
      title: "Tên danh mục",
      classNameHeader: "text-left text-muted-foreground",
      classNameItem: "text-left",
      render: (_v, row) => (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground text-sm hover:text-blue-600 transition-colors">
              {row.ten}
            </span>
            {row.soLuongChiTiet !== undefined && row.soLuongChiTiet > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium border border-blue-500/20">
                {row.soLuongChiTiet} chi tiết
              </span>
            )}
          </div>
          {row.moTa ? (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {row.moTa}
            </p>
          ) : (
            <span className="text-[11px] text-muted-foreground/50 italic">
              Chưa có mô tả
            </span>
          )}
        </div>
      ),
    },
    {
      key: "trangThai",
      title: "Trạng thái",
      classNameHeader: "text-center w-36 text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) =>
        row.trangThai ? (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sử dụng
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              Khóa
            </span>
          </div>
        ),
    },
    {
      key: "function",
      title: "Thao tác",
      classNameHeader: "text-center w-28 text-muted-foreground",
      classNameItem: "text-center",
      render: (_v, row) => (
        <div className="flex gap-1 justify-center items-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenEdit(row)}
            title="Chỉnh sửa danh mục"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors"
          >
            <SquarePen className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleOpenDelete(row)}
            title="Xóa danh mục"
            className="h-8 w-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen space-y-6">
      {/* 1. Header & Breadcrumb */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/70">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider mb-1">
              <span>Hệ thống</span>
              <span className="text-muted-foreground/30">/</span>
              <span className="text-foreground">Danh mục dùng chung</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-xs">
                <FolderTree className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Danh mục dùng chung
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Quản lý và thiết lập các danh mục thuộc tính dùng chung trong toàn hệ thống
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSync}
              disabled={isSyncing}
              className="h-9 px-3 flex items-center gap-1.5 border-border/80 text-muted-foreground hover:text-foreground"
              title="Đồng bộ danh mục từ dữ liệu chuẩn"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-blue-500" : ""}`}
              />
              <span className="text-xs font-medium">Đồng bộ</span>
            </Button>

            <Button
              size="sm"
              onClick={handleModalAdd}
              className="h-9 px-3.5 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="text-xs font-medium">Thêm mới</span>
            </Button>
          </div>
        </div>
      )}

      {/* 3. Toolbar: Tìm kiếm và lọc */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Tìm kiếm theo tên danh mục..."
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-8 h-9.5 w-full bg-background/80 text-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground w-4 h-4 rounded-full flex items-center justify-center hover:bg-muted cursor-pointer transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Trạng thái Filter Buttons (Segmented Control) */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border/60 text-xs shrink-0">
            <Filter className="w-3.5 h-3.5 text-muted-foreground ml-1 mr-0.5" />
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-background shadow-xs text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Tất cả ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("active");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                statusFilter === "active"
                  ? "bg-background shadow-xs text-emerald-600 dark:text-emerald-400 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sử dụng ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setStatusFilter("inactive");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                statusFilter === "inactive"
                  ? "bg-background shadow-xs text-slate-700 dark:text-slate-300 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Khóa ({inactiveCount})
            </button>
          </div>

          {/* Reload button */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            title="Tải lại dữ liệu"
            className="h-9.5 w-9.5 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* 4. Table danh sách */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full mb-2" />
          <Skeleton className="h-12 w-full" />
        </Card>
      ) : (
        <div className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-3 flex flex-col gap-3 w-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                  <FolderOpen className="w-7 h-7 stroke-[1.5]" />
                </div>
                <p className="font-semibold text-base text-foreground">
                  Không tìm thấy danh mục nào
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  {searchInput
                    ? `Không có kết quả nào khớp với từ khóa "${searchInput}". Bạn hãy thử tìm kiếm từ khóa khác.`
                    : "Hiện tại chưa có danh mục chung nào trong hệ thống. Hãy tạo danh mục đầu tiên!"}
                </p>
                <Button
                  size="sm"
                  onClick={handleModalAdd}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-1" /> Thêm danh mục mới
                </Button>
              </div>
            ) : (
              <>
                <Table<DM_DanhMucChung>
                  data={items}
                  columns={danhMucChungColumns}
                  showIndex
                  startIndex={(page - 1) * pageSize}
                />

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/70 text-sm text-muted-foreground">
                  <div className="text-xs">
                    Trang <strong className="text-foreground">{page}</strong> / {totalPages}{" "}
                    (Tổng {totalCount} danh mục)
                  </div>

                  <div className="flex items-center gap-1.5">
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      className="h-8 border border-border/80 rounded-md px-2 bg-background text-foreground text-xs outline-none focus:border-blue-500"
                    >
                      <option value={10}>10 / trang</option>
                      <option value={20}>20 / trang</option>
                      <option value={50}>50 / trang</option>
                      <option value={100}>100 / trang</option>
                    </select>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                      className="h-8 text-xs"
                    >
                      Trước
                    </Button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === totalPages ||
                          Math.abs(p - page) <= 2
                      )
                      .map((p, idx, arr) => {
                        const prev = arr[idx - 1];
                        return (
                          <React.Fragment key={p}>
                            {prev && p - prev > 1 && (
                              <span className="px-1 text-muted-foreground">...</span>
                            )}
                            <Button
                              variant={page === p ? "default" : "outline"}
                              size="sm"
                              className={`h-8 w-8 p-0 text-xs ${
                                page === p ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                              }`}
                              onClick={() => setPage(p)}
                            >
                              {p}
                            </Button>
                          </React.Fragment>
                        );
                      })}

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                      className="h-8 text-xs"
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Slide-over Drawer: THÊM MỚI DANH MỤC */}
      <SlideOver
        open={open}
        onClose={() => setOpen(false)}
        title="Thêm mới danh mục chung"
        description="Định nghĩa danh mục thuộc tính mới vào hệ thống"
        icon={FolderTree}
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setOpen(false)}
              disabled={isCreating}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={handleSubmit}
              disabled={isCreating}
            >
              {isCreating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
              ) : null}
              Lưu danh mục
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Tên danh mục */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên danh mục <span className="text-red-600">*</span>
            </label>
            <Input
              type="text"
              value={dataAdd.Ten}
              placeholder="Ví dụ: Thương hiệu linh kiện, Loại khung xe..."
              className={`rounded-lg ${errors.ten ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  Ten: e.target.value,
                }))
              }
              autoFocus
            />
            {errors.ten && (
              <p className="text-xs text-red-600">{errors.ten}</p>
            )}
          </div>

          {/* Thứ tự sắp xếp */}
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Thứ tự sắp xếp
            </label>
            <Input
              type="number"
              min={0}
              value={dataAdd.ThuTu}
              className="rounded-lg"
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  ThuTu: parseInt(e.target.value) || 0,
                }))
              }
            />
            {errors.thuTu && (
              <p className="text-xs text-red-600">{errors.thuTu}</p>
            )}
          </div>

          {/* Trạng thái sử dụng */}
          <div className="col-span-1 flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              name="isActiveAdd"
              id="isActiveAdd"
              checked={dataAdd.TrangThai}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  TrangThai: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="isActiveAdd"
              className="text-sm font-medium text-foreground cursor-pointer select-none"
            >
              Kích hoạt sử dụng
            </label>
          </div>

          {/* Mô tả */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Mô tả danh mục
            </label>
            <Textarea
              value={dataAdd.MoTa || ""}
              onChange={(e) =>
                setDataAdd((prev) => ({
                  ...prev,
                  MoTa: e.target.value,
                }))
              }
              placeholder="Nhập mô tả hoặc ghi chú..."
              className="h-28 resize-none rounded-lg"
            />
          </div>
        </div>
      </SlideOver>

      {/* Slide-over Drawer: CẬP NHẬT DANH MỤC */}
      <SlideOver
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        title={`Cập nhật danh mục #${dataUpdate.DanhMucID}`}
        description="Chỉnh sửa thông tin danh mục thuộc tính"
        icon={SquarePen}
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              onClick={() => setOpenUpdate(false)}
              disabled={isUpdating}
            >
              Hủy
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              onClick={handleSubmitUpdate}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-1.5" />
              ) : null}
              Lưu thay đổi
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Tên danh mục */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Tên danh mục <span className="text-red-600">*</span>
            </label>
            <Input
              type="text"
              value={dataUpdate.Ten}
              placeholder="Nhập tên danh mục..."
              className={`rounded-lg ${errors.ten ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  Ten: e.target.value,
                }))
              }
            />
            {errors.ten && (
              <p className="text-xs text-red-600">{errors.ten}</p>
            )}
          </div>

          {/* Thứ tự sắp xếp */}
          <div className="col-span-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Thứ tự sắp xếp
            </label>
            <Input
              type="number"
              min={0}
              value={dataUpdate.ThuTu}
              className="rounded-lg"
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  ThuTu: parseInt(e.target.value) || 0,
                }))
              }
            />
            {errors.thuTu && (
              <p className="text-xs text-red-600">{errors.thuTu}</p>
            )}
          </div>

          {/* Trạng thái sử dụng */}
          <div className="col-span-1 flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              name="isActiveUpdate"
              id="isActiveUpdate"
              checked={dataUpdate.TrangThai}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  TrangThai: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label
              htmlFor="isActiveUpdate"
              className="text-sm font-medium text-foreground cursor-pointer select-none"
            >
              Kích hoạt sử dụng
            </label>
          </div>

          {/* Mô tả */}
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">
              Mô tả
            </label>
            <Textarea
              value={dataUpdate.MoTa || ""}
              onChange={(e) =>
                setDataUpdate((prev) => ({
                  ...prev,
                  MoTa: e.target.value,
                }))
              }
              placeholder="Nhập mô tả hoặc ghi chú..."
              className="h-28 resize-none rounded-lg"
            />
          </div>
        </div>
      </SlideOver>

      {/* Modal Xác nhận Xóa */}
      <ConfirmModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleSubmitDelete}
        title="Xác nhận xóa danh mục"
        variant="danger"
        isLoading={isDeleting}
        confirmText="Xác nhận xóa"
        description={
          <div>
            <p>
              Bạn có chắc chắn muốn xóa danh mục &quot;
              <strong className="text-foreground">{selectItemName}</strong>&quot; không?
            </p>
            <span className="text-xs text-rose-600/90 dark:text-rose-400 mt-2 block bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
              Hành động này không thể hoàn tác. Nếu danh mục đang có mục con hoặc dữ liệu phụ thuộc, hệ thống sẽ từ chối xóa.
            </span>
          </div>
        }
      />
    </div>
  );
}