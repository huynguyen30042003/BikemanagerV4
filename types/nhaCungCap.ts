/**
 * Model NH_NhaCungCap theo db.md & api.md
 */
export interface NH_NhaCungCap {
  nhaCungCapID: string;
  maNhaCungCap: string;
  tenNhaCungCap: string;
  dienThoai: string;
  hopThu?: string | null;
  diaChi?: string | null;
  quocGiaID?: number | null;
  tenQuocGia?: string | null;
  tinhID?: number | null;
  tenTinh?: string | null;
  xaID?: number | null;
  tenXa?: string | null;
  maSoThue?: string | null;
  nguoiLienHe?: string | null;
  soTaiKhoanNganHang?: string | null;
  tenNganHang?: string | null;
  congNoHienTai: number;
  ghiChu?: string | null;
  trangThai: boolean;
  ngayTaoLap?: string | null;
  ngayHieuChinh?: string | null;
}

export interface NhaCungCapFilter {
  TuKhoa?: string;
  QuocGiaID?: number | null;
  CoCongNo?: boolean | null;
  PageIndex?: number;
  PageSize?: number;
  TrangThai?: boolean | null;
}

export interface CreateNhaCungCapPayload {
  MaNhaCungCap?: string;
  TenNhaCungCap: string;
  DienThoai: string;
  HopThu?: string;
  DiaChi?: string;
  QuocGiaID?: number | null;
  TinhID?: number | null;
  XaID?: number | null;
  MaSoThue?: string;
  NguoiLienHe?: string;
  SoTaiKhoanNganHang?: string;
  TenNganHang?: string;
  GhiChu?: string;
  TrangThai?: boolean;
}

export interface UpdateNhaCungCapPayload {
  MaNhaCungCap?: string;
  NhaCungCapID: string;
  TenNhaCungCap: string;
  DienThoai: string;
  HopThu?: string;
  DiaChi?: string;
  QuocGiaID?: number | null;
  TinhID?: number | null;
  XaID?: number | null;
  MaSoThue?: string;
  NguoiLienHe?: string;
  SoTaiKhoanNganHang?: string;
  TenNganHang?: string;
  GhiChu?: string;
  TrangThai?: boolean;
}

export interface NhaCungCapKPI {
  total_NhaCungCap: number;
  total_HoatDong: number;
  total_CoCongNo: number;
  total_CongNoHienTai: number;
}

export interface NH_PurchaseNavTabs {
  total_NhaCungCap?: number;
  total_DonNhapHang?: number;
  totalNhaCungCap?: number;
  totalDonNhapHang?: number;
}


