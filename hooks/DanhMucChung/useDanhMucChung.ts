"use client";

import { useConfirm } from "@/components/Common/ConfirmContext";
import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";

import { DM_DanhMucChung } from "@/types/danhMucChung";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetDanhMucChung,
  useGetDanhMucChungKPI,
  useDeleteDanhMucChung,
  useSyncDanhMucChung,
} from "./useDanhMucChungApi";

// Re-export các hook call API thuần để có thể gọi ở bất kỳ nơi nào
export * from "./useDanhMucChungApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEBOUNCE_DELAY = 400;

// Schema validate form bằng Zod
export const danhMucChungSchema = z.object({
  ten: z.string().trim().min(1, "Vui lòng nhập tên danh mục"),
  thuTu: z.number().min(0, "Thứ tự phải lớn hơn hoặc bằng 0"),
});

/**
 * Hook quản lý State phân trang, bộ lọc & thao tác danh sách của trang Danh mục dùng chung
 * (State Form Thêm/Sửa đã được cô lập hoàn toàn bên trong CreateDanhMucChungSlideOver & UpdateDanhMucChungSlideOver)
 */
export function useDanhMucChung() {
  const { confirm } = useConfirm();

  // Pagination & Filter state
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all"); // "all" | "active" | "inactive"

  // Search
  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  // API query params
  const filterParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    return {
      TuKhoa: searchTerm.trim(),
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, page, pageSize, statusFilter]);

  // Gọi các API hooks đã tách riêng
  const {
    data: dataDanhMucChung,
    isLoading,
    isFetching,
    refetch,
  } = useGetDanhMucChung(filterParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetDanhMucChungKPI();

  const deleteCategory = useDeleteDanhMucChung();
  const syncCategory = useSyncDanhMucChung();

  // Dữ liệu từ API trả về dạng { isSuccess, data: [...], recordsTotal, pagination: { page, pageSize, totalItems, totalPages } }
  const items: DM_DanhMucChung[] = useMemo(
    () => dataDanhMucChung?.data ?? [],
    [dataDanhMucChung],
  );
  const totalCount =
    dataDanhMucChung?.pagination?.totalItems ??
    dataDanhMucChung?.recordsTotal ??
    items.length;
  const totalPages = dataDanhMucChung?.pagination?.totalPages ?? 1;

  // Gợi ý thứ tự tiếp theo cho Modal Thêm mới
  const defaultThuTu = useMemo(() => {
    if (items.length === 0) return 1;
    const maxThuTu = Math.max(...items.map((i: DM_DanhMucChung) => i.thuTu ?? 0));
    return maxThuTu + 1;
  }, [items]);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };

  const handleDelete = async (row: DM_DanhMucChung) => {
    const isConfirmed = await confirm({
      title: "Xác nhận xóa danh mục dùng chung",
      variant: "danger",
      confirmText: "Xác nhận xóa",
      description: `Bạn có chắc chắn muốn xóa danh mục "${row.ten}" không? Toàn bộ danh mục con chi tiết có thể bị ảnh hưởng.`,
    });
    if (!isConfirmed) return;
    try {
      await deleteCategory.mutateAsync(row.danhMucID);
      toast.success("Xóa danh mục thành công");
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        "Không thể xóa danh mục (Có thể do có danh mục con hoặc dữ liệu ràng buộc)";
      toast.error(msg);
    }
  };

  const handleSync = async () => {
    try {
      await syncCategory.mutateAsync();
      toast.success("Đồng bộ danh mục thành công");
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đồng bộ thất bại";
      toast.error(msg);
    }
  };

  return {
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
    items,
    totalCount,
    totalPages,
    defaultThuTu,
    isLoading,
    isFetching,
    refetch,

    // KPI data
    kpiData,
    isLoadingKPI,
    refetchKPI,

    // Delete state & actions
    handleDelete,
    isDeleting: deleteCategory.isPending,

    // Sync
    handleSync,
    isSyncing: syncCategory.isPending,
  };
}
