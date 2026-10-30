import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateDiaPhuongCapTinhPayload,
  DiaPhuongCapTinhFilter,
  UpdateDiaPhuongCapTinhPayload,
  DiaPhuongCapTinhKPI,
} from "@/types/diaPhuongCapTinh";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách tỉnh/thành phố có tìm kiếm và phân trang (gọi qua Next.js Route Handler BFF)
 * GET /api/dia-phuong-cap-tinh
 */
export const getDiaPhuongCapTinhApi = async (
  filter: DiaPhuongCapTinhFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", TrangThai: null }
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

  const response = await fetch(`/api/dia-phuong-cap-tinh?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải danh mục tỉnh/thành phố: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy chi tiết thông tin một tỉnh/thành phố theo ID (gọi qua Next.js Route Handler BFF)
 * GET /api/dia-phuong-cap-tinh/[id]
 */
export const getDiaPhuongCapTinhByIdApi = async (id: number) => {
  const response = await fetch(`/api/dia-phuong-cap-tinh/${id}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải chi tiết tỉnh/thành phố ID ${id}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Thêm mới tỉnh/thành phố
 * POST /api/DiaPhuongCapTinhApi/Add
 */
export const createDiaPhuongCapTinhApi = async (payload: CreateDiaPhuongCapTinhPayload) => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapTinhApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin tỉnh/thành phố
 * PUT /api/DiaPhuongCapTinhApi/Edit
 */
export const updateDiaPhuongCapTinhApi = async (payload: UpdateDiaPhuongCapTinhPayload) => {
  const response = await api.put(
    `${APP_URL}/DiaPhuongCapTinhApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa tỉnh/thành phố theo ID
 * DELETE /api/DiaPhuongCapTinhApi/Delete?TinhID={id}
 */
export const deleteDiaPhuongCapTinhApi = async (tinhId: number) => {
  const response = await api.delete(
    `${APP_URL}/DiaPhuongCapTinhApi/Delete`,
    {
      params: { TinhID: tinhId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đồng bộ danh mục tỉnh/thành phố từ dữ liệu chuẩn
 * POST /api/DiaPhuongCapTinhApi/Sync
 */
export const syncDiaPhuongCapTinhApi = async () => {
  const response = await api.post(
    `${APP_URL}/DiaPhuongCapTinhApi/Sync`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy dữ liệu thống kê KPI tỉnh/thành phố (gọi qua Next.js Route Handler BFF)
 * GET /api/dia-phuong-cap-tinh/kpi
 */
export const getDiaPhuongCapTinhKPIApi = async (): Promise<DiaPhuongCapTinhKPI> => {
  const response = await fetch(`/api/dia-phuong-cap-tinh/kpi`);
  if (!response.ok) {
    throw new Error(`Lỗi tải KPI tỉnh/thành phố: ${response.statusText}`);
  }
  return response.json();
};
