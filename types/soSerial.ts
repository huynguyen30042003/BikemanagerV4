export interface SP_SoSerial {
  soSerialID: string;
  bienTheSanPhamID: string;
  tenBienThe?: string;
  tenSanPham?: string;
  maSerial: string;
  soKhung?: string | null;
  soMay?: string | null;
  soPin?: string | null;
  maQR?: string | null;
  trangThaiID: number;
  tenTrangThai?: string;
  khoID?: string | null;
  tenKho?: string | null;
  viTriLuuTru?: string | null;
  donHangID?: string | null;
  khachHangID?: string | null;
  tenKhachHang?: string | null;
  dienThoaiKhachHang?: string | null;
  bienSoXe?: string | null;
  ngaySanXuat?: string | null;
  ngayNhap?: string | null;
  ngayXuatBan?: string | null;
  ngayBatDauBaoHanh?: string | null;
  ngayKetThucBaoHanh?: string | null;
  ghiChu?: string | null;
  ngayTao?: string;
}

export interface SoSerialFilter {
  TuKhoa?: string;
  KhoID?: string | null;
  TrangThaiID?: number | null;
  BienTheSanPhamID?: string | null;
  PageIndex?: number;
  PageSize?: number;
}

export interface CreateSoSerialPayload {
  BienTheSanPhamID: string;
  MaSerial: string;
  SoKhung?: string;
  SoMay?: string;
  SoPin?: string;
  TrangThaiID: number;
  KhoID?: string | null;
  ViTriLuuTru?: string;
  NgaySanXuat?: string;
  GhiChu?: string;
}

export interface KichHoatBaoHanhPayload {
  SoSerialID: string;
  KhachHangID: string;
  DonHangID?: string | null;
  TrangThaiDaBanID: number;
  BienSoXe?: string;
}

export interface ChuyenTrangThaiSerialPayload {
  SoSerialID: string;
  TrangThaiID: number;
  GhiChu?: string;
}
