"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  chuyenQuyenSoHuuApi,
  createLichSuSoHuuApi,
  getLichSuSoHuuApi,
  getLichSuSoHuuByIdApi,
  getLichSuSoHuuKPIApi,
} from "@/shared/api/LichSuSoHuuPhuongTien";
import {
  ChuyenQuyenSoHuuPayload,
  CreateLichSuSoHuuPayload,
  LichSuSoHuuFilter,
} from "@/types/lichSuSoHuuPhuongTien";
import { PHUONG_TIEN_QUERY_KEYS } from "../PhuongTienKhachHang/usePhuongTienKhachHangApi";

export const LICHSU_SOHUU_QUERY_KEYS = {
  all: ["lichSuSoHuuPhuongTien"] as const,
  kpi: () => [...LICHSU_SOHUU_QUERY_KEYS.all, "kpi"] as const,
  lists: () => [...LICHSU_SOHUU_QUERY_KEYS.all, "list"] as const,
  list: (params: LichSuSoHuuFilter) => [...LICHSU_SOHUU_QUERY_KEYS.lists(), params] as const,
  details: () => [...LICHSU_SOHUU_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...LICHSU_SOHUU_QUERY_KEYS.details(), id] as const,
};

export const useGetLichSuSoHuu = (params: LichSuSoHuuFilter) => {
  return useQuery({
    queryKey: LICHSU_SOHUU_QUERY_KEYS.list(params),
    queryFn: () => getLichSuSoHuuApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetLichSuSoHuuKPI = () => {
  return useQuery({
    queryKey: LICHSU_SOHUU_QUERY_KEYS.kpi(),
    queryFn: () => getLichSuSoHuuKPIApi(),
    placeholderData: (prev) => prev,
    staleTime: 10000,
  });
};

export const useGetLichSuSoHuuById = (id?: string) => {
  return useQuery({
    queryKey: LICHSU_SOHUU_QUERY_KEYS.detail(id || ""),
    queryFn: () => getLichSuSoHuuByIdApi(id!),
    enabled: !!id,
  });
};

export const useCreateLichSuSoHuu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLichSuSoHuuPayload) => createLichSuSoHuuApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LICHSU_SOHUU_QUERY_KEYS.all });
      toast.success("Thêm mới lịch sử sở hữu thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể thêm lịch sử sở hữu!");
    },
  });
};

export const useChuyenQuyenSoHuu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChuyenQuyenSoHuuPayload) => chuyenQuyenSoHuuApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LICHSU_SOHUU_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PHUONG_TIEN_QUERY_KEYS.all });
      toast.success("Chuyển quyền sở hữu / Sang tên xe thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể thực hiện chuyển quyền sở hữu xe!");
    },
  });
};

