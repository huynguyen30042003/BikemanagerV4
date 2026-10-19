import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreateDanhMucChungPayload,
  DanhMucChungFilter,
  UpdateDanhMucChungPayload,
  DMC_NavTabs,
  DanhMucChungKPI,
} from "@/types/danhMucChung";


const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách danh mục chung có tìm kiếm và phân trang
 * POST /api/DanhMucChungApi/Gets
 */
export const getDanhMucChungApi = async (
  filter: DanhMucChungFilter = { PageIndex: 1, PageSize: 10, TuKhoa: "", TrangThai: null }
) => {
  const response = await api.post(
    `${APP_URL}/DanhMucChungApi/Gets`,
    {
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
 * Lấy thông tin chi tiết một danh mục chung theo ID
 * POST /api/DanhMucChungApi/Get
 */
export const getDanhMucChungByIdApi = async (id: number) => {
  const response = await api.post(
    `${APP_URL}/DanhMucChungApi/Get`,
    { Id: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Thêm mới danh mục chung
 * POST /api/DanhMucChungApi/Add
 */
export const createDanhMucChungApi = async (payload: CreateDanhMucChungPayload) => {
  const response = await api.post(
    `${APP_URL}/DanhMucChungApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật thông tin danh mục chung
 * PUT /api/DanhMucChungApi/Edit
 */
export const updateDanhMucChungApi = async (payload: UpdateDanhMucChungPayload) => {
  const response = await api.put(
    `${APP_URL}/DanhMucChungApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xóa danh mục chung theo ID
 * DELETE /api/DanhMucChungApi/Delete?DanhMucID={id}
 */
export const deleteDanhMucChungApi = async (danhMucId: number) => {
  const response = await api.delete(
    `${APP_URL}/DanhMucChungApi/Delete`,
    {
      params: { DanhMucID: danhMucId },
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Đồng bộ danh mục chung từ dữ liệu mặc định
 * POST /api/DanhMucChungApi/Sync
 */
export const syncDanhMucChungApi = async () => {
  const response = await api.post(
    `${APP_URL}/DanhMucChungApi/Sync`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy số lượng thống kê cho các tabs danh mục
 * GET /api/DanhMucChungApi/NavTabs
 */
export const getDanhMucChungNavTabsApi = async (): Promise<DMC_NavTabs> => {
  const response = await api.get(`${APP_URL}/DanhMucChungApi/NavTabs`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });

  return response.data?.data ?? response.data;
};

/**
 * Lấy dữ liệu thống kê KPI danh mục dùng chung
 * GET /api/DanhMucChung/GetKPI
 */
export const getDanhMucChungKPIApi = async (): Promise<DanhMucChungKPI> => {
  const endpoints = [
    `${APP_URL}/DanhMucChung/GetKPI`,
    `${APP_URL}/DanhMucChungApi/GetKPI`,
    `/api/DanhMucChung/GetKPI`,
  ];

  for (const url of endpoints) {
    try {
      const response = await api.get(url, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });
      if (response?.data?.data) {
        return response.data.data;
      }
      if (response?.data?.total_DanhMucChung !== undefined) {
        return response.data;
      }
    } catch {
      try {
        const response = await api.post(
          url,
          {},
          {
            headers: getAuthHeaders(),
            withCredentials: true,
          }
        );
        if (response?.data?.data) {
          return response.data.data;
        }
        if (response?.data?.total_DanhMucChung !== undefined) {
          return response.data;
        }
      } catch {
        // Tiếp tục thử URL tiếp theo
      }
    }
  }

  throw new Error("Không thể tải dữ liệu KPI danh mục dùng chung");
};

