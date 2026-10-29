import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  useGetBaoHanh,
  useCreateBaoHanh,
  useDeleteBaoHanh,
  useGetPhieuBaoHanh,
  useCreatePhieuBaoHanh,
  useDeletePhieuBaoHanh,
} from "./useBaoHanhApi";
import {
  BH_BaoHanh,
  CreateBaoHanhPayload,
  BH_PhieuBaoHanh,
  CreatePhieuBaoHanhPayload,
} from "@/types/baoHanh";
import { useDanhMucChiTietLookup } from "@/hooks/DanhMucChiTiet/useDanhMucChiTietLookup";
import { DANH_MUC_CHUNG } from "@/constants/danhMuc";
import { useGetKhachHang } from "@/hooks/KhachHang/useKhachHangApi";
import { useGetSoSerial } from "@/hooks/SoSerial/useSoSerialApi";
import { useGetDiaDiem } from "@/hooks/DiaDiem/useDiaDiemApi";
import { useConfirm } from "@/components/Common/ConfirmContext";

export const useBaoHanhHook = () => {
  const { confirm } = useConfirm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  // Dynamic Lookup trạng thái sổ bảo hành (18)
  const {
    options: warrantyStatusOptions,
    getLabel: getWarrantyStatusLabel,
    getBadge: getWarrantyStatusBadge,
    isLoading: isLoadingStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_SO_BAO_HANH);

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

  const { data: dataSerials } = useGetSoSerial({ PageIndex: 1, PageSize: 100 });
  const serialOptions = useMemo(() => {
    const list = dataSerials?.data ?? dataSerials?.items ?? [];
    return list.map(
      (s: {
        soSerialID: string;
        maSerial: string;
        soKhung?: string;
        bienTheSanPhamID: string;
      }) => ({
        value: s.soSerialID,
        label: `${s.maSerial}${s.soKhung ? ` [VIN: ${s.soKhung}]` : ""}`,
        bienTheID: s.bienTheSanPhamID,
      }),
    );
  }, [dataSerials]);

  const [openAdd, setOpenAdd] = useState(false);
  const [formData, setFormData] = useState<CreateBaoHanhPayload>({
    SoSerialID: "",
    BienTheSanPhamID: "",
    KhachHangID: "",
    NgayKichHoat: new Date().toISOString(),
    NgayBatDau: new Date().toISOString(),
    NgayKetThuc: new Date(
      Date.now() + 365 * 24 * 3600 * 1000 * 3,
    ).toISOString(), // 3 năm
    SoThangBaoHanh: 36,
    GioiHanKm: 30000,
    TrangThaiID: 91, // Đang hiệu lực
    DieuKienBaoHanh:
      "Bảo hành 3 năm hoặc 30.000 km đối với khung sườn, động cơ và pin",
    GhiChu: "",
  });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchInput,
      TrangThaiID: statusFilter,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchInput, statusFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } = useGetBaoHanh(queryParams);

  const items: BH_BaoHanh[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;

  const createMutation = useCreateBaoHanh();
  const deleteMutation = useDeleteBaoHanh();

  const handleOpenAdd = () => {
    setFormData({
      SoSerialID: serialOptions[0]?.value ?? "",
      BienTheSanPhamID: serialOptions[0]?.bienTheID ?? "",
      KhachHangID: customerOptions[0]?.value ?? "",
      NgayKichHoat: new Date().toISOString(),
      NgayBatDau: new Date().toISOString(),
      NgayKetThuc: new Date(
        Date.now() + 365 * 24 * 3600 * 1000 * 3,
      ).toISOString(),
      SoThangBaoHanh: 36,
      GioiHanKm: 30000,
      TrangThaiID: 91,
      DieuKienBaoHanh:
        "Bảo hành 3 năm hoặc 30.000 km đối với khung sườn, động cơ và pin",
      GhiChu: "",
    });
    setOpenAdd(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.KhachHangID) {
      toast.warning("Vui lòng chọn khách hàng!");
      return;
    }
    if (!formData.SoSerialID) {
      toast.warning("Vui lòng chọn số serial xe / pin!");
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Kích hoạt sổ bảo hành thành công!");
      setOpenAdd(false);
      refetch();
    } catch {
      toast.error("Không thể kích hoạt bảo hành!");
    }
  };

  const handleDelete = async (item: BH_BaoHanh) => {
    const isConfirmed = await confirm({
      title: "Xác nhận hủy sổ bảo hành",
      variant: "danger",
      confirmText: "Hủy bảo hành",
      description: `Bạn có chắc muốn hủy sổ bảo hành "${item.maBaoHanh}" không? Thao tác này không thể hoàn tác.`,
    });
    if (!isConfirmed) return;
    try {
      await deleteMutation.mutateAsync(item.baoHanhID);
      toast.success("Đã hủy sổ bảo hành!");
      refetch();
    } catch {
      toast.error("Không thể hủy bảo hành!");
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
    warrantyStatusOptions,
    getWarrantyStatusLabel,
    getWarrantyStatusBadge,
    isLoadingStatuses,
    customerOptions,
    serialOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    formData,
    setFormData,
    handleOpenAdd,
    handleSubmitAdd,
    handleDelete,
    isSubmitting: createMutation.isPending,
  };
};

export const usePhieuBaoHanhHook = () => {
  const { confirm } = useConfirm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [actionFilter, setActionFilter] = useState<number | null>(null);

  // Dynamic Lookup trạng thái phiếu BH (19) & Hướng xử lý (20)
  const {
    options: claimStatusOptions,
    getLabel: getClaimStatusLabel,
    getBadge: getClaimStatusBadge,
    isLoading: isLoadingClaimStatuses,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.TRANG_THAI_PHIEU_BAO_HANH);

  const {
    options: actionOptions,
    getLabel: getActionLabel,
    getBadge: getActionBadge,
    isLoading: isLoadingActions,
  } = useDanhMucChiTietLookup(DANH_MUC_CHUNG.HUONG_XU_LY_BAO_HANH);

  const { data: dataDiaDiems } = useGetDiaDiem({ PageIndex: 1, PageSize: 100 });
  const diaDiemOptions = useMemo(() => {
    const list = dataDiaDiems?.data ?? dataDiaDiems?.items ?? [];
    return list.map((d: { diaDiemID: string; tenDiaDiem: string }) => ({
      value: d.diaDiemID,
      label: d.tenDiaDiem,
    }));
  }, [dataDiaDiems]);

  const [openAdd, setOpenAdd] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BH_PhieuBaoHanh | null>(
    null,
  );

  const handleOpenDetail = (item: BH_PhieuBaoHanh) => {
    setSelectedItem(item);
    setOpenDetail(true);
  };
  const [formData, setFormData] = useState<CreatePhieuBaoHanhPayload>({
    BaoHanhID: "",
    KhachHangID: "",
    SoSerialID: "",
    DiaDiemID: "",
    MoTaLoi: "",
    KetQuaKiemTra: "",
    HuongXuLyID: 102, // Sửa chữa tại trạm
    TrangThaiID: 96, // Tiếp nhận
    ChiPhiHangHoTro: 0,
    ChiPhiKhachTra: 0,
    GhiChu: "",
    ChiTiets: [],
  });

  const queryParams = useMemo(() => {
    return {
      TuKhoa: searchInput,
      TrangThaiID: statusFilter,
      HuongXuLyID: actionFilter,
      PageIndex: page,
      PageSize: pageSize,
    };
  }, [searchInput, statusFilter, actionFilter, page, pageSize]);

  const { data, isLoading, isFetching, refetch } =
    useGetPhieuBaoHanh(queryParams);

  const items: BH_PhieuBaoHanh[] = useMemo(() => {
    return data?.data ?? data?.items ?? [];
  }, [data]);

  const totalCount =
    data?.pagination?.totalItems ?? data?.recordsTotal ?? items.length;
  const totalPages = data?.pagination?.totalPages ?? 1;
  const createMutation = useCreatePhieuBaoHanh();
  const deleteMutation = useDeletePhieuBaoHanh();

  const handleOpenAdd = () => {
    setFormData({
      BaoHanhID: "",
      KhachHangID: "",
      SoSerialID: "",
      DiaDiemID: diaDiemOptions[0]?.value ?? "",
      MoTaLoi: "",
      KetQuaKiemTra: "",
      HuongXuLyID: 102,
      TrangThaiID: 96,
      ChiPhiHangHoTro: 0,
      ChiPhiKhachTra: 0,
      GhiChu: "",
      ChiTiets: [],
    });
    setOpenAdd(true);
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.MoTaLoi.trim()) {
      toast.warning("Vui lòng nhập mô tả sự cố hư hỏng!");
      return;
    }
    try {
      await createMutation.mutateAsync(formData);
      toast.success("Lập phiếu tiếp nhận bảo hành thành công!");
      setOpenAdd(false);
      refetch();
    } catch {
      toast.error("Không thể tạo phiếu bảo hành!");
    }
  };

  const handleDelete = async (claim: BH_PhieuBaoHanh) => {
    const isConfirmed = await confirm({
      title: "Xác nhận xóa phiếu bảo hành",
      variant: "danger",
      confirmText: "Xóa phiếu",
      description: `Bạn có chắc muốn xóa phiếu "${claim.maPhieuBaoHanh}" không? Thao tác này không thể hoàn tác.`,
    });
    if (!isConfirmed) return;
    try {
      await deleteMutation.mutateAsync(claim.phieuBaoHanhID);
      toast.success("Đã xóa phiếu bảo hành!");
      refetch();
    } catch {
      toast.error("Không thể xóa phiếu bảo hành!");
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
    actionFilter,
    setActionFilter,
    claimStatusOptions,
    getClaimStatusLabel,
    getClaimStatusBadge,
    isLoadingClaimStatuses,
    actionOptions,
    getActionLabel,
    getActionBadge,
    isLoadingActions,
    diaDiemOptions,
    items,
    totalCount,
    totalPages,
    isLoading,
    isFetching,
    refetch,
    openAdd,
    setOpenAdd,
    openDetail,
    setOpenDetail,
    selectedItem,
    handleOpenDetail,
    formData,
    setFormData,
    handleOpenAdd,
    handleSubmitAdd,
    handleDelete,
    isSubmitting: createMutation.isPending,
  };
};
