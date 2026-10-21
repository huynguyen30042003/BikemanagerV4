"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getGiaoDichTonKhoApi,
  getTonKhoApi,
  getTonKhoDetailApi,
  updateDinhMucTonKhoApi,
  getTonKhoKPIApi,
  nhapTonDauKyApi,
} from "@/shared/api/TonKho";
import {
  GiaoDichFilter,
  TonKhoFilter,
  UpdateDinhMucPayload,
  KHO_TonKho_NhapTonDauKy_Request,
} from "@/types/tonKho";

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


export const useGetTonKho = (
  params: TonKhoFilter,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: TON_KHO_QUERY_KEYS.list(params),
    queryFn: () => getTonKhoApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
    enabled: options?.enabled,
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

export const useNhapTonDauKy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: KHO_TonKho_NhapTonDauKy_Request) => nhapTonDauKyApi(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TON_KHO_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: TON_KHO_QUERY_KEYS.kpi() });
      queryClient.invalidateQueries({ queryKey: ["warehouseNavTabs"] });
      queryClient.invalidateQueries({ queryKey: ["soSerial"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["bienTheSanPham"] });
      toast.success(
        `Nhập tồn kho đầu kỳ thành công! Tồn sau bổ sung: ${data.soLuongSau?.toLocaleString("vi-VN")} (Khả dụng: ${data.soLuongKhaDung?.toLocaleString("vi-VN")})`
      );
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Nhập tồn kho đầu kỳ thất bại!");
    },
  });
};

export { useGetWarehouseNavTabs } from "../Kho/useKhoApi";


