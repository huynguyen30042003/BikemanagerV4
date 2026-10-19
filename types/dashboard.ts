export type TimeRangeType =
  | "tat_ca"
  | "hom_nay"
  | "7_ngay"
  | "thang_nay"
  | "quy_nay"
  | "nam_nay"
  | "tuy_chon";

export interface DashboardOverviewFilter {
  TuNgay?: string | null;
  DenNgay?: string | null;
  KhoID?: string | null;
  DiaDiemID?: string | null;
  loaiThoiGian?: TimeRangeType;
}

export interface DashboardKpi {
  tongDoanhThu: number;
  doanhThuHomNay: number;
  doanhThuThangNay: number;
  tongDonHang: number;
  donHangHomNay: number;
  donHangChoXuLy: number;
  tongKhachHang: number;
  khachHangMoiThangNay: number;
  tongGiaTriTonKho: number;
  tongSoLuongTon: number;
  soMatHangSapHet: number;
  soPhieuSuaChuaDangXuLy: number;
  soPhieuBaoHanhDangXuLy: number;
  tongChiPhiNhapHang: number;
}

export interface DoanhThuTheoNgayItem {
  ngay: string;
  doanhThu: number;
  soDonHang: number;
  daThanhToan: number;
}

export interface DoanhThuTheoThangItem {
  thang: string;
  doanhThu: number;
  soDonHang: number;
  chiPhiNhap: number;
}

export interface CoCauTrangThaiDonHangItem {
  trangThaiID: number;
  tenTrangThai: string;
  soLuong: number;
  tongTien: number;
}

export interface TopSanPhamBanChayItem {
  bienTheSanPhamID: string;
  maSKU: string;
  tenSanPham: string;
  tenBienThe: string;
  soLuongDaBan: number;
  tongDoanhThu: number;
  hinhAnh?: string;
}

export interface DonHangMoiNhatItem {
  donHangID: string;
  maDonHang: string;
  khachHangID: string;
  tenKhachHang: string;
  dienThoaiKhachHang: string;
  ngayTaoLap: string;
  tongTien: number;
  trangThaiDonHangID: number;
  tenTrangThaiDonHang: string;
  trangThaiThanhToanID: number;
  tenTrangThaiThanhToan: string;
}

export interface CanhBaoTonKhoItem {
  bienTheSanPhamID: string;
  maSKU: string;
  tenSanPham: string;
  tenBienThe: string;
  tenKho: string;
  soLuong: number;
  soLuongToiThieu: number;
}

export interface DashboardOverviewData {
  kpi: DashboardKpi;
  doanhThuTheoNgay: DoanhThuTheoNgayItem[];
  doanhThuTheoThang: DoanhThuTheoThangItem[];
  coCauTrangThaiDonHang: CoCauTrangThaiDonHangItem[];
  topSanPhamBanChay: TopSanPhamBanChayItem[];
  donHangMoiNhat: DonHangMoiNhatItem[];
  canhBaoTonKho: CanhBaoTonKhoItem[];
}

export interface DashboardApiResponse {
  isSuccess?: boolean;
  code?: number;
  message?: string;
  data: DashboardOverviewData;
}
