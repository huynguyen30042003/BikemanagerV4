import api from "@/shared/api";
import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  NH_DonNhapHang,
  DonNhapHangFilter,
  CreateDonNhapHangPayload,
  UpdateDonNhapHangPayload,
  ChuyenTrangThaiDonNhapPayload,
  ThanhToanDonNhapPayload,
  NH_LichSuThanhToan,
} from "@/types/donNhapHang";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/**
 * Lấy danh sách đơn nhập hàng
 * POST /api/DonNhapHangApi/Gets
 */
export const getDonNhapHangApi = async (
  filter: DonNhapHangFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/DonNhapHangApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      NhaCungCapID: filter.NhaCungCapID ?? null,
      KhoID: filter.KhoID ?? null,
      TrangThaiID: filter.TrangThaiID ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
    },
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Lấy chi tiết đơn nhập hàng theo ID
 * POST /api/DonNhapHangApi/Get
 */
export const getDonNhapHangByIdApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/DonNhapHangApi/Get`,
    { GuidId: id, DonNhapHangID: id},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Tạo mới đơn nhập hàng
 * POST /api/DonNhapHangApi/Add
 */
export const createDonNhapHangApi = async (payload: CreateDonNhapHangPayload) => {
  const response = await api.post(
    `${APP_URL}/DonNhapHangApi/Add`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Chỉnh sửa đơn nhập hàng (Lưu tạm hoặc Chờ duyệt)
 * POST /api/DonNhapHangApi/Edit
 */
export const updateDonNhapHangApi = async (payload: UpdateDonNhapHangPayload) => {
  const response = await api.post(
    `${APP_URL}/DonNhapHangApi/Edit`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Chuyển trạng thái đơn nhập
 * POST /api/DonNhapHangApi/ChuyenTrangThai
 */
export const chuyenTrangThaiDonNhapApi = async (payload: ChuyenTrangThaiDonNhapPayload) => {
  const response = await api.post(
    `${APP_URL}/DonNhapHangApi/ChuyenTrangThai`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Xác nhận nhập kho thực tế
 * POST /api/DonNhapHangApi/XacNhanNhapKho?DonNhapHangID={id}
 */
export const xacNhanNhapKhoApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/DonNhapHangApi/XacNhanNhapKho?DonNhapHangID=${id}`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Xóa đơn nhập hàng
 * DELETE /api/DonNhapHangApi/Delete?DonNhapHangID={id}
 */
export const deleteDonNhapHangApi = async (id: string) => {
  const response = await api.delete(
    `${APP_URL}/DonNhapHangApi/Delete?DonNhapHangID=${id}`,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Lấy lịch sử thanh toán của đơn nhập
 * POST /api/DonNhapHangApi/GetsLichSuThanhToan?DonNhapHangID={id}
 */
export const getLichSuThanhToanDonNhapApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/DonNhapHangApi/GetsLichSuThanhToan?DonNhapHangID=${id}`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};

/**
 * Ghi nhận thanh toán tiền hàng cho NCC
 * POST /api/DonNhapHangApi/AddLichSuThanhToan
 */
export const addLichSuThanhToanDonNhapApi = async (payload: ThanhToanDonNhapPayload) => {
  const response = await api.post(
    `${APP_URL}/DonNhapHangApi/AddLichSuThanhToan`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};
