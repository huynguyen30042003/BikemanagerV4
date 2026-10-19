"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createSanPhamApi,
  deleteSanPhamApi,
  getProductNavTabsApi,
  getSanPhamApi,
  getSanPhamByIdApi,
  updateSanPhamApi,
} from "@/shared/api/SanPham";
import {
  CreateSanPhamPayload,
  SanPhamFilter,
  UpdateSanPhamPayload,
} from "@/types/sanPham";

export const SAN_PHAM_QUERY_KEYS = {
  all: ["sanPham"] as const,
  lists: () => [...SAN_PHAM_QUERY_KEYS.all, "list"] as const,
  list: (params: SanPhamFilter) => [...SAN_PHAM_QUERY_KEYS.lists(), params] as const,
  details: () => [...SAN_PHAM_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SAN_PHAM_QUERY_KEYS.details(), id] as const,
  navTabs: () => ["productNavTabs"] as const,
};

export const useGetProductNavTabs = () => {
  return useQuery({
    queryKey: SAN_PHAM_QUERY_KEYS.navTabs(),
    queryFn: () => getProductNavTabsApi(),
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useGetSanPham = (params: SanPhamFilter) => {
  return useQuery({
    queryKey: SAN_PHAM_QUERY_KEYS.list(params),
    queryFn: () => getSanPhamApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetSanPhamById = (id?: string) => {
  return useQuery({
    queryKey: SAN_PHAM_QUERY_KEYS.detail(id || ""),
    queryFn: () => getSanPhamByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreateSanPham = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSanPhamPayload) => createSanPhamApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAN_PHAM_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SAN_PHAM_QUERY_KEYS.navTabs() });
      toast.success("Thêm mới sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể thêm mới sản phẩm!");
    },
  });
};

export const useUpdateSanPham = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSanPhamPayload) => updateSanPhamApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SAN_PHAM_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SAN_PHAM_QUERY_KEYS.navTabs() });
      queryClient.invalidateQueries({
        queryKey: SAN_PHAM_QUERY_KEYS.detail(variables.SanPhamID),
      });
      toast.success("Cập nhật thông tin sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật sản phẩm!");
    },
  });
};

export const useDeleteSanPham = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSanPhamApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SAN_PHAM_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SAN_PHAM_QUERY_KEYS.navTabs() });
      toast.success("Xóa sản phẩm thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xóa sản phẩm. Có thể sản phẩm đang có biến thể hoặc giao dịch tồn kho.");
    },
  });
};
