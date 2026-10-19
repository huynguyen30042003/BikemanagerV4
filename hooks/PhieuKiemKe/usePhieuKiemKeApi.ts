"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  canBangKiemKeApi,
  capNhatSoDemKiemKeApi,
  createPhieuKiemKeApi,
  getPhieuKiemKeApi,
  getPhieuKiemKeByIdApi,
  huyPhieuKiemKeApi,
} from "@/shared/api/PhieuKiemKe";
import {
  CanBangPayload,
  CapNhatSoDemPayload,
  CreatePhieuKiemKePayload,
  HuyKiemKePayload,
  PhieuKiemKeFilter,
} from "@/types/phieuKiemKe";

export const KIEM_KE_QUERY_KEYS = {
  all: ["phieuKiemKe"] as const,
  lists: () => [...KIEM_KE_QUERY_KEYS.all, "list"] as const,
  list: (params: PhieuKiemKeFilter) => [...KIEM_KE_QUERY_KEYS.lists(), params] as const,
  details: () => [...KIEM_KE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...KIEM_KE_QUERY_KEYS.details(), id] as const,
};

export const useGetPhieuKiemKe = (params: PhieuKiemKeFilter) => {
  return useQuery({
    queryKey: KIEM_KE_QUERY_KEYS.list(params),
    queryFn: () => getPhieuKiemKeApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetPhieuKiemKeById = (id?: string) => {
  return useQuery({
    queryKey: KIEM_KE_QUERY_KEYS.detail(id || ""),
    queryFn: () => getPhieuKiemKeByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreatePhieuKiemKe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePhieuKiemKePayload) => createPhieuKiemKeApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KIEM_KE_QUERY_KEYS.lists() });
      toast.success("Khởi tạo phiếu kiểm kê kho thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể khởi tạo phiếu kiểm kê!");
    },
  });
};

export const useCapNhatSoDemKiemKe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CapNhatSoDemPayload) => capNhatSoDemKiemKeApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: KIEM_KE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: KIEM_KE_QUERY_KEYS.detail(variables.PhieuKiemKeID),
      });
      toast.success("Cập nhật số đếm thực tế thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật số đếm kiểm kê!");
    },
  });
};

export const useCanBangKiemKe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CanBangPayload) => canBangKiemKeApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: KIEM_KE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: KIEM_KE_QUERY_KEYS.detail(variables.PhieuKiemKeID),
      });
      toast.success("Cân bằng kho thành công! Giao dịch điều chỉnh tồn kho đã được ghi nhận.");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cân bằng kho!");
    },
  });
};

export const useHuyPhieuKiemKe = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: HuyKiemKePayload) => huyPhieuKiemKeApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: KIEM_KE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: KIEM_KE_QUERY_KEYS.detail(variables.PhieuKiemKeID),
      });
      toast.success("Đã hủy phiếu kiểm kê kho!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể hủy phiếu kiểm kê!");
    },
  });
};
