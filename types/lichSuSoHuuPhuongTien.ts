export interface KH_LichSuSoHuuPhuongTien {
  id: string;
  phuongTienKhachHangID: string;
  tenModel?: string;
  bienSo?: string;
  soSerialID?: string | null;
  khachHangID: string;
  tenKhachHang?: string;
  dienThoaiKhachHang?: string;
  donHangID?: string | null;
  ngayBatDauSoHuu: string;
  ngayKetThucSoHuu?: string | null;
  laChuSoHuuHienTai: boolean;
  lyDo?: string | null; // MuaMoi, SangTen, ThuCuDoiMoi...
  ngayTao?: string;
}

export interface LichSuSoHuuFilter {
  PhuongTienKhachHangID?: string | null;
  KhachHangID?: string | null;
  TuKhoa?: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface CreateLichSuSoHuuPayload {
  PhuongTienKhachHangID: string;
  KhachHangID: string;
  NgayBatDauSoHuu: string;
  LaChuSoHuuHienTai: boolean;
  LyDo?: string;
}

export interface ChuyenQuyenSoHuuPayload {
  PhuongTienKhachHangID: string;
  KhachHangMoiID: string;
  DonHangID?: string | null;
  LyDo: string; // SangTen, ThuCuDoiMoi, BanLai...
  GhiChu?: string;
}
