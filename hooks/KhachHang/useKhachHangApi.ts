"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createKhachHangApi,
  deleteKhachHangApi,
  getKhachHangApi,
  getKhachHangByIdApi,
  updateKhachHangApi,
  getKhachHangNavTabsApi,
} from "@/shared/api/KhachHang";
import {
  CreateKhachHangPayload,
  KhachHangFilter,
  UpdateKhachHangPayload,
} from "@/types/khachHang";

export const KHACH_HANG_QUERY_KEYS = {
  all: ["khachHang"] as const,
  lists: () => [...KHACH_HANG_QUERY_KEYS.all, "list"] as const,
  list: (params: KhachHangFilter) => [...KHACH_HANG_QUERY_KEYS.lists(), params] as const,
  details: () => [...KHACH_HANG_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...KHACH_HANG_QUERY_KEYS.details(), id] as const,
  navTabs: () => ["khachHangNavTabs"] as const,
};

export const useGetKhachHangNavTabs = () => {
  return useQuery({
    queryKey: KHACH_HANG_QUERY_KEYS.navTabs(),
    queryFn: () => getKhachHangNavTabsApi(),
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useGetKhachHang = (params: KhachHangFilter) => {
  return useQuery({
    queryKey: KHACH_HANG_QUERY_KEYS.list(params),
    queryFn: () => getKhachHangApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetKhachHangById = (id?: string) => {
  return useQuery({
    queryKey: KHACH_HANG_QUERY_KEYS.detail(id || ""),
    queryFn: () => getKhachHangByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreateKhachHang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateKhachHangPayload) => createKhachHangApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KHACH_HANG_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KHACH_HANG_QUERY_KEYS.navTabs() });
      toast.success("Thêm mới hồ sơ khách hàng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể thêm mới khách hàng!");
    },
  });
};

export const useUpdateKhachHang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateKhachHangPayload) => updateKhachHangApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: KHACH_HANG_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: KHACH_HANG_QUERY_KEYS.detail(variables.KhachHangID),
      });
      queryClient.invalidateQueries({ queryKey: KHACH_HANG_QUERY_KEYS.navTabs() });
      toast.success("Cập nhật thông tin khách hàng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật thông tin khách hàng!");
    },
  });
};

export const useDeleteKhachHang = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteKhachHangApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KHACH_HANG_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KHACH_HANG_QUERY_KEYS.navTabs() });
      toast.success("Xóa hồ sơ khách hàng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xóa khách hàng. Có thể khách hàng đang có đơn hàng hoặc xe liên kết.");
    },
  });
};

