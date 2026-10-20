import api from "@/shared/api";
import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  DonViTraGop,
  CreateDonViTraGopPayload,
  UpdateDonViTraGopPayload,
  DonViTraGopFilter,
  HopDongTraGop,
  CreateHopDongTraGopPayload,
  UpdateHopDongTraGopPayload,
  HopDongTraGopFilter,
  ChuyenTrangThaiHopDongPayload,
  XacNhanGiaiNganPayload,
  TinhDuToanTraGopPayload,
  KetQuaDuToanTraGop,
  TG_NavTabs,
  TG_DonViTraGopKPI,
  TG_TraGopKPI,
} from "@/types/traGop";


const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ==============================================================================
   1. ĐƠN VỊ TRẢ GÓP (DonViTraGopApi)
   ============================================================================== */

/** Lấy danh sách đối tác tài chính trả góp */
export const getDonViTraGopApi = async (
  filter: DonViTraGopFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/DonViTraGopApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      DangHoatDong: filter.DangHoatDong ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 50,
    },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/** Lấy chi tiết đơn vị trả góp theo ID */
export const getDonViTraGopByIdApi = async (guidId: string): Promise<DonViTraGop> => {
  const response = await api.post(
    `${APP_URL}/DonViTraGopApi/Get`,
    { GuidId: guidId },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/** Thêm mới đơn vị trả góp */
export const createDonViTraGopApi = async (payload: CreateDonViTraGopPayload) => {
  const response = await api.post(`${APP_URL}/DonViTraGopApi/Add`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** Cập nhật thông tin đơn vị trả góp */
export const updateDonViTraGopApi = async (payload: UpdateDonViTraGopPayload) => {
  const response = await api.put(`${APP_URL}/DonViTraGopApi/Edit`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** Xóa đơn vị trả góp */
export const deleteDonViTraGopApi = async (donViTraGopID: string) => {
  const response = await api.delete(`${APP_URL}/DonViTraGopApi/Delete`, {
    params: { DonViTraGopID: donViTraGopID },
    headers: getAuthHeaders(),
  });
  return response.data;
};

/* ==============================================================================
   2. HỢP ĐỒNG TRẢ GÓP (TraGopApi)
   ============================================================================== */

/** Lấy danh sách hồ sơ / hợp đồng trả góp */
export const getHopDongTraGopApi = async (
  filter: HopDongTraGopFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/TraGopApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      DonHangID: filter.DonHangID ?? null,
      KhachHangID: filter.KhachHangID ?? null,
      DonViTraGopID: filter.DonViTraGopID ?? null,
      TrangThaiHopDongID: filter.TrangThaiHopDongID ?? null,
      TrangThaiGiaiNganID: filter.TrangThaiGiaiNganID ?? null,
      TuNgay: filter.TuNgay ?? null,
      DenNgay: filter.DenNgay ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
    },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/** Lấy chi tiết hồ sơ hợp đồng trả góp theo ID */
export const getHopDongTraGopByIdApi = async (guidId: string): Promise<HopDongTraGop> => {
  const response = await api.post(
    `${APP_URL}/TraGopApi/Get`,
    { GuidId: guidId },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/** Lấy thông tin hợp đồng trả góp theo Đơn hàng */
export const getHopDongTraGopByDonHangApi = async (
  donHangID: string
): Promise<HopDongTraGop> => {
  const response = await api.post(
    `${APP_URL}/TraGopApi/GetByDonHang`,
    null,
    {
      params: { DonHangID: donHangID },
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

/** Tạo mới hồ sơ đề nghị vay trả góp cho đơn hàng */
export const createHopDongTraGopApi = async (payload: CreateHopDongTraGopPayload) => {
  const response = await api.post(`${APP_URL}/TraGopApi/Add`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** Chỉnh sửa / bổ sung thông tin hồ sơ trả góp */
export const updateHopDongTraGopApi = async (payload: UpdateHopDongTraGopPayload) => {
  const response = await api.post(`${APP_URL}/TraGopApi/Edit`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** Chuyển trạng thái thẩm định hồ sơ (Chờ duyệt = 110, Đã duyệt = 111, Từ chối = 112...) */
export const chuyenTrangThaiHopDongApi = async (
  payload: ChuyenTrangThaiHopDongPayload
) => {
  const response = await api.post(`${APP_URL}/TraGopApi/ChuyenTrangThai`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** Xác nhận tiền giải ngân từ công ty tài chính về tài khoản Showroom */
export const xacNhanGiaiNganApi = async (payload: XacNhanGiaiNganPayload) => {
  const response = await api.post(`${APP_URL}/TraGopApi/XacNhanGiaiNgan`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** Công cụ tính toán nhanh dự toán trả góp */
export const tinhDuToanTraGopApi = async (
  payload: TinhDuToanTraGopPayload
): Promise<KetQuaDuToanTraGop> => {
  const response = await api.post(`${APP_URL}/TraGopApi/TinhDuToan`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/** Xóa / Hủy hồ sơ trả góp */
export const deleteHopDongTraGopApi = async (hopDongTraGopID: string) => {
  const response = await api.delete(`${APP_URL}/TraGopApi/Delete`, {
    params: { HopDongTraGopID: hopDongTraGopID },
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Lấy số lượng thống kê cho các tabs trả góp
 * GET /api/TraGopApi/NavTabs
 */
export const getTraGopNavTabsApi = async (): Promise<TG_NavTabs> => {
  const response = await api.get(`${APP_URL}/TraGopApi/NavTabs`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });

  return response.data?.data ?? response.data;
};

/**
 * Lấy số liệu thống kê KPI Đơn vị trả góp
 * POST /api/DonViTraGopApi/GetKPI
 */
export const getDonViTraGopKPIApi = async (): Promise<TG_DonViTraGopKPI> => {
  try {
    const res = await api.post(
      `${APP_URL}/DonViTraGopApi/GetKPI`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return res.data?.data ?? res.data;
  } catch {
    const res = await api.get(`${APP_URL}/DonViTraGopApi/GetKPI`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return res.data?.data ?? res.data;
  }
};

/**
 * Lấy số liệu thống kê KPI Hợp đồng trả góp
 * POST /api/TraGopApi/GetKPI
 */
export const getTraGopKPIApi = async (): Promise<TG_TraGopKPI> => {
  try {
    const res = await api.post(
      `${APP_URL}/TraGopApi/GetKPI`,
      {},
      {
        headers: getAuthHeaders(),
        withCredentials: true,
      }
    );
    return res.data?.data ?? res.data;
  } catch {
    const res = await api.get(`${APP_URL}/TraGopApi/GetKPI`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return res.data?.data ?? res.data;
  }
};


