"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  chuyenTrangThaiSerialApi,
  createSoSerialApi,
  getSoSerialApi,
  getSoSerialByIdApi,
  kichHoatBaoHanhApi,
  traCuuBaoHanhApi,
} from "@/shared/api/SoSerial";
import {
  ChuyenTrangThaiSerialPayload,
  CreateSoSerialPayload,
  KichHoatBaoHanhPayload,
  SoSerialFilter,
} from "@/types/soSerial";

export const SO_SERIAL_QUERY_KEYS = {
  all: ["soSerial"] as const,
  lists: () => [...SO_SERIAL_QUERY_KEYS.all, "list"] as const,
  list: (params: SoSerialFilter) => [...SO_SERIAL_QUERY_KEYS.lists(), params] as const,
  details: () => [...SO_SERIAL_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SO_SERIAL_QUERY_KEYS.details(), id] as const,
};

export const useGetSoSerial = (params: SoSerialFilter) => {
  return useQuery({
    queryKey: SO_SERIAL_QUERY_KEYS.list(params),
    queryFn: () => getSoSerialApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetSoSerialById = (id?: string) => {
  return useQuery({
    queryKey: SO_SERIAL_QUERY_KEYS.detail(id || ""),
    queryFn: () => getSoSerialByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreateSoSerial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSoSerialPayload) => createSoSerialApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SO_SERIAL_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Đăng ký số Serial / Số Khung thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể đăng ký số Serial!");
    },
  });
};

export const useKichHoatBaoHanh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: KichHoatBaoHanhPayload) => kichHoatBaoHanhApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SO_SERIAL_QUERY_KEYS.lists() });
      toast.success("Kích hoạt bảo hành điện tử thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể kích hoạt bảo hành!");
    },
  });
};

export const useChuyenTrangThaiSerial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChuyenTrangThaiSerialPayload) => chuyenTrangThaiSerialApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SO_SERIAL_QUERY_KEYS.lists() });
      toast.success("Chuyển trạng thái thiết bị thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể chuyển trạng thái thiết bị!");
    },
  });
};
