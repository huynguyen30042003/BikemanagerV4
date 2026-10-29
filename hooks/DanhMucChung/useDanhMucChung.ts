"use client";

import { useConfirm } from "@/components/Common/ConfirmContext";
import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";

import {
  DM_DanhMucChung,
  CreateDanhMucChungPayload,
  UpdateDanhMucChungPayload,
} from "@/types/danhMucChung";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetDanhMucChung,
  useGetDanhMucChungKPI,
  useCreateDanhMucChung,
  useUpdateDanhMucChung,
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
 * Hook quản lý toàn bộ State & UI của trang Danh mục dùng chung
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

  // Modal / Drawer state
  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Add State
  const [dataAdd, setDataAdd] = useState<CreateDanhMucChungPayload>({
    Ten: "",
    MoTa: "",
    ThuTu: 1,
    TrangThai: true,
  });

  // Form Update State
  const [dataUpdate, setDataUpdate] = useState<UpdateDanhMucChungPayload>({
    DanhMucID: 0,
    Ten: "",
    MoTa: "",
    ThuTu: 1,
    TrangThai: true,
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

  const createCategory = useCreateDanhMucChung();
  const updateCategory = useUpdateDanhMucChung();
  const deleteCategory = useDeleteDanhMucChung();
  const syncCategory = useSyncDanhMucChung();

  // Dữ liệu từ API trả về dạng { isSuccess, data: [...], recordsTotal, pagination: { page, pageSize, totalItems, totalPages } }
  const items = dataDanhMucChung?.data ?? [];
  const totalCount =
    dataDanhMucChung?.pagination?.totalItems ??
    dataDanhMucChung?.recordsTotal ??
    items.length;
  const totalPages = dataDanhMucChung?.pagination?.totalPages ?? 1;

  // Handlers
  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };

  const handleModalAdd = () => {
    resetModalAdd();
    setOpen(true);
  };

  const resetModalAdd = () => {
    const currentItems = dataDanhMucChung?.data || [];
    const maxThuTu =
      currentItems.length > 0
        ? Math.max(...currentItems.map((i: DM_DanhMucChung) => i.thuTu ?? 0))
        : 0;

    setDataAdd({
      Ten: "",
      MoTa: "",
      ThuTu: maxThuTu + 1,
      TrangThai: true,
    });
    setErrors({});
  };

  const handleOpenEdit = (row: DM_DanhMucChung) => {
    setDataUpdate({
      DanhMucID: row.danhMucID,
      Ten: row.ten,
      MoTa: row.moTa || "",
      ThuTu: row.thuTu ?? 1,
      TrangThai: row.trangThai ?? true,
    });
    setErrors({});
    setOpenUpdate(true);
  };

  const handleSubmit = async () => {
    const result = danhMucChungSchema.safeParse({
      ten: dataAdd.Ten,
      thuTu: dataAdd.ThuTu,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          newErrors[String(field)] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await createCategory.mutateAsync(dataAdd);
      toast.success("Thêm danh mục thành công");
      setOpen(false);
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đã có lỗi xảy ra khi thêm danh mục";
      toast.error(msg);
    }
  };

  const handleSubmitUpdate = async () => {
    const result = danhMucChungSchema.safeParse({
      ten: dataUpdate.Ten,
      thuTu: dataUpdate.ThuTu,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) {
          newErrors[String(field)] = issue.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await updateCategory.mutateAsync(dataUpdate);
      toast.success("Cập nhật danh mục thành công");
      setOpenUpdate(false);
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Đã có lỗi xảy ra khi cập nhật danh mục";
      toast.error(msg);
    }
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
    isLoading,
    isFetching,
    refetch,

    // KPI data
    kpiData,
    isLoadingKPI,
    refetchKPI,

    // Add state & actions
    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmit,
    isCreating: createCategory.isPending,

    // Update state & actions
    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating: updateCategory.isPending,

    // Delete state & actions
    handleDelete,
    isDeleting: deleteCategory.isPending,

    // Sync
    handleSync,
    isSyncing: syncCategory.isPending,

    // Validation
    errors,
    setErrors,
  };
}
