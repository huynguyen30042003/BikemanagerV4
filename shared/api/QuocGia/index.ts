import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateQuocGiaPayload,
  QuocGiaFilter,
  QuocGiaKPI,
  UpdateQuocGiaPayload,
} from "@/types/quocGia";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy số liệu thống kê KPI Quốc gia (qua Next.js BFF Route Cache)
 * GET /api/quoc-gia/kpi
 */
export const getQuocGiaKPIApi = async (): Promise<QuocGiaKPI> => {
  const response = await fetch(`/api/quoc-gia/kpi`);
  if (!response.ok) {
    throw new Error(`Lỗi tải KPI quốc gia: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy danh sách quốc gia có phân trang và tìm kiếm (qua Next.js BFF Route Cache)
 * GET /api/quoc-gia
 */
export const getQuocGiaApi = async (
  filter: QuocGiaFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", TrangThai: null }
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

  const response = await fetch(`/api/quoc-gia?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải danh mục quốc gia: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy chi tiết thông tin một quốc gia theo ID (qua Next.js BFF Route Cache)
 * GET /api/quoc-gia/[id]
 */
export const getQuocGiaByIdApi = async (id: number) => {
  const response = await fetch(`/api/quoc-gia/${id}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải chi tiết quốc gia ID ${id}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Thêm mới quốc gia
 * POST /api/QuocGiaApi/Add
 */
export const createQuocGiaApi = async (payload: CreateQuocGiaPayload) => {
  const response = await api.post(
    `${APP_URL}/QuocGiaApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin quốc gia
 * PUT /api/QuocGiaApi/Edit
 */
export const updateQuocGiaApi = async (payload: UpdateQuocGiaPayload) => {
  const response = await api.put(
    `${APP_URL}/QuocGiaApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa quốc gia theo ID
 * DELETE /api/QuocGiaApi/Delete?QuocGiaID={id}
 */
export const deleteQuocGiaApi = async (quocGiaId: number) => {
  const response = await api.delete(
    `${APP_URL}/QuocGiaApi/Delete`,
    {
      params: { QuocGiaID: quocGiaId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đồng bộ danh mục quốc gia từ file dữ liệu chuẩn
 * POST /api/QuocGiaApi/Sync
 */
export const syncQuocGiaApi = async () => {
  const response = await api.post(
    `${APP_URL}/QuocGiaApi/Sync`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};
