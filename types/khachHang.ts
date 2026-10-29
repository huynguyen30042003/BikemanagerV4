export interface KH_KhachHang {
  khachHangID: string;
  maKhachHang: string;
  loaiKhachHang: number; // 1: Cá nhân, 2: Doanh nghiệp / Tổ chức
  tenKhachHang: string;
  dienThoai: string;
  hopThu?: string | null;
  diaChi?: string | null;
  tinhID?: number | null;
  xaID?: number | null;
  ghiChu?: string | null;
  trangThai: boolean;

  // Cá nhân
  maDinhDanh?: string | null; // CCCD
  ngayCapMaDinhDanh?: string | null;
  noiCapMaDinhDanh?: string | null;
  ngaySinh?: string | null;
  gioiTinhID?: number | null;
  quocTichID?: number | null;
  danTocID?: number | null;
  anhChanDung?: string | null;

  // Doanh nghiệp
  maSoThue?: string | null;
  nguoiDaiDien?: string | null;
  dienThoaiNguoiDaiDien?: string | null;
  toChucCapChaID?: string | null;
  loaiToChucID?: number | null;
  trangChu?: string | null;
  anhBieuTrung?: string | null;

  ngayTao?: string;
  nguoiTao?: string;
}

export interface KhachHangFilter {
  TuKhoa?: string;
  TinhID?: number | null;
  LoaiKhachHang?: number | null;
  PageIndex?: number;
  PageSize?: number;
  TrangThai?: boolean | null;
}

export interface CreateKhachHangPayload {
  LoaiKhachHang: number;
  TenKhachHang: string;
  DienThoai: string;
  HopThu?: string;
  DiaChi?: string;
  TinhID?: number | null;
  XaID?: number | null;
  GhiChu?: string;
  TrangThai: boolean;

  // Cá nhân
  MaDinhDanh?: string;
  NgayCapMaDinhDanh?: string;
  NoiCapMaDinhDanh?: string;
  NgaySinh?: string;
  GioiTinhID?: number | null;
  QuocTichID?: number | null;
  DanTocID?: number | null;
  anhChanDung?: File | string | null;
  fileAnhChanDung?: File | string | null;

  // Doanh nghiệp
  MaSoThue?: string;
  NguoiDaiDien?: string;
  DienThoaiNguoiDaiDien?: string;
  ToChucCapChaID?: string | null;
  LoaiToChucID?: number | null;
  TrangChu?: string;
  anhBieuTrung?: File | string | null;
  fileAnhBieuTrung?: File | string | null;
}

export interface UpdateKhachHangPayload extends CreateKhachHangPayload {
  KhachHangID: string;
  XoaAnhChanDung?: boolean;
  XoaAnhBieuTrung?: boolean;
}

export interface KH_NavTabs {
  total_KhachHang?: number;
  total_ThongKeKhachHang?: number;
  total_PhuongTienKhachHang?: number;
  total_LichSuSoHuuPhuongTien?: number;
}

export interface KhachHangKPI {
  total_KhachHang: number;
  total_CaNhan: number;
  total_ToChuc: number;
  total_HoatDong: number;
}
