import api from "@/shared/api";
import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  DH_DonHang,
  DonHangFilter,
  CreateDonHangPayload,
  ChuyenTrangThaiDonHangPayload,
  AddLichSuThanhToanPayload,
  ThanhToanDonHangPayload,
  DH_LichSuThanhToan,
} from "@/types/donHang";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/**
 * Lấy danh sách đơn hàng phân trang & lọc đa tiêu chí
 * POST /api/DonHangApi/Gets
 */
export const getDonHangApi = async (
  filter: DonHangFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/DonHangApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      KhachHangID: filter.KhachHangID ?? null,
      KhoXuatID: filter.KhoXuatID ?? null,
      DiaDiemID: filter.DiaDiemID ?? null,
      TrangThaiDonHangID: filter.TrangThaiDonHangID ?? null,
      TrangThaiThanhToanID: filter.TrangThaiThanhToanID ?? null,
      LoaiDonHangID: filter.LoaiDonHangID ?? null,
      TuNgay: filter.TuNgay ?? null,
      DenNgay: filter.DenNgay ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
    },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Lấy thông tin chi tiết đơn hàng (kèm danh sách mặt hàng, số khung/serial và lịch sử thanh toán)
 * POST /api/DonHangApi/Get
 */
export const getDonHangByIdApi = async (id: string): Promise<DH_DonHang> => {
  const response = await api.post(
    `${APP_URL}/DonHangApi/Get`,
    { GuidId: id },
    { headers: getAuthHeaders() }
  );
  return response.data?.data ?? response.data;
};

/**
 * Tạo mới đơn hàng bán lẻ / showroom
 * POST /api/DonHangApi/Add
 */
export const createDonHangApi = async (payload: CreateDonHangPayload) => {
  const response = await api.post(`${APP_URL}/DonHangApi/Add`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Chỉnh sửa đơn hàng (chỉ cho phép khi ở trạng thái Lưu tạm = 72 hoặc Chờ xử lý = 73)
 * POST /api/DonHangApi/Edit
 */
export const updateDonHangApi = async (payload: Partial<CreateDonHangPayload> & { DonHangID: string }) => {
  const response = await api.post(`${APP_URL}/DonHangApi/Edit`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Chuyển trạng thái đơn hàng (Chờ xử lý/Đặt cọc = 73, Chuẩn bị xe = 74, Đang giao = 75, Đã hủy = 77)
 * POST /api/DonHangApi/ChuyenTrangThai
 */
export const chuyenTrangThaiDonHangApi = async (payload: ChuyenTrangThaiDonHangPayload) => {
  const response = await api.post(
    `${APP_URL}/DonHangApi/ChuyenTrangThai`,
    {
      DonHangID: payload.DonHangID,
      TrangThaiID: payload.TrangThaiID ?? payload.TrangThaiDonHangID,
      GhiChu: payload.GhiChu ?? "",
    },
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

/**
 * Xác nhận hoàn thành đơn & Bàn giao xe (Trigger trừ tồn kho, tính giá vốn FIFO, kích hoạt BH, sinh xe cho khách và tính điểm thưởng)
 * POST /api/DonHangApi/HoanThanhVaGiaoXe?DonHangID={id}
 */
export const hoanThanhVaGiaoXeDonHangApi = async (donHangId: string) => {
  const response = await api.post(
    `${APP_URL}/DonHangApi/HoanThanhVaGiaoXe?DonHangID=${donHangId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

/**
 * Lấy lịch sử các đợt thanh toán của đơn hàng
 * POST /api/DonHangApi/GetsLichSuThanhToan?DonHangID={donHangId}
 */
export const getLichSuThanhToanDonHangApi = async (
  donHangId: string
): Promise<DH_LichSuThanhToan[]> => {
  const response = await api.post(
    `${APP_URL}/DonHangApi/GetsLichSuThanhToan?DonHangID=${donHangId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data?.data ?? response.data ?? [];
};

/**
 * Ghi nhận thanh toán cho đơn hàng (Cọc/Thanh toán đủ - tự động cập nhật công nợ và trạng thái thanh toán)
 * POST /api/DonHangApi/AddLichSuThanhToan
 */
export const addLichSuThanhToanDonHangApi = async (payload: AddLichSuThanhToanPayload) => {
  const response = await api.post(
    `${APP_URL}/DonHangApi/AddLichSuThanhToan`,
    {
      DonHangID: payload.DonHangID,
      MaGiaoDich: payload.MaGiaoDich,
      PhuongTucThanhToanID: payload.PhuongTucThanhToanID,
      SoTien: payload.SoTien,
      GhiChu: payload.GhiChu ?? "",
    },
    {
      headers: getAuthHeaders(),
    }
  );
  return response.data;
};

// Alias for backward compatibility
export const thanhToanDonHangApi = addLichSuThanhToanDonHangApi;

/**
 * Xóa đơn hàng (chỉ cho phép khi ở trạng thái Lưu tạm = 72 hoặc Đã hủy = 77)
 * DELETE /api/DonHangApi/Delete?DonHangID={id}
 */
export const deleteDonHangApi = async (id: string) => {
  const response = await api.delete(`${APP_URL}/DonHangApi/Delete?DonHangID=${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Lấy dữ liệu KPI thống kê đơn hàng
 * POST /api/DonHangApi/GetKPI
 */
export const getDonHangKPIApi = async () => {
  const response = await api.post(
    `${APP_URL}/DonHangApi/GetKPI`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return response.data;
};
