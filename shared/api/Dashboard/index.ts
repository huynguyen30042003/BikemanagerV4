import api from "@/shared/api";
import { APP_URL } from "@/shared/constants/apiConstants";
import { getAccessToken } from "@/lib/auth";
import {
  DashboardOverviewData,
  DashboardOverviewFilter,
  DashboardApiResponse,
} from "@/types/dashboard";

const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Lấy dữ liệu tổng quan Dashboard từ Backend .NET
 * POST /api/DashboardApi/Overview
 */
export const getDashboardOverviewApi = async (
  filter: DashboardOverviewFilter = {
    TuNgay: null,
    DenNgay: null,
    KhoID: null,
    DiaDiemID: null,
  }
): Promise<DashboardOverviewData> => {
  const payload = {
    TuNgay: filter.TuNgay ?? null,
    DenNgay: filter.DenNgay ?? null,
    KhoID: filter.KhoID ?? null,
    DiaDiemID: filter.DiaDiemID ?? null,
  };

  const response = await api.post<DashboardApiResponse | DashboardOverviewData>(
    `${APP_URL}/DashboardApi/Overview`,
    payload,
    {
      headers: getAuthHeaders(),
      withCredentials: true,
    }
  );

  const rawData: any = response.data;
  const result: DashboardOverviewData =
    rawData?.data !== undefined ? rawData.data : rawData;

  // Đảm bảo cấu trúc an toàn, tránh lỗi null/undefined
  return {
    kpi: {
      tongDoanhThu: result?.kpi?.tongDoanhThu ?? 0,
      doanhThuHomNay: result?.kpi?.doanhThuHomNay ?? 0,
      doanhThuThangNay: result?.kpi?.doanhThuThangNay ?? 0,
      tongDonHang: result?.kpi?.tongDonHang ?? 0,
      donHangHomNay: result?.kpi?.donHangHomNay ?? 0,
      donHangChoXuLy: result?.kpi?.donHangChoXuLy ?? 0,
      tongKhachHang: result?.kpi?.tongKhachHang ?? 0,
      khachHangMoiThangNay: result?.kpi?.khachHangMoiThangNay ?? 0,
      tongGiaTriTonKho: result?.kpi?.tongGiaTriTonKho ?? 0,
      tongSoLuongTon: result?.kpi?.tongSoLuongTon ?? 0,
      soMatHangSapHet: result?.kpi?.soMatHangSapHet ?? 0,
      soPhieuSuaChuaDangXuLy: result?.kpi?.soPhieuSuaChuaDangXuLy ?? 0,
      soPhieuBaoHanhDangXuLy: result?.kpi?.soPhieuBaoHanhDangXuLy ?? 0,
      tongChiPhiNhapHang: result?.kpi?.tongChiPhiNhapHang ?? 0,
    },
    doanhThuTheoNgay: result?.doanhThuTheoNgay || [],
    doanhThuTheoThang: result?.doanhThuTheoThang || [],
    coCauTrangThaiDonHang: result?.coCauTrangThaiDonHang || [],
    topSanPhamBanChay: result?.topSanPhamBanChay || [],
    donHangMoiNhat: result?.donHangMoiNhat || [],
    canhBaoTonKho: result?.canhBaoTonKho || [],
  };
};
