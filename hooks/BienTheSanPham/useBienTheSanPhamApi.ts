"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBienTheApi,
  deleteBienTheApi,
  getBienTheByIdApi,
  getBienTheSanPhamApi,
  getBienTheSanPhamKPIApi,
  getPhuTungsApi,
  updateBienTheApi,
} from "@/shared/api/BienTheSanPham";
import {
  BienTheFilter,
  BienTheSanPhamKPI,
  CreateBienThePayload,
  UpdateBienThePayload,
} from "@/types/bienTheSanPham";

export const BIEN_THE_QUERY_KEYS = {
  all: ["bienTheSanPham"] as const,
  lists: () => [...BIEN_THE_QUERY_KEYS.all, "list"] as const,
  list: (params: BienTheFilter) => [...BIEN_THE_QUERY_KEYS.lists(), params] as const,
  phuTungs: () => [...BIEN_THE_QUERY_KEYS.all, "phuTungs"] as const,
  phuTungList: (params: BienTheFilter) => [...BIEN_THE_QUERY_KEYS.phuTungs(), params] as const,
  details: () => [...BIEN_THE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...BIEN_THE_QUERY_KEYS.details(), id] as const,
  kpi: () => [...BIEN_THE_QUERY_KEYS.all, "kpi"] as const,
};

export const useGetBienTheSanPham = (
  params: BienTheFilter,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: BIEN_THE_QUERY_KEYS.list(params),
    queryFn: () => getBienTheSanPhamApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
    enabled: options?.enabled,
  });
};

export const useGetPhuTungs = (
  params: BienTheFilter = {},
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: BIEN_THE_QUERY_KEYS.phuTungList(params),
    queryFn: () => getPhuTungsApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
    enabled: options?.enabled,
  });
};

export const useGetBienTheSanPhamKPI = () => {
  return useQuery({
    queryKey: BIEN_THE_QUERY_KEYS.kpi(),
    queryFn: async () => {
      const res = await getBienTheSanPhamKPIApi();
      return (res?.data ?? res) as BienTheSanPhamKPI;
    },
    placeholderData: (prev) => prev,
    staleTime: 10000,
  });
};

export const useGetBienTheById = (id?: string) => {
  return useQuery({
    queryKey: BIEN_THE_QUERY_KEYS.detail(id || ""),
    queryFn: () => getBienTheByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreateBienThe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBienThePayload) => createBienTheApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BIEN_THE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Thêm mới biến thể sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể thêm mới biến thể!");
    },
  });
};

export const useUpdateBienThe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBienThePayload) => updateBienTheApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: BIEN_THE_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: BIEN_THE_QUERY_KEYS.detail(variables.BienTheSanPhamID),
      });
      toast.success("Cập nhật thông tin biến thể thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật biến thể!");
    },
  });
};

export const useDeleteBienThe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteBienTheApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BIEN_THE_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Xóa biến thể sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xóa biến thể. Có thể biến thể đang có số serial hoặc tồn kho.");
    },
  });
};
