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
 * Lấy danh sách danh mục chi tiết (có tìm kiếm, lọc theo danh mục cha, phân trang)
 * POST /api/DanhMucChiTietApi/Gets
 */
export const getDanhMucChiTietApi = async (
  filter: DanhMucChiTietFilter = { PageIndex: 1, PageSize: 10, TuKhoa: "", TrangThai: null }
) => {
  const response = await api.post(
    `${APP_URL}/DanhMucChiTietApi/Gets`,
    {
      DanhMucID: filter.DanhMucID ?? null,
      TuKhoa: filter.TuKhoa ?? "",
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 10,
      TrangThai: filter.TrangThai ?? null,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy thông tin chi tiết một danh mục con theo ID
 * POST /api/DanhMucChiTietApi/Get
 */
export const getDanhMucChiTietByIdApi = async (id: number) => {
  const response = await api.post(
    `${APP_URL}/DanhMucChiTietApi/Get`,
    { Id: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
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
 * Lấy dữ liệu thống kê KPI danh mục chi tiết
 * POST /api/DanhMucChiTiet/GetKPI
 */
export const getDanhMucChiTietKPIApi = async (): Promise<DanhMucChiTietKPI> => {
  const response = await api.post(
    `${APP_URL}/DanhMucChiTiet/GetKPI`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data?.data ?? response.data;
};
