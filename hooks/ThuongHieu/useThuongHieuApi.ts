"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createThuongHieuApi,
  deleteThuongHieuApi,
  getThuongHieuApi,
  getThuongHieuByIdApi,
  updateThuongHieuApi,
} from "@/shared/api/ThuongHieu";
import {
  CreateThuongHieuPayload,
  ThuongHieuFilter,
  UpdateThuongHieuPayload,
} from "@/types/thuongHieu";

export const THUONG_HIEU_QUERY_KEYS = {
  all: ["thuongHieu"] as const,
  lists: () => [...THUONG_HIEU_QUERY_KEYS.all, "list"] as const,
  list: (params: ThuongHieuFilter) => [...THUONG_HIEU_QUERY_KEYS.lists(), params] as const,
  details: () => [...THUONG_HIEU_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...THUONG_HIEU_QUERY_KEYS.details(), id] as const,
};

export const useGetThuongHieu = (params: ThuongHieuFilter) => {
  return useQuery({
    queryKey: THUONG_HIEU_QUERY_KEYS.list(params),
    queryFn: () => getThuongHieuApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetThuongHieuById = (id?: string) => {
  return useQuery({
    queryKey: THUONG_HIEU_QUERY_KEYS.detail(id || ""),
    queryFn: () => getThuongHieuByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreateThuongHieu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateThuongHieuPayload) => createThuongHieuApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: THUONG_HIEU_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Thêm mới thương hiệu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể thêm thương hiệu!");
    },
  });
};

export const useUpdateThuongHieu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateThuongHieuPayload) => updateThuongHieuApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: THUONG_HIEU_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: THUONG_HIEU_QUERY_KEYS.detail(variables.ThuongHieuID),
      });
      toast.success("Cập nhật thông tin thương hiệu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật thương hiệu!");
    },
  });
};

export const useDeleteThuongHieu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteThuongHieuApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: THUONG_HIEU_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Xóa thương hiệu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xóa thương hiệu. Có thể thương hiệu đang có sản phẩm liên kết.");
    },
  });
};
