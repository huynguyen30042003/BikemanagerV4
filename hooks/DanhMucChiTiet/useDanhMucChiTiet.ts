"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";

import {
  DM_DanhMucChiTiet,
  CreateDanhMucChiTietPayload,
  UpdateDanhMucChiTietPayload,
} from "@/types/danhMucChiTiet";
import { DM_DanhMucChung } from "@/types/danhMucChung";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetDanhMucChiTiet,
  useCreateDanhMucChiTiet,
  useUpdateDanhMucChiTiet,
  useDeleteDanhMucChiTiet,
  useSyncDanhMucChiTiet,
  useGetDanhMucChiTietKPI,
} from "./useDanhMucChiTietApi";
import { useGetDanhMucChung } from "../DanhMucChung/useDanhMucChungApi";

export * from "./useDanhMucChiTietApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEBOUNCE_DELAY = 400;

// Schema validate form bằng Zod
export const danhMucChiTietSchema = z.object({
  danhMucID: z.number().min(1, "Vui lòng chọn danh mục chung cha"),
  ten: z.string().trim().min(1, "Vui lòng nhập tên danh mục chi tiết"),
  thuTu: z.number().min(0, "Thứ tự phải lớn hơn hoặc bằng 0"),
});

/**
 * Hook quản lý toàn bộ State & UI của trang Danh mục chi tiết
 */
export function useDanhMucChiTiet(initialParentId?: string | number) {
  // Pagination & Filter state
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all"); // "all" | "active" | "inactive"
  const [parentCategoryFilter, setParentCategoryFilter] = useState<string | number>(
    initialParentId ?? ""
  ); // Lọc theo danh mục cha

  // Search
  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  // Modal / Drawer state
  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectDetailId, setSelectDetailId] = useState<number>(0);
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form Add State
  const [dataAdd, setDataAdd] = useState<CreateDanhMucChiTietPayload>({
    DanhMucID: 0,
    Ten: "",
    MoTa: "",
    ThuTu: 1,
    TrangThai: true,
  });

  // Form Update State
  const [dataUpdate, setDataUpdate] = useState<UpdateDanhMucChiTietPayload>({
    DanhMucChiTietID: 0,
    DanhMucID: 0,
    Ten: "",
    MoTa: "",
    ThuTu: 1,
    TrangThai: true,
  });

  // Lấy danh sách danh mục cha (danh mục chung) để chọn trong SearchSelect
  const { data: dataDanhMucChung, isLoading: isLoadingParent } = useGetDanhMucChung({
    PageIndex: 1,
    PageSize: 100,
  });

  const parentCategories: DM_DanhMucChung[] = useMemo(() => {
    return dataDanhMucChung?.data ?? dataDanhMucChung?.items ?? [];
  }, [dataDanhMucChung]);

  // Options dùng cho SearchSelect
  const parentCategoryOptions = useMemo(() => {
    return parentCategories.map((cat: DM_DanhMucChung) => ({
      value: cat.danhMucID,
      label: cat.ten,
    }));
  }, [parentCategories]);

  // Map ID danh mục cha sang tên để hiển thị trên bảng
  const parentCategoryMap = useMemo(() => {
    const map = new Map<number, string>();
    parentCategories.forEach((cat: DM_DanhMucChung) => {
      map.set(cat.danhMucID, cat.ten);
    });
    return map;
  }, [parentCategories]);

  // API query params
  const filterParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    const danhMucId =
      typeof parentCategoryFilter === "number"
        ? parentCategoryFilter
        : parentCategoryFilter !== ""
        ? Number(parentCategoryFilter)
        : null;

    return {
      DanhMucID: danhMucId,
      TuKhoa: searchTerm.trim(),
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, page, pageSize, statusFilter, parentCategoryFilter]);

  // Gọi các API hooks
  const {
    data: dataDanhMucChiTiet,
    isLoading,
    isFetching,
    refetch,
  } = useGetDanhMucChiTiet(filterParams);

  const createDetail = useCreateDanhMucChiTiet();
  const updateDetail = useUpdateDanhMucChiTiet();
  const deleteDetail = useDeleteDanhMucChiTiet();
  const syncDetail = useSyncDanhMucChiTiet();

  // Gọi API lấy dữ liệu KPI
  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetDanhMucChiTietKPI();

  // Reset pagination khi search
  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };

  // Mở modal thêm mới
  const handleModalAdd = () => {
    setDataAdd({
      DanhMucID:
        typeof parentCategoryFilter === "number"
          ? parentCategoryFilter
          : parentCategoryOptions.length > 0
          ? Number(parentCategoryOptions[0].value)
          : 0,
      Ten: "",
      MoTa: "",
      ThuTu: 1,
      TrangThai: true,
    });
    setErrors({});
    setOpen(true);
  };

  // Submit thêm mới
  const handleSubmit = async () => {
    const validation = danhMucChiTietSchema.safeParse({
      danhMucID: dataAdd.DanhMucID,
      ten: dataAdd.Ten,
      thuTu: dataAdd.ThuTu,
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        errMap[fieldName] = issue.message;
      });
      setErrors(errMap);
      toast.error(
        validation.error.issues[0]?.message || "Vui lòng kiểm tra lại thông tin"
      );
      return;
    }

    setErrors({});

    try {
      await createDetail.mutateAsync(dataAdd);
      toast.success("Thêm mới danh mục chi tiết thành công!");
      setOpen(false);
      refetch();
    } catch (error: unknown) {
      console.error("[Thêm danh mục chi tiết lỗi]", error);
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Thêm mới thất bại";
      toast.error(msg);
    }
  };

  // Mở modal chỉnh sửa
  const handleOpenEdit = (item: DM_DanhMucChiTiet) => {
    setDataUpdate({
      DanhMucChiTietID: item.danhMucChiTietID,
      DanhMucID: item.danhMucID,
      Ten: item.ten,
      MoTa: item.moTa || "",
      ThuTu: item.thuTu || 1,
      TrangThai: item.trangThai ?? true,
    });
    setErrors({});
    setOpenUpdate(true);
  };

  // Submit cập nhật
  const handleSubmitUpdate = async () => {
    const validation = danhMucChiTietSchema.safeParse({
      danhMucID: dataUpdate.DanhMucID,
      ten: dataUpdate.Ten,
      thuTu: dataUpdate.ThuTu,
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        errMap[fieldName] = issue.message;
      });
      setErrors(errMap);
      toast.error(
        validation.error.issues[0]?.message || "Vui lòng kiểm tra lại thông tin"
      );
      return;
    }

    setErrors({});

    try {
      await updateDetail.mutateAsync(dataUpdate);
      toast.success("Cập nhật danh mục chi tiết thành công!");
      setOpenUpdate(false);
      refetch();
    } catch (error: unknown) {
      console.error("[Cập nhật danh mục chi tiết lỗi]", error);
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Cập nhật thất bại";
      toast.error(msg);
    }
  };

  // Mở modal xóa
  const handleOpenDelete = (item: DM_DanhMucChiTiet) => {
    setSelectDetailId(item.danhMucChiTietID);
    setSelectItemName(item.ten);
    setOpenDelete(true);
  };

  // Submit xóa
  const handleSubmitDelete = async () => {
    if (!selectDetailId) return;

    try {
      await deleteDetail.mutateAsync(selectDetailId);
      toast.success(`Đã xóa "${selectItemName}" thành công!`);
      setOpenDelete(false);
      setSelectDetailId(0);
      setSelectItemName("");
      refetch();
    } catch (error: unknown) {
      console.error("[Xóa danh mục chi tiết lỗi]", error);
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Xóa thất bại";
      toast.error(msg);
    }
  };

  // Đồng bộ
  const handleSync = async () => {
    try {
      await syncDetail.mutateAsync();
      toast.success("Đồng bộ danh mục chi tiết thành công!");
      refetch();
    } catch (error: unknown) {
      console.error("[Đồng bộ danh mục chi tiết lỗi]", error);
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Đồng bộ thất bại";
      toast.error(msg);
    }
  };

  // Chuẩn hóa danh sách items
  const items: DM_DanhMucChiTiet[] = useMemo(() => {
    return dataDanhMucChiTiet?.data ?? dataDanhMucChiTiet?.items ?? [];
  }, [dataDanhMucChiTiet]);

  const totalCount: number =
    dataDanhMucChiTiet?.pagination?.totalItems ??
    dataDanhMucChiTiet?.totalCount ??
    dataDanhMucChiTiet?.recordsTotal ??
    items.length;

  const totalPages: number =
    dataDanhMucChiTiet?.pagination?.totalPages ??
    dataDanhMucChiTiet?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    // Pagination & Filter
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    parentCategoryFilter,
    setParentCategoryFilter,
    searchInput,
    handleSearch,

    // Parent category options
    parentCategories,
    parentCategoryOptions,
    parentCategoryMap,
    isLoadingParent,

    // Data
    dataDanhMucChiTiet,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    // KPI
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
    isCreating: createDetail.isPending,

    // Update state & actions
    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating: updateDetail.isPending,

    // Delete state & actions
    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting: deleteDetail.isPending,

    // Sync
    handleSync,
    isSyncing: syncDetail.isPending,

    // Validation
    errors,
  };
}
