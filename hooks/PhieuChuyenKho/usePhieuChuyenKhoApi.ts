"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPhieuChuyenKhoApi,
  getPhieuChuyenKhoApi,
  getPhieuChuyenKhoByIdApi,
  huyPhieuChuyenKhoApi,
  nhanHangChuyenKhoApi,
  xuatKhoChuyenKhoApi,
  getPhieuChuyenKhoKPIApi,
} from "@/shared/api/PhieuChuyenKho";
import {
  CreatePhieuChuyenPayload,
  HuyPhieuChuyenPayload,
  NhanHangPayload,
  PhieuChuyenFilter,
  XuatKhoPayload,
} from "@/types/phieuChuyenKho";

export const CHUYEN_KHO_QUERY_KEYS = {
  all: ["phieuChuyenKho"] as const,
  lists: () => [...CHUYEN_KHO_QUERY_KEYS.all, "list"] as const,
  list: (params: PhieuChuyenFilter) => [...CHUYEN_KHO_QUERY_KEYS.lists(), params] as const,
  details: () => [...CHUYEN_KHO_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...CHUYEN_KHO_QUERY_KEYS.details(), id] as const,
  kpi: () => [...CHUYEN_KHO_QUERY_KEYS.all, "kpi"] as const,
};

export const useGetPhieuChuyenKhoKPI = () => {
  return useQuery({
    queryKey: CHUYEN_KHO_QUERY_KEYS.kpi(),
    queryFn: () => getPhieuChuyenKhoKPIApi(),
    placeholderData: (prev) => prev,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};


export const useGetPhieuChuyenKho = (params: PhieuChuyenFilter) => {
  return useQuery({
    queryKey: CHUYEN_KHO_QUERY_KEYS.list(params),
    queryFn: () => getPhieuChuyenKhoApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetPhieuChuyenKhoById = (id?: string) => {
  return useQuery({
    queryKey: CHUYEN_KHO_QUERY_KEYS.detail(id || ""),
    queryFn: () => getPhieuChuyenKhoByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreatePhieuChuyenKho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePhieuChuyenPayload) => createPhieuChuyenKhoApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHUYEN_KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["warehouseNavTabs"] });
      queryClient.invalidateQueries({ queryKey: CHUYEN_KHO_QUERY_KEYS.kpi() });
      toast.success("Tạo phiếu điều chuyển kho thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể tạo phiếu chuyển kho!");
    },
  });
};

export const useXuatKhoChuyenKho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: XuatKhoPayload) => xuatKhoChuyenKhoApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CHUYEN_KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CHUYEN_KHO_QUERY_KEYS.detail(variables.PhieuChuyenKhoID),
      });
      queryClient.invalidateQueries({ queryKey: CHUYEN_KHO_QUERY_KEYS.kpi() });
      toast.success("Xuất kho điều chuyển thành công! Hàng đang được vận chuyển.");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể duyệt xuất kho!");
    },
  });
};

export const useNhanHangChuyenKho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NhanHangPayload) => nhanHangChuyenKhoApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CHUYEN_KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CHUYEN_KHO_QUERY_KEYS.detail(variables.PhieuChuyenKhoID),
      });
      queryClient.invalidateQueries({ queryKey: ["warehouseNavTabs"] });
      queryClient.invalidateQueries({ queryKey: CHUYEN_KHO_QUERY_KEYS.kpi() });
      toast.success("Xác nhận nhận hàng tại kho đích thành công! Tồn kho đã được cập nhật.");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xác nhận nhận hàng!");
    },
  });
};

export const useHuyPhieuChuyenKho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: HuyPhieuChuyenPayload) => huyPhieuChuyenKhoApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CHUYEN_KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: CHUYEN_KHO_QUERY_KEYS.detail(variables.PhieuChuyenKhoID),
      });
      queryClient.invalidateQueries({ queryKey: ["warehouseNavTabs"] });
      queryClient.invalidateQueries({ queryKey: CHUYEN_KHO_QUERY_KEYS.kpi() });
      toast.success("Đã hủy phiếu điều chuyển kho!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể hủy phiếu chuyển kho!");
    },
  });
};
