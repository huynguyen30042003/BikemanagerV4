"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useConfirm } from "@/components/Common/ConfirmContext";
import {
  KH_PhuongTienKhachHang,
  CreatePhuongTienPayload,
  UpdatePhuongTienPayload,
} from "@/types/phuongTienKhachHang";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetPhuongTienKhachHang,
  useGetPhuongTienKhachHangKPI,
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
  const { confirm } = useConfirm();
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [khachHangFilter, setKhachHangFilter] = useState<string>(
    initialKhachHangId ?? "",
  );

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query khách hàng cho dropdown
  const { data: dataCustomers, isLoading: isLoadingCustomers } =
    useGetKhachHang({
      PageIndex: 1,
      PageSize: 100,
      TrangThai: true,
    });

  const customerOptions = useMemo(() => {
    const list = dataCustomers?.data ?? dataCustomers?.items ?? [];
    return list.map(
      (c: {
        khachHangID: string;
        tenKhachHang: string;
        dienThoai: string;
      }) => ({
        value: c.khachHangID,
        label: `${c.tenKhachHang} - ${c.dienThoai}`,
      }),
    );
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

  const { data, isLoading, isFetching, refetch } =
    useGetPhuongTienKhachHang(queryParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetPhuongTienKhachHangKPI();

  const items: KH_PhuongTienKhachHang[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

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

  const handleDelete = async (item: KH_PhuongTienKhachHang) => {
    const isConfirmed = await confirm({
      title: "Xác nhận xóa phương tiện khách hàng",
      variant: "danger",
      confirmText: "Xác nhận xóa",
      description: `Bạn có chắc chắn muốn xóa phương tiện "${item.tenModel} (${item.bienSo})" không? Hành động này sẽ xóa toàn bộ thông số và lịch sử của xe trong hệ thống.`,
    });
    if (!isConfirmed) return;
    try {
      await deleteMutation.mutateAsync(item.id);
      refetchKPI();
    } catch {
      // Toast notification is handled inside useDeletePhuongTien
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

    handleDelete,
    isDeleting: deleteMutation.isPending,

    errors,
  };
}
