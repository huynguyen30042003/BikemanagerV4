"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useConfirm } from "@/components/Common/ConfirmContext";
import {
  NH_DonNhapHang,
  NH_LichSuThanhToan,
  CreateDonNhapHangPayload,
  UpdateDonNhapHangPayload,
  ChuyenTrangThaiDonNhapPayload,
  ThanhToanDonNhapPayload,
  DonNhapHangKPI,
} from "@/types/donNhapHang";
import { useDebounceSearch } from "../useDebounceSearch";
import {
  useGetDonNhapHang,
  useGetDonNhapHangKPI,
  useGetDonNhapHangById,
  useGetLichSuThanhToanDonNhap,
  useCreateDonNhapHang,
  useUpdateDonNhapHang,
  useChuyenTrangThaiDonNhap,
  useXacNhanNhapKho,
  useDeleteDonNhapHang,
  useAddLichSuThanhToanDonNhap,
} from "./useDonNhapHangApi";
import { useGetNhaCungCap } from "../NhaCungCap/useNhaCungCapApi";
import { useGetKho } from "../Kho/useKhoApi";
import { useGetBienTheSanPham } from "../BienTheSanPham/useBienTheSanPhamApi";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useDanhMucChiTietLookup } from "../DanhMucChiTiet/useDanhMucChiTietLookup";

export * from "./useDonNhapHangApi";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEBOUNCE_DELAY = 400;

export function useDonNhapHang() {
  const { confirm } = useConfirm();
  const [page, setPage] = useState<number>(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [supplierFilter, setSupplierFilter] = useState<string>("");
  const [khoFilter, setKhoFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  const { searchInput, searchTerm, setSearchInput } = useDebounceSearch({
    delay: DEBOUNCE_DELAY,
    initialValue: "",
  });

  // Modal states
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openStatusModal, setOpenStatusModal] = useState<boolean>(false);
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderFallback, setSelectedOrderFallback] =
    useState<NH_DonNhapHang | null>(null);

  // Dynamic Lookup từ DM_DanhMucChiTiet
  const {
    options: orderStatusOptions,
    getBadge: getOrderStatusBadge,
    getLabel: getOrderStatusLabel,
    isLoading: isLoadingStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_DON_NHAP_HANG);

  const {
    options: paymentMethodOptions,
    getLabel: getPaymentMethodLabel,
    isLoading: isLoadingPaymentMethods,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.PHUONG_THUC_THANH_TOAN);

  // Kiểm tra trạng thái thành công / đã hoàn thành
  const isCompletedStatus = (statusId?: number | null) => {
    if (!statusId) return false;
    const badge = getOrderStatusBadge(statusId);
    return (
      statusId === 70 ||
      badge.color === "emerald" ||
      badge.label.toLowerCase().includes("hoàn thành") ||
      badge.label.toLowerCase().includes("đã nhập kho")
    );
  };

  // Lấy chi tiết đơn nhập hàng theo ID (chứa đầy đủ ChiTiets, Serials, LichSuThanhToans)
  const {
    data: dataDetail,
    isLoading: isLoadingDetail,
    refetch: refetchDetail,
  } = useGetDonNhapHangById(
    openDetail && selectedOrderId ? selectedOrderId : undefined,
  );

  // Lịch sử thanh toán của đơn nhập
  const { data: dataPaymentHistory, isLoading: isLoadingPaymentHistory } =
    useGetLichSuThanhToanDonNhap(
      (openDetail || openPaymentModal) && selectedOrderId
        ? selectedOrderId
        : undefined,
    );

  const selectedOrder: NH_DonNhapHang | null = useMemo(() => {
    if (!selectedOrderId && !selectedOrderFallback) return null;
    const detail =
      (dataDetail as any)?.data ?? (dataDetail as any)?.Data ?? dataDetail;
    if (
      detail &&
      typeof detail === "object" &&
      (detail.donNhapHangID ||
        detail.DonNhapHangID ||
        detail.chiTiets ||
        detail.ChiTiets)
    ) {
      const rawChiTiets =
        detail.chiTiets ??
        detail.ChiTiets ??
        selectedOrderFallback?.chiTiets ??
        [];
      const normalizedChiTiets = Array.isArray(rawChiTiets)
        ? rawChiTiets.map((ct: any) => ({
            id: ct.id ?? ct.ID,
            chiTietID: ct.chiTietID ?? ct.ChiTietID,
            donNhapHangID: ct.donNhapHangID ?? ct.DonNhapHangID,
            bienTheSanPhamID: ct.bienTheSanPhamID ?? ct.BienTheSanPhamID,
            maSKU: ct.maSKU ?? ct.MaSKU,
            tenSanPham: ct.tenSanPham ?? ct.TenSanPham,
            soLuong: ct.soLuong ?? ct.SoLuong ?? 0,
            donGiaNhap: ct.donGiaNhap ?? ct.DonGiaNhap ?? 0,
            phanTramGiamGia: ct.phanTramGiamGia ?? ct.PhanTramGiamGia ?? 0,
            tienGiamGia: ct.tienGiamGia ?? ct.TienGiamGia ?? 0,
            thueVAT: ct.thueVAT ?? ct.ThueVAT ?? 0,
            tienThueVAT: ct.tienThueVAT ?? ct.TienThueVAT ?? 0,
            thanhTien: ct.thanhTien ?? ct.ThanhTien ?? 0,
            quanLyTheoSerial: ct.quanLyTheoSerial ?? ct.QuanLyTheoSerial,
            ghiChu: ct.ghiChu ?? ct.GhiChu,
          }))
        : [];

      const rawSerials =
        detail.serials ??
        detail.Serials ??
        selectedOrderFallback?.serials ??
        [];
      const normalizedSerials = Array.isArray(rawSerials)
        ? rawSerials.map((s: any) => ({
            id: s.id ?? s.ID,
            chiTietDonNhapHangID:
              s.chiTietDonNhapHangID ?? s.ChiTietDonNhapHangID,
            bienTheSanPhamID: s.bienTheSanPhamID ?? s.BienTheSanPhamID,
            maSerial: s.maSerial ?? s.MaSerial,
            soKhung: s.soKhung ?? s.SoKhung,
            soMay: s.soMay ?? s.SoMay,
            soPin: s.soPin ?? s.SoPin,
            ngaySanXuat: s.ngaySanXuat ?? s.NgaySanXuat,
            viTriLuuTru: s.viTriLuuTru ?? s.ViTriLuuTru,
          }))
        : [];

      const rawLichSu =
        detail.lichSuThanhToans ??
        detail.LichSuThanhToans ??
        selectedOrderFallback?.lichSuThanhToans ??
        [];
      const normalizedLichSu = Array.isArray(rawLichSu)
        ? rawLichSu.map((ls: any) => ({
            id: ls.id ?? ls.ID,
            donNhapHangID: ls.donNhapHangID ?? ls.DonNhapHangID,
            nhaCungCapID: ls.nhaCungCapID ?? ls.NhaCungCapID,
            maGiaoDich: ls.maGiaoDich ?? ls.MaGiaoDich,
            phuongTucThanhToanID:
              ls.phuongTucThanhToanID ?? ls.PhuongTucThanhToanID,
            tenPhuongThuc: ls.tenPhuongThuc ?? ls.TenPhuongThuc,
            soTien: ls.soTien ?? ls.SoTien ?? 0,
            ngayThanhToan: ls.ngayThanhToan ?? ls.NgayThanhToan,
            ghiChu: ls.ghiChu ?? ls.GhiChu,
          }))
        : [];

      return {
        ...(selectedOrderFallback ?? {}),
        ...detail,
        donNhapHangID:
          detail.donNhapHangID ??
          detail.DonNhapHangID ??
          selectedOrderFallback?.donNhapHangID,
        maDonNhap:
          detail.maDonNhap ??
          detail.MaDonNhap ??
          selectedOrderFallback?.maDonNhap,
        nhaCungCapID:
          detail.nhaCungCapID ??
          detail.NhaCungCapID ??
          selectedOrderFallback?.nhaCungCapID,
        tenNhaCungCap:
          detail.tenNhaCungCap ??
          detail.TenNhaCungCap ??
          selectedOrderFallback?.tenNhaCungCap,
        khoID: detail.khoID ?? detail.KhoID ?? selectedOrderFallback?.khoID,
        tenKho: detail.tenKho ?? detail.TenKho ?? selectedOrderFallback?.tenKho,
        soHoaDonChungTu:
          detail.soHoaDonChungTu ??
          detail.SoHoaDonChungTu ??
          selectedOrderFallback?.soHoaDonChungTu,
        ngayHoaDon:
          detail.ngayHoaDon ??
          detail.NgayHoaDon ??
          selectedOrderFallback?.ngayHoaDon,
        hanThanhToan:
          detail.hanThanhToan ??
          detail.HanThanhToan ??
          selectedOrderFallback?.hanThanhToan,
        tongTien:
          detail.tongTien ?? detail.TongTien ?? selectedOrderFallback?.tongTien,
        daThanhToan:
          detail.daThanhToan ??
          detail.DaThanhToan ??
          selectedOrderFallback?.daThanhToan,
        conNo: detail.conNo ?? detail.ConNo ?? selectedOrderFallback?.conNo,
        trangThaiID:
          detail.trangThaiID ??
          detail.TrangThaiID ??
          selectedOrderFallback?.trangThaiID,
        chiTiets: normalizedChiTiets,
        serials: normalizedSerials,
        lichSuThanhToans: normalizedLichSu,
      } as NH_DonNhapHang;
    }
    return selectedOrderFallback;
  }, [selectedOrderId, selectedOrderFallback, dataDetail]);

  const paymentHistoryItems: NH_LichSuThanhToan[] = useMemo(() => {
    const fromApi =
      dataPaymentHistory?.data ??
      dataPaymentHistory?.items ??
      dataPaymentHistory;
    if (Array.isArray(fromApi) && fromApi.length > 0) return fromApi;
    return (selectedOrder as any)?.lichSuThanhToans ?? [];
  }, [dataPaymentHistory, selectedOrder]);

  // Dropdown Nhà cung cấp
  const { data: dataSuppliers, isLoading: isLoadingSuppliers } =
    useGetNhaCungCap({
      PageIndex: 1,
      PageSize: 100,
      TrangThai: true,
    });

  const supplierOptions = useMemo(() => {
    const list = dataSuppliers?.data ?? dataSuppliers?.items ?? [];
    return list.map(
      (s: {
        nhaCungCapID: string;
        tenNhaCungCap: string;
        maNhaCungCap: string;
      }) => ({
        value: s.nhaCungCapID,
        label: `${s.tenNhaCungCap} [${s.maNhaCungCap}]`,
      }),
    );
  }, [dataSuppliers]);

  // Dropdown Kho hàng
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

  // Dropdown Biến thể sản phẩm
  const { data: dataVariants, isLoading: isLoadingVariants } =
    useGetBienTheSanPham({
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
        giaNhap?: number;
        quanLyTheoSerial?: boolean;
      }) => ({
        value: v.bienTheSanPhamID,
        label: `${v.tenBienThe} [${v.maSKU}]`,
        sku: v.maSKU,
        name: v.tenBienThe,
        defaultPrice: v.giaNhap || 0,
        quanLyTheoSerial: Boolean(v.quanLyTheoSerial),
      }),
    );
  }, [dataVariants]);

  // Form tạo đơn mới
  const [dataCreate, setDataCreate] = useState<CreateDonNhapHangPayload>({
    NhaCungCapID: "",
    KhoID: "",
    TrangThaiID: 66, // Mặc định Lưu tạm
    SoHoaDonChungTu: "",
    NgayHoaDon: null,
    ChiPhiVanChuyen: 0,
    HanThanhToan: null,
    GhiChu: "",
    ChiTiets: [
      {
        BienTheSanPhamID: "",
        SoLuong: 1,
        DonGiaNhap: 0,
        PhanTramGiamGia: 0,
        TienGiamGia: 0,
        ThueVAT: 10,
        TienThueVAT: 0,
        ThanhTien: 0,
        QuanLyTheoSerial: true,
        GhiChu: "",
      },
    ],
    Serials: [],
  });

  // Form thanh toán
  const [dataPayment, setDataPayment] = useState<ThanhToanDonNhapPayload>({
    DonNhapHangID: "",
    MaGiaoDich: "",
    PhuongTucThanhToanID: 79, // VietQR
    SoTien: 0,
    GhiChu: "",
  });

  // Form chuyển trạng thái
  const [dataStatusChange, setDataStatusChange] =
    useState<ChuyenTrangThaiDonNhapPayload>({
      DonNhapHangID: "",
      TrangThaiID: 67,
      GhiChu: "",
    });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchTerm,
      NhaCungCapID: supplierFilter || null,
      KhoID: khoFilter || null,
      TrangThaiID: statusFilter,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchTerm, supplierFilter, khoFilter, statusFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } =
    useGetDonNhapHang(queryParams);

  const {
    data: kpiData,
    isLoading: isLoadingKPI,
    refetch: refetchKPI,
  } = useGetDonNhapHangKPI();

  const items: NH_DonNhapHang[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createMutation = useCreateDonNhapHang();
  const updateMutation = useUpdateDonNhapHang();
  const statusMutation = useChuyenTrangThaiDonNhap();
  const nhapKhoMutation = useXacNhanNhapKho();
  const deleteMutation = useDeleteDonNhapHang();
  const paymentMutation = useAddLichSuThanhToanDonNhap();

  const handleOpenCreate = () => {
    setDataCreate({
      NhaCungCapID: supplierOptions[0]?.value ?? "",
      KhoID: khoOptions[0]?.value ?? "",
      TrangThaiID: 66,
      SoHoaDonChungTu: "",
      NgayHoaDon: null,
      ChiPhiVanChuyen: 0,
      HanThanhToan: null,
      GhiChu: "",
      ChiTiets: [
        {
          BienTheSanPhamID: "",
          SoLuong: 1,
          DonGiaNhap: 0,
          PhanTramGiamGia: 0,
          TienGiamGia: 0,
          ThueVAT: 10,
          TienThueVAT: 0,
          ThanhTien: 0,
          QuanLyTheoSerial: true,
          GhiChu: "",
        },
      ],
      Serials: [],
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
          DonGiaNhap: 0,
          PhanTramGiamGia: 0,
          TienGiamGia: 0,
          ThueVAT: 10,
          TienThueVAT: 0,
          ThanhTien: 0,
          QuanLyTheoSerial: true,
          GhiChu: "",
        },
      ],
    }));
  };

  const handleRemoveDetailRow = (index: number) => {
    if (dataCreate.ChiTiets.length <= 1) {
      toast.warning("Đơn nhập phải có ít nhất 1 mặt hàng!");
      return;
    }
    setDataCreate((prev) => ({
      ...prev,
      ChiTiets: prev.ChiTiets.filter((_, idx) => idx !== index),
    }));
  };

  const handleOpenDetail = (order: NH_DonNhapHang) => {
    setSelectedOrderId(order.donNhapHangID);
    setSelectedOrderFallback(order);
    setOpenDetail(true);
  };

  const handleOpenPayment = (order: NH_DonNhapHang) => {
    setSelectedOrderId(order.donNhapHangID);
    setSelectedOrderFallback(order);
    setDataPayment({
      DonNhapHangID: order.donNhapHangID,
      MaGiaoDich: `PAY-NCC-${Date.now().toString().slice(-6)}`,
      PhuongTucThanhToanID: paymentMethodOptions[0]?.value ?? 79,
      SoTien: order.conNo || 0,
      GhiChu: `Thanh toán tiền hàng đơn ${order.maDonNhap}`,
    });
    setOpenPaymentModal(true);
  };

  const handleOpenStatusChange = (order: NH_DonNhapHang) => {
    if (isCompletedStatus(order.trangThaiID)) {
      toast.warning(
        "Đơn hàng đã ở trạng thái hoàn thành (nhập kho thành công), không thể thay đổi trạng thái!",
      );
      return;
    }
    setSelectedOrderId(order.donNhapHangID);
    setSelectedOrderFallback(order);
    setDataStatusChange({
      DonNhapHangID: order.donNhapHangID,
      TrangThaiID: order.trangThaiID,
      GhiChu: "",
    });
    setOpenStatusModal(true);
  };

  const handleSubmitCreate = async (
    e?: React.FormEvent,
    customPayload?: CreateDonNhapHangPayload,
  ) => {
    if (e) e.preventDefault();
    const payload = customPayload || dataCreate;

    if (!payload.NhaCungCapID) {
      toast.warning("Vui lòng chọn nhà cung cấp!");
      return;
    }
    if (!payload.KhoID) {
      toast.warning("Vui lòng chọn kho tiếp nhận!");
      return;
    }
    if (payload.ChiTiets.some((c) => !c.BienTheSanPhamID || c.SoLuong <= 0)) {
      toast.warning("Vui lòng kiểm tra thông tin mặt hàng và số lượng nhập!");
      return;
    }

    try {
      const sanitizedPayload: CreateDonNhapHangPayload = {
        ...payload,
        ChiPhiVanChuyen: Number(payload.ChiPhiVanChuyen) || 0,
        ChiTiets: payload.ChiTiets.map((ct) => ({
          ...ct,
          SoLuong: Number(ct.SoLuong) || 1,
          DonGiaNhap: Number(ct.DonGiaNhap) || 0,
          ThueVAT: Number(ct.ThueVAT) || 0,
          TienThueVAT: Number(ct.TienThueVAT) || 0,
          ThanhTien: Number(ct.ThanhTien) || 0,
        })),
      };
      await createMutation.mutateAsync(sanitizedPayload);
      toast.success("Tạo đơn nhập hàng thành công!");
      setOpenCreate(false);
    } catch {
      toast.error("Không thể tạo đơn nhập. Vui lòng kiểm tra lại!");
    }
  };

  const handleSubmitStatusChange = async (
    payloadOrEvent?: React.FormEvent | ChuyenTrangThaiDonNhapPayload,
  ) => {
    let payload = dataStatusChange;
    if (payloadOrEvent && "DonNhapHangID" in payloadOrEvent) {
      payload = payloadOrEvent;
    } else if (payloadOrEvent && "preventDefault" in payloadOrEvent) {
      payloadOrEvent.preventDefault();
    }

    if (isCompletedStatus(selectedOrder?.trangThaiID)) {
      toast.warning(
        "Đơn hàng đã ở trạng thái hoàn thành (nhập kho thành công), không thể thay đổi trạng thái!",
      );
      setOpenStatusModal(false);
      return;
    }
    try {
      await statusMutation.mutateAsync(payload);
      toast.success("Cập nhật trạng thái đơn nhập thành công!");
      setOpenStatusModal(false);
    } catch {
      toast.error("Không thể cập nhật trạng thái đơn nhập!");
    }
  };

  const handleXacNhanNhapKho = async (orderId: string) => {
    const isConfirmed = await confirm({
      title: "Xác nhận nhập kho thực tế",
      variant: "warning",
      confirmText: "Xác nhận nhập kho",
      description: "Bạn có chắc chắn muốn xác nhận nhập kho thực tế cho đơn hàng này? Tồn kho thực tế của các sản phẩm sẽ được cộng dồn và tính giá vốn nhập hàng FIFO.",
    });
    if (!isConfirmed) return;
    try {
      await nhapKhoMutation.mutateAsync(orderId);
      toast.success("Đã xác nhận nhập kho thực tế & tăng tồn kho thành công!");
      setOpenDetail(false);
      refetch();
      refetchKPI();
    } catch {
      toast.error("Không thể xác nhận nhập kho!");
    }
  };

  const handleSubmitPayment = async (
    payloadOrEvent?: React.FormEvent | ThanhToanDonNhapPayload,
  ) => {
    let payload = dataPayment;
    if (payloadOrEvent && "DonNhapHangID" in payloadOrEvent) {
      payload = payloadOrEvent;
    } else if (payloadOrEvent && "preventDefault" in payloadOrEvent) {
      payloadOrEvent.preventDefault();
    }

    if (payload.SoTien <= 0) {
      toast.warning("Số tiền thanh toán phải lớn hơn 0!");
      return;
    }
    try {
      await paymentMutation.mutateAsync(payload);
      toast.success("Ghi nhận thanh toán tiền hàng thành công!");
      setOpenPaymentModal(false);
    } catch {
      toast.error("Không thể ghi nhận thanh toán!");
    }
  };

  const handleDelete = async (orderId: string) => {
    const isConfirmed = await confirm({
      title: "Xác nhận xóa đơn nhập hàng",
      variant: "danger",
      confirmText: "Xóa đơn nhập",
      description: "Bạn có chắc chắn muốn xóa đơn nhập hàng này không? Thao tác này không thể hoàn tác.",
    });
    if (!isConfirmed) return;
    try {
      await deleteMutation.mutateAsync(orderId);
      toast.success("Đã xóa đơn nhập hàng!");
      setOpenDetail(false);
      refetch();
      refetchKPI();
    } catch {
      toast.error("Không thể xóa đơn nhập hàng!");
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
    supplierFilter,
    setSupplierFilter,
    khoFilter,
    setKhoFilter,
    statusFilter,
    setStatusFilter,
    searchInput,
    handleSearch,

    orderStatusOptions,
    getOrderStatusBadge,
    getOrderStatusLabel,
    isLoadingStatuses,
    paymentMethodOptions,
    getPaymentMethodLabel,
    isLoadingPaymentMethods,

    supplierOptions,
    isLoadingSuppliers,
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
    kpiData,
    isLoadingKPI,
    refetchKPI,

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
    isLoadingDetail,
    isCompletedStatus,

    openStatusModal,
    setOpenStatusModal,
    dataStatusChange,
    setDataStatusChange,
    handleOpenStatusChange,
    handleSubmitStatusChange,
    isChangingStatus: statusMutation.isPending,

    handleXacNhanNhapKho,
    isNhapKho: nhapKhoMutation.isPending,

    openPaymentModal,
    setOpenPaymentModal,
    dataPayment,
    setDataPayment,
    handleOpenPayment,
    handleSubmitPayment,
    isPaying: paymentMutation.isPending,
    paymentHistoryItems,
    isLoadingPaymentHistory,

    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
}
