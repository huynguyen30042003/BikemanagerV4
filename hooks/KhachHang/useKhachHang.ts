"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { KH_KhachHang } from "@/types/khachHang";
import { DM_DiaPhuongCapTinh } from "@/types/diaPhuongCapTinh";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetKhachHang,
  useGetKhachHangKPI,
  useDeleteKhachHang,
} from "./useKhachHangApi";
import { useGetDiaPhuongCapTinh } from "../DiaPhuongCapTinh/useDiaPhuongCapTinhApi";

export * from "./useKhachHangApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 5;
export const DEBOUNCE_DELAY = 400;

export const khachHangSchema = z.object({
  tenKhachHang: z.string().trim().min(1, "Vui lòng nhập tên khách hàng"),
  dienThoai: z
    .string()
    .trim()
    .min(9, "Số điện thoại tối thiểu 9 số")
    .max(15, "Số điện thoại tối đa 15 số"),
  loaiKhachHang: z.number().min(1).max(2),
});

export function useKhachHang(initialTinhId?: string | number) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loaiFilter, setLoaiFilter] = useState<string>("all"); // "all" | "1" | "2"
  const [tinhFilter, setTinhFilter] = useState<string | number>(
    initialTinhId ?? "",
  );

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  // Delete modal state
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectKhachHangId, setSelectKhachHangId] = useState<string>("");
  const [selectItemName, setSelectItemName] = useState<string>("");

  // Query danh sách tỉnh/thành phố
  const { data: dataTinh, isLoading: isLoadingTinh } = useGetDiaPhuongCapTinh({
    PageIndex: 1,
    PageSize: 100,
  });

  const provinceOptions = useMemo(() => {
    const provinces: DM_DiaPhuongCapTinh[] = dataTinh?.data ?? [];
    return provinces.map((p) => ({
      value: p.tinhID,
      label: p.ten,
    }));
  }, [dataTinh]);

  // Params query khách hàng
  const queryParams = useMemo(() => {
    let trangThai: boolean | null = null;
    if (statusFilter === "active") trangThai = true;
    if (statusFilter === "inactive") trangThai = false;

    let loaiKH: number | null = null;
    if (loaiFilter === "1") loaiKH = 1;
    if (loaiFilter === "2") loaiKH = 2;

    return {
      TuKhoa: searchTerm.trim(),
      TinhID: tinhFilter ? Number(tinhFilter) : null,
      LoaiKhachHang: loaiKH,
      PageIndex: page,
      PageSize: pageSize,
      TrangThai: trangThai,
    };
  }, [searchTerm, tinhFilter, loaiFilter, page, pageSize, statusFilter]);

  const { data, isLoading, isFetching, refetch } = useGetKhachHang(queryParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetKhachHangKPI();

  const items: KH_KhachHang[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

  const totalCount = data?.pagination?.totalItems ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const deleteMutation = useDeleteKhachHang();

  const handleOpenDelete = (item: KH_KhachHang) => {
    setSelectKhachHangId(item.khachHangID);
    setSelectItemName(item.tenKhachHang);
    setOpenDelete(true);
  };

  const handleSubmitDelete = async () => {
    if (!selectKhachHangId) return;
    try {
      await deleteMutation.mutateAsync(selectKhachHangId);
      setOpenDelete(false);
    } catch {
      // Toast được xử lý trong useDeleteKhachHang
    }
  };

  const handleSearch = (val: string) => {
    setSearchInput(val);
    setPage(DEFAULT_PAGE);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    statusFilter,
    setStatusFilter,
    loaiFilter,
    setLoaiFilter,
    tinhFilter,
    setTinhFilter,
    searchInput,
    handleSearch,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    kpiData,
    isLoadingKPI,
    refetchKPI,

    provinceOptions,
    isLoadingTinh,

    openDelete,
    setOpenDelete,
    selectItemName,
    handleOpenDelete,
    handleSubmitDelete,
    isDeleting: deleteMutation.isPending,
  };
}
