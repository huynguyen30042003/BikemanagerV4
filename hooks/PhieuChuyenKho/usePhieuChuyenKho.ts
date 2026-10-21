"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  KHO_PhieuChuyenKho,
  CreatePhieuChuyenPayload,
  XuatKhoPayload,
  NhanHangPayload,
  HuyPhieuChuyenPayload,
} from "@/types/phieuChuyenKho";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetPhieuChuyenKho,
  useCreatePhieuChuyenKho,
  useXuatKhoChuyenKho,
  useNhanHangChuyenKho,
  useHuyPhieuChuyenKho,
} from "./usePhieuChuyenKhoApi";
import { useGetKho } from "../Kho/useKhoApi";
import { useGetBienTheSanPham } from "../BienTheSanPham/useBienTheSanPhamApi";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useDanhMucChiTietLookup } from "../DanhMucChiTiet/useDanhMucChiTietLookup";

export * from "./usePhieuChuyenKhoApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEBOUNCE_DELAY = 400;

/**
 * Fallback map cho trạng thái chuyển kho khi chưa load kịp dữ liệu từ API
 */
export const STATUS_TRANSFER_MAP: Record<number, { label: string; color: string }> = {
  22: { label: "Chờ xuất kho", color: "amber" },
  23: { label: "Đang vận chuyển", color: "blue" },
  24: { label: "Đã nhận hàng", color: "emerald" },
  25: { label: "Đã hủy", color: "rose" },
  // Backward compatibility
  1: { label: "Chờ xuất kho", color: "amber" },
  2: { label: "Đang vận chuyển", color: "blue" },
  3: { label: "Đã nhận hàng", color: "emerald" },
  4: { label: "Đã hủy", color: "rose" },
};

export const STATUS_TRANSFER_OPTIONS = [
  { value: 22, label: "Chờ xuất kho" },
  { value: 23, label: "Đang vận chuyển" },
  { value: 24, label: "Đã nhận hàng" },
  { value: 25, label: "Đã hủy" },
];

export function usePhieuChuyenKho() {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // Lấy danh mục trạng thái động từ DM_DanhMucChiTiet (DanhMucID = 6)
  const {
    options: transferStatusOptions,
    getBadge: getTransferStatusBadge,
    getLabel: getTransferStatusLabel,
    isLoading: isLoadingStatusList,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_CHUYEN_KHO);
  const [khoFilter, setKhoFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [selectedPhieu, setSelectedPhieu] = useState<KHO_PhieuChuyenKho | null>(null);

  // Dropdown kho
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

  // Dropdown biến thể
  const { data: dataVariants, isLoading: isLoadingVariants } = useGetBienTheSanPham({
    PageIndex: 1,
    PageSize: 100,
  });

  const variantOptions = useMemo(() => {
    const list = dataVariants?.data ?? dataVariants?.items ?? [];
    return list.map((v: { bienTheSanPhamID: string; tenBienThe: string; maSKU: string }) => ({
      value: v.bienTheSanPhamID,
      label: `${v.tenBienThe} [${v.maSKU}]`,
    }));
  }, [dataVariants]);

  // Form tạo phiếu mới
  const [dataCreate, setDataCreate] = useState<CreatePhieuChuyenPayload>({
    KhoXuatID: "",
    KhoNhapID: "",
    NguoiGiaoHang: "",
    BienSoXeVanChuyen: "",
    GhiChu: "",
    ChiTiets: [
      {
        BienTheSanPhamID: "",
        SoLuongChuyen: 1,
        DonGiaVon: 0,
        GhiChu: "",
      },
    ],
  });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchTerm,
      KhoID: khoFilter || null,
      TrangThaiID: statusFilter,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchTerm, khoFilter, statusFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetPhieuChuyenKho(queryParams);

  const items: KHO_PhieuChuyenKho[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreatePhieuChuyenKho();
  const xuatKhoMutation = useXuatKhoChuyenKho();
  const nhanHangMutation = useNhanHangChuyenKho();
  const huyMutation = useHuyPhieuChuyenKho();

  const handleOpenCreate = () => {
    setDataCreate({
      KhoXuatID: "",
      KhoNhapID: "",
      NguoiGiaoHang: "",
      BienSoXeVanChuyen: "",
      GhiChu: "",
      ChiTiets: [
        {
          BienTheSanPhamID: "",
          SoLuongChuyen: 1,
          DonGiaVon: 0,
          GhiChu: "",
        },
      ],
    });
    setOpenCreate(true);
  };

  const handleOpenDetail = (phieu: KHO_PhieuChuyenKho) => {
    setSelectedPhieu(phieu);
    setOpenDetail(true);
  };

  const handleAddDetailRow = () => {
    setDataCreate((prev) => ({
      ...prev,
      ChiTiets: [
        ...prev.ChiTiets,
        {
          BienTheSanPhamID: "",
          SoLuongChuyen: 1,
          DonGiaVon: 0,
          GhiChu: "",
        },
      ],
    }));
  };

  const handleRemoveDetailRow = (index: number) => {
    setDataCreate((prev) => ({
      ...prev,
      ChiTiets: prev.ChiTiets.filter((_, i) => i !== index),
    }));
  };

  const handleSubmitCreate = async (payload?: CreatePhieuChuyenPayload) => {
    const data = payload || dataCreate;
    if (!data.KhoXuatID || !data.KhoNhapID) {
      toast.error("Vui lòng chọn cả kho xuất và kho nhập!");
      return;
    }
    if (data.KhoXuatID === data.KhoNhapID) {
      toast.error("Kho xuất và kho nhập không được trùng nhau!");
      return;
    }
    const validChiTiets = (data.ChiTiets || []).filter(
      (c) => c.BienTheSanPhamID && c.SoLuongChuyen > 0
    );
    if (validChiTiets.length === 0) {
      toast.error("Vui lòng thêm ít nhất 1 sản phẩm với số lượng chuyển hợp lệ!");
      return;
    }

    try {
      await createMutation.mutateAsync({
        ...data,
        ChiTiets: validChiTiets,
      });
      setOpenCreate(false);
    } catch {
      // Toast handled
    }
  };

  const handleXuatKho = async (phieuIdOrPayload: string | XuatKhoPayload) => {
    try {
      const payload: XuatKhoPayload =
        typeof phieuIdOrPayload === "string"
          ? { PhieuChuyenKhoID: phieuIdOrPayload }
          : phieuIdOrPayload;
      await xuatKhoMutation.mutateAsync(payload);
      setOpenDetail(false);
    } catch {
      // Toast handled
    }
  };

  const handleNhanHang = async (
    phieuOrPayload: KHO_PhieuChuyenKho | NhanHangPayload
  ) => {
    try {
      let payload: NhanHangPayload;
      if ("ThucNhans" in phieuOrPayload) {
        payload = phieuOrPayload;
      } else {
        const thucNhans = (phieuOrPayload.chiTiets || []).map((ct) => ({
          BienTheSanPhamID: ct.bienTheSanPhamID,
          SoSerialID: ct.soSerialID || null,
          SoLuongThucNhan: ct.soLuongChuyen,
        }));
        payload = {
          PhieuChuyenKhoID: phieuOrPayload.phieuChuyenKhoID,
          ThucNhans: thucNhans,
        };
      }
      await nhanHangMutation.mutateAsync(payload);
      setOpenDetail(false);
    } catch {
      // Toast handled
    }
  };

  const handleHuyPhieu = async (phieuIdOrPayload: string | HuyPhieuChuyenPayload) => {
    try {
      const payload: HuyPhieuChuyenPayload =
        typeof phieuIdOrPayload === "string"
          ? { PhieuChuyenKhoID: phieuIdOrPayload }
          : phieuIdOrPayload;
      await huyMutation.mutateAsync(payload);
      setOpenDetail(false);
    } catch {
      // Toast handled
    }
  };

  const handleSearch = (val: string) => {
    setSearchInput(val);
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    searchInput || khoFilter || statusFilter !== null
  );

  const handleResetFilters = () => {
    handleSearch("");
    setKhoFilter("");
    setStatusFilter(null);
    setPage(1);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    khoFilter,
    setKhoFilter,
    statusFilter,
    setStatusFilter,
    searchInput,
    searchTerm,
    handleSearch,
    hasActiveFilters,
    handleResetFilters,

    transferStatusOptions,
    getTransferStatusBadge,
    getTransferStatusLabel,
    isLoadingStatusList,

    khoOptions,
    isLoadingKhos,
    variantOptions,
    isLoadingVariants,

    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,

    openCreate,
    setOpenCreate,
    dataCreate,
    setDataCreate,
    handleOpenCreate,
    handleAddDetailRow,
    handleRemoveDetailRow,
    handleSubmitCreate,
    isCreating: createMutation.isPending,

    openDetail,
    setOpenDetail,
    selectedPhieu,
    handleOpenDetail,
    handleXuatKho,
    isXuatKho: xuatKhoMutation.isPending,
    handleNhanHang,
    isNhanHang: nhanHangMutation.isPending,
    handleHuyPhieu,
    isHuyPhieu: huyMutation.isPending,
  };
}
