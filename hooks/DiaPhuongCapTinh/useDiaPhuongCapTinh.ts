"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  DM_DiaPhuongCapTinh,
  CreateDiaPhuongCapTinhPayload,
  UpdateDiaPhuongCapTinhPayload,
} from "@/types/diaPhuongCapTinh";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetDiaPhuongCapTinh,
  useGetDiaPhuongCapTinhKPI,
  useCreateDiaPhuongCapTinh,
  useUpdateDiaPhuongCapTinh,
  useDeleteDiaPhuongCapTinh,
  useSyncDiaPhuongCapTinh,
} from "./useDiaPhuongCapTinhApi";

export * from "./useDiaPhuongCapTinhApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const diaPhuongCapTinhSchema = z.object({
  maTinh: z.string().trim().min(1, "Vui lòng nhập mã tỉnh / thành phố"),
  ten: z.string().trim().min(1, "Vui lòng nhập tên tỉnh / thành phố"),
  thuTu: z.number().min(0, "Thứ tự phải lớn hơn hoặc bằng 0"),
  loai: z.number().min(1, "Vui lòng chọn loại địa phương"),
});

export function useDiaPhuongCapTinh() {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectTinhId, setSelectTinhId] = useState<number>(0);
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [dataAdd, setDataAdd] = useState<CreateDiaPhuongCapTinhPayload>({
    MaTinh: "",
    Ten: "",
    TenKhongDau: "",
    ThuTu: 1,
    Loai: 1,
    TrangThai: true,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateDiaPhuongCapTinhPayload>({
    TinhID: 0,
    MaTinh: "",
    Ten: "",
    TenKhongDau: "",
    ThuTu: 1,
    Loai: 1,
    TrangThai: true,
  });

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

  const {
    data: dataDiaPhuongCapTinh,
    isLoading,
    isFetching,
    refetch,
  } = useGetDiaPhuongCapTinh(filterParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetDiaPhuongCapTinhKPI();

  const createMutation = useCreateDiaPhuongCapTinh();
  const updateMutation = useUpdateDiaPhuongCapTinh();
  const deleteMutation = useDeleteDiaPhuongCapTinh();
  const syncMutation = useSyncDiaPhuongCapTinh();

  const items: DM_DiaPhuongCapTinh[] = useMemo(() => {
    return dataDiaPhuongCapTinh?.data ?? [];
  }, [dataDiaPhuongCapTinh]);

  const totalCount: number =
    dataDiaPhuongCapTinh?.pagination?.totalItems ?? items.length;

  const totalPages: number =
    dataDiaPhuongCapTinh?.pagination?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };

  const handleModalAdd = () => {
    setDataAdd({
      MaTinh: "",
      Ten: "",
      TenKhongDau: "",
      ThuTu: 1,
      Loai: 1,
      TrangThai: true,
    });
    setErrors({});
    setOpen(true);
  };

  const handleOpenEdit = (item: DM_DiaPhuongCapTinh) => {
    setDataUpdate({
      TinhID: item.tinhID,
      MaTinh: item.maTinh,
      Ten: item.ten,
      TenKhongDau: item.tenKhongDau || "",
      ThuTu: item.thuTu ?? 1,
      Loai: item.loai ?? 1,
      TrangThai: item.trangThai ?? true,
    });
    setErrors({});
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: DM_DiaPhuongCapTinh) => {
    setSelectTinhId(item.tinhID);
    setSelectItemName(item.ten);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    const validation = diaPhuongCapTinhSchema.safeParse({
      maTinh: dataAdd.MaTinh,
      ten: dataAdd.Ten,
      thuTu: dataAdd.ThuTu,
      loai: dataAdd.Loai,
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        errMap[String(issue.path[0])] = issue.message;
      });
      setErrors(errMap);
      toast.error("Vui lòng kiểm tra lại thông tin nhập");
      return;
    }

    setErrors({});
    try {
      await createMutation.mutateAsync(dataAdd);
      toast.success("Thêm mới tỉnh/thành phố thành công");
      setOpen(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Thêm tỉnh/thành phố thất bại";
      toast.error(msg);
    }
  };

  const handleSubmitUpdate = async () => {
    const validation = diaPhuongCapTinhSchema.safeParse({
      maTinh: dataUpdate.MaTinh,
      ten: dataUpdate.Ten,
      thuTu: dataUpdate.ThuTu,
      loai: dataUpdate.Loai,
    });

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        errMap[String(issue.path[0])] = issue.message;
      });
      setErrors(errMap);
      toast.error("Vui lòng kiểm tra lại thông tin nhập");
      return;
    }

    setErrors({});
    try {
      await updateMutation.mutateAsync(dataUpdate);
      toast.success("Cập nhật tỉnh/thành phố thành công");
      setOpenUpdate(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Cập nhật tỉnh/thành phố thất bại";
      toast.error(msg);
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectTinhId) return;
    try {
      await deleteMutation.mutateAsync(selectTinhId);
      toast.success(`Đã xóa "${selectItemName}" thành công`);
      setOpenDelete(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Không thể xóa tỉnh/thành phố (có thể đang có xã/phường phụ thuộc)";
      toast.error(msg);
    }
  };

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync();
      toast.success("Đồng bộ danh mục tỉnh/thành phố thành công");
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Đồng bộ thất bại";
      toast.error(msg);
    }
  };

  return {
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

    // KPI data
    kpiData,
    isLoadingKPI,
    refetchKPI,

    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmit,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSyncing: syncMutation.isPending,

    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,

    handleSync,

    errors,
  };
}
