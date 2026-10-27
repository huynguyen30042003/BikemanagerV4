"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  KHO_PhieuKiemKe,
  CreatePhieuKiemKePayload,
  CapNhatSoDemPayload,
} from "@/types/phieuKiemKe";
import {
  useGetPhieuKiemKe,
  useCreatePhieuKiemKe,
  useCapNhatSoDemKiemKe,
  useCanBangKiemKe,
  useHuyPhieuKiemKe,
} from "./usePhieuKiemKeApi";
import { useGetKho } from "../Kho/useKhoApi";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useDanhMucChiTietLookup } from "../DanhMucChiTiet/useDanhMucChiTietLookup";

export * from "./usePhieuKiemKeApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;

/**
 * Fallback map cho trạng thái kiểm kê khi chưa load xong dữ liệu API
 */
export const STATUS_AUDIT_MAP: Record<
  number,
  { label: string; color: string }
> = {
  26: { label: "Đang kiểm kê", color: "amber" },
  27: { label: "Đã cân bằng kho", color: "emerald" },
  28: { label: "Đã hủy", color: "rose" },
  // Backward compatibility
  1: { label: "Đang kiểm kê", color: "amber" },
  2: { label: "Đã cân bằng kho", color: "emerald" },
  3: { label: "Đã hủy", color: "rose" },
};

export const REASON_DISCREPANCY_OPTIONS = [
  { value: 29, label: "Đếm nhầm số lượng" },
  { value: 30, label: "Hàng hóa hư hỏng / móp méo" },
  { value: 31, label: "Thất thoát / Không rõ nguyên nhân" },
  { value: 32, label: "Xuất bán chưa kịp lập phiếu" },
];

export function usePhieuKiemKe() {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // Lấy danh mục trạng thái kiểm kê động (DanhMucID = 7)
  const {
    options: auditStatusOptions,
    getBadge: getAuditStatusBadge,
    getLabel: getAuditStatusLabel,
    isLoading: isLoadingAuditStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_KIEM_KE);

  // Lấy danh mục lý do lệch kiểm kê động (DanhMucID = 8)
  const {
    options: reasonDiscrepancyOptions,
    getLabel: getReasonDiscrepancyLabel,
    isLoading: isLoadingReasons,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.LY_DO_LECH_KIEM_KE);
  const [khoFilter, setKhoFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setKhoFilter("");
    setStatusFilter(null);
    setPage(1);
  };

  const hasActiveFilters = useMemo(
    () =>
      Boolean(searchTerm.trim() || khoFilter !== "" || statusFilter !== null),
    [searchTerm, khoFilter, statusFilter],
  );

  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openCapNhat, setOpenCapNhat] = useState<boolean>(false);
  const [selectedPhieu, setSelectedPhieu] = useState<KHO_PhieuKiemKe | null>(
    null,
  );

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

  // Form tạo phiếu mới
  const [dataCreate, setDataCreate] = useState<CreatePhieuKiemKePayload>({
    KhoID: "",
    GhiChu: "",
    BienTheSanPhamIDs: [],
  });

  // Form cập nhật số đếm
  const [dataCapNhat, setDataCapNhat] = useState<CapNhatSoDemPayload>({
    PhieuKiemKeID: "",
    ChiTiets: [],
  });

  const queryParams = useMemo(() => {
    return {
      KhoID: khoFilter || null,
      TrangThaiID: statusFilter ?? null,
      TuKhoa: searchTerm || "",
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [khoFilter, statusFilter, searchTerm, page, pageSize]);

  const { data, isLoading, isFetching, refetch } =
    useGetPhieuKiemKe(queryParams);

  const items: KHO_PhieuKiemKe[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createMutation = useCreatePhieuKiemKe();
  const capNhatMutation = useCapNhatSoDemKiemKe();
  const canBangMutation = useCanBangKiemKe();
  const huyMutation = useHuyPhieuKiemKe();

  const handleOpenCreate = () => {
    setDataCreate({
      KhoID: khoFilter || "",
      GhiChu: "",
      BienTheSanPhamIDs: [],
    });
    setOpenCreate(true);
  };

  const handleOpenDetail = (phieu: KHO_PhieuKiemKe) => {
    setSelectedPhieu(phieu);
    setOpenDetail(true);
  };

  const handleOpenCapNhat = (phieu: KHO_PhieuKiemKe) => {
    setSelectedPhieu(phieu);
    setDataCapNhat({
      PhieuKiemKeID: phieu.phieuKiemKeID,
      ChiTiets: (phieu.chiTiets || []).map((ct) => ({
        BienTheSanPhamID: ct.bienTheSanPhamID,
        SoSerialID: ct.soSerialID || null,
        SoLuongThucTe: ct.soLuongThucTe,
        LyDoLechID: ct.lyDoLechID || 1,
        GhiChuLyDo: ct.ghiChuLyDo || "",
      })),
    });
    setOpenCapNhat(true);
  };

  const handleSubmitCreate = async (
    customPayload?: CreatePhieuKiemKePayload,
  ) => {
    const payload = customPayload || dataCreate;
    if (!payload.KhoID) {
      toast.error("Vui lòng chọn kho cần tiến hành kiểm kê!");
      return;
    }
    try {
      await createMutation.mutateAsync(payload);
      setOpenCreate(false);
    } catch {
      // Toast handled
    }
  };

  const handleSubmitCapNhat = async (customPayload?: CapNhatSoDemPayload) => {
    const payload = customPayload || dataCapNhat;
    try {
      await capNhatMutation.mutateAsync(payload);
      setOpenCapNhat(false);
    } catch {
      // Toast handled
    }
  };

  const handleCanBang = async (phieuId: string) => {
    try {
      await canBangMutation.mutateAsync({ PhieuKiemKeID: phieuId });
      setOpenDetail(false);
    } catch {
      // Toast handled
    }
  };

  const handleHuyPhieu = async (phieuId: string) => {
    try {
      await huyMutation.mutateAsync({ PhieuKiemKeID: phieuId });
      setOpenDetail(false);
    } catch {
      // Toast handled
    }
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
    setSearchInput,
    searchTerm,
    handleSearch,
    handleResetFilters,
    hasActiveFilters,

    auditStatusOptions,
    getAuditStatusBadge,
    getAuditStatusLabel,
    isLoadingAuditStatuses,

    reasonDiscrepancyOptions,
    getReasonDiscrepancyLabel,
    isLoadingReasons,

    khoOptions,
    isLoadingKhos,

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
    handleSubmitCreate,
    isCreating: createMutation.isPending,

    openDetail,
    setOpenDetail,
    selectedPhieu,
    handleOpenDetail,

    openCapNhat,
    setOpenCapNhat,
    dataCapNhat,
    setDataCapNhat,
    handleOpenCapNhat,
    handleSubmitCapNhat,
    isCapNhatting: capNhatMutation.isPending,

    handleCanBang,
    isCanBang: canBangMutation.isPending,
    handleHuyPhieu,
    isHuyPhieu: huyMutation.isPending,
  };
}
