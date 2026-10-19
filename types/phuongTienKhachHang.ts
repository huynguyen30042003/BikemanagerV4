export interface KH_PhuongTienKhachHang {
  id: string;
  khachHangID: string;
  tenKhachHang?: string;
  dienThoaiKhachHang?: string;
  soSerialID?: string | null;
  bienTheSanPhamID?: string | null;
  thuongHieuID?: string | null;
  tenThuongHieu?: string | null;
  tenModel: string;
  bienSo: string;
  soKhung?: string | null;
  soMay?: string | null;
  soPin?: string | null;
  mauSac?: string | null;
  soKmHienTai?: number | null;
  ngayMua?: string | null;
  ghiChu?: string | null;
  trangThai: boolean; // true: Đang sử dụng, false: Đã bán/Hỏng
  ngayTao?: string;
}

export interface PhuongTienFilter {
  KhachHangID?: string | null;
  TuKhoa?: string;
  PageIndex?: number;
  PageSize?: number;
  TrangThai?: boolean | null;
}

export interface CreatePhuongTienPayload {
  KhachHangID: string;
  ThuongHieuID?: string | null;
  TenModel: string;
  BienSo: string;
  SoKhung?: string;
  SoMay?: string;
  SoPin?: string;
  MauSac?: string;
  SoKmHienTai?: number | null;
  NgayMua?: string;
  GhiChu?: string;
  TrangThai: boolean;
}

export interface UpdatePhuongTienPayload extends CreatePhuongTienPayload {
  ID: string;
}
