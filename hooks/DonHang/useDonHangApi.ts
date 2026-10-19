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
} from "@/shared/api/DonHang";
import {
  DonHangFilter,
  CreateDonHangPayload,
  ChuyenTrangThaiDonHangPayload,
  AddLichSuThanhToanPayload,
  ThanhToanDonHangPayload,
} from "@/types/donHang";

export const DON_HANG_KEYS = {
  all: ["don-hang"] as const,
  lists: () => [...DON_HANG_KEYS.all, "list"] as const,
  list: (filter: DonHangFilter) => [...DON_HANG_KEYS.lists(), filter] as const,
  details: () => [...DON_HANG_KEYS.all, "detail"] as const,
  detail: (id: string) => [...DON_HANG_KEYS.details(), id] as const,
  payments: (id: string) => [...DON_HANG_KEYS.all, "payments", id] as const,
};

export const useGetDonHang = (filter: DonHangFilter = {}) => {
  return useQuery({
    queryKey: DON_HANG_KEYS.list(filter),
    queryFn: () => getDonHangApi(filter),
    staleTime: 1000 * 30,
  });
};

export const useGetDonHangById = (id: string) => {
  return useQuery({
    queryKey: DON_HANG_KEYS.detail(id),
    queryFn: () => getDonHangByIdApi(id),
    enabled: Boolean(id),
  });
};

export const useGetLichSuThanhToanDonHang = (donHangId: string) => {
  return useQuery({
    queryKey: DON_HANG_KEYS.payments(donHangId),
    queryFn: () => getLichSuThanhToanDonHangApi(donHangId),
    enabled: Boolean(donHangId),
  });
};

export const useCreateDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDonHangPayload) => createDonHangApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.lists() });
    },
  });
};

export const useUpdateDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateDonHangPayload> & { DonHangID: string }) =>
      updateDonHangApi(payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.detail(vars.DonHangID) });
    },
  });
};

export const useChuyenTrangThaiDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChuyenTrangThaiDonHangPayload) => chuyenTrangThaiDonHangApi(payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.detail(vars.DonHangID) });
    },
  });
};

export const useHoanThanhVaGiaoXeDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (donHangId: string) => hoanThanhVaGiaoXeDonHangApi(donHangId),
    onSuccess: (_, donHangId) => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.detail(donHangId) });
    },
  });
};

export const useAddLichSuThanhToanDonHang = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddLichSuThanhToanPayload) => addLichSuThanhToanDonHangApi(payload),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.detail(vars.DonHangID) });
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.payments(vars.DonHangID) });
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
      queryClient.invalidateQueries({ queryKey: DON_HANG_KEYS.lists() });
    },
  });
};
