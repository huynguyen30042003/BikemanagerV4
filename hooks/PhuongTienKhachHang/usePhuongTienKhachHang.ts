"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  KH_PhuongTienKhachHang,
  CreatePhuongTienPayload,
  UpdatePhuongTienPayload,
} from "@/types/phuongTienKhachHang";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetPhuongTienKhachHang,
  useCreatePhuongTien,
  useUpdatePhuongTien,
  useDeletePhuongTien,
} from "./usePhuongTienKhachHangApi";
import { useGetKhachHang } from "../KhachHang/useKhachHangApi";

export * from "./usePhuongTienKhachHangApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const phuongTienSchema = z.object({
  khachHangID: z.string().min(1, "Vui lòng chọn khách hàng sở hữu"),
  tenModel: z.string().trim().min(1, "Vui lòng nhập tên model xe"),
  bienSo: z.string().trim().min(1, "Vui lòng nhập biển số xe"),
});

export function usePhuongTienKhachHang(initialKhachHangId?: string) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [khachHangFilter, setKhachHangFilter] = useState<string>(initialKhachHangId ?? "");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectPhuongTienId, setSelectPhuongTienId] = useState<string>("");
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query khách hàng cho dropdown
  const { data: dataCustomers, isLoading: isLoadingCustomers } = useGetKhachHang({
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const customerOptions = useMemo(() => {
    const list = dataCustomers?.data ?? dataCustomers?.items ?? [];
    return list.map((c: { khachHangID: string; tenKhachHang: string; dienThoai: string }) => ({
      value: c.khachHangID,
      label: `${c.tenKhachHang} - ${c.dienThoai}`,
    }));
  }, [dataCustomers]);

  // Form states
  const [dataAdd, setDataAdd] = useState<CreatePhuongTienPayload>({
    KhachHangID: initialKhachHangId ?? "",
    ThuongHieuID: null,
    TenModel: "",
    BienSo: "",
    SoKhung: "",
    SoMay: "",
    SoPin: "",
    MauSac: "",
    SoKmHienTai: 0,
    NgayMua: "",
    GhiChu: "",
    TrangThai: true,
  });

  const [dataUpdate, setDataUpdate] = useState<UpdatePhuongTienPayload>({
    ID: "",
    KhachHangID: "",
    ThuongHieuID: null,
    TenModel: "",
    BienSo: "",
    SoKhung: "",
    SoMay: "",
    SoPin: "",
    MauSac: "",
    SoKmHienTai: 0,
    NgayMua: "",
    GhiChu: "",
    TrangThai: true,
  });

  const queryParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    return {
      KhachHangID: khachHangFilter || undefined,
      TuKhoa: searchTerm,
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [khachHangFilter, searchTerm, page, pageSize, statusFilter]);

  const { data, isLoading, isFetching, refetch } = useGetPhuongTienKhachHang(queryParams);

  const items: KH_PhuongTienKhachHang[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreatePhuongTien();
  const updateMutation = useUpdatePhuongTien();
  const deleteMutation = useDeletePhuongTien();

  const handleModalAdd = () => {
    setErrors({});
    setDataAdd({
      KhachHangID: khachHangFilter || "",
      ThuongHieuID: null,
      TenModel: "",
      BienSo: "",
      SoKhung: "",
      SoMay: "",
      SoPin: "",
      MauSac: "",
      SoKmHienTai: 0,
      NgayMua: "",
      GhiChu: "",
      TrangThai: true,
    });
    setOpen(true);
  };

  const handleOpenEdit = (item: KH_PhuongTienKhachHang) => {
    setErrors({});
    setDataUpdate({
      ID: item.id,
      KhachHangID: item.khachHangID,
      ThuongHieuID: item.thuongHieuID || null,
      TenModel: item.tenModel,
      BienSo: item.bienSo,
      SoKhung: item.soKhung || "",
      SoMay: item.soMay || "",
      SoPin: item.soPin || "",
      MauSac: item.mauSac || "",
      SoKmHienTai: item.soKmHienTai || 0,
      NgayMua: item.ngayMua ? item.ngayMua.substring(0, 10) : "",
      GhiChu: item.ghiChu || "",
      TrangThai: item.trangThai,
    });
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: KH_PhuongTienKhachHang) => {
    setSelectPhuongTienId(item.id);
    setSelectItemName(`${item.tenModel} (${item.bienSo})`);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    try {
      phuongTienSchema.parse({
        khachHangID: dataAdd.KhachHangID,
        tenModel: dataAdd.TenModel,
        bienSo: dataAdd.BienSo,
      });

      setErrors({});
      await createMutation.mutateAsync(dataAdd);
      setOpen(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng nhập đầy đủ thông tin phương tiện!");
      }
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      phuongTienSchema.parse({
        khachHangID: dataUpdate.KhachHangID,
        tenModel: dataUpdate.TenModel,
        bienSo: dataUpdate.BienSo,
      });

      setErrors({});
      await updateMutation.mutateAsync(dataUpdate);
      setOpenUpdate(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng kiểm tra lại thông tin phương tiện!");
      }
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectPhuongTienId) return;
    try {
      await deleteMutation.mutateAsync(selectPhuongTienId);
      setOpenDelete(false);
    } catch {
      // Toast handled
    }
  };

  const handleSearch = (val: string) => {
    setSearchInput(val);
    setPage(1);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    khachHangFilter,
    setKhachHangFilter,
    searchInput,
    handleSearch,

    customerOptions,
    isLoadingCustomers,

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

    errors,
  };
}
