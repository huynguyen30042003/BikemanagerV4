import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetDichVu,
  useCreateDichVu,
  useUpdateDichVu,
  useDeleteDichVu,
  useGetPhieuSuaChua,
  useCreatePhieuSuaChua,
  useChuyenTrangThaiSuaChua,
  useThanhToanSuaChua,
  useDeletePhieuSuaChua,
} from "./useSuaChuaApi";
import {
  SC_DichVu,
  CreateDichVuPayload,
  SC_PhieuSuaChua,
  CreatePhieuSuaChuaPayload,
  ThanhToanSuaChuaPayload,
} from "@/types/suaChua";
import { useDanhMucChiTietLookup } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useGetKhachHang } from "@/hooks/KhachHang/useKhachHangApi";
import { useGetPhuongTienKhachHang } from "@/hooks/PhuongTienKhachHang/usePhuongTienKhachHangApi";
import { useGetDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { useGetKho } from "@/hooks/Kho/useKhoApi";

export const useDichVuHook = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);

  // Dynamic Lookup nhóm dịch vụ (22)
  const {
    options: serviceTypeOptions,
    getLabel: getServiceTypeLabel,
    isLoading: isLoadingServiceTypes,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.LOAI_DICH_VU_SUA_CHUA);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SC_DichVu | null>(null);

  const [formData, setFormData] = useState<CreateDichVuPayload>({
    MaDichVu: "",
    TenDichVu: "",
    DanhMucChiTietID: 114,
    MoTa: "",
    GiaCoBan: 50000,
    GiaKhuyenMai: null,
    ThoiGianDuKienPhut: 30,
    ThuTu: 0,
    TrangThai: true,
  });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchInput,
      DanhMucChiTietID: categoryFilter,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchInput, categoryFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetDichVu(queryParams);

  const items: SC_DichVu[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreateDichVu();
  const updateMutation = useUpdateDichVu();
  const deleteMutation = useDeleteDichVu();

  const handleOpenAdd = () => {
    setFormData({
      MaDichVu: `DV-${Date.now().toString().slice(-4)}`,
      TenDichVu: "",
      DanhMucChiTietID: serviceTypeOptions[0]?.value ? Number(serviceTypeOptions[0].value) : 114,
      MoTa: "",
      GiaCoBan: 50000,
      GiaKhuyenMai: null,
      ThoiGianDuKienPhut: 30,
      ThuTu: 0,
      TrangThai: true,
    });
    setOpenAdd(true);
  };

  const handleOpenEdit = (item: SC_DichVu) => {
    setSelectedItem(item);
    setFormData({
      MaDichVu: item.maDichVu,
      TenDichVu: item.tenDichVu,
      DanhMucChiTietID: item.danhMucChiTietID,
      MoTa: item.moTa || "",
      GiaCoBan: item.giaCoBan,
      GiaKhuyenMai: item.giaKhuyenMai || null,
      ThoiGianDuKienPhut: item.thoiGianDuKienPhut,
      ThuTu: item.thuTu,
      TrangThai: item.trangThai,
    });
    setOpenEdit(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.TenDichVu.trim()) {
      toast.warning("Vui lòng nhập tên dịch vụ!");
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Thêm dịch vụ thành công!");
      setOpenAdd(false);
      refetch();
    } catch {
      toast.error("Không thể thêm dịch vụ!");
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await updateMutation.mutateAsync({
        ...formData,
        DichVuID: selectedItem.dichVuID,
      });
      toast.success("Cập nhật dịch vụ thành công!");
      setOpenEdit(false);
      refetch();
    } catch {
      toast.error("Không thể cập nhật dịch vụ!");
    }
  };

  const handleDelete = async (item: SC_DichVu) => {
    if (!confirm(`Bạn có chắc muốn xóa dịch vụ "${item.tenDichVu}"?`)) return;
    try {
      await deleteMutation.mutateAsync(item.dichVuID);
      toast.success("Đã xóa dịch vụ thành công!");
      refetch();
    } catch {
      toast.error("Không thể xóa dịch vụ này!");
    }
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    categoryFilter,
    setCategoryFilter,
    serviceTypeOptions,
    getServiceTypeLabel,
    isLoadingServiceTypes,
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

export const usePhieuSuaChuaHook = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<number | null>(null);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<number | null>(null);

  // Lookups động từ DM_DanhMucChiTiet
  const {
    options: repairStatusOptions,
    getLabel: getRepairStatusLabel,
    getBadge: getRepairStatusBadge,
    isLoading: isLoadingRepairStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_PHIEU_SUA_CHUA);

  const {
    options: paymentStatusOptions,
    getLabel: getPaymentStatusLabel,
    getBadge: getPaymentStatusBadge,
    isLoading: isLoadingPaymentStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_THANH_TOAN);

  const {
    options: serviceTypeOptions,
    getLabel: getServiceTypeLabel,
    isLoading: isLoadingServiceTypes,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.LOAI_DICH_VU_SUA_CHUA);

  const {
    options: paymentMethodOptions,
    getLabel: getPaymentMethodLabel,
    isLoading: isLoadingPaymentMethods,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.PHUONG_THUC_THANH_TOAN);

  const { data: dataCustomers } = useGetKhachHang({ PageIndex: 1, PageSize: 100 });
  const customerOptions = useMemo(() => {
    const list = dataCustomers?.data ?? dataCustomers?.items ?? [];
    return list.map((c: { khachHangID: string; tenKhachHang: string; dienThoai: string }) => ({
      value: c.khachHangID,
      label: `${c.tenKhachHang} - ${c.dienThoai}`,
    }));
  }, [dataCustomers]);

  const { data: dataVehicles } = useGetPhuongTienKhachHang({ PageIndex: 1, PageSize: 100 });
  const vehicleOptions = useMemo(() => {
    const list = dataVehicles?.data ?? dataVehicles?.items ?? [];
    return list.map((v: { id: string; tenModel: string; bienSo: string; khachHangID: string }) => ({
      value: v.id,
      label: `${v.tenModel} [${v.bienSo || "Chưa có biển"}]`,
      khachHangID: v.khachHangID,
    }));
  }, [dataVehicles]);

  const { data: dataDiaDiems } = useGetDiaDiem({ PageIndex: 1, PageSize: 100 });
  const diaDiemOptions = useMemo(() => {
    const list = dataDiaDiems?.data ?? dataDiaDiems?.items ?? [];
    return list.map((d: { diaDiemID: string; tenDiaDiem: string }) => ({
      value: d.diaDiemID,
      label: d.tenDiaDiem,
    }));
  }, [dataDiaDiems]);

  const { data: dataKhos } = useGetKho({ PageIndex: 1, PageSize: 100 });
  const khoOptions = useMemo(() => {
    const list = dataKhos?.data ?? dataKhos?.items ?? [];
    return list.map((k: { khoID: string; tenKho: string; maKho: string }) => ({
      value: k.khoID,
      label: `${k.tenKho} [${k.maKho}]`,
    }));
  }, [dataKhos]);

  const [openCreate, setOpenCreate] = useState(false);
  const [dataCreate, setDataCreate] = useState<CreatePhieuSuaChuaPayload>({
    KhachHangID: "",
    PhuongTienKhachHangID: "",
    DiaDiemID: "",
    KhoID: "",
    LoaiDichVuID: 114,
    SoKmHienTai: 0,
    MoTaVanDe: "",
    KetQuaChanDoan: "",
    GiaiPhapXuLy: "",
    TrangThaiID: 107, // Tiếp nhận
    TrangThaiThanhToanID: 83, // Chưa thanh toán
    ThoiGianHenTra: null,
    GhiChu: "",
    ChiTiets: [],
  });

  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [dataPayment, setDataPayment] = useState<ThanhToanSuaChuaPayload>({
    PhieuSuaChuaID: "",
    MaGiaoDich: "",
    PhuongTucThanhToanID: 78,
    SoTien: 0,
    GhiChu: "",
  });

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [dataStatusChange, setDataStatusChange] = useState<{
    PhieuSuaChuaID: string;
    TrangThaiID: number;
    GhiChu?: string;
  }>({
    PhieuSuaChuaID: "",
    TrangThaiID: 108,
    GhiChu: "",
  });

  const [selectedTicket, setSelectedTicket] = useState<SC_PhieuSuaChua | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const handleOpenDetail = (ticket: SC_PhieuSuaChua) => {
    setSelectedTicket(ticket);
    setOpenDetail(true);
  };

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchInput,
      TrangThaiID: statusFilter,
      TrangThaiThanhToanID: paymentStatusFilter,
      LoaiDichVuID: serviceTypeFilter,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchInput, statusFilter, paymentStatusFilter, serviceTypeFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetPhieuSuaChua(queryParams);

  const items: SC_PhieuSuaChua[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreatePhieuSuaChua();
  const statusMutation = useChuyenTrangThaiSuaChua();
  const paymentMutation = useThanhToanSuaChua();
  const deleteMutation = useDeletePhieuSuaChua();

  const handleOpenCreate = () => {
    setDataCreate({
      KhachHangID: customerOptions[0]?.value ?? "",
      PhuongTienKhachHangID: vehicleOptions[0]?.value ?? "",
      DiaDiemID: diaDiemOptions[0]?.value ?? "",
      KhoID: khoOptions[0]?.value ?? "",
      LoaiDichVuID: 114,
      SoKmHienTai: 0,
      MoTaVanDe: "",
      KetQuaChanDoan: "",
      GiaiPhapXuLy: "",
      TrangThaiID: 107,
      TrangThaiThanhToanID: 83,
      ThoiGianHenTra: null,
      GhiChu: "",
      ChiTiets: [
        {
          LoaiHangMuc: 1, // Tiền công
          MaHangMuc: "DV-KT",
          TenHangMuc: "Kiểm tra tổng quát xe điện",
          SoLuong: 1,
          DonGia: 100000,
          TienGiamGia: 0,
          ThanhTien: 100000,
        },
      ],
    });
    setOpenCreate(true);
  };

  const handleAddDetailRow = () => {
    setDataCreate((prev) => ({
      ...prev,
      ChiTiets: [
        ...prev.ChiTiets,
        {
          LoaiHangMuc: 1,
          MaHangMuc: "DV-SC",
          TenHangMuc: "",
          SoLuong: 1,
          DonGia: 50000,
          TienGiamGia: 0,
          ThanhTien: 50000,
        },
      ],
    }));
  };

  const handleRemoveDetailRow = (idx: number) => {
    setDataCreate((prev) => ({
      ...prev,
      ChiTiets: prev.ChiTiets.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataCreate.KhachHangID) {
      toast.warning("Vui lòng chọn khách hàng!");
      return;
    }
    if (!dataCreate.MoTaVanDe?.trim()) {
      toast.warning("Vui lòng ghi nhận tình trạng xe / vấn đề!");
      return;
    }
    try {
      await createMutation.mutateAsync(dataCreate);
      toast.success("Lập phiếu sửa chữa thành công!");
      setOpenCreate(false);
      refetch();
    } catch {
      toast.error("Không thể tạo phiếu sửa chữa!");
    }
  };

  const handleOpenStatusChange = (ticket: SC_PhieuSuaChua) => {
    setSelectedTicket(ticket);
    setDataStatusChange({
      PhieuSuaChuaID: ticket.phieuSuaChuaID,
      TrangThaiID: ticket.trangThaiID,
      GhiChu: "",
    });
    setOpenStatusModal(true);
  };

  const handleSubmitStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await statusMutation.mutateAsync(dataStatusChange);
      toast.success("Cập nhật trạng thái phiếu sửa chữa thành công!");
      setOpenStatusModal(false);
      refetch();
    } catch {
      toast.error("Không thể chuyển trạng thái phiếu sửa chữa!");
    }
  };

  const handleOpenPayment = (ticket: SC_PhieuSuaChua) => {
    setSelectedTicket(ticket);
    setDataPayment({
      PhieuSuaChuaID: ticket.phieuSuaChuaID,
      MaGiaoDich: `REPAIR-PAY-${Date.now().toString().slice(-6)}`,
      PhuongTucThanhToanID: 78,
      SoTien: Math.max(0, ticket.conNo || ticket.tongTien - ticket.daThanhToan),
      GhiChu: "",
    });
    setOpenPaymentModal(true);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dataPayment.SoTien <= 0) {
      toast.warning("Số tiền thanh toán phải lớn hơn 0!");
      return;
    }
    try {
      await paymentMutation.mutateAsync(dataPayment);
      toast.success("Thanh toán phiếu dịch vụ thành công!");
      setOpenPaymentModal(false);
      refetch();
    } catch {
      toast.error("Giao dịch thanh toán thất bại!");
    }
  };

  const handleDelete = async (ticket: SC_PhieuSuaChua) => {
    if (!confirm(`Bạn có chắc muốn hủy phiếu sửa chữa "${ticket.maPhieuSuaChua}"?`)) return;
    try {
      await deleteMutation.mutateAsync(ticket.phieuSuaChuaID);
      toast.success("Đã hủy phiếu sửa chữa thành công!");
      refetch();
    } catch {
      toast.error("Không thể hủy phiếu sửa chữa!");
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
    paymentStatusFilter,
    setPaymentStatusFilter,
    serviceTypeFilter,
    setServiceTypeFilter,
    repairStatusOptions,
    getRepairStatusLabel,
    getRepairStatusBadge,
    isLoadingRepairStatuses,
    paymentStatusOptions,
    getPaymentStatusLabel,
    getPaymentStatusBadge,
    isLoadingPaymentStatuses,
    serviceTypeOptions,
    getServiceTypeLabel,
    isLoadingServiceTypes,
    paymentMethodOptions,
    getPaymentMethodLabel,
    isLoadingPaymentMethods,
    customerOptions,
    vehicleOptions,
    diaDiemOptions,
    khoOptions,
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
    openStatusModal,
    setOpenStatusModal,
    dataStatusChange,
    setDataStatusChange,
    handleOpenStatusChange,
    handleSubmitStatusChange,
    openPaymentModal,
    setOpenPaymentModal,
    dataPayment,
    setDataPayment,
    handleOpenPayment,
    handleSubmitPayment,
    openDetail,
    setOpenDetail,
    handleOpenDetail,
    handleDelete,
    selectedTicket,
    isSubmitting:
      createMutation.isPending ||
      statusMutation.isPending ||
      paymentMutation.isPending ||
      deleteMutation.isPending,
  };
};
