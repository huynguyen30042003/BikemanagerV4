import api from "@/shared/api";
import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  NhaCungCapFilter,
  CreateNhaCungCapPayload,
  UpdateNhaCungCapPayload,
  NH_PurchaseNavTabs,
} from "@/types/nhaCungCap";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/**
 * Lấy danh sách nhà cung cấp (phân trang, lọc quốc gia, công nợ, tìm kiếm) qua Next.js BFF Route Cache
 * GET /api/nha-cung-cap
 */
export const getNhaCungCapApi = async (
  filter: NhaCungCapFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "", TrangThai: true }
) => {
  const params = new URLSearchParams();
  if (filter.TuKhoa) {
    params.set("TuKhoa", filter.TuKhoa);
  }
  if (filter.QuocGiaID !== undefined && filter.QuocGiaID !== null) {
    params.set("QuocGiaID", String(filter.QuocGiaID));
  }
  if (filter.CoCongNo !== undefined && filter.CoCongNo !== null) {
    params.set("CoCongNo", String(filter.CoCongNo));
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

  const response = await fetch(`/api/nha-cung-cap?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải danh sách nhà cung cấp: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Lấy chi tiết thông tin nhà cung cấp theo ID qua Next.js BFF Route Cache
 * GET /api/nha-cung-cap/[id]
 */
export const getNhaCungCapByIdApi = async (id: string) => {
  const response = await fetch(`/api/nha-cung-cap/${id}`);
  if (!response.ok) {
    throw new Error(`Lỗi tải chi tiết nhà cung cấp ID ${id}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Thêm mới nhà cung cấp
 * POST /api/NhaCungCapApi/Add
 */
export const createNhaCungCapApi = async (payload: CreateNhaCungCapPayload) => {
  const response = await api.post(
    `${APP_URL}/NhaCungCapApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Cập nhật thông tin nhà cung cấp
 * PUT /api/NhaCungCapApi/Edit
 */
export const updateNhaCungCapApi = async (payload: UpdateNhaCungCapPayload) => {
  const response = await api.put(
    `${APP_URL}/NhaCungCapApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Xóa nhà cung cấp theo ID
 * DELETE /api/NhaCungCapApi/Delete?NhaCungCapID={id}
 */
export const deleteNhaCungCapApi = async (id: string) => {
  const response = await api.delete(
    `${APP_URL}/NhaCungCapApi/Delete?NhaCungCapID=${id}`,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Lấy số liệu KPI tổng quan nhà cung cấp qua Next.js BFF Route Cache
 * GET /api/nha-cung-cap/kpi
 */
export const getNhaCungCapKPIApi = async () => {
  const response = await fetch(`/api/nha-cung-cap/kpi`);
  if (!response.ok) {
    throw new Error(`Lỗi tải KPI nhà cung cấp: ${response.statusText}`);
  }
  const json = await response.json();
  return json?.data ?? json;
};

/**
 * Lấy số lượng thống kê cho các tabs nhập hàng qua Next.js BFF Route Cache
 * GET /api/nha-cung-cap/nav-tabs
 */
export const getPurchaseNavTabsApi = async (): Promise<NH_PurchaseNavTabs> => {
  const response = await fetch(`/api/nha-cung-cap/nav-tabs`);
  if (!response.ok) {
    throw new Error(`Lỗi tải NavTabs nhập hàng: ${response.statusText}`);
  }
  const json = await response.json();
  return json?.data ?? json;
};
