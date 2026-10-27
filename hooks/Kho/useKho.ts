"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { KHO_Kho, CreateKhoPayload, UpdateKhoPayload } from "@/types/kho";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetKho,
  useCreateKho,
  useUpdateKho,
  useDeleteKho,
} from "./useKhoApi";
import { useGetDiaDiem } from "../DiaDiem/useDiaDiemApi";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useDanhMucChiTietLookup } from "../DanhMucChiTiet/useDanhMucChiTietLookup";

export * from "./useKhoApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEBOUNCE_DELAY = 400;

export const khoSchema = z.object({
  maKho: z.string().trim().min(1, "Vui lòng nhập mã kho hàng"),
  tenKho: z.string().trim().min(1, "Vui lòng nhập tên kho hàng"),
});

/**
 * Fallback danh sách loại kho khi chưa load xong API
 */
export const LOAI_KHO_OPTIONS = [
  { value: 17, label: "Kho tổng trung tâm" },
  { value: 18, label: "Kho showroom bán lẻ" },
  { value: 19, label: "Kho phụ tùng & đồ nghề" },
  { value: 20, label: "Kho xe cũ & đổi trả" },
  { value: 21, label: "Kho bảo hành & lỗi chờ xử lý" },
];

export function useKho() {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Lấy danh mục loại kho động từ DM_DanhMucChiTiet (DanhMucID = 5)
  const {
    options: loaiKhoOptions,
    getLabel: getLoaiKhoLabel,
    getBadge: getLoaiKhoBadge,
    isLoading: isLoadingLoaiKho,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.LOAI_KHO_HANG);

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectKhoId, setSelectKhoId] = useState<string>("");
  const [selectItemName, setSelectItemName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query Địa điểm / Showroom cho dropdown
  const { data: dataLocations, isLoading: isLoadingLocations } = useGetDiaDiem({
    PageIndex: 1,
    PageSize: 100,
  });

  const locationOptions = useMemo(() => {
    const list = dataLocations?.data ?? dataLocations?.items ?? [];
    return list.map((loc: { diaDiemID: string; tenDiaDiem: string }) => ({
      value: loc.diaDiemID,
      label: loc.tenDiaDiem,
    }));
  }, [dataLocations]);

  // Form states
  const [dataAdd, setDataAdd] = useState<CreateKhoPayload>({
    MaKho: "",
    TenKho: "",
    DiaDiemID: null,
    LoaiKhoID: 1,
    DiaChi: "",
    DienThoai: "",
    LaKhoMacDinh: false,
    ChoPhepTonAm: false,
    TrangThai: true,
    GhiChu: "",
  });

  const [dataUpdate, setDataUpdate] = useState<UpdateKhoPayload>({
    KhoID: "",
    MaKho: "",
    TenKho: "",
    DiaDiemID: null,
    LoaiKhoID: 1,
    DiaChi: "",
    DienThoai: "",
    LaKhoMacDinh: false,
    ChoPhepTonAm: false,
    TrangThai: true,
    GhiChu: "",
  });

  const queryParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    return {
      TuKhoa: searchTerm,
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, page, pageSize, statusFilter]);

  const { data, isLoading, isFetching, refetch } = useGetKho(queryParams);

  const items: KHO_Kho[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createMutation = useCreateKho();
  const updateMutation = useUpdateKho();
  const deleteMutation = useDeleteKho();

  const handleModalAdd = () => {
    setErrors({});
    setDataAdd({
      MaKho: "",
      TenKho: "",
      DiaDiemID: null,
      LoaiKhoID: 1,
      DiaChi: "",
      DienThoai: "",
      LaKhoMacDinh: false,
      ChoPhepTonAm: false,
      TrangThai: true,
      GhiChu: "",
    });
    setOpen(true);
  };

  const handleOpenEdit = (item: KHO_Kho) => {
    setErrors({});
    setDataUpdate({
      KhoID: item.khoID,
      MaKho: item.maKho,
      TenKho: item.tenKho,
      DiaDiemID: item.diaDiemID || null,
      LoaiKhoID: item.loaiKhoID || 1,
      DiaChi: item.diaChi || "",
      DienThoai: item.dienThoai || "",
      LaKhoMacDinh: item.laKhoMacDinh,
      ChoPhepTonAm: item.choPhepTonAm,
      TrangThai: item.trangThai,
      GhiChu: item.ghiChu || "",
    });
    setOpenUpdate(true);
  };

  const handleOpenDelete = (item: KHO_Kho) => {
    setSelectKhoId(item.khoID);
    setSelectItemName(item.tenKho);
    setOpenDelete(true);
  };

  const handleSubmit = async () => {
    try {
      khoSchema.parse({
        maKho: dataAdd.MaKho,
        tenKho: dataAdd.TenKho,
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
        toast.error("Vui lòng điền đủ thông tin bắt buộc!");
      }
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      khoSchema.parse({
        maKho: dataUpdate.MaKho,
        tenKho: dataUpdate.TenKho,
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
        toast.error("Vui lòng kiểm tra lại thông tin kho hàng!");
      }
    }
  };

  const handleSubmitDelete = async () => {
    if (!selectKhoId) return;
    try {
      await deleteMutation.mutateAsync(selectKhoId);
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
    searchInput,
    handleSearch,

    locationOptions,
    isLoadingLocations,

    loaiKhoOptions,
    getLoaiKhoLabel,
    getLoaiKhoBadge,
    isLoadingLoaiKho,

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
