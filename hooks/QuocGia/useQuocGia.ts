"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  DM_QuocGia,
  CreateQuocGiaPayload,
  UpdateQuocGiaPayload,
} from "@/types/quocGia";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetQuocGia,
  useCreateQuocGia,
  useUpdateQuocGia,
  useDeleteQuocGia,
  useSyncQuocGia,
} from "./useQuocGiaApi";

export * from "./useQuocGiaApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const quocGiaSchema = z.object({
  maQuocGia: z.string().trim().min(1, "Vui lòng nhập mã quốc gia (ISO/Alpha)"),
  ten: z.string().trim().min(1, "Vui lòng nhập tên quốc gia"),
  thuTu: z.number().min(0, "Thứ tự phải lớn hơn hoặc bằng 0"),
});

export function useQuocGia() {
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
  const [selectQuocGiaId, setSelectQuocGiaId] = useState<number>(0);
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [dataAdd, setDataAdd] = useState<CreateQuocGiaPayload>({
    MaQuocGia: "",
    Ten: "",
    TenKhongDau: "",
    ThuTu: 1,
    TrangThai: true,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateQuocGiaPayload>({
    QuocGiaID: 0,
    MaQuocGia: "",
    Ten: "",
    TenKhongDau: "",
    ThuTu: 1,
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
    data: dataQuocGia,
    isLoading,
    isFetching,
    refetch,
  } = useGetQuocGia(filterParams);

  const createMutation = useCreateQuocGia();
  const updateMutation = useUpdateQuocGia();
  const deleteMutation = useDeleteQuocGia();
  const syncMutation = useSyncQuocGia();

  const items: DM_QuocGia[] = useMemo(() => {
    return dataQuocGia?.data ?? dataQuocGia?.items ?? [];
  }, [dataQuocGia]);

  const totalCount: number =
    dataQuocGia?.pagination?.totalItems ??
    dataQuocGia?.totalCount ??
    dataQuocGia?.recordsTotal ??
    items.length;

  const totalPages: number =
    dataQuocGia?.pagination?.totalPages ??
    dataQuocGia?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };

  const handleModalAdd = () => {
    const currentMaxThuTu =
      items.length > 0 ? Math.max(...items.map((i) => i.thuTu ?? 0)) : 0;

    setDataAdd({
      MaQuocGia: "",
      Ten: "",
      TenKhongDau: "",
      ThuTu: currentMaxThuTu + 1,
      TrangThai: true,
    });
    setErrors({});
    setOpen(true);
  };

  const handleOpenEdit = (item: DM_QuocGia) => {
    setDataUpdate({
      QuocGiaID: item.quocGiaID,
      MaQuocGia: item.maQuocGia,
      Ten: item.ten,
      TenKhongDau: item.tenKhongDau || "",
      ThuTu: item.thuTu ?? 1,
      TrangThai: item.trangThai ?? true,
    });
    setErrors({});
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: DM_QuocGia) => {
    setSelectQuocGiaId(item.quocGiaID);
    setSelectItemName(item.ten);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    const validation = quocGiaSchema.safeParse({
      maQuocGia: dataAdd.MaQuocGia,
      ten: dataAdd.Ten,
      thuTu: dataAdd.ThuTu,
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
      toast.success("Thêm mới quốc gia thành công");
      setOpen(false);
      refetch();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Thêm quốc gia thất bại";
      toast.error(msg);
    }
  };

  const handleSubmitUpdate = async () => {
    const validation = quocGiaSchema.safeParse({
      maQuocGia: dataUpdate.MaQuocGia,
      ten: dataUpdate.Ten,
      thuTu: dataUpdate.ThuTu,
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
      toast.success("Cập nhật quốc gia thành công");
      setOpenUpdate(false);
      refetch();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Cập nhật quốc gia thất bại";
      toast.error(msg);
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectQuocGiaId) return;
    try {
      await deleteMutation.mutateAsync(selectQuocGiaId);
      toast.success(`Đã xóa "${selectItemName}" thành công`);
      setOpenDelete(false);
      refetch();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Không thể xóa quốc gia (có thể đang có dữ liệu liên kết)";
      toast.error(msg);
    }
  };

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync();
      toast.success("Đồng bộ danh mục quốc gia thành công");
      refetch();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Đồng bộ thất bại";
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

    open,
    setOpen,
    dataAdd,
    setDataAdd,
    handleModalAdd,
    handleSubmit,
    isCreating: createMutation.isPending,

    openUpdate,
    setOpenUpdate,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating: updateMutation.isPending,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting: deleteMutation.isPending,

    handleSync,
    isSyncing: syncMutation.isPending,

    errors,
  };
}
