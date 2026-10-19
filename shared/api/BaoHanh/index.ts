import api from "@/shared/api";
import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  BH_BaoHanh,
  BaoHanhFilter,
  CreateBaoHanhPayload,
  BH_PhieuBaoHanh,
  PhieuBaoHanhFilter,
  CreatePhieuBaoHanhPayload,
} from "@/types/baoHanh";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ==================== SỔ BẢO HÀNH ĐIỆN TỬ (BaoHanhApi - Mục 25) ==================== */

/**
 * Lấy danh sách sổ bảo hành điện tử có lọc và phân trang
 * POST /api/BaoHanhApi/Gets
 */
export const getBaoHanhApi = async (
  filter: BaoHanhFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/BaoHanhApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      KhachHangID: filter.KhachHangID ?? null,
      TrangThaiID: filter.TrangThaiID ?? null,
      SoSerialID: filter.SoSerialID ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
    },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Lấy thông tin chi tiết sổ bảo hành theo ID hoặc Mã
 * POST /api/BaoHanhApi/Get
 */
export const getBaoHanhByIdApi = async (id: string): Promise<BH_BaoHanh> => {
  const response = await api.post(
    `${APP_URL}/BaoHanhApi/Get`,
    { BaoHanhID: id, GuidId: id },
    { headers: getAuthHeaders() }
  );
  return response.data?.data ?? response.data;
};

/**
 * Tra cứu bảo hành điện tử nhanh (theo Số khung, Số máy, Số pin, Biển số xe, SĐT hoặc Mã BH)
 * GET /api/BaoHanhApi/TraCuu?tuKhoa={tuKhoa}
 */
export const traCuuBaoHanhApi = async (tuKhoa: string) => {
  const response = await api.get(`${APP_URL}/BaoHanhApi/TraCuu`, {
    params: { tuKhoa },
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Đăng ký / Kích hoạt thủ công sổ bảo hành điện tử
 * POST /api/BaoHanhApi/Add
 */
export const createBaoHanhApi = async (payload: CreateBaoHanhPayload) => {
  const response = await api.post(`${APP_URL}/BaoHanhApi/Add`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Cập nhật thông tin sổ bảo hành
 * POST /api/BaoHanhApi/Edit
 */
export const updateBaoHanhApi = async (payload: Partial<CreateBaoHanhPayload> & { BaoHanhID: string }) => {
  const response = await api.post(`${APP_URL}/BaoHanhApi/Edit`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Xóa sổ bảo hành
 * DELETE /api/BaoHanhApi/Delete?BaoHanhID={id}
 */
export const deleteBaoHanhApi = async (id: string) => {
  const response = await api.delete(`${APP_URL}/BaoHanhApi/Delete?BaoHanhID=${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/* ==================== PHIẾU BẢO HÀNH (BaoHanhApi - Mục 25) ==================== */

/**
 * Lấy danh sách phiếu yêu cầu bảo hành có phân trang và lọc
 * POST /api/BaoHanhApi/GetsPhieuBaoHanh
 */
export const getPhieuBaoHanhApi = async (
  filter: PhieuBaoHanhFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/BaoHanhApi/GetsPhieuBaoHanh`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      KhachHangID: filter.KhachHangID ?? null,
      TrangThaiID: filter.TrangThaiID ?? null,
      HuongXuLyID: filter.HuongXuLyID ?? null,
      DiaDiemID: filter.DiaDiemID ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
    },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Lấy thông tin chi tiết một phiếu bảo hành
 * POST /api/BaoHanhApi/GetPhieuBaoHanh
 */
export const getPhieuBaoHanhByIdApi = async (id: string): Promise<BH_PhieuBaoHanh> => {
  const response = await api.post(
    `${APP_URL}/BaoHanhApi/GetPhieuBaoHanh`,
    { PhieuBaoHanhID: id, GuidId: id },
    { headers: getAuthHeaders() }
  );
  return response.data?.data ?? response.data;
};

/**
 * Tạo phiếu tiếp nhận bảo hành xe / linh kiện
 * POST /api/BaoHanhApi/AddPhieuBaoHanh
 */
export const createPhieuBaoHanhApi = async (payload: CreatePhieuBaoHanhPayload) => {
  const response = await api.post(`${APP_URL}/BaoHanhApi/AddPhieuBaoHanh`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Cập nhật phiếu tiếp nhận bảo hành
 * POST /api/BaoHanhApi/EditPhieuBaoHanh
 */
export const updatePhieuBaoHanhApi = async (payload: Partial<CreatePhieuBaoHanhPayload> & { PhieuBaoHanhID: string }) => {
  const response = await api.post(`${APP_URL}/BaoHanhApi/EditPhieuBaoHanh`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Chuyển trạng thái phiếu bảo hành
 * POST /api/BaoHanhApi/ChuyenTrangThaiPhieuBaoHanh
 */
export const chuyenTrangThaiPhieuBaoHanhApi = async (payload: { PhieuBaoHanhID: string; TrangThaiID: number; GhiChu?: string }) => {
  const response = await api.post(`${APP_URL}/BaoHanhApi/ChuyenTrangThaiPhieuBaoHanh`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Xóa phiếu bảo hành
 * DELETE /api/BaoHanhApi/DeletePhieuBaoHanh?PhieuBaoHanhID={id}
 */
export const deletePhieuBaoHanhApi = async (id: string) => {
  const response = await api.delete(`${APP_URL}/BaoHanhApi/DeletePhieuBaoHanh?PhieuBaoHanhID=${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
