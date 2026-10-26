import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getDonHangApi,
  getDonHangByIdApi,
  createDonHangApi,
  updateDonHangApi,
  chuyenTrangThaiDonHangApi,
  hoanThanhVaGiaoXeDonHangApi,
  addLichSuThanhToanDonHangApi,
  thanhToanDonHangApi,
  deleteDonHangApi,
  getLichSuThanhToanDonHangApi,
  getDonHangKPIApi,
  getSanPhamBanHangApi,
} from "@/shared/api/DonHang";
import {
  DonHangFilter,
  CreateDonHangPayload,
  ChuyenTrangThaiDonHangPayload,
  AddLichSuThanhToanPayload,
  ThanhToanDonHangPayload,
  DonHangKPI,
  SanPhamBanHangFilter,
} from "@/types/donHang";

export const DON_HANG_KEYS = {
  all: ["don-hang"] as const,
  lists: () => [...DON_HANG_KEYS.all, "list"] as const,
  list: (filter: DonHangFilter) => [...DON_HANG_KEYS.lists(), filter] as const,
  sanPhamBanHang: (filter: SanPhamBanHangFilter) =>
    [...DON_HANG_KEYS.all, "san-pham-ban-hang", filter] as const,
  details: () => [...DON_HANG_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DON_HANG_KEYS.details(), id] as const,
  payments: (id: string) => [...DON_HANG_KEYS.all, "payments", id] as const,
  kpi: () => [...DON_HANG_KEYS.all, "kpi"] as const,
};

export const useGetSanPhamBanHang = (filter: SanPhamBanHangFilter) => {
  return useQuery({
    queryKey: DON_HANG_KEYS.sanPhamBanHang(filter),
    queryFn: () => getSanPhamBanHangApi(filter),
    enabled: Boolean(filter.KhoID),
    staleTime: 1000 * 30,
  });
};

export const useGetDonHang = (filter: DonHangFilter = {}) => {
  return useQuery({
    queryKey: DON_HANG_KEYS.list(filter),
    queryFn: () => getDonHangApi(filter),
    staleTime: 1000 * 30,
  });
};

export const useGetDonHangKPI = () => {
  return useQuery({
    queryKey: DON_HANG_KEYS.kpi(),
    queryFn: async () => {
      const res = await getDonHangKPIApi();
      return (res?.data ?? res) as DonHangKPI;
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
  });
};

export const useGetDonHangById = (id?: string | null, option?: boolean) => {
  return useQuery({
    queryKey: DON_HANG_KEYS.detail(id || ""),
    queryFn: () => getDonHangByIdApi(id || ""),
    enabled: option,
    // staleTime: 1000 * 30,
  });
};

export const useGetLichSuThanhToanDonHang = (donHangId?: string | null) => {
  return useQuery({
    queryKey: DON_HANG_KEYS.payments(donHangId || ""),
    queryFn: () => getLichSuThanhToanDonHangApi(donHangId || ""),
    enabled: Boolean(donHangId),
    staleTime: 1000 * 30,
  });
};

export const useCreateDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDonHangPayload) => createDonHangApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.all });
    },
  });
};

export const useUpdateDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Partial<CreateDonHangPayload> & { DonHangID: string },
    ) => updateDonHangApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.all });
    },
  });
};

export const useChuyenTrangThaiDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChuyenTrangThaiDonHangPayload) =>
      chuyenTrangThaiDonHangApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.all });
    },
  });
};

export const useHoanThanhVaGiaoXeDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (donHangId: string) => hoanThanhVaGiaoXeDonHangApi(donHangId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.all });
    },
  });
};

export const useAddLichSuThanhToanDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddLichSuThanhToanPayload) =>
      addLichSuThanhToanDonHangApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.all });
    },
  });
};

// Alias for backward compatibility
export const useThanhToanDonHang = useAddLichSuThanhToanDonHang;

export const useDeleteDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDonHangApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.all });
    },
  });
};
