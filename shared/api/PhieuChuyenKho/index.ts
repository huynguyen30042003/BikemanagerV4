import api from "..";
import { APP_URL } from "../../constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  CreatePhieuChuyenPayload,
  HuyPhieuChuyenPayload,
  NhanHangPayload,
  PhieuChuyenFilter,
  XuatKhoPayload,
  KHO_PhieuChuyenKhoKPI,
} from "@/types/phieuChuyenKho";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy danh sách phiếu chuyển kho
 * POST /api/PhieuChuyenKhoApi/Gets
 */
export const getPhieuChuyenKhoApi = async (
  filter: PhieuChuyenFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "", KhoID: null, TrangThaiID: null }
) => {
  const response = await api.post(
    `${APP_URL}/PhieuChuyenKhoApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      KhoID: filter.KhoID || null,
      TrangThaiID: filter.TrangThaiID ?? null,
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
 * Lấy chi tiết phiếu chuyển kho kèm danh sách hàng & serial
 * POST /api/PhieuChuyenKhoApi/Get
 */
export const getPhieuChuyenKhoByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/PhieuChuyenKhoApi/Get`,
    { GuidId: id },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Tạo phiếu điều chuyển kho mới
 * POST /api/PhieuChuyenKhoApi/Add
 */
export const createPhieuChuyenKhoApi = async (payload: CreatePhieuChuyenPayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuChuyenKhoApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Duyệt xuất kho điều chuyển (trừ kho xuất, đổi trạng thái đi đường)
 * POST /api/PhieuChuyenKhoApi/XuatKho
 */
export const xuatKhoChuyenKhoApi = async (payload: XuatKhoPayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuChuyenKhoApi/XuatKho`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Xác nhận nhận hàng tại kho đích (cộng kho nhập, đổi vị trí serial)
 * POST /api/PhieuChuyenKhoApi/NhanHang
 */
export const nhanHangChuyenKhoApi = async (payload: NhanHangPayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuChuyenKhoApi/NhanHang`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Hủy phiếu điều chuyển kho
 * POST /api/PhieuChuyenKhoApi/Huy
 */
export const huyPhieuChuyenKhoApi = async (payload: HuyPhieuChuyenPayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuChuyenKhoApi/Huy`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  return response.data;
};

/**
 * Lấy số liệu thống kê KPI Phiếu chuyển kho
 * POST /api/PhieuChuyenKhoApi/GetKPI
 */
export const getPhieuChuyenKhoKPIApi = async (): Promise<KHO_PhieuChuyenKhoKPI> => {
  try {
    const res = await api.post(
      `${APP_URL}/PhieuChuyenKhoApi/GetKPI`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return res.data?.data ?? res.data;
  } catch {
    const res = await api.get(`${APP_URL}/PhieuChuyenKhoApi/GetKPI`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return res.data?.data ?? res.data;
  }
};

