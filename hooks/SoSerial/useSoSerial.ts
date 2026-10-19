"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { toast } from "sonner";
import {
  SP_SoSerial,
  CreateSoSerialPayload,
  KichHoatBaoHanhPayload,
  ChuyenTrangThaiSerialPayload,
} from "@/types/soSerial";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetSoSerial,
  useCreateSoSerial,
  useKichHoatBaoHanh,
  useChuyenTrangThaiSerial,
} from "./useSoSerialApi";
import { useGetBienTheSanPham } from "../BienTheSanPham/useBienTheSanPhamApi";
import { useGetKhachHang } from "../KhachHang/useKhachHangApi";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useDanhMucChiTietLookup } from "../DanhMucChiTiet/useDanhMucChiTietLookup";

export * from "./useSoSerialApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEBOUNCE_DELAY = 400;

export const soSerialSchema = z.object({
  bienTheSanPhamID: z.string().min(1, "Vui lòng chọn dòng xe / biến thể sản phẩm"),
  maSerial: z.string().trim().min(1, "Vui lòng nhập mã serial tem dán"),
});

/**
 * Fallback map cho trạng thái Serial khi chưa load xong API
 */
export const STATUS_SERIAL_MAP: Record<number, { label: string; color: string }> = {
  59: { label: "Trong kho / Tồn kho", color: "emerald" },
  60: { label: "Đang vận chuyển / Chuyển kho", color: "blue" },
  61: { label: "Đã bán cho khách", color: "indigo" },
  62: { label: "Đang tiếp nhận bảo hành", color: "purple" },
  63: { label: "Đang sửa chữa tại xưởng", color: "amber" },
  64: { label: "Đã gửi nhà máy / Hãng xử lý", color: "cyan" },
  65: { label: "Lỗi hỏng / Chờ thanh lý", color: "rose" },
  // Backward compatibility
  1: { label: "Trong kho", color: "emerald" },
  2: { label: "Đã xuất bán", color: "blue" },
  3: { label: "Đang bảo hành", color: "amber" },
  4: { label: "Đang sửa chữa", color: "purple" },
  5: { label: "Lỗi / Hỏng", color: "rose" },
};

export const STATUS_SERIAL_OPTIONS = [
  { value: 59, label: "Trong kho / Tồn kho" },
  { value: 60, label: "Đang vận chuyển / Chuyển kho" },
  { value: 61, label: "Đã bán cho khách" },
  { value: 62, label: "Đang tiếp nhận bảo hành" },
  { value: 63, label: "Đang sửa chữa tại xưởng" },
  { value: 64, label: "Đã gửi nhà máy / Hãng xử lý" },
  { value: 65, label: "Lỗi hỏng / Chờ thanh lý" },
];

export function useSoSerial(initialBienTheId?: string) {
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // Lấy danh mục trạng thái Serial động từ DM_DanhMucChiTiet (DanhMucID = 12)
  const {
    options: serialStatusOptions,
    getBadge: getSerialStatusBadge,
    getLabel: getSerialStatusLabel,
    isLoading: isLoadingSerialStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_SERIAL);
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [bienTheFilter, setBienTheFilter] = useState<string>(initialBienTheId ?? "");

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  const [open, setOpen] = useState<boolean>(false);
  const [openWarranty, setOpenWarranty] = useState<boolean>(false);
  const [openChangeStatus, setOpenChangeStatus] = useState<boolean>(false);
  const [selectedSerial, setSelectedSerial] = useState<SP_SoSerial | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Query Biến thể cho dropdown
  const { data: dataVariants, isLoading: isLoadingVariants } = useGetBienTheSanPham({
    QuanLyTheoSerial: true,
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

  // Query khách hàng cho dropdown kích hoạt bảo hành
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

  // Form thêm mới
  const [dataAdd, setDataAdd] = useState<CreateSoSerialPayload>({
    BienTheSanPhamID: initialBienTheId ?? "",
    MaSerial: "",
    SoKhung: "",
    SoMay: "",
    SoPin: "",
    TrangThaiID: 59,
    KhoID: null,
    ViTriLuuTru: "",
    NgaySanXuat: "",
    GhiChu: "",
  });

  // Form kích hoạt bảo hành
  const [dataWarranty, setDataWarranty] = useState<KichHoatBaoHanhPayload>({
    SoSerialID: "",
    KhachHangID: "",
    DonHangID: null,
    TrangThaiDaBanID: 61,
    BienSoXe: "",
  });

  // Form chuyển trạng thái
  const [dataChangeStatus, setDataChangeStatus] = useState<ChuyenTrangThaiSerialPayload>({
    SoSerialID: "",
    TrangThaiID: 1,
    GhiChu: "",
  });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchTerm,
      TrangThaiID: statusFilter,
      BienTheSanPhamID: bienTheFilter || null,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchTerm, statusFilter, bienTheFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetSoSerial(queryParams);

  const items: SP_SoSerial[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreateSoSerial();
  const warrantyMutation = useKichHoatBaoHanh();
  const statusMutation = useChuyenTrangThaiSerial();

  const handleModalAdd = () => {
    setErrors({});
    setDataAdd({
      BienTheSanPhamID: bienTheFilter || "",
      MaSerial: "",
      SoKhung: "",
      SoMay: "",
      SoPin: "",
      TrangThaiID: 59,
      KhoID: null,
      ViTriLuuTru: "",
      NgaySanXuat: "",
      GhiChu: "",
    });
    setOpen(true);
  };

  const handleOpenWarranty = (item: SP_SoSerial) => {
    setSelectedSerial(item);
    setDataWarranty({
      SoSerialID: item.soSerialID,
      KhachHangID: item.khachHangID || "",
      DonHangID: null,
      TrangThaiDaBanID: 61,
      BienSoXe: item.bienSoXe || "",
    });
    setOpenWarranty(true);
  };

  const handleOpenChangeStatus = (item: SP_SoSerial) => {
    setSelectedSerial(item);
    setDataChangeStatus({
      SoSerialID: item.soSerialID,
      TrangThaiID: item.trangThaiID,
      GhiChu: "",
    });
    setOpenChangeStatus(true);
  };

  const handleSubmitAdd = async () => {
    try {
      soSerialSchema.parse({
        bienTheSanPhamID: dataAdd.BienTheSanPhamID,
        maSerial: dataAdd.MaSerial,
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
        toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      }
    }
  };

  const handleSubmitWarranty = async () => {
    if (!dataWarranty.KhachHangID) {
      toast.error("Vui lòng chọn khách hàng để kích hoạt bảo hành!");
      return;
    }
    try {
      await warrantyMutation.mutateAsync(dataWarranty);
      setOpenWarranty(false);
    } catch {
      // Toast handled
    }
  };

  const handleSubmitChangeStatus = async () => {
    try {
      await statusMutation.mutateAsync(dataChangeStatus);
      setOpenChangeStatus(false);
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
    bienTheFilter,
    setBienTheFilter,
    searchInput,
    handleSearch,

    serialStatusOptions,
    getSerialStatusBadge,
    getSerialStatusLabel,
    isLoadingSerialStatuses,

    variantOptions,
    isLoadingVariants,
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
    handleSubmitAdd,
    isCreating: createMutation.isPending,

    openWarranty,
    setOpenWarranty,
    selectedSerial,
    dataWarranty,
    setDataWarranty,
    handleOpenWarranty,
    handleSubmitWarranty,
    isActivatingWarranty: warrantyMutation.isPending,

    openChangeStatus,
    setOpenChangeStatus,
    dataChangeStatus,
    setDataChangeStatus,
    handleOpenChangeStatus,
    handleSubmitChangeStatus,
    isChangingStatus: statusMutation.isPending,

    errors,
  };
}
