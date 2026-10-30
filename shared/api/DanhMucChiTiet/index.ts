import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateDanhMucChiTietPayload,
  DanhMucChiTietFilter,
  DanhMucChiTietKPI,
  UpdateDanhMucChiTietPayload,
} from "@/types/danhMucChiTiet";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách danh mục chi tiết (gọi qua Next.js Route Handler BFF để tận dụng Data Cache 24h)
 * GET /api/danh-muc-chi-tiet
 */
export const getDanhMucChiTietApi = async (
  filter: DanhMucChiTietFilter = { PageIndex: 1, PageSize: 10, TuKhoa: "", TrangThai: null }
) => {
  const params = new URLSearchParams();
  if (filter.DanhMucID !== undefined && filter.DanhMucID !== null) {
    params.set("DanhMucID", String(filter.DanhMucID));
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

  const response = await fetch(`/api/danh-muc-chi-tiet?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải danh mục chi tiết: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy thông tin chi tiết một danh mục con theo ID (gọi qua Next.js Route Handler BFF)
 * GET /api/danh-muc-chi-tiet/[id]
 */
export const getDanhMucChiTietByIdApi = async (id: number) => {
  const response = await fetch(`/api/danh-muc-chi-tiet/${id}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải chi tiết danh mục ID ${id}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Thêm mới mục chi tiết vào danh mục chung
 * POST /api/DanhMucChiTietApi/Add
 */
export const createDanhMucChiTietApi = async (payload: CreateDanhMucChiTietPayload) => {
  const response = await api.post(
    `${APP_URL}/DanhMucChiTietApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin danh mục chi tiết
 * PUT /api/DanhMucChiTietApi/Edit
 */
export const updateDanhMucChiTietApi = async (payload: UpdateDanhMucChiTietPayload) => {
  const response = await api.put(
    `${APP_URL}/DanhMucChiTietApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa danh mục chi tiết theo ID
 * DELETE /api/DanhMucChiTietApi/Delete?DanhMucChiTietID={id}
 */
export const deleteDanhMucChiTietApi = async (danhMucChiTietId: number) => {
  const response = await api.delete(
    `${APP_URL}/DanhMucChiTietApi/Delete`,
    {
      params: { DanhMucChiTietID: danhMucChiTietId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đồng bộ danh sách danh mục chi tiết mặc định
 * POST /api/DanhMucChiTietApi/Sync
 */
export const syncDanhMucChiTietApi = async () => {
  const response = await api.post(
    `${APP_URL}/DanhMucChiTietApi/Sync`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy dữ liệu thống kê KPI danh mục chi tiết (gọi qua Next.js Route Handler BFF)
 * GET /api/danh-muc-chi-tiet/kpi
 */
export const getDanhMucChiTietKPIApi = async (): Promise<DanhMucChiTietKPI> => {
  const response = await fetch(`/api/danh-muc-chi-tiet/kpi`);
  if (!response.ok) {
    throw new Error(`Lỗi tải KPI danh mục chi tiết: ${response.statusText}`);
  }
  return response.json();
};
