"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createKhoApi,
  deleteKhoApi,
  getKhoApi,
  getKhoByIdApi,
  updateKhoApi,
  getWarehouseNavTabsApi,
  getKhoKPIApi,
} from "@/shared/api/Kho";
import { CreateKhoPayload, KhoFilter, UpdateKhoPayload } from "@/types/kho";

export const KHO_QUERY_KEYS = {
  all: ["kho"] as const,
  lists: () => [...KHO_QUERY_KEYS.all, "list"] as const,
  list: (params: KhoFilter) => [...KHO_QUERY_KEYS.lists(), params] as const,
  details: () => [...KHO_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...KHO_QUERY_KEYS.details(), id] as const,
  navTabs: () => ["warehouseNavTabs"] as const,
  kpi: () => [...KHO_QUERY_KEYS.all, "kpi"] as const,
};

export const useGetWarehouseNavTabs = () => {
  return useQuery({
    queryKey: KHO_QUERY_KEYS.navTabs(),
    queryFn: () => getWarehouseNavTabsApi(),
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};

export const useGetKhoKPI = () => {
  return useQuery({
    queryKey: KHO_QUERY_KEYS.kpi(),
    queryFn: () => getKhoKPIApi(),
    placeholderData: (prev) => prev,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};


export const useGetKho = (params: KhoFilter) => {
  return useQuery({
    queryKey: KHO_QUERY_KEYS.list(params),
    queryFn: () => getKhoApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetKhoById = (id?: string) => {
  return useQuery({
    queryKey: KHO_QUERY_KEYS.detail(id || ""),
    queryFn: () => getKhoByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreateKho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateKhoPayload) => createKhoApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["warehouseNavTabs"] });
      queryClient.invalidateQueries({ queryKey: KHO_QUERY_KEYS.kpi() });
      toast.success("Thêm mới kho hàng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể tạo kho hàng!");
    },
  });
};

export const useUpdateKho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateKhoPayload) => updateKhoApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: KHO_QUERY_KEYS.detail(variables.KhoID),
      });
      queryClient.invalidateQueries({ queryKey: ["warehouseNavTabs"] });
      queryClient.invalidateQueries({ queryKey: KHO_QUERY_KEYS.kpi() });
      toast.success("Cập nhật thông tin kho hàng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật kho hàng!");
    },
  });
};

export const useDeleteKho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteKhoApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["warehouseNavTabs"] });
      queryClient.invalidateQueries({ queryKey: KHO_QUERY_KEYS.kpi() });
      toast.success("Xóa kho hàng thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xóa kho hàng! Kho có thể đang chứa tồn kho.");
    },
  });
};

