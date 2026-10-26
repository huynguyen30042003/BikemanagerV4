import api from "@/shared/api";
import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  SC_DichVu,
  DichVuFilter,
  CreateDichVuPayload,
  UpdateDichVuPayload,
  SC_PhieuSuaChua,
  PhieuSuaChuaFilter,
  CreatePhieuSuaChuaPayload,
  UpdatePhieuSuaChuaPayload,
  CreateChiTietSuaChuaItem,
  AddLichSuThanhToanSuaChuaPayload,
  ThanhToanSuaChuaPayload,
  SC_LichSuThanhToan,
  DV_ServiceNavTabs,
  SC_DichVuKPI,
  SC_PhieuSuaChuaKPI,
} from "@/types/suaChua";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ==================== DANH MỤC DỊCH VỤ SỬA CHỮA (DichVuApi - Mục 23) ==================== */

/**
 * Lấy danh sách dịch vụ sửa chữa có lọc và phân trang
 * POST /api/DichVuApi/Gets
 */
export const getDichVuApi = async (
  filter: DichVuFilter = { PageIndex: 1, PageSize: 50, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/DichVuApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      DanhMucChiTietID: filter.DanhMucChiTietID ?? null,
      TrangThai: filter.TrangThai ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 50,
    },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Lấy thông tin chi tiết dịch vụ theo ID
 * POST /api/DichVuApi/Get
 */
export const getDichVuByIdApi = async (id: string): Promise<SC_DichVu> => {
  const response = await api.post(
    `${APP_URL}/DichVuApi/Get`,
    { DichVuID: id, GuidId: id },
    { headers: getAuthHeaders() }
  );
  return response.data?.data ?? response.data;
};

/**
 * Thêm mới dịch vụ sửa chữa / bảo dưỡng
 * POST /api/DichVuApi/Add
 */
export const createDichVuApi = async (payload: CreateDichVuPayload) => {
  const response = await api.post(`${APP_URL}/DichVuApi/Add`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Cập nhật thông tin dịch vụ sửa chữa
 * POST /api/DichVuApi/Edit
 */
export const updateDichVuApi = async (payload: UpdateDichVuPayload) => {
  const response = await api.post(`${APP_URL}/DichVuApi/Edit`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Xóa dịch vụ sửa chữa
 * DELETE /api/DichVuApi/Delete?DichVuID={id}
 */
export const deleteDichVuApi = async (id: string) => {
  const response = await api.delete(`${APP_URL}/DichVuApi/Delete?DichVuID=${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/* ==================== PHIẾU TIẾP NHẬN SỬA CHỮA (PhieuSuaChuaApi - Mục 24) ==================== */

/**
 * Lấy danh sách phiếu sửa chữa có phân trang & tìm kiếm đa điều kiện
 * POST /api/PhieuSuaChuaApi/Gets
 */
export const getPhieuSuaChuaApi = async (
  filter: PhieuSuaChuaFilter = { PageIndex: 1, PageSize: 20, TuKhoa: "" }
) => {
  const response = await api.post(
    `${APP_URL}/PhieuSuaChuaApi/Gets`,
    {
      TuKhoa: filter.TuKhoa ?? "",
      KhachHangID: filter.KhachHangID ?? null,
      TrangThaiID: filter.TrangThaiID ?? null,
      TrangThaiThanhToanID: filter.TrangThaiThanhToanID ?? null,
      LoaiDichVuID: filter.LoaiDichVuID ?? null,
      DiaDiemID: filter.DiaDiemID ?? null,
      PageIndex: filter.PageIndex ?? 1,
      PageSize: filter.PageSize ?? 20,
    },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Lấy thông tin chi tiết phiếu sửa chữa
 * POST /api/PhieuSuaChuaApi/Get
 */
export const getPhieuSuaChuaByIdApi = async (id: string): Promise<SC_PhieuSuaChua> => {
  const response = await api.post(
    `${APP_URL}/PhieuSuaChuaApi/Get`,
    { GuidId: id, PhieuSuaChuaID: id },
    { headers: getAuthHeaders() }
  );
  return response.data?.data ?? response.data;
};

/**
 * Tạo mới phiếu sửa chữa & bảo dưỡng xe
 * POST /api/PhieuSuaChuaApi/Add
 */
export const createPhieuSuaChuaApi = async (payload: CreatePhieuSuaChuaPayload) => {
  const formattedBody = {
    MaPhieuSuaChua: payload.MaPhieuSuaChua || null,
    KhachHangID: payload.KhachHangID,
    PhuongTienKhachHangID: payload.PhuongTienKhachHangID,
    DiaDiemID: payload.DiaDiemID,
    KhoID: payload.KhoID,
    NhanVienTiepNhanID: payload.NhanVienTiepNhanID ?? 1,
    KyThuatVienChinhID: payload.KyThuatVienChinhID ?? 2,
    LoaiDichVuID: Number(payload.LoaiDichVuID) || 114,
    SoKmHienTai: Number(payload.SoKmHienTai) || 0,
    MoTaVanDe: payload.MoTaVanDe || "",
    KetQuaChanDoan: payload.KetQuaChanDoan || "",
    GiaiPhapXuLy: payload.GiaiPhapXuLy || "",
    ThoiGianHenTra: payload.ThoiGianHenTra || null,
    TienGiamGia: Number(payload.TienGiamGia) || 0,
    TienThueVAT: Number(payload.TienThueVAT) || 0,
    SoThangBaoHanhSuaChua: Number(payload.SoThangBaoHanhSuaChua) || 3,
    GhiChu: payload.GhiChu || "",
    ChiTiets: (payload.ChiTiets || []).map((ct) => ({
      LoaiHangMuc: Number(ct.LoaiHangMuc) || 1,
      DichVuID: ct.LoaiHangMuc === 1 ? (ct.DichVuID || null) : null,
      BienTheSanPhamID: ct.LoaiHangMuc === 2 ? (ct.BienTheSanPhamID || null) : null,
      MaHangMuc: ct.MaHangMuc || "",
      TenHangMuc: ct.TenHangMuc || "",
      DonViTinhID: ct.LoaiHangMuc === 2 ? (ct.DonViTinhID ?? 1) : null,
      SoLuong: Number(ct.SoLuong) || 1,
      DonGia: Number(ct.DonGia) || 0,
      TienGiamGia: Number(ct.TienGiamGia) || 0,
      ThanhTien:
        Number(ct.ThanhTien) ||
        Math.max(
          0,
          (Number(ct.SoLuong) || 1) * (Number(ct.DonGia) || 0) -
            (Number(ct.TienGiamGia) || 0)
        ),
      GhiChu: ct.GhiChu || "",
    })),
  };

  const response = await api.post(`${APP_URL}/PhieuSuaChuaApi/Add`, formattedBody, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Cập nhật / Chỉnh sửa phiếu sửa chữa
 * POST /api/PhieuSuaChuaApi/Edit
 */
export const updatePhieuSuaChuaApi = async (payload: UpdatePhieuSuaChuaPayload) => {
  const formattedBody = {
    PhieuSuaChuaID: payload.PhieuSuaChuaID,
    KhachHangID: payload.KhachHangID,
    PhuongTienKhachHangID: payload.PhuongTienKhachHangID,
    DiaDiemID: payload.DiaDiemID,
    KhoID: payload.KhoID,
    NhanVienTiepNhanID: payload.NhanVienTiepNhanID ?? 1,
    KyThuatVienChinhID: payload.KyThuatVienChinhID ?? 2,
    LoaiDichVuID: Number(payload.LoaiDichVuID) || 114,
    SoKmHienTai: Number(payload.SoKmHienTai) || 0,
    MoTaVanDe: payload.MoTaVanDe || "",
    KetQuaChanDoan: payload.KetQuaChanDoan || "",
    GiaiPhapXuLy: payload.GiaiPhapXuLy || "",
    ThoiGianHenTra: payload.ThoiGianHenTra || null,
    TienGiamGia: Number(payload.TienGiamGia) || 0,
    TienThueVAT: Number(payload.TienThueVAT) || 0,
    SoThangBaoHanhSuaChua: Number(payload.SoThangBaoHanhSuaChua) || 3,
    GhiChu: payload.GhiChu || "",
    ChiTiets: (payload.ChiTiets || []).map((ct) => ({
      LoaiHangMuc: Number(ct.LoaiHangMuc) || 1,
      DichVuID: ct.LoaiHangMuc === 1 ? (ct.DichVuID || null) : null,
      BienTheSanPhamID: ct.LoaiHangMuc === 2 ? (ct.BienTheSanPhamID || null) : null,
      MaHangMuc: ct.MaHangMuc || "",
      TenHangMuc: ct.TenHangMuc || "",
      DonViTinhID: ct.LoaiHangMuc === 2 ? (ct.DonViTinhID ?? 1) : null,
      SoLuong: Number(ct.SoLuong) || 1,
      DonGia: Number(ct.DonGia) || 0,
      TienGiamGia: Number(ct.TienGiamGia) || 0,
      ThanhTien:
        Number(ct.ThanhTien) ||
        Math.max(
          0,
          (Number(ct.SoLuong) || 1) * (Number(ct.DonGia) || 0) -
            (Number(ct.TienGiamGia) || 0)
        ),
      GhiChu: ct.GhiChu || "",
    })),
  };

  const response = await api.post(`${APP_URL}/PhieuSuaChuaApi/Edit`, formattedBody, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Chuyển trạng thái phiếu sửa chữa
 * POST /api/PhieuSuaChuaApi/ChuyenTrangThai
 */
export const chuyenTrangThaiSuaChuaApi = async (payload: { PhieuSuaChuaID: string; TrangThaiID: number; GhiChu?: string }) => {
  const response = await api.post(`${APP_URL}/PhieuSuaChuaApi/ChuyenTrangThai`, payload, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Hoàn thành & Bàn giao xe cho khách (Trigger xuất kho trừ phụ tùng thực tế, cập nhật ngày hoàn thành)
 * POST /api/PhieuSuaChuaApi/HoanThanhVaGiaoXe?PhieuSuaChuaID={id}
 */
export const hoanThanhVaGiaoXeSuaChuaApi = async (id: string) => {
  const response = await api.post(
    `${APP_URL}/PhieuSuaChuaApi/HoanThanhVaGiaoXe?PhieuSuaChuaID=${id}`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Lấy lịch sử các đợt thanh toán của phiếu sửa chữa
 * POST /api/PhieuSuaChuaApi/GetsLichSuThanhToan?PhieuSuaChuaID={id}
 */
export const getLichSuThanhToanSuaChuaApi = async (id: string): Promise<SC_LichSuThanhToan[]> => {
  const response = await api.post(
    `${APP_URL}/PhieuSuaChuaApi/GetsLichSuThanhToan?PhieuSuaChuaID=${id}`,
    {},
    { headers: getAuthHeaders() }
  );
  return response.data?.data ?? response.data ?? [];
};

/**
 * Thu tiền / Ghi nhận thanh toán phiếu sửa chữa (Cập nhật DaThanhToan, ConNo và TrangThaiThanhToanID)
 * POST /api/PhieuSuaChuaApi/AddLichSuThanhToan
 */
export const addLichSuThanhToanSuaChuaApi = async (payload: AddLichSuThanhToanSuaChuaPayload) => {
  const response = await api.post(
    `${APP_URL}/PhieuSuaChuaApi/AddLichSuThanhToan`,
    payload,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Alias for backward compatibility
export const thanhToanSuaChuaApi = addLichSuThanhToanSuaChuaApi;

/**
 * Xóa phiếu sửa chữa (chỉ xóa được khi ở trạng thái Tiếp nhận = 107 hoặc Đã hủy = 112)
 * DELETE /api/PhieuSuaChuaApi/Delete?PhieuSuaChuaID={id}
 */
export const deletePhieuSuaChuaApi = async (id: string) => {
  const response = await api.delete(`${APP_URL}/PhieuSuaChuaApi/Delete?PhieuSuaChuaID=${id}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

/**
 * Lấy số lượng thống kê tabs Dịch vụ, Sửa chữa & Bảo hành
 * POST /api/DichVuApi/NavTabs
 */
export const getServiceNavTabsApi = async (): Promise<DV_ServiceNavTabs> => {
  const endpoints = [
    `${APP_URL}/DichVuApi/NavTabs`,
    `${APP_URL}/BaoHanhApi/NavTabs`,
    `${APP_URL}/PhieuBaoHanhApi/NavTabs`,
    `${APP_URL}/PhieuSuaChuaApi/NavTabs`,
    `/api/v1/DichVuApi/NavTabs`,
    `/api/DichVuApi/NavTabs`,
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
    `${APP_URL}/DichVuApi/NavTabs`,
    {},
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );
  return fallback.data?.data ?? fallback.data;
};

/** Gọi KPI (backend chỉ hỗ trợ POST) */
const fetchKPI = async <T,>(path: string): Promise<T> => {
  const res = await api.post(`${APP_URL}${path}`, {}, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return (res.data?.data ?? res.data) as T;
};

/**
 * KPI Danh mục dịch vụ sửa chữa
 * POST /api/DichVuApi/GetKPI
 */
export const getDichVuKPIApi = () => fetchKPI<SC_DichVuKPI>("/DichVuApi/GetKPI");

/**
 * KPI Phiếu sửa chữa
 * POST /api/PhieuSuaChuaApi/GetKPI
 */
export const getPhieuSuaChuaKPIApi = () =>
  fetchKPI<SC_PhieuSuaChuaKPI>("/PhieuSuaChuaApi/GetKPI");
