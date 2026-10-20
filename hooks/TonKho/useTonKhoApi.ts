"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGiaoDichTonKhoApi,
  getTonKhoApi,
  getTonKhoDetailApi,
  updateDinhMucTonKhoApi,
  getTonKhoKPIApi,
} from "@/shared/api/TonKho";
import { GiaoDichFilter, TonKhoFilter, UpdateDinhMucPayload } from "@/types/tonKho";

export const TON_KHO_QUERY_KEYS = {
  all: ["tonKho"] as const,
  lists: () => [...TON_KHO_QUERY_KEYS.all, "list"] as const,
  list: (params: TonKhoFilter) => [...TON_KHO_QUERY_KEYS.lists(), params] as const,
  detail: (khoId: string, bienTheId: string) =>
    [...TON_KHO_QUERY_KEYS.all, "detail", khoId, bienTheId] as const,
  giaoDichs: (params: GiaoDichFilter) =>
    [...TON_KHO_QUERY_KEYS.all, "giaoDichs", params] as const,
  kpi: () => [...TON_KHO_QUERY_KEYS.all, "kpi"] as const,
};

export const useGetTonKhoKPI = () => {
  return useQuery({
    queryKey: TON_KHO_QUERY_KEYS.kpi(),
    queryFn: () => getTonKhoKPIApi(),
    placeholderData: (prev) => prev,
    staleTime: 10000,
    refetchOnWindowFocus: true,
  });
};


export const useGetTonKho = (params: TonKhoFilter) => {
  return useQuery({
    queryKey: TON_KHO_QUERY_KEYS.list(params),
    queryFn: () => getTonKhoApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetTonKhoDetail = (khoId?: string, bienTheId?: string) => {
  return useQuery({
    queryKey: TON_KHO_QUERY_KEYS.detail(khoId || "", bienTheId || ""),
    queryFn: () => getTonKhoDetailApi(khoId!, bienTheId!),
    enabled: !!khoId && !!bienTheId,
  });
};

export const useGetGiaoDichTonKho = (params: GiaoDichFilter) => {
  return useQuery({
    queryKey: TON_KHO_QUERY_KEYS.giaoDichs(params),
    queryFn: () => getGiaoDichTonKhoApi(params),
    enabled: !!params.KhoID || !!params.BienTheSanPhamID,
  });
};

export const useUpdateDinhMucTonKho = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDinhMucPayload) => updateDinhMucTonKhoApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TON_KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TON_KHO_QUERY_KEYS.kpi() });
      toast.success("Cập nhật định mức tồn kho & vị trí lưu trữ thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật định mức tồn kho!");
    },
  });
};

export const useGetLoChiPhiTonKho = (params: { KhoID?: string | null; BienTheSanPhamID?: string | null; TuKhoa?: string; PageIndex?: number; PageSize?: number }) => {
  return useQuery({
    queryKey: [...TON_KHO_QUERY_KEYS.all, "loChiPhis", params],
    queryFn: () => import("@/shared/api/TonKho").then((m) => m.getLoChiPhiTonKhoApi(params)),
    enabled: true,
  });
};

export { useGetWarehouseNavTabs } from "../Kho/useKhoApi";


