import api from "@/shared/api";
import { APP_URL, BE_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  NH_NhaCungCap,
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
 * Lấy danh sách nhà cung cấp (phân trang, lọc quốc gia, công nợ, tìm kiếm)
 * POST /api/NhaCungCapApi/Gets
 */
export const getNhaCungCapApi = async (
  filter: NhaCungCapFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "", TrangThai: true }
) => {
  const response = await api.post(
    `${APP_URL}/NhaCungCapApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      QuocGiaID: filter.QuocGiaID ?? null,
      CoCongNo: filter.CoCongNo ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
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
 * Lấy chi tiết thông tin nhà cung cấp theo ID
 * POST /api/NhaCungCapApi/Get
 */
export const getNhaCungCapByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/NhaCungCapApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
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
 * Lấy số liệu KPI tổng quan nhà cung cấp
 * POST /api/NhaCungCapApi/GetKPI
 */
export const getNhaCungCapKPIApi = async () => {
  const response = await api.post(
    `${APP_URL}/NhaCungCapApi/GetKPI`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Lấy số lượng thống kê cho các tabs nhập hàng (Nhà cung cấp, Đơn nhập hàng & Nhập kho)
 * POST /api/v1/NhaCungCapApi/NavTabs
 */
export const getPurchaseNavTabsApi = async (): Promise<NH_PurchaseNavTabs> => {
  const endpoints = [
    `${BE_URL}/api/v1/NhaCungCapApi/NavTabs`,
    `${APP_URL}/NhaCungCapApi/NavTabs`,
    `${APP_URL}/DonNhapHangApi/NavTabs`,
    `/api/v1/NhaCungCapApi/NavTabs`,
  ];

  for (const url of endpoints) {
    try {
      const response = await api.post(
        url,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );
      if (response?.data) {
        return response.data?.data ?? response.data;
      }
    } catch {
      try {
        const response = await api.get(url, {
          headers: getAuthHeaders(),
          withCredentials: true,
        });
        if (response?.data) {
          return response.data?.data ?? response.data;
        }
      } catch {
        // Thử endpoint tiếp theo
      }
    }
  }

  const fallback = await api.post(
    `${BE_URL}/api/v1/NhaCungCapApi/NavTabs`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return fallback.data?.data ?? fallback.data;
};



