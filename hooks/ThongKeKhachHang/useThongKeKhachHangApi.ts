"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getThongKeKhachHangApi,
  getThongKeKhachHangByIdApi,
  updateThongKeKhachHangApi,
} from "@/shared/api/ThongKeKhachHang";
import {
  ThongKeKhachHangFilter,
  UpdateThongKeKhachHangPayload,
} from "@/types/thongKeKhachHang";

export const THONG_KE_KH_QUERY_KEYS = {
  all: ["thongKeKhachHang"] as const,
  lists: () => [...THONG_KE_KH_QUERY_KEYS.all, "list"] as const,
  list: (params: ThongKeKhachHangFilter) => [...THONG_KE_KH_QUERY_KEYS.lists(), params] as const,
  details: () => [...THONG_KE_KH_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...THONG_KE_KH_QUERY_KEYS.details(), id] as const,
};

export const useGetThongKeKhachHang = (params: ThongKeKhachHangFilter) => {
  return useQuery({
    queryKey: THONG_KE_KH_QUERY_KEYS.list(params),
    queryFn: () => getThongKeKhachHangApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetThongKeKhachHangById = (id?: string) => {
  return useQuery({
    queryKey: THONG_KE_KH_QUERY_KEYS.detail(id || ""),
    queryFn: () => getThongKeKhachHangByIdApi(id!),
    enabled: !!id,
  });
};

export const useUpdateThongKeKhachHang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateThongKeKhachHangPayload) => updateThongKeKhachHangApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: THONG_KE_KH_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: THONG_KE_KH_QUERY_KEYS.detail(variables.KhachHangID),
      });
      toast.success("Cập nhật xếp hạng & thông số khách hàng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật thống kê khách hàng!");
    },
  });
};
