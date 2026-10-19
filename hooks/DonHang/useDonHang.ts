import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetDonHang,
  useCreateDonHang,
  useChuyenTrangThaiDonHang,
  useHoanThanhVaGiaoXeDonHang,
  useAddLichSuThanhToanDonHang,
  useThanhToanDonHang,
  useDeleteDonHang,
  useGetLichSuThanhToanDonHang,
} from "./useDonHangApi";
import {
  DH_DonHang,
  DH_LichSuThanhToan,
  CreateDonHangPayload,
  ChuyenTrangThaiDonHangPayload,
  AddLichSuThanhToanPayload,
  ThanhToanDonHangPayload,
} from "@/types/donHang";
import { useDanhMucChiTietLookup } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useGetKhachHang } from "@/hooks/KhachHang/useKhachHangApi";
import { useGetDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { useGetKho } from "@/hooks/Kho/useKhoApi";
import { useGetBienTheSanPham } from "@/hooks/BienTheSanPham/useBienTheSanPhamApi";

export const useDonHang = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<number | null>(null);
  const [orderTypeFilter, setOrderTypeFilter] = useState<number | null>(null);
  const [customerFilter, setCustomerFilter] = useState<string>("");
  const [khoFilter, setKhoFilter] = useState<string>("");
  const [diaDiemFilter, setDiaDiemFilter] = useState<string>("");

  // Lookups động từ DM_DanhMucChiTiet
  const {
    options: orderStatusOptions,
    getLabel: getOrderStatusLabel,
    getBadge: getOrderStatusBadge,
    isLoading: isLoadingOrderStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_DON_HANG);

  const {
    options: paymentStatusOptions,
    getLabel: getPaymentStatusLabel,
    getBadge: getPaymentStatusBadge,
    isLoading: isLoadingPaymentStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_THANH_TOAN);

  const {
    options: orderTypeOptions,
    getLabel: getOrderTypeLabel,
    isLoading: isLoadingOrderTypes,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.LOAI_DON_HANG);

  const {
    options: paymentMethodOptions,
    getLabel: getPaymentMethodLabel,
    isLoading: isLoadingPaymentMethods,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.PHUONG_THUC_THANH_TOAN);

  // Khách hàng options
  const { data: dataCustomers, isLoading: isLoadingCustomers } = useGetKhachHang({
    PageIndex: 1,
    PageSize: 100,
  });

  const customerOptions = useMemo(() => {
    const list = dataCustomers?.data ?? dataCustomers?.items ?? [];
    return list.map((c: { khachHangID: string; tenKhachHang: string; dienThoai: string }) => ({
      value: c.khachHangID,
      label: `${c.tenKhachHang} - ${c.dienThoai}`,
    }));
  }, [dataCustomers]);

  // Cơ sở / Showroom options
  const { data: dataDiaDiems, isLoading: isLoadingDiaDiems } = useGetDiaDiem({
    PageIndex: 1,
    PageSize: 100,
  });

  const diaDiemOptions = useMemo(() => {
    const list = dataDiaDiems?.data ?? dataDiaDiems?.items ?? [];
    return list.map((d: { diaDiemID: string; tenDiaDiem: string }) => ({
      value: d.diaDiemID,
      label: d.tenDiaDiem,
    }));
  }, [dataDiaDiems]);

  // Kho hàng options
  const { data: dataKhos, isLoading: isLoadingKhos } = useGetKho({
    PageIndex: 1,
    PageSize: 100,
  });

  const khoOptions = useMemo(() => {
    const list = dataKhos?.data ?? dataKhos?.items ?? [];
    return list.map((k: { khoID: string; tenKho: string; maKho: string }) => ({
      value: k.khoID,
      label: `${k.tenKho} [${k.maKho}]`,
    }));
  }, [dataKhos]);

  // Biến thể sản phẩm options
  const { data: dataVariants, isLoading: isLoadingVariants } = useGetBienTheSanPham({
    PageIndex: 1,
    PageSize: 100,
  });

  const variantOptions = useMemo(() => {
    const list = dataVariants?.data ?? dataVariants?.items ?? [];
    return list.map(
      (v: {
        bienTheSanPhamID: string;
        tenBienThe: string;
        maSKU: string;
        giaBan?: number;
        quanLyTheoSerial?: boolean;
      }) => ({
        value: v.bienTheSanPhamID,
        label: `${v.tenBienThe} [${v.maSKU}]`,
        sku: v.maSKU,
        name: v.tenBienThe,
        defaultPrice: v.giaBan || 0,
        quanLySerial: Boolean(v.quanLyTheoSerial),
      })
    );
  }, [dataVariants]);

  // Form tạo đơn
  const [openCreate, setOpenCreate] = useState(false);
  const [dataCreate, setDataCreate] = useState<CreateDonHangPayload>({
    KhachHangID: "",
    DiaDiemID: "",
    KhoXuatID: "",
    LoaiDonHangID: 87, // Bán lẻ tại quầy
    TrangThaiDonHangID: 72, // Lưu tạm / Chờ xử lý
    TrangThaiThanhToanID: 83, // Chưa thanh toán
    TamTinh: 0,
    TienGiamGia: 0,
    TienThueVAT: 0,
    PhiVanChuyen: 0,
    PhiDichVuBienSo: 0,
    TongTien: 0,
    DaThanhToan: 0,
    DiemSuDung: 0,
    GhiChu: "",
    ChiTiets: [],
  });

  // Modal Chi tiết
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DH_DonHang | null>(null);

  // Lịch sử thanh toán của đơn hàng
  const { data: dataPaymentHistory, isLoading: isLoadingPaymentHistory } =
    useGetLichSuThanhToanDonHang(openDetail && selectedOrder?.donHangID ? selectedOrder.donHangID : "");
  const paymentHistoryItems: DH_LichSuThanhToan[] = useMemo(() => {
    if (!dataPaymentHistory) return [];
    if (Array.isArray(dataPaymentHistory)) return dataPaymentHistory;
    return (dataPaymentHistory as any)?.data ?? (dataPaymentHistory as any)?.items ?? [];
  }, [dataPaymentHistory]);

  // Modal Chuyển trạng thái
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [dataStatusChange, setDataStatusChange] = useState<ChuyenTrangThaiDonHangPayload>({
    DonHangID: "",
    TrangThaiDonHangID: 73,
    GhiChu: "",
  });

  // Modal Thanh toán
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [dataPayment, setDataPayment] = useState<ThanhToanDonHangPayload>({
    DonHangID: "",
    MaGiaoDich: "",
    PhuongTucThanhToanID: 78, // Tiền mặt
    SoTien: 0,
    GhiChu: "",
  });

  // Search debounce
  const handleSearch = (term: string) => {
    setSearchInput(term);
    setSearchTerm(term);
    setPage(1);
  };

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchTerm,
      KhachHangID: customerFilter || null,
      KhoXuatID: khoFilter || null,
      DiaDiemID: diaDiemFilter || null,
      TrangThaiDonHangID: statusFilter,
      TrangThaiThanhToanID: paymentStatusFilter,
      LoaiDonHangID: orderTypeFilter,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [
    searchTerm,
    customerFilter,
    khoFilter,
    diaDiemFilter,
    statusFilter,
    paymentStatusFilter,
    orderTypeFilter,
    page,
    pageSize,
  ]);

  const { data, isLoading, isFetching, refetch } = useGetDonHang(queryParams);

  const items: DH_DonHang[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.totalItems ?? data?.totalCount ?? items.length;
  }, [data, items.length]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalCount / pageSize));
  }, [totalCount, pageSize]);

  const createMutation = useCreateDonHang();
  const statusMutation = useChuyenTrangThaiDonHang();
  const paymentMutation = useAddLichSuThanhToanDonHang();
  const hoanThanhVaGiaoXeMutation = useHoanThanhVaGiaoXeDonHang();
  const deleteMutation = useDeleteDonHang();

  const handleOpenCreate = () => {
    setDataCreate({
      KhachHangID: customerOptions[0]?.value ?? "",
      DiaDiemID: diaDiemOptions[0]?.value ?? "",
      KhoXuatID: khoOptions[0]?.value ?? "",
      LoaiDonHangID: 87,
      TrangThaiDonHangID: 72,
      TrangThaiThanhToanID: 83,
      TamTinh: 0,
      TienGiamGia: 0,
      TienThueVAT: 0,
      PhiVanChuyen: 0,
      PhiDichVuBienSo: 0,
      TongTien: 0,
      DaThanhToan: 0,
      DiemSuDung: 0,
      GhiChu: "",
      ChiTiets: [
        {
          BienTheSanPhamID: "",
          SoLuong: 1,
          DonGiaBan: 0,
          TienGiamGia: 0,
          ThueVAT: 10,
          TienThueVAT: 0,
          ThanhTien: 0,
          QuanLyTheoSerial: false,
          LaPhuongTien: false,
          SoThangBaoHanh: 12,
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
          BienTheSanPhamID: "",
          SoLuong: 1,
          DonGiaBan: 0,
          TienGiamGia: 0,
          ThueVAT: 10,
          TienThueVAT: 0,
          ThanhTien: 0,
          QuanLyTheoSerial: false,
          LaPhuongTien: false,
          SoThangBaoHanh: 12,
        },
      ],
    }));
  };

  const handleRemoveDetailRow = (index: number) => {
    setDataCreate((prev) => {
      const updated = prev.ChiTiets.filter((_, i) => i !== index);
      const sub = updated.reduce((sum, r) => sum + r.ThanhTien, 0);
      return {
        ...prev,
        ChiTiets: updated,
        TamTinh: sub,
        TongTien: sub + (prev.PhiVanChuyen || 0) + (prev.PhiDichVuBienSo || 0) - (prev.TienGiamGia || 0),
      };
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataCreate.KhachHangID) {
      toast.warning("Vui lòng chọn khách hàng mua!");
      return;
    }
    if (!dataCreate.KhoXuatID) {
      toast.warning("Vui lòng chọn kho hàng xuất!");
      return;
    }
    if (dataCreate.ChiTiets.length === 0 || !dataCreate.ChiTiets[0].BienTheSanPhamID) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm bán!");
      return;
    }

    try {
      const subTotal = dataCreate.ChiTiets.reduce((sum, item) => sum + (item.SoLuong || 0) * (item.DonGiaBan || 0), 0);
      const vatTotal = dataCreate.ChiTiets.reduce((sum, item) => sum + (item.TienThueVAT || 0), 0);
      const total = dataCreate.ChiTiets.reduce((sum, item) => sum + (item.ThanhTien || 0), 0) + (dataCreate.PhiVanChuyen || 0) + (dataCreate.PhiDichVuBienSo || 0) - (dataCreate.TienGiamGia || 0);

      const sanitizedPayload = {
        ...dataCreate,
        TamTinh: subTotal,
        TienThueVAT: vatTotal,
        TongTien: total,
        ChiTiets: dataCreate.ChiTiets.map((ct) => ({
          ...ct,
          SoLuong: Number(ct.SoLuong) || 1,
          DonGiaBan: Number(ct.DonGiaBan) || 0,
          ThueVAT: Number(ct.ThueVAT) || 0,
          TienThueVAT: Number(ct.TienThueVAT) || 0,
          ThanhTien: Number(ct.ThanhTien) || 0,
        })),
      };

      await createMutation.mutateAsync(sanitizedPayload);
      toast.success("Tạo đơn hàng thành công!");
      setOpenCreate(false);
      refetch();
    } catch {
      toast.error("Không thể tạo đơn hàng. Vui lòng kiểm tra lại!");
    }
  };

  const handleOpenDetail = (order: DH_DonHang) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleOpenStatusChange = (order: DH_DonHang) => {
    setSelectedOrder(order);
    setDataStatusChange({
      DonHangID: order.donHangID,
      TrangThaiDonHangID: order.trangThaiDonHangID,
      GhiChu: "",
    });
    setOpenStatusModal(true);
  };

  const handleSubmitStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await statusMutation.mutateAsync(dataStatusChange);
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      setOpenStatusModal(false);
      refetch();
    } catch {
      toast.error("Không thể chuyển trạng thái đơn hàng!");
    }
  };

  const handleOpenPayment = (order: DH_DonHang) => {
    setSelectedOrder(order);
    setDataPayment({
      DonHangID: order.donHangID,
      MaGiaoDich: `PAY-${Date.now().toString().slice(-6)}`,
      PhuongTucThanhToanID: 78,
      SoTien: Math.max(0, order.conNo || order.tongTien - order.daThanhToan),
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
      toast.success("Ghi nhận thanh toán thành công!");
      setOpenPaymentModal(false);
      refetch();
    } catch {
      toast.error("Giao dịch thanh toán thất bại!");
    }
  };

  const handleHoanThanhVaGiaoXe = async (order: DH_DonHang) => {
    if (
      !confirm(
        `Xác nhận hoàn thành và bàn giao xe cho đơn hàng "${order.maDonHang}"?\nHệ thống sẽ trigger trừ tồn kho thực tế, tính giá vốn FIFO, kích hoạt bảo hành điện tử và tích điểm cho khách.`
      )
    )
      return;
    try {
      await hoanThanhVaGiaoXeMutation.mutateAsync(order.donHangID);
      toast.success("Xác nhận hoàn thành đơn và bàn giao xe thành công!");
      refetch();
    } catch {
      toast.error("Không thể xác nhận hoàn thành & bàn giao xe!");
    }
  };

  const handleDelete = async (order: DH_DonHang) => {
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn hàng "${order.maDonHang}"?`)) return;
    try {
      await deleteMutation.mutateAsync(order.donHangID);
      toast.success("Đã hủy đơn hàng thành công!");
      refetch();
    } catch {
      toast.error("Không thể hủy đơn hàng này!");
    }
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    handleSearch,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    orderTypeFilter,
    setOrderTypeFilter,
    customerFilter,
    setCustomerFilter,
    khoFilter,
    setKhoFilter,
    diaDiemFilter,
    setDiaDiemFilter,

    orderStatusOptions,
    getOrderStatusLabel,
    getOrderStatusBadge,
    isLoadingOrderStatuses,
    paymentStatusOptions,
    getPaymentStatusLabel,
    getPaymentStatusBadge,
    isLoadingPaymentStatuses,
    orderTypeOptions,
    getOrderTypeLabel,
    isLoadingOrderTypes,
    paymentMethodOptions,
    getPaymentMethodLabel,
    isLoadingPaymentMethods,

    customerOptions,
    isLoadingCustomers,
    diaDiemOptions,
    isLoadingDiaDiems,
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
    selectedOrder,
    handleOpenDetail,

    openStatusModal,
    setOpenStatusModal,
    dataStatusChange,
    setDataStatusChange,
    handleOpenStatusChange,
    handleSubmitStatusChange,
    isChangingStatus: statusMutation.isPending,

    openPaymentModal,
    setOpenPaymentModal,
    dataPayment,
    setDataPayment,
    handleOpenPayment,
    handleSubmitPayment,
    isPaying: paymentMutation.isPending,
    paymentHistoryItems,
    isLoadingPaymentHistory,

    handleHoanThanhVaGiaoXe,
    isCompleting: hoanThanhVaGiaoXeMutation.isPending,

    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};
