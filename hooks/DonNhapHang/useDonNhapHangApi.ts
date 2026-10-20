import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDonNhapHangApi,
  getDonNhapHangByIdApi,
  getDonNhapHangKPIApi,
  createDonNhapHangApi,
  updateDonNhapHangApi,
  chuyenTrangThaiDonNhapApi,
  xacNhanNhapKhoApi,
  deleteDonNhapHangApi,
  getLichSuThanhToanDonNhapApi,
  addLichSuThanhToanDonNhapApi,
} from "@/shared/api/DonNhapHang";
import {
  CreateDonNhapHangPayload,
  DonNhapHangFilter,
  UpdateDonNhapHangPayload,
  ChuyenTrangThaiDonNhapPayload,
  ThanhToanDonNhapPayload,
  DonNhapHangKPI,
} from "@/types/donNhapHang";

export const DON_NHAP_HANG_KEYS = {
  all: ["donNhapHang"] as const,
  list: (params?: object) => [...DON_NHAP_HANG_KEYS.all, "list", params] as const,
  detail: (id: string) => [...DON_NHAP_HANG_KEYS.all, "detail", id] as const,
  payments: (id: string) => [...DON_NHAP_HANG_KEYS.all, "payments", id] as const,
  kpi: () => [...DON_NHAP_HANG_KEYS.all, "kpi"] as const,
};

export const useGetDonNhapHang = (params: DonNhapHangFilter) =>
  useQuery({
    queryKey: DON_NHAP_HANG_KEYS.list(params),
    queryFn: () => getDonNhapHangApi(params),
    staleTime: 1000 * 60 * 5,
  });

export const useGetDonNhapHangKPI = () =>
  useQuery({
    queryKey: DON_NHAP_HANG_KEYS.kpi(),
    queryFn: async () => {
      const res = await getDonNhapHangKPIApi();
      return (res?.data ?? res) as DonNhapHangKPI;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });


export const useGetDonNhapHangById = (id?: string) =>
  useQuery({
    queryKey: DON_NHAP_HANG_KEYS.detail(id ?? ""),
    queryFn: () => (id ? getDonNhapHangByIdApi(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useGetLichSuThanhToanDonNhap = (id?: string) =>
  useQuery({
    queryKey: DON_NHAP_HANG_KEYS.payments(id ?? ""),
    queryFn: () => (id ? getLichSuThanhToanDonNhapApi(id) : null),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useCreateDonNhapHang = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDonNhapHangPayload) => createDonNhapHangApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DON_NHAP_HANG_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
    },
  });
};

export const useUpdateDonNhapHang = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDonNhapHangPayload) => updateDonNhapHangApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DON_NHAP_HANG_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
    },
  });
};

export const useChuyenTrangThaiDonNhap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ChuyenTrangThaiDonNhapPayload) => chuyenTrangThaiDonNhapApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DON_NHAP_HANG_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
    },
  });
};

export const useXacNhanNhapKho = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => xacNhanNhapKhoApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DON_NHAP_HANG_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
      qc.invalidateQueries({ queryKey: ["tonKho"] });
      qc.invalidateQueries({ queryKey: ["soSerial"] });
    },
  });
};

export const useDeleteDonNhapHang = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDonNhapHangApi(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DON_NHAP_HANG_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
    },
  });
};

export const useAddLichSuThanhToanDonNhap = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ThanhToanDonNhapPayload) => addLichSuThanhToanDonNhapApi(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DON_NHAP_HANG_KEYS.all });
      qc.invalidateQueries({ queryKey: ["purchaseNavTabs"] });
      qc.invalidateQueries({ queryKey: ["nhaCungCap"] });
    },
  });
};

export { useGetPurchaseNavTabs } from "../NhaCungCap/useNhaCungCapApi";

