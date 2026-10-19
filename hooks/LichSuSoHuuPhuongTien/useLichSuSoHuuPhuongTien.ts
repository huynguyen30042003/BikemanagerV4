"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  KH_LichSuSoHuuPhuongTien,
  ChuyenQuyenSoHuuPayload,
} from "@/types/lichSuSoHuuPhuongTien";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetLichSuSoHuu,
  useChuyenQuyenSoHuu,
} from "./useLichSuSoHuuPhuongTienApi";
import { useGetPhuongTienKhachHang } from "../PhuongTienKhachHang/usePhuongTienKhachHangApi";
import { useGetKhachHang } from "../KhachHang/useKhachHangApi";

export * from "./useLichSuSoHuuPhuongTienApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const DEBOUNCE_DELAY = 400;

export const chuyenQuyenSchema = z.object({
  phuongTienKhachHangID: z.string().min(1, "Vui lòng chọn xe cần chuyển quyền"),
  khachHangMoiID: z.string().min(1, "Vui lòng chọn chủ sở hữu mới"),
  lyDo: z.string().min(1, "Vui lòng chọn lý do chuyển quyền"),
});

export function useLichSuSoHuuPhuongTien(initialPhuongTienId?: string, initialKhachHangId?: string) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [lyDoFilter, setLyDoFilter] = useState<string>("all");
  const [vehicleFilter, setVehicleFilter] = useState<string>(initialPhuongTienId ?? "");
  const [customerFilter, setCustomerFilter] = useState<string>(initialKhachHangId ?? "");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [openTransfer, setOpenTransfer] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form chuyển quyền sở hữu
  const [dataTransfer, setDataTransfer] = useState<ChuyenQuyenSoHuuPayload>({
    PhuongTienKhachHangID: initialPhuongTienId ?? "",
    KhachHangMoiID: "",
    DonHangID: null,
    LyDo: "SangTen",
    GhiChu: "",
  });

  // Query xe cho dropdown
  const { data: dataVehicles, isLoading: isLoadingVehicles } = useGetPhuongTienKhachHang({
    PageIndex: 1,
    PageSize: 100,
    TrangThai: true,
  });

  const vehicleOptions = useMemo(() => {
    const list = dataVehicles?.data ?? dataVehicles?.items ?? [];
    return list.map((v: { id: string; tenModel: string; bienSo: string }) => ({
      value: v.id,
      label: `${v.tenModel} [${v.bienSo || "Chưa biển"}]`,
    }));
  }, [dataVehicles]);

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

  const queryParams = useMemo(() => {
    return {
      PhuongTienKhachHangID: vehicleFilter || undefined,
      KhachHangID: customerFilter || undefined,
      TuKhoa: searchTerm,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [vehicleFilter, customerFilter, searchTerm, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetLichSuSoHuu(queryParams);

  const rawItems: KH_LichSuSoHuuPhuongTien[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const items = useMemo(() => {
    if (lyDoFilter === "all") return rawItems;
    return rawItems.filter((i) => i.lyDo === lyDoFilter);
  }, [rawItems, lyDoFilter]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const transferMutation = useChuyenQuyenSoHuu();

  const handleOpenTransfer = (preselectedVehicleId?: string) => {
    setErrors({});
    setDataTransfer({
      PhuongTienKhachHangID: preselectedVehicleId || vehicleFilter || "",
      KhachHangMoiID: "",
      DonHangID: null,
      LyDo: "SangTen",
      GhiChu: "",
    });
    setOpenTransfer(true);
  };

  const handleSubmitTransfer = async () => {
    try {
      chuyenQuyenSchema.parse({
        phuongTienKhachHangID: dataTransfer.PhuongTienKhachHangID,
        khachHangMoiID: dataTransfer.KhachHangMoiID,
        lyDo: dataTransfer.LyDo,
      });

      setErrors({});
      await transferMutation.mutateAsync(dataTransfer);
      setOpenTransfer(false);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Vui lòng nhập đầy đủ thông tin chuyển quyền!");
      }
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
    lyDoFilter,
    setLyDoFilter,
    vehicleFilter,
    setVehicleFilter,
    customerFilter,
    setCustomerFilter,
    searchInput,
    handleSearch,

    vehicleOptions,
    isLoadingVehicles,
    customerOptions,
    isLoadingCustomers,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openTransfer,
    setOpenTransfer,
    dataTransfer,
    setDataTransfer,
    handleOpenTransfer,
    handleSubmitTransfer,
    isTransferring: transferMutation.isPending,

    errors,
  };
}
