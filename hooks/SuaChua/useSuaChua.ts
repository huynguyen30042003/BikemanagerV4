import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetDichVu,
  useCreateDichVu,
  useUpdateDichVu,
  useDeleteDichVu,
  useGetPhieuSuaChua,
  useCreatePhieuSuaChua,
  useUpdatePhieuSuaChua,
  useChuyenTrangThaiSuaChua,
  useHoanThanhVaGiaoXeSuaChua,
  useThanhToanSuaChua,
  useDeletePhieuSuaChua,
} from "./useSuaChuaApi";
import {
  SC_DichVu,
  CreateDichVuPayload,
  UpdateDichVuPayload,
  SC_PhieuSuaChua,
  CreatePhieuSuaChuaPayload,
  UpdatePhieuSuaChuaPayload,
  ThanhToanSuaChuaPayload,
} from "@/types/suaChua";
import { useDanhMucChiTietLookup } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useGetKhachHang } from "@/hooks/KhachHang/useKhachHangApi";
import { useGetPhuongTienKhachHang } from "@/hooks/PhuongTienKhachHang/usePhuongTienKhachHangApi";
import { useGetDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { useGetKho } from "@/hooks/Kho/useKhoApi";
import { useGetPhuTungs } from "@/hooks/BienTheSanPham/useBienTheSanPhamApi";
import { useConfirm } from "@/components/Common/ConfirmContext";

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

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchInput,
      DanhMucChiTietID: categoryFilter,
      TrangThai:
        statusFilter === "all"
          ? null
          : statusFilter === "active"
            ? true
            : false,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchInput, categoryFilter, statusFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetDichVu(queryParams);

  const items: SC_DichVu[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createMutation = useCreateDichVu();
  const updateMutation = useUpdateDichVu();
  const deleteMutation = useDeleteDichVu();

  const handleOpenAdd = () => {
    setFormData({
      MaDichVu: `DV-${Date.now().toString().slice(-4)}`,
      TenDichVu: "",
      DanhMucChiTietID: serviceTypeOptions[0]?.value
        ? Number(serviceTypeOptions[0].value)
        : 114,
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

  const handleSubmitAdd = async (
    e?: React.FormEvent,
    customData?: CreateDichVuPayload,
  ) => {
    e?.preventDefault?.();
    const payload = customData || formData;
    if (!payload.TenDichVu.trim()) {
      toast.warning("Vui lòng nhập tên dịch vụ!");
      return;
    }
    try {
      await createMutation.mutateAsync(payload);
      toast.success("Thêm dịch vụ thành công!");
      setOpenAdd(false);
      refetch();
    } catch {
      toast.error("Không thể thêm dịch vụ!");
    }
  };

  const handleSubmitEdit = async (
    e?: React.FormEvent,
    customData?: UpdateDichVuPayload,
  ) => {
    e?.preventDefault?.();
    const payload =
      customData ||
      (selectedItem
        ? {
            ...formData,
            DichVuID: selectedItem.dichVuID,
          }
        : null);
    if (!payload) return;
    try {
      await updateMutation.mutateAsync(payload);
      toast.success("Cập nhật dịch vụ thành công!");
      setOpenEdit(false);
      refetch();
    } catch {
      toast.error("Không thể cập nhật dịch vụ!");
    }
  };

  const { confirm } = useConfirm();

  const handleDelete = async (item: SC_DichVu) => {
    const isConfirmed = await confirm({
      title: "Xác nhận xóa dịch vụ",
      description: `Bạn có chắc chắn muốn xóa dịch vụ "${item.tenDichVu}" (mã: ${item.maDichVu})? Thao tác này sẽ xóa vĩnh viễn dịch vụ khỏi bảng giá hệ thống.`,
      confirmText: "Xóa vĩnh viễn",
      variant: "danger",
    });
    if (!isConfirmed) return;
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
    statusFilter,
    setStatusFilter,
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
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<number | null>(
    null,
  );
  const [serviceTypeFilter, setServiceTypeFilter] = useState<number | null>(
    null,
  );

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

  const { data: dataCustomers } = useGetKhachHang({
    PageIndex: 1,
    PageSize: 100,
  });
  const customerOptions = useMemo(() => {
    const list = dataCustomers?.data ?? dataCustomers?.items ?? [];
    return list.map(
      (c: {
        khachHangID: string;
        tenKhachHang: string;
        dienThoai: string;
      }) => ({
        value: c.khachHangID,
        label: `${c.tenKhachHang} - ${c.dienThoai}`,
      }),
    );
  }, [dataCustomers]);

  const { data: dataVehicles } = useGetPhuongTienKhachHang({
    PageIndex: 1,
    PageSize: 100,
  });
  const vehicleOptions = useMemo(() => {
    const list = dataVehicles?.data ?? dataVehicles?.items ?? [];
    return list.map(
      (v: {
        id: string;
        tenModel: string;
        bienSo: string;
        khachHangID: string;
      }) => ({
        value: v.id,
        label: `${v.tenModel} [${v.bienSo || "Chưa có biển"}]`,
        khachHangID: v.khachHangID,
      }),
    );
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

  // Lookup danh mục tiền công / dịch vụ sửa chữa có sẵn
  const { data: dataServices } = useGetDichVu({ PageIndex: 1, PageSize: 100 });
  const serviceOptions = useMemo(() => {
    const list = dataServices?.data ?? dataServices?.items ?? [];
    return list.map((d: SC_DichVu) => ({
      value: d.dichVuID,
      label: `${d.tenDichVu} [${d.maDichVu}]`,
      maDichVu: d.maDichVu,
      tenDichVu: d.tenDichVu,
      donGia: d.giaKhuyenMai ?? d.giaCoBan,
    }));
  }, [dataServices]);

  // Lookup danh mục phụ tùng thay thế có sẵn chuyên biệt (GetPhuTungs)
  const { data: dataVariants } = useGetPhuTungs({
    PageIndex: 1,
    PageSize: 200,
  });
  const partOptions = useMemo(() => {
    const list = dataVariants?.data ?? dataVariants?.items ?? [];
    return list.map(
      (v: {
        bienTheSanPhamID: string;
        tenBienThe: string;
        maSKU: string;
        giaBan?: number;
        giaSuaChua?: number;
        tonKhoTaiKho?: number;
        donViTinhID?: number;
      }) => {
        const price = v.giaSuaChua ?? v.giaBan ?? 0;
        const tonLabel =
          v.tonKhoTaiKho !== undefined ? ` [Tồn: ${v.tonKhoTaiKho}]` : "";
        return {
          value: v.bienTheSanPhamID,
          label: `${v.tenBienThe} (${v.maSKU})${tonLabel} - ${price.toLocaleString("vi-VN")} đ`,
          maSKU: v.maSKU,
          tenBienThe: v.tenBienThe,
          donGia: price,
          donViTinhID: v.donViTinhID,
          tonKhoTaiKho: v.tonKhoTaiKho,
        };
      },
    );
  }, [dataVariants]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
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

  const [selectedTicket, setSelectedTicket] = useState<SC_PhieuSuaChua | null>(
    null,
  );
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
  }, [
    searchInput,
    statusFilter,
    paymentStatusFilter,
    serviceTypeFilter,
    page,
    pageSize,
  ]);

  const { data, isLoading, isFetching, refetch } =
    useGetPhieuSuaChua(queryParams);

  const items: SC_PhieuSuaChua[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createMutation = useCreatePhieuSuaChua();
  const updateMutation = useUpdatePhieuSuaChua();
  const statusMutation = useChuyenTrangThaiSuaChua();
  const hoanThanhVaGiaoXeMutation = useHoanThanhVaGiaoXeSuaChua();
  const paymentMutation = useThanhToanSuaChua();
  const deleteMutation = useDeletePhieuSuaChua();

  const handleHoanThanhVaGiaoXe = async (ticket: SC_PhieuSuaChua) => {
    if (ticket.trangThaiID === 112) {
      toast.info("Phiếu đã hoàn thành và bàn giao xe trước đó!");
      return;
    }
    if (ticket.trangThaiID === 113) {
      toast.warning("Phiếu đã bị hủy, không thể bàn giao xe!");
      return;
    }
    try {
      await hoanThanhVaGiaoXeMutation.mutateAsync(ticket.phieuSuaChuaID);
      toast.success("Bàn giao xe và trừ tồn kho phụ tùng thành công!");
      refetch();
    } catch {
      toast.error("Không thể hoàn thành & bàn giao xe!");
    }
  };

  const handleOpenEdit = (ticket: SC_PhieuSuaChua) => {
    setSelectedTicket(ticket);
    setOpenEdit(true);
  };

  const handleSubmitEdit = async (
    e?: React.FormEvent,
    customData?: UpdatePhieuSuaChuaPayload,
  ) => {
    e?.preventDefault?.();
    if (!customData) return;
    try {
      await updateMutation.mutateAsync(customData);
      toast.success("Cập nhật phiếu sửa chữa thành công!");
      setOpenEdit(false);
      refetch();
    } catch {
      toast.error("Không thể cập nhật phiếu sửa chữa!");
    }
  };

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

  const handleSubmitCreate = async (
    e?: React.FormEvent,
    customData?: CreatePhieuSuaChuaPayload,
  ) => {
    e?.preventDefault?.();
    const payload = customData || dataCreate;
    if (!payload.KhachHangID) {
      toast.warning("Vui lòng chọn khách hàng!");
      return;
    }
    if (!payload.MoTaVanDe?.trim()) {
      toast.warning("Vui lòng ghi nhận tình trạng xe / vấn đề!");
      return;
    }
    try {
      await createMutation.mutateAsync(payload);
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

  const handleSubmitStatusChange = async (
    e?: React.FormEvent,
    customData?: {
      PhieuSuaChuaID: string;
      TrangThaiID: number;
      GhiChu?: string;
    },
  ) => {
    e?.preventDefault?.();
    const payload = customData || dataStatusChange;
    try {
      await statusMutation.mutateAsync(payload);
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

  const handleSubmitPayment = async (
    e?: React.FormEvent,
    customData?: ThanhToanSuaChuaPayload,
  ) => {
    e?.preventDefault?.();
    const payload = customData || dataPayment;
    if (payload.SoTien <= 0) {
      toast.warning("Số tiền thanh toán phải lớn hơn 0!");
      return;
    }
    try {
      await paymentMutation.mutateAsync(payload);
      toast.success("Thanh toán phiếu dịch vụ thành công!");
      setOpenPaymentModal(false);
      refetch();
    } catch {
      toast.error("Giao dịch thanh toán thất bại!");
    }
  };

  const { confirm } = useConfirm();

  const handleDelete = async (ticket: SC_PhieuSuaChua) => {
    const isConfirmed = await confirm({
      title: "Xác nhận hủy phiếu sửa chữa",
      description: `Bạn có chắc chắn muốn hủy phiếu tiếp nhận "${ticket.maPhieuSuaChua}" của khách hàng "${ticket.tenKhachHang || 'Khách lẻ'}"? Thao tác này sẽ hủy phiếu và hoàn kho các linh kiện phụ tùng liên quan.`,
      confirmText: "Hủy phiếu ngay",
      variant: "danger",
    });
    if (!isConfirmed) return;
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
    serviceOptions,
    partOptions,
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
    openEdit,
    setOpenEdit,
    handleOpenEdit,
    handleSubmitEdit,
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
    handleHoanThanhVaGiaoXe,
    selectedTicket,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending ||
      statusMutation.isPending ||
      hoanThanhVaGiaoXeMutation.isPending ||
      paymentMutation.isPending ||
      deleteMutation.isPending,
  };
};
