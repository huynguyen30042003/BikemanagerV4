"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  chuyenTrangThaiSerialApi,
  createSoSerialApi,
  updateSoSerialApi,
  deleteSoSerialHinhAnhApi,
  getSoSerialApi,
  getSoSerialByIdApi,
  getSoSerialHinhAnhApi,
  getSoSerialKPIApi,
  kichHoatBaoHanhApi,
  traCuuBaoHanhApi,
  uploadSoSerialHinhAnhApi,
} from "@/shared/api/SoSerial";
import {
  ChuyenTrangThaiSerialPayload,
  CreateSoSerialPayload,
  UpdateSoSerialPayload,
  KichHoatBaoHanhPayload,
  SP_SoSerial_HinhAnh,
  SoSerialFilter,
  SoSerialKPI,
} from "@/types/soSerial";

export const SO_SERIAL_QUERY_KEYS = {
  all: ["soSerial"] as const,
  lists: () => [...SO_SERIAL_QUERY_KEYS.all, "list"] as const,
  list: (params: SoSerialFilter) =>
    [...SO_SERIAL_QUERY_KEYS.lists(), params] as const,
  details: () => [...SO_SERIAL_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SO_SERIAL_QUERY_KEYS.details(), id] as const,
  kpi: () => [...SO_SERIAL_QUERY_KEYS.all, "kpi"] as const,
  images: (serialId: string) => [...SO_SERIAL_QUERY_KEYS.all, "images", serialId] as const,
};

export const useGetSoSerial = (params: SoSerialFilter) => {
  return useQuery({
    queryKey: SO_SERIAL_QUERY_KEYS.list(params),
    queryFn: () => getSoSerialApi(params),
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
};

export const useGetSoSerialKPI = () => {
  return useQuery({
    queryKey: SO_SERIAL_QUERY_KEYS.kpi(),
    queryFn: async () => {
      const res = await getSoSerialKPIApi();
      return (res?.data ?? res) as SoSerialKPI;
    },
    placeholderData: (prev) => prev,
    staleTime: 10000,
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
      queryClient.invalidateQueries({ queryKey: SO_SERIAL_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Đăng ký số Serial / Số Khung thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể đăng ký số Serial!");
    },
  });
};

export const useUpdateSoSerial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSoSerialPayload) => updateSoSerialApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SO_SERIAL_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["productNavTabs"] });
      toast.success("Cập nhật số Serial / Số Khung thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể cập nhật số Serial!");
    },
  });
};

export const useKichHoatBaoHanh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: KichHoatBaoHanhPayload) =>
      kichHoatBaoHanhApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SO_SERIAL_QUERY_KEYS.all });
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
    mutationFn: (payload: ChuyenTrangThaiSerialPayload) =>
      chuyenTrangThaiSerialApi(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SO_SERIAL_QUERY_KEYS.all });
      toast.success("Chuyển trạng thái thiết bị thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể chuyển trạng thái thiết bị!");
    },
  });
};

export const useGetSoSerialHinhAnh = (soSerialID?: string) => {
  return useQuery({
    queryKey: SO_SERIAL_QUERY_KEYS.images(soSerialID || ""),
    queryFn: async () => {
      if (!soSerialID) return [];
      const res = await getSoSerialHinhAnhApi({ SoSerialID: soSerialID });
      return (res?.data ?? res ?? []) as SP_SoSerial_HinhAnh[];
    },
    enabled: !!soSerialID,
  });
};

export const useUploadSoSerialHinhAnh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => uploadSoSerialHinhAnhApi(formData),
    onSuccess: (_, variables) => {
      const serialId = variables.get("soSerialID") as string;
      if (serialId) {
        queryClient.invalidateQueries({
          queryKey: SO_SERIAL_QUERY_KEYS.images(serialId),
        });
        queryClient.invalidateQueries({
          queryKey: SO_SERIAL_QUERY_KEYS.detail(serialId),
        });
      }
      queryClient.invalidateQueries({ queryKey: SO_SERIAL_QUERY_KEYS.lists() });
      toast.success("Tải lên hình ảnh thành công!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể tải lên hình ảnh!");
    },
  });
};

export const useDeleteSoSerialHinhAnh = (soSerialID?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSoSerialHinhAnhApi(id),
    onSuccess: () => {
      if (soSerialID) {
        queryClient.invalidateQueries({
          queryKey: SO_SERIAL_QUERY_KEYS.images(soSerialID),
        });
        queryClient.invalidateQueries({
          queryKey: SO_SERIAL_QUERY_KEYS.detail(soSerialID),
        });
      }
      toast.success("Đã xóa hình ảnh!");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Không thể xóa hình ảnh!");
    },
  });
};
