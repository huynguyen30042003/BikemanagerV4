/**
 * Đơn vị đối tác tài chính / ngân hàng trả góp
 * (HD Saison, FE Credit, Home Credit, MCredit...)
 */
export interface DonViTraGop {
  id?: string;
  donViTraGopID?: string;
  maDonVi: string;
  tenDonVi: string;
  ten?: string; // fallback
  dienThoai: string;
  email?: string | null;
  diaChi?: string | null;
  tenNguoiLienHe?: string | null;
  sdtNguoiLienHe?: string | null;
  diaChiAPI?: string | null;
  apiKey?: string | null;
  cauHinhGoiVayJson?: string | null;
  thuTu: number;
  dangHoatDong: boolean;
  ghiChu?: string | null;
  ngayTao?: string;
}

export interface CreateDonViTraGopPayload {
  MaDonVi: string;
  TenDonVi: string;
  DienThoai: string;
  Email?: string;
  DiaChi?: string;
  TenNguoiLienHe?: string;
  SdtNguoiLienHe?: string;
  DiaChiAPI?: string;
  ApiKey?: string;
  CauHinhGoiVayJson?: string;
  ThuTu?: number;
  DangHoatDong?: boolean;
  GhiChu?: string;
}

export interface UpdateDonViTraGopPayload extends CreateDonViTraGopPayload {
  DonViTraGopID: string;
}

export interface DonViTraGopFilter {
  PageIndex?: number;
  PageSize?: number;
  TuKhoa?: string;
  DangHoatDong?: boolean | null;
}

/**
 * Hợp đồng / Hồ sơ vay mua xe trả góp
 */
export interface HopDongTraGop {
  id?: string;
  hopDongTraGopID?: string;
  donHangID: string;
  donHangMa?: string | null;
  khachHangID?: string;
  khachHangTen?: string | null;
  khachHangDienThoai?: string | null;
  donViTraGopID: string;
  donViTraGopTen?: string | null;
  soHopDong: string;
  maHoSoOnline?: string | null;

  // Tài chính & kỳ hạn
  tongGiaTriDonHang: number;
  tienTraTruoc: number;
  soTienVay: number;
  phiBaoHiemKhoanVay: number;
  laiSuat: number;
  soThangTraGop: number;
  soTienTraHangThang: number;
  ngayTraHangThang?: number | null;

  // Trạng thái thẩm định
  // 110: Chờ duyệt, 111: Đã duyệt, 112: Từ chối, 113: Đã ký HĐ, 114: Đang trả góp, 115: Đã tất toán, 116: Đã hủy
  trangThaiHopDongID: number;
  trangThaiHopDong?: string | null; // label fallback
  ngayNopHoSo?: string | null;
  ngayPheDuyet?: string | null;

  // Giải ngân về showroom
  // 120: Chưa giải ngân, 121: Đã giải ngân
  trangThaiGiaiNganID?: number | null;
  soTienGiaiNganThucTe?: number | null;
  phiHoaHongDoiTac?: number | null;
  ngayGiaiNgan?: string | null;
  maChuanChiGiaiNgan?: string | null;
  lichSuThanhToanID?: string | null;

  // Tài liệu & nhân sự
  duongDanHopDongPdf?: string | null;
  danhSachTaiLieuJson?: string | null;
  nhanVienLamHoSoID?: number | null;
  nhanVienLamHoSoTen?: string | null;
  nguoiThamChieu?: string | null;
  ghiChu?: string | null;
  ngayTao?: string;
}

export interface CreateHopDongTraGopPayload {
  DonHangID: string;
  KhachHangID?: string;
  DonViTraGopID: string;
  SoHopDong: string;
  MaHoSoOnline?: string;
  TongGiaTriDonHang: number;
  TienTraTruoc: number;
  SoTienVay: number;
  PhiBaoHiemKhoanVay?: number;
  LaiSuat: number;
  SoThangTraGop: number;
  SoTienTraHangThang: number;
  NgayTraHangThang?: number;
  TrangThaiHopDongID?: number;
  NgayNopHoSo?: string;
  TrangThaiGiaiNganID?: number;
  DuongDanHopDongPdf?: string;
  DanhSachTaiLieuJson?: string;
  NhanVienLamHoSoID?: number;
  NguoiThamChieu?: string;
  GhiChu?: string;
}

export interface UpdateHopDongTraGopPayload {
  HopDongTraGopID: string;
  DonViTraGopID?: string;
  SoHopDong?: string;
  MaHoSoOnline?: string;
  TienTraTruoc?: number;
  SoTienVay?: number;
  PhiBaoHiemKhoanVay?: number;
  LaiSuat?: number;
  SoThangTraGop?: number;
  SoTienTraHangThang?: number;
  NgayTraHangThang?: number;
  DuongDanHopDongPdf?: string;
  DanhSachTaiLieuJson?: string;
  NguoiThamChieu?: string;
  GhiChu?: string;
}

export interface HopDongTraGopFilter {
  PageIndex?: number;
  PageSize?: number;
  TuKhoa?: string;
  DonHangID?: string | null;
  KhachHangID?: string | null;
  DonViTraGopID?: string | null;
  TrangThaiHopDongID?: number | null;
  TrangThaiGiaiNganID?: number | null;
  TuNgay?: string | null;
  DenNgay?: string | null;
}

export interface ChuyenTrangThaiHopDongPayload {
  HopDongTraGopID: string;
  TrangThaiHopDongID: number;
  NgayPheDuyet?: string;
  GhiChu?: string;
}

export interface XacNhanGiaiNganPayload {
  HopDongTraGopID: string;
  SoTienGiaiNganThucTe: number;
  PhiHoaHongDoiTac?: number;
  NgayGiaiNgan?: string;
  MaChuanChiGiaiNgan?: string;
  GhiChu?: string;
}

export interface TinhDuToanTraGopPayload {
  TongGiaTriXe: number;
  PhanTramTraTruoc: number;
  SoThangVay: number;
  LaiSuatThang: number;
  PhiBaoHiemKhoanVay?: number;
}

export interface KetQuaDuToanTraGop {
  soTienTraTruoc: number;
  soTienVay: number;
  tienGocHangThang: number;
  tienLaiHangThang: number;
  tongTienTraHangThang: number;
  tongLaiPhaiTra: number;
  tongChiPhi: number;
}

export interface TG_NavTabs {
  total_DonViTraGop?: number;
  total_HopDongTraGop?: number;
}

export interface TG_DonViTraGopKPI {
  total_DonViTraGop?: number;
  total_DangHoatDong?: number;
  total_NgungHoatDong?: number;
  total_TichHopAPI?: number;
  totalDonViTraGop?: number;
  totalDangHoatDong?: number;
  totalNgungHoatDong?: number;
  totalTichHopAPI?: number;
}

export interface TG_TraGopKPI {
  total_HopDongTraGop?: number;
  total_ChoDuyet?: number;
  total_DaDuyet?: number;
  total_DaGiaiNgan?: number;
  total_TongSoTienVay?: number;
  total_SoTienGiaiNganThucTe?: number;
  totalHopDongTraGop?: number;
  totalChoDuyet?: number;
  totalDaDuyet?: number;
  totalDaGiaiNgan?: number;
  totalTongSoTienVay?: number;
  totalSoTienGiaiNganThucTe?: number;
}



