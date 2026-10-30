import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateDiaPhuongCapXaPayload,
  DiaPhuongCapXaFilter,
  UpdateDiaPhuongCapXaPayload,
  DiaPhuongCapXaKPI,
} from "@/types/diaPhuongCapXa";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách xã/phường có phân trang và lọc theo TỉnhID (qua Next.js BFF Route Cache)
 * GET /api/dia-phuong-cap-xa
 */
export const getDiaPhuongCapXaApi = async (
  filter: DiaPhuongCapXaFilter = {
    PageIndex: 1,
    PageSize: 50,
    TuKhoa: "",
    TrangThai: null,
    TinhID: null,
  }
) => {
  const params = new URLSearchParams();
  if (filter.TinhID !== undefined && filter.TinhID !== null) {
    params.set("TinhID", String(filter.TinhID));
  }
  if (filter.TuKhoa) {
    params.set("TuKhoa", filter.TuKhoa);
  }
  if (filter.PageIndex) {
    params.set("PageIndex", String(filter.PageIndex));
  }
  if (filter.PageSize) {
    params.set("PageSize", String(filter.PageSize));
  }
  if (filter.TrangThai !== undefined && filter.TrangThai !== null) {
    params.set("TrangThai", String(filter.TrangThai));
  }

  const response = await fetch(`/api/dia-phuong-cap-xa?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải danh mục xã/phường: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy thông tin chi tiết một xã/phường theo ID (qua Next.js BFF Route Cache)
 * GET /api/dia-phuong-cap-xa/[id]
 */
export const getDiaPhuongCapXaByIdApi = async (id: number) => {
  const response = await fetch(`/api/dia-phuong-cap-xa/${id}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải chi tiết xã/phường ID ${id}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy dữ liệu thống kê KPI xã/phường (qua Next.js BFF Route Cache)
 * GET /api/dia-phuong-cap-xa/kpi
 */
export const getDiaPhuongCapXaKPIApi = async (): Promise<DiaPhuongCapXaKPI> => {
  const response = await fetch(`/api/dia-phuong-cap-xa/kpi`);
  if (!response.ok) {
    throw new Error(`Lỗi tải KPI xã/phường: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Thêm mới xã/phường
 * POST /api/DiaPhuongCapXaApi/Add
 */
export const createDiaPhuongCapXaApi = async (
  payload: CreateDiaPhuongCapXaPayload
) => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapXaApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin xã/phường
 * PUT /api/DiaPhuongCapXaApi/Edit
 */
export const updateDiaPhuongCapXaApi = async (
  payload: UpdateDiaPhuongCapXaPayload
) => {
  const response = await api.put(
    `${APP_URL}/DiaPhuongCapXaApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa xã/phường theo ID
 * DELETE /api/DiaPhuongCapXaApi/Delete?XaID={id}
 */
export const deleteDiaPhuongCapXaApi = async (xaId: number) => {
  const response = await api.delete(
    `${APP_URL}/DiaPhuongCapXaApi/Delete`,
    {
      params: { XaID: xaId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đồng bộ danh mục xã/phường từ dữ liệu chuẩn
 * POST /api/DiaPhuongCapXaApi/Sync
 */
export const syncDiaPhuongCapXaApi = async () => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapXaApi/Sync`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
