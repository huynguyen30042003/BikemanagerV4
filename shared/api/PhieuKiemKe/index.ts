import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CanBangPayload,
  CapNhatSoDemPayload,
  CreatePhieuKiemKePayload,
  HuyKiemKePayload,
  PhieuKiemKeFilter,
  KHO_PhieuKiemKeKPI,
} from "@/types/phieuKiemKe";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách phiếu kiểm kê kho
 * POST /api/PhieuKiemKeApi/Gets
 */
export const getPhieuKiemKeApi = async (
  filter: PhieuKiemKeFilter = { PageIndex: 1, PageSize: 50, KhoID: null }
) => {
  const response = await api.post(
    `${APP_URL}/PhieuKiemKeApi/Gets`,
    {
      KhoID: filter.KhoID || null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 50,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy chi tiết phiếu kiểm kê kèm kết quả đối soát
 * POST /api/PhieuKiemKeApi/Get
 */
export const getPhieuKiemKeByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/PhieuKiemKeApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Tạo mới phiếu kiểm kê kho
 * POST /api/PhieuKiemKeApi/Add
 */
export const createPhieuKiemKeApi = async (payload: CreatePhieuKiemKePayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuKiemKeApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Cập nhật số đếm thực tế kiểm kê tại kho
 * POST /api/PhieuKiemKeApi/CapNhatSoDem
 */
export const capNhatSoDemKiemKeApi = async (payload: CapNhatSoDemPayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuKiemKeApi/CapNhatSoDem`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Nghiệp vụ duyệt và cân bằng kho tự động
 * POST /api/PhieuKiemKeApi/CanBang
 */
export const canBangKiemKeApi = async (payload: CanBangPayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuKiemKeApi/CanBang`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Hủy bỏ phiếu kiểm kê kho
 * POST /api/PhieuKiemKeApi/Huy
 */
export const huyPhieuKiemKeApi = async (payload: HuyKiemKePayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuKiemKeApi/Huy`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy số liệu thống kê KPI Phiếu kiểm kê kho
 * POST /api/PhieuKiemKeApi/GetKPI
 */
export const getPhieuKiemKeKPIApi = async (): Promise<KHO_PhieuKiemKeKPI> => {
  try {
    const res = await api.post(
      `${APP_URL}/PhieuKiemKeApi/GetKPI`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return res.data?.data ?? res.data;
  } catch {
    const res = await api.get(`${APP_URL}/PhieuKiemKeApi/GetKPI`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return res.data?.data ?? res.data;
  }
};

