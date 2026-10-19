"use client";

import { useState, useMemo } from "react";
import {
  KH_ThongKeKhachHang,
  UpdateThongKeKhachHangPayload,
} from "@/types/thongKeKhachHang";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetThongKeKhachHang,
  useUpdateThongKeKhachHang,
} from "./useThongKeKhachHangApi";

export * from "./useThongKeKhachHangApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export function useThongKeKhachHang() {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [tierFilter, setTierFilter] = useState<string>("all"); // "all", "BinhThuong", "Bac", "Vang", "KimCuong"

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<KH_ThongKeKhachHang | null>(null);

  const [dataUpdate, setDataUpdate] = useState<UpdateThongKeKhachHangPayload>({
    KhachHangID: "",
    HangKhachHang: "BinhThuong",
    TyLeGiamGia: 0,
    DiemTichLuy: 0,
    CongNoHienTai: 0,
  });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchTerm,
      HangKhachHang: tierFilter === "all" ? undefined : tierFilter,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchTerm, tierFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetThongKeKhachHang(queryParams);

  const items: KH_ThongKeKhachHang[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const updateMutation = useUpdateThongKeKhachHang();

  const handleOpenEdit = (item: KH_ThongKeKhachHang) => {
    setSelectedItem(item);
    setDataUpdate({
      KhachHangID: item.khachHangID,
      HangKhachHang: item.hangKhachHang || "BinhThuong",
      TyLeGiamGia: item.tyLeGiamGia || 0,
      DiemTichLuy: item.diemTichLuy || 0,
      CongNoHienTai: item.congNoHienTai || 0,
    });
    setOpenUpdate(true);
  };

  const handleSubmitUpdate = async () => {
    try {
      await updateMutation.mutateAsync(dataUpdate);
      setOpenUpdate(false);
    } catch {
      // Handled by toast
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
    tierFilter,
    setTierFilter,
    searchInput,
    handleSearch,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openUpdate,
    setOpenUpdate,
    selectedItem,
    dataUpdate,
    setDataUpdate,
    handleOpenEdit,
    handleSubmitUpdate,
    isUpdating: updateMutation.isPending,
  };
}
