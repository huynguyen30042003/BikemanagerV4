"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPhuongTienApi,
  deletePhuongTienApi,
  getPhuongTienByIdApi,
  getPhuongTienKhachHangApi,
  getPhuongTienKhachHangKPIApi,
  updatePhuongTienApi,
} from "@/shared/api/PhuongTienKhachHang";
import {
  CreatePhuongTienPayload,
  PhuongTienFilter,
  UpdatePhuongTienPayload,
} from "@/types/phuongTienKhachHang";

export const PHUONG_TIEN_QUERY_KEYS = {
  all: ["phuongTienKhachHang"] as const,
  kpi: () => [...PHUONG_TIEN_QUERY_KEYS.all, "kpi"] as const,
  lists: () => [...PHUONG_TIEN_QUERY_KEYS.all, "list"] as const,
  list: (params: PhuongTienFilter) => [...PHUONG_TIEN_QUERY_KEYS.lists(), params] as const,
  details: () => [...PHUONG_TIEN_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...PHUONG_TIEN_QUERY_KEYS.details(), id] as const,
};

export const useGetPhuongTienKhachHang = (params: PhuongTienFilter) => {
  return useQuery({
    queryKey: PHUONG_TIEN_QUERY_KEYS.list(params),
    queryFn: () => getPhuongTienKhachHangApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetPhuongTienKhachHangKPI = () => {
  return useQuery({
    queryKey: PHUONG_TIEN_QUERY_KEYS.kpi(),
    queryFn: () => getPhuongTienKhachHangKPIApi(),
    placeholderData: (prev) => prev,
    staleTime: 10000,
  });
};

export const useGetPhuongTienById = (id?: string) => {
  return useQuery({
    queryKey: PHUONG_TIEN_QUERY_KEYS.detail(id || ""),
    queryFn: () => getPhuongTienByIdApi(id!),
    enabled: !!id,
  });
};


export const useCreatePhuongTien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePhuongTienPayload) => createPhuongTienApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHUONG_TIEN_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["khachHangNavTabs"] });
      toast.success("Thêm mới phương tiện xe của khách thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể thêm mới phương tiện!");
    },
  });
};

export const useUpdatePhuongTien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePhuongTienPayload) => updatePhuongTienApi(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: PHUONG_TIEN_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PHUONG_TIEN_QUERY_KEYS.detail(variables.ID),
      });
      queryClient.invalidateQueries({ queryKey: ["khachHangNavTabs"] });
      toast.success("Cập nhật thông tin phương tiện thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật phương tiện!");
    },
  });
};

export const useDeletePhuongTien = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePhuongTienApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PHUONG_TIEN_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["khachHangNavTabs"] });
      toast.success("Xóa phương tiện thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xóa phương tiện!");
    },
  });
};

