"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addHinhAnhApi,
  deleteHinhAnhApi,
  getHinhAnhsApi,
  getHinhAnhSanPhamKPIApi,
} from "@/shared/api/HinhAnhSanPham";
import {
  CreateHinhAnhPayload,
  DeleteHinhAnhPayload,
  HinhAnhFilter,
  HinhAnhSanPhamKPI,
} from "@/types/hinhAnhSanPham";

export const HINH_ANH_QUERY_KEYS = {
  all: ["hinhAnhSanPham"] as const,
  lists: () => [...HINH_ANH_QUERY_KEYS.all, "list"] as const,
  list: (params: HinhAnhFilter) =>
    [...HINH_ANH_QUERY_KEYS.lists(), params] as const,
  kpi: () => [...HINH_ANH_QUERY_KEYS.all, "kpi"] as const,
};

export const useGetHinhAnhs = (params: HinhAnhFilter) => {
  return useQuery({
    queryKey: HINH_ANH_QUERY_KEYS.list(params),
    queryFn: () => getHinhAnhsApi(params),
    enabled: !!params.SanPhamID,
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetHinhAnhSanPhamKPI = () => {
  return useQuery({
    queryKey: HINH_ANH_QUERY_KEYS.kpi(),
    queryFn: async () => {
      const res = await getHinhAnhSanPhamKPIApi();
      return (res?.data ?? res) as HinhAnhSanPhamKPI;
    },
    placeholderData: (prev) => prev,
    staleTime: 10000,
  });
};

export const useAddHinhAnh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHinhAnhPayload) => addHinhAnhApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HINH_ANH_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Tải lên hình ảnh thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể tải lên hình ảnh!");
    },
  });
};

export const useDeleteHinhAnh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteHinhAnhPayload) => deleteHinhAnhApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HINH_ANH_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Xóa hình ảnh thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xóa hình ảnh!");
    },
  });
};
