"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { KHO_TonKho, UpdateDinhMucPayload } from "@/types/tonKho";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetTonKho,
  useUpdateDinhMucTonKho,
  useGetGiaoDichTonKho,
  useGetLoChiPhiTonKho,
} from "./useTonKhoApi";
import { useGetKho } from "../Kho/useKhoApi";

export * from "./useTonKhoApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEBOUNCE_DELAY = 400;

export function useTonKho(initialKhoId?: string) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [khoFilter, setKhoFilter] = useState<string>(initialKhoId || "");
  const [warningFilter, setWarningFilter] = useState<"all" | "low" | "out">(
    "all",
  );

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [openDinhMuc, setOpenDinhMuc] = useState<boolean>(false);
  const [openTheKho, setOpenTheKho] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<KHO_TonKho | null>(null);

  // Dropdown danh sách kho
  const { data: dataKhos, isLoading: isLoadingKhos } = useGetKho({
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const khoOptions = useMemo(() => {
    const list = dataKhos?.data ?? dataKhos?.items ?? [];
    return list.map((k: { khoID: string; tenKho: string; maKho: string }) => ({
      value: k.khoID,
      label: `${k.tenKho} [${k.maKho}]`,
    }));
  }, [dataKhos]);

  // Form cập nhật định mức
  const [dataDinhMuc, setDataDinhMuc] = useState<UpdateDinhMucPayload>({
    KhoID: "",
    BienTheSanPhamID: "",
    SoLuongToiThieu: 5,
    ViTriLuuTru: "",
  });

  const queryParams = useMemo(() => {
    return {
      KhoID: khoFilter || null,
      TuKhoa: searchTerm,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [khoFilter, searchTerm, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetTonKho(queryParams);

  const rawItems: KHO_TonKho[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  // Lọc thêm theo cảnh báo nếu chọn
  const items = useMemo(() => {
    if (warningFilter === "low") {
      return rawItems.filter(
        (i) =>
          i.soLuongToiThieu != null &&
          i.soLuongKhaDung <= i.soLuongToiThieu &&
          i.soLuongKhaDung > 0,
      );
    }
    if (warningFilter === "out") {
      return rawItems.filter((i) => i.soLuongKhaDung <= 0);
    }
    return rawItems;
  }, [rawItems, warningFilter]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;
  // Query thẻ kho nếu mở modal
  const { data: dataGiaoDichs, isLoading: isLoadingTheKho } =
    useGetGiaoDichTonKho({
      KhoID: selectedItem?.khoID || null,
      BienTheSanPhamID: selectedItem?.bienTheSanPhamID || null,
      PageIndex: 1,
      PageSize: 100,
    });

  const theKhoItems = useMemo(() => {
    return dataGiaoDichs?.data ?? dataGiaoDichs?.items ?? [];
  }, [dataGiaoDichs]);

  const updateDinhMucMutation = useUpdateDinhMucTonKho();

  const handleOpenDinhMuc = (item: KHO_TonKho) => {
    setSelectedItem(item);
    setDataDinhMuc({
      KhoID: item.khoID,
      BienTheSanPhamID: item.bienTheSanPhamID,
      SoLuongToiThieu: item.soLuongToiThieu ?? 5,
      ViTriLuuTru: item.viTriLuuTru || "",
    });
    setOpenDinhMuc(true);
  };

  const handleOpenTheKho = (item: KHO_TonKho) => {
    setSelectedItem(item);
    setOpenTheKho(true);
  };

  const handleSubmitDinhMuc = async (customPayload?: UpdateDinhMucPayload) => {
    try {
      await updateDinhMucMutation.mutateAsync(customPayload || dataDinhMuc);
      setOpenDinhMuc(false);
    } catch {
      // Toast handled
    }
  };

  const handleSearch = (val: string) => {
    setSearchInput(val);
    setPage(1);
  };

  const [activeTab, setActiveTab] = useState<
    "stock" | "costs" | "transactions"
  >("stock");

  // Query Lô chi phí tồn kho (KHO_LoChiPhiTonKho)
  const {
    data: dataLoChiPhis,
    isLoading: isLoadingLoChiPhis,
    refetch: refetchLoChiPhis,
  } = useGetLoChiPhiTonKho({
    KhoID: khoFilter || null,
    TuKhoa: searchTerm,
    PageIndex: page,
    PageSize: pageSize,
  });

  const loChiPhiItems = useMemo(() => {
    return dataLoChiPhis?.data ?? dataLoChiPhis?.items ?? [];
  }, [dataLoChiPhis]);

  const totalLoChiPhis = useMemo(() => {
    return (
      dataLoChiPhis?.totalItems ??
      dataLoChiPhis?.totalCount ??
      loChiPhiItems.length
    );
  }, [dataLoChiPhis, loChiPhiItems.length]);

  // Query Toàn bộ giao dịch thẻ kho (KHO_GiaoDichTonKho)
  const {
    data: dataAllGiaoDichs,
    isLoading: isLoadingAllGiaoDichs,
    refetch: refetchAllGiaoDichs,
  } = useGetGiaoDichTonKho({
    KhoID: khoFilter || null,
    PageIndex: page,
    PageSize: pageSize,
  });

  const allGiaoDichItems = useMemo(() => {
    return dataAllGiaoDichs?.data ?? dataAllGiaoDichs?.items ?? [];
  }, [dataAllGiaoDichs]);

  const totalAllGiaoDichs = useMemo(() => {
    return (
      dataAllGiaoDichs?.totalItems ??
      dataAllGiaoDichs?.totalCount ??
      allGiaoDichItems.length
    );
  }, [dataAllGiaoDichs, allGiaoDichItems.length]);

  return {
    activeTab,
    setActiveTab,
    page,
    setPage,
    pageSize,
    setPageSize,
    khoFilter,
    setKhoFilter,
    warningFilter,
    setWarningFilter,
    searchInput,
    handleSearch,

    khoOptions,
    isLoadingKhos,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    loChiPhiItems,
    totalLoChiPhis,
    isLoadingLoChiPhis,
    refetchLoChiPhis,

    allGiaoDichItems,
    totalAllGiaoDichs,
    isLoadingAllGiaoDichs,
    refetchAllGiaoDichs,

    openDinhMuc,
    setOpenDinhMuc,
    selectedItem,
    dataDinhMuc,
    setDataDinhMuc,
    handleOpenDinhMuc,
    handleSubmitDinhMuc,
    isUpdatingDinhMuc: updateDinhMucMutation.isPending,

    openTheKho,
    setOpenTheKho,
    theKhoItems,
    isLoadingTheKho,
    handleOpenTheKho,
  };
}
