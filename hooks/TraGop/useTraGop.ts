import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetDonViTraGop,
  useCreateDonViTraGop,
  useUpdateDonViTraGop,
  useDeleteDonViTraGop,
  useGetHopDongTraGop,
  useCreateHopDongTraGop,
  useUpdateHopDongTraGop,
  useChuyenTrangThaiHopDong,
  useXacNhanGiaiNgan,
  useTinhDuToanTraGop,
  useDeleteHopDongTraGop,
} from "./useTraGopApi";
import {
  DonViTraGop,
  CreateDonViTraGopPayload,
  HopDongTraGop,
  CreateHopDongTraGopPayload,
  ChuyenTrangThaiHopDongPayload,
  XacNhanGiaiNganPayload,
  TinhDuToanTraGopPayload,
} from "@/types/traGop";

export const TRANG_THAI_HOP_DONG = {
  CHO_DUYET: 110,
  DA_DUYET: 111,
  TU_CHOI: 112,
  DA_KY_HD: 113,
  DANG_TRA_GOP: 114,
  DA_TAT_TOAN: 115,
  DA_HUY: 116,
} as const;

export const TRANG_THAI_GIAI_NGAN = {
  CHUA_GIAI_NGAN: 120,
  DA_GIAI_NGAN: 121,
} as const;

export const getTrangThaiHopDongBadge = (statusId?: number | null, fallback?: string | null) => {
  switch (statusId) {
    case 110:
      return { label: "Chờ thẩm định", color: "amber" };
    case 111:
      return { label: "Đã duyệt vay", color: "emerald" };
    case 112:
      return { label: "Từ chối hồ sơ", color: "rose" };
    case 113:
      return { label: "Đã ký hợp đồng", color: "blue" };
    case 114:
      return { label: "Đang trả góp", color: "indigo" };
    case 115:
      return { label: "Đã tất toán", color: "emerald" };
    case 116:
      return { label: "Đã hủy", color: "slate" };
    default:
      if (fallback?.toLowerCase().includes("daduyet")) return { label: "Đã duyệt", color: "emerald" };
      if (fallback?.toLowerCase().includes("tuchoi")) return { label: "Từ chối", color: "rose" };
      return { label: fallback || "Chờ duyệt", color: "amber" };
  }
};

export const getTrangThaiGiaiNganBadge = (statusId?: number | null) => {
  switch (statusId) {
    case 121:
      return { label: "Đã giải ngân", color: "emerald" };
    case 120:
    default:
      return { label: "Chưa giải ngân", color: "slate" };
  }
};

/* ==============================================================================
   HOOK QUẢN LÝ ĐƠN VỊ TRẢ GÓP
   ============================================================================== */
export const useDonViTraGopHook = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DonViTraGop | null>(null);

  const [formData, setFormData] = useState<CreateDonViTraGopPayload>({
    MaDonVi: "",
    TenDonVi: "",
    DienThoai: "",
    Email: "",
    DiaChi: "",
    TenNguoiLienHe: "",
    SdtNguoiLienHe: "",
    DiaChiAPI: "",
    ApiKey: "",
    CauHinhGoiVayJson: "",
    ThuTu: 1,
    DangHoatDong: true,
    GhiChu: "",
  });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchInput,
      DangHoatDong: statusFilter === "all" ? null : statusFilter === "active",
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchInput, statusFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetDonViTraGop(queryParams);

  const items: DonViTraGop[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreateDonViTraGop();
  const updateMutation = useUpdateDonViTraGop();
  const deleteMutation = useDeleteDonViTraGop();

  const handleOpenAdd = () => {
    setFormData({
      MaDonVi: "",
      TenDonVi: "",
      DienThoai: "",
      Email: "",
      DiaChi: "",
      TenNguoiLienHe: "",
      SdtNguoiLienHe: "",
      DiaChiAPI: "",
      ApiKey: "",
      CauHinhGoiVayJson: "",
      ThuTu: items.length + 1,
      DangHoatDong: true,
      GhiChu: "",
    });
    setOpenAdd(true);
  };

  const handleOpenEdit = (item: DonViTraGop) => {
    setSelectedItem(item);
    setFormData({
      MaDonVi: item.maDonVi || "",
      TenDonVi: item.tenDonVi || item.ten || "",
      DienThoai: item.dienThoai || "",
      Email: item.email || "",
      DiaChi: item.diaChi || "",
      TenNguoiLienHe: item.tenNguoiLienHe || "",
      SdtNguoiLienHe: item.sdtNguoiLienHe || "",
      DiaChiAPI: item.diaChiAPI || "",
      ApiKey: item.apiKey || "",
      CauHinhGoiVayJson: item.cauHinhGoiVayJson || "",
      ThuTu: item.thuTu ?? 1,
      DangHoatDong: item.dangHoatDong,
      GhiChu: item.ghiChu || "",
    });
    setOpenEdit(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.MaDonVi.trim()) {
      toast.warning("Vui lòng nhập mã đối tác (VD: HDSAISON, FECREDIT)!");
      return;
    }
    if (!formData.TenDonVi.trim()) {
      toast.warning("Vui lòng nhập tên đối tác tài chính!");
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Thêm đơn vị đối tác trả góp thành công!");
      setOpenAdd(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể thêm đối tác trả góp!");
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = selectedItem?.donViTraGopID || selectedItem?.id;
    if (!id) return;
    try {
      await updateMutation.mutateAsync({
        ...formData,
        DonViTraGopID: id,
      });
      toast.success("Cập nhật thông tin đối tác thành công!");
      setOpenEdit(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể cập nhật đối tác trả góp!");
    }
  };

  const handleDelete = async (item: DonViTraGop) => {
    const id = item.donViTraGopID || item.id;
    if (!id) return;
    const name = item.tenDonVi || item.ten || item.maDonVi;
    if (!confirm(`Bạn có chắc muốn xóa đối tác "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Đã xóa đơn vị trả góp!");
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể xóa đối tác trả góp này (có thể đã phát sinh hợp đồng)!");
    }
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    openEdit,
    setOpenEdit,
    selectedItem,
    formData,
    setFormData,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmitAdd,
    handleSubmitEdit,
    handleDelete,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};

/* ==============================================================================
   HOOK QUẢN LÝ HỢP ĐỒNG TRẢ GÓP
   ============================================================================== */
export const useHopDongTraGopHook = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [disbursementFilter, setDisbursementFilter] = useState<string>("all");

  const [openAdd, setOpenAdd] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openDisburseModal, setOpenDisburseModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState<HopDongTraGop | null>(null);

  const [formData, setFormData] = useState<CreateHopDongTraGopPayload>({
    DonHangID: "",
    KhachHangID: "",
    DonViTraGopID: "",
    SoHopDong: "",
    MaHoSoOnline: "",
    TongGiaTriDonHang: 0,
    TienTraTruoc: 0,
    SoTienVay: 0,
    PhiBaoHiemKhoanVay: 0,
    LaiSuat: 0,
    SoThangTraGop: 12,
    SoTienTraHangThang: 0,
    NgayTraHangThang: 5,
    TrangThaiHopDongID: TRANG_THAI_HOP_DONG.CHO_DUYET,
    TrangThaiGiaiNganID: TRANG_THAI_GIAI_NGAN.CHUA_GIAI_NGAN,
    DuongDanHopDongPdf: "",
    DanhSachTaiLieuJson: "",
    NguoiThamChieu: "",
    GhiChu: "",
  });

  const { data: dataProviders } = useGetDonViTraGop({ PageIndex: 1, PageSize: 100 });
  const providerOptions = useMemo(() => {
    const list = dataProviders?.data ?? dataProviders?.items ?? [];
    return list.map((p: DonViTraGop) => ({
      value: p.donViTraGopID || p.id || "",
      label: p.tenDonVi || p.ten || p.maDonVi,
    }));
  }, [dataProviders]);

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchInput,
      DonViTraGopID: providerFilter || null,
      TrangThaiHopDongID: statusFilter === "all" ? null : Number(statusFilter),
      TrangThaiGiaiNganID: disbursementFilter === "all" ? null : Number(disbursementFilter),
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchInput, providerFilter, statusFilter, disbursementFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetHopDongTraGop(queryParams);

  const items: HopDongTraGop[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreateHopDongTraGop();
  const chuyenTrangThaiMutation = useChuyenTrangThaiHopDong();
  const xacNhanGiaiNganMutation = useXacNhanGiaiNgan();
  const deleteMutation = useDeleteHopDongTraGop();

  const handleOpenAdd = () => {
    setFormData({
      DonHangID: "",
      KhachHangID: "",
      DonViTraGopID: providerOptions[0]?.value ?? "",
      SoHopDong: `HDS-${Date.now().toString().slice(-6)}`,
      MaHoSoOnline: "",
      TongGiaTriDonHang: 0,
      TienTraTruoc: 0,
      SoTienVay: 0,
      PhiBaoHiemKhoanVay: 0,
      LaiSuat: 0,
      SoThangTraGop: 12,
      SoTienTraHangThang: 0,
      NgayTraHangThang: 5,
      TrangThaiHopDongID: TRANG_THAI_HOP_DONG.CHO_DUYET,
      TrangThaiGiaiNganID: TRANG_THAI_GIAI_NGAN.CHUA_GIAI_NGAN,
      DuongDanHopDongPdf: "",
      DanhSachTaiLieuJson: "",
      NguoiThamChieu: "",
      GhiChu: "",
    });
    setOpenAdd(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.SoHopDong.trim()) {
      toast.warning("Vui lòng nhập số hợp đồng tín dụng!");
      return;
    }
    if (!formData.DonViTraGopID) {
      toast.warning("Vui lòng chọn đơn vị đối tác tài chính!");
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Lập hồ sơ đề nghị vay trả góp thành công!");
      setOpenAdd(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể lưu hợp đồng trả góp!");
    }
  };

  const handleChuyenTrangThai = async (payload: ChuyenTrangThaiHopDongPayload) => {
    try {
      await chuyenTrangThaiMutation.mutateAsync(payload);
      toast.success("Cập nhật trạng thái thẩm định hồ sơ thành công!");
      setOpenStatusModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi cập nhật trạng thái!");
    }
  };

  const handleXacNhanGiaiNgan = async (payload: XacNhanGiaiNganPayload) => {
    try {
      await xacNhanGiaiNganMutation.mutateAsync(payload);
      toast.success("Xác nhận tiền giải ngân thành công! Đã tự động cập nhật thanh toán đơn hàng.");
      setOpenDisburseModal(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Lỗi khi ghi nhận giải ngân!");
    }
  };

  const handleDelete = async (contract: HopDongTraGop) => {
    const id = contract.hopDongTraGopID || contract.id;
    if (!id) return;
    if (!confirm(`Bạn có chắc muốn hủy hồ sơ trả góp "${contract.soHopDong}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Đã hủy hồ sơ trả góp!");
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể hủy hồ sơ này!");
    }
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    providerFilter,
    setProviderFilter,
    statusFilter,
    setStatusFilter,
    disbursementFilter,
    setDisbursementFilter,
    providerOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    openStatusModal,
    setOpenStatusModal,
    openDisburseModal,
    setOpenDisburseModal,
    selectedContract,
    setSelectedContract,
    formData,
    setFormData,
    handleOpenAdd,
    handleSubmitAdd,
    handleChuyenTrangThai,
    handleXacNhanGiaiNgan,
    handleDelete,
    isSubmitting:
      createMutation.isPending ||
      chuyenTrangThaiMutation.isPending ||
      xacNhanGiaiNganMutation.isPending,
  };
};
