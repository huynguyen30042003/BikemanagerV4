"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  DM_DiaPhuongCapXa,
  CreateDiaPhuongCapXaPayload,
  UpdateDiaPhuongCapXaPayload,
} from "@/types/diaPhuongCapXa";
import { DM_DiaPhuongCapTinh } from "@/types/diaPhuongCapTinh";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetDiaPhuongCapXa,
  useGetDiaPhuongCapXaKPI,
  useCreateDiaPhuongCapXa,
  useUpdateDiaPhuongCapXa,
  useDeleteDiaPhuongCapXa,
  useSyncDiaPhuongCapXa,
} from "./useDiaPhuongCapXaApi";
import { useGetDiaPhuongCapTinh } from "../DiaPhuongCapTinh/useDiaPhuongCapTinhApi";

export * from "./useDiaPhuongCapXaApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const diaPhuongCapXaSchema = z.object({
  tinhID: z.number().min(1, "Vui lòng chọn Tỉnh / Thành phố trực thuộc"),
  maXa: z.string().trim().min(1, "Vui lòng nhập mã xã / phường"),
  ten: z.string().trim().min(1, "Vui lòng nhập tên xã / phường"),
  loai: z.number().min(1, "Vui lòng chọn loại xã / phường"),
  thuTu: z.number().min(0, "Thứ tự phải lớn hơn hoặc bằng 0"),
});

export function useDiaPhuongCapXa(initialTinhId?: string | number) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tinhFilter, setTinhFilter] = useState<string | number>(initialTinhId ?? "");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectXaId, setSelectXaId] = useState<number>(0);
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [dataAdd, setDataAdd] = useState<CreateDiaPhuongCapXaPayload>({
    TinhID: 0,
    MaXa: "",
    Ten: "",
    TenKhongDau: "",
    Loai: 1,
    ThuTu: 1,
    TrangThai: true,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateDiaPhuongCapXaPayload>({
    XaID: 0,
    TinhID: 0,
    MaXa: "",
    Ten: "",
    TenKhongDau: "",
    Loai: 1,
    ThuTu: 1,
    TrangThai: true,
  });

  // Query danh sách tỉnh thành để hiển thị trong SearchSelect
  const { data: dataTinh, isLoading: isLoadingTinh } = useGetDiaPhuongCapTinh({
    PageIndex: 1,
    PageSize: 100,
  });

  const provinces: DM_DiaPhuongCapTinh[] = useMemo(() => {
    return dataTinh?.data ?? [];
  }, [dataTinh]);

  const provinceOptions = useMemo(() => {
    return provinces.map((p) => ({
      value: p.tinhID,
      label: p.ten,
    }));
  }, [provinces]);

  const provinceMap = useMemo(() => {
    const map = new Map<number, string>();
    provinces.forEach((p) => map.set(p.tinhID, p.ten));
    return map;
  }, [provinces]);

  const filterParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    const tinhId =
      typeof tinhFilter === "number"
        ? tinhFilter
        : tinhFilter !== ""
        ? Number(tinhFilter)
        : null;

    return {
      TinhID: tinhId,
      TuKhoa: searchTerm.trim(),
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, page, pageSize, statusFilter, tinhFilter]);

  const {
    data: dataDiaPhuongCapXa,
    isLoading,
    isFetching,
    refetch,
  } = useGetDiaPhuongCapXa(filterParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetDiaPhuongCapXaKPI();

  const createMutation = useCreateDiaPhuongCapXa();
  const updateMutation = useUpdateDiaPhuongCapXa();
  const deleteMutation = useDeleteDiaPhuongCapXa();
  const syncMutation = useSyncDiaPhuongCapXa();

  const items: DM_DiaPhuongCapXa[] = useMemo(() => {
    return dataDiaPhuongCapXa?.data ?? [];
  }, [dataDiaPhuongCapXa]);

  const totalCount: number =
    dataDiaPhuongCapXa?.pagination?.totalItems ?? items.length;

  const totalPages: number =
    dataDiaPhuongCapXa?.pagination?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setPage(DEFAULT_PAGE);
  };

  const handleModalAdd = () => {
    const defaultTinh =
      typeof tinhFilter === "number"
        ? tinhFilter
        : tinhFilter !== ""
        ? Number(tinhFilter)
        : provinceOptions[0]?.value ? Number(provinceOptions[0].value) : 0;

    setDataAdd({
      TinhID: defaultTinh,
      MaXa: "",
      Ten: "",
      TenKhongDau: "",
      Loai: 1,
      ThuTu: 1,
      TrangThai: true,
    });
    setErrors({});
    setOpen(true);
  };

  const handleOpenEdit = (item: DM_DiaPhuongCapXa) => {
    setDataUpdate({
      XaID: item.xaID,
      TinhID: item.tinhID,
      MaXa: item.maXa,
      Ten: item.ten,
      TenKhongDau: item.tenKhongDau || "",
      Loai: item.loai ?? 1,
      ThuTu: item.thuTu ?? 1,
      TrangThai: item.trangThai ?? true,
    });
    setErrors({});
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: DM_DiaPhuongCapXa) => {
    setSelectXaId(item.xaID);
    setSelectItemName(item.ten);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    const validation = diaPhuongCapXaSchema.safeParse({
      tinhID: dataAdd.TinhID,
      maXa: dataAdd.MaXa,
      ten: dataAdd.Ten,
      loai: dataAdd.Loai,
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
      toast.success("Thêm mới xã/phường thành công");
      setOpen(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Thêm mới xã/phường thất bại";
      toast.error(msg);
    }
  };

  const handleSubmitUpdate = async () => {
    const validation = diaPhuongCapXaSchema.safeParse({
      tinhID: dataUpdate.TinhID,
      maXa: dataUpdate.MaXa,
      ten: dataUpdate.Ten,
      loai: dataUpdate.Loai,
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
      toast.success("Cập nhật xã/phường thành công");
      setOpenUpdate(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Cập nhật xã/phường thất bại";
      toast.error(msg);
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectXaId) return;
    try {
      await deleteMutation.mutateAsync(selectXaId);
      toast.success(`Đã xóa "${selectItemName}" thành công`);
      setOpenDelete(false);
      refetch();
      refetchKPI();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Không thể xóa xã/phường (có thể đang liên kết với địa điểm showroom/khách hàng)";
      toast.error(msg);
    }
  };

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync();
      toast.success("Đồng bộ danh mục xã/phường thành công");
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
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    provinces,
    provinceOptions,
    provinceMap,
    isLoadingTinh,

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
