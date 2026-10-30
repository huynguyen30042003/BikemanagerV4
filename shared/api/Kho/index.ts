import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateKhoPayload,
  KhoFilter,
  UpdateKhoPayload,
  KHO_WarehouseNavTabs,
  KHO_KhoKPI,
} from "@/types/kho";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách kho hàng có phân trang và tìm kiếm (qua Next.js BFF Route Cache)
 * GET /api/kho
 */
export const getKhoApi = async (
  filter: KhoFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", TrangThai: null }
) => {
  const params = new URLSearchParams();
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

  const response = await fetch(`/api/kho?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải danh sách kho: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy chi tiết thông tin kho hàng theo ID (qua Next.js BFF Route Cache)
 * GET /api/kho/[id]
 */
export const getKhoByIdApi = async (id: string) => {
  const response = await fetch(`/api/kho/${id}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải chi tiết kho ID ${id}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Thêm mới kho hàng hoặc bãi lưu trữ xe
 * POST /api/KhoApi/Add
 */
export const createKhoApi = async (payload: CreateKhoPayload) => {
  const response = await api.post(
    `${APP_URL}/KhoApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin kho hàng
 * POST /api/KhoApi/Edit
 */
export const updateKhoApi = async (payload: UpdateKhoPayload) => {
  const response = await api.post(
    `${APP_URL}/KhoApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa kho hàng theo ID
 * POST /api/KhoApi/Delete
 */
export const deleteKhoApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/KhoApi/Delete`,
    { KhoID: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy số lượng thống kê cho các tabs quản lý kho bãi (qua Next.js BFF Route Cache)
 * GET /api/kho/nav-tabs
 */
export const getWarehouseNavTabsApi = async (): Promise<KHO_WarehouseNavTabs> => {
  const response = await fetch(`/api/kho/nav-tabs`);
  if (!response.ok) {
    throw new Error(`Lỗi tải NavTabs kho bãi: ${response.statusText}`);
  }
  const json = await response.json();
  return json?.data ?? json;
};

/**
 * Lấy số liệu thống kê KPI Kho bãi (qua Next.js BFF Route Cache)
 * GET /api/kho/kpi
 */
export const getKhoKPIApi = async (): Promise<KHO_KhoKPI> => {
  const response = await fetch(`/api/kho/kpi`);
  if (!response.ok) {
    throw new Error(`Lỗi tải KPI kho bãi: ${response.statusText}`);
  }
  const json = await response.json();
  return json?.data ?? json;
};
