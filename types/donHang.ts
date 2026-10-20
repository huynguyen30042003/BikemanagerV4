export interface DH_SerialXuatBan {
  id?: string;
  chiTietDonHangID?: string;
  bienTheSanPhamID: string;
  soSerialID: string;
  maSerial: string;
  soKhung?: string | null;
  soMay?: string | null;
  soPin?: string | null;
  bienSoXe?: string | null;
  ngayBatDauBaoHanh?: string | null;
  ngayKetThucBaoHanh?: string | null;
}

export interface DH_ChiTietDonHang {
  id?: string;
  donHangID?: string;
  bienTheSanPhamID: string;
  maSKU: string;
  tenSanPham: string;
  donViTinhID?: number | null;
  donViTinhTen?: string | null;
  soLuong: number;
  donGiaBan: number;
  donGiaVon?: number;
  tienGiamGia: number;
  thueVAT: number;
  tienThueVAT: number;
  thanhTien: number;
  quanLyTheoSerial: boolean;
  laPhuongTien: boolean;
  soThangBaoHanh: number;
  ghiChu?: string | null;
  serials?: DH_SerialXuatBan[];
}

export interface DH_LichSuThanhToan {
  id: string;
  donHangID: string;
  maGiaoDich: string;
  phuongTucThanhToanID: number;
  phuongTucThanhToanTen?: string | null;
  soTien: number;
  ngayThanhToan: string;
  donViTraGop?: string | null;
  maHopDongTraGop?: string | null;
  ghiChu?: string | null;
  nguoiTaoLap?: number | null;
}

export interface DH_DonHang {
  donHangID: string;
  maDonHang: string;
  khachHangID: string;
  tenKhachHang?: string | null;
  soDienThoaiKhachHang?: string | null;
  diaDiemID: string;
  tenDiaDiem?: string | null;
  khoXuatID: string;
  tenKhoXuat?: string | null;
  nhanVienBanHangID?: number | null;
  tenNhanVienBanHang?: string | null;

  // Trạng thái từ DM_DanhMucChiTiet
  loaiDonHangID: number;
  tenLoaiDonHang?: string | null;
  trangThaiDonHangID: number;
  tenTrangThaiDonHang?: string | null;
  trangThaiThanhToanID: number;
  tenTrangThaiThanhToan?: string | null;

  // Tài chính
  tamTinh: number;
  tienGiamGia: number;
  tienThueVAT: number;
  phiVanChuyen: number;
  phiDichVuBienSo: number;
  tongTien: number;
  daThanhToan: number;
  conNo: number;

  // Điểm tích lũy
  diemSuDung: number;
  diemTichLuyDuoc: number;

  // Nhận hàng
  tenNguoiNhan?: string | null;
  dienThoaiNguoiNhan?: string | null;
  diaChiGiaoHang?: string | null;
  tinhID?: number | null;
  xaID?: number | null;
  ngayHoanThanh?: string | null;
  ghiChu?: string | null;
  serials?: DH_SerialXuatBan[];

  ngayTaoLap?: string | null;
  ngayHieuChinh?: string | null;
  nguoiTaoLap?: number | null;

  chiTiets?: DH_ChiTietDonHang[];
  lichSuThanhToans?: DH_LichSuThanhToan[];
}

export interface DonHangFilter {
  PageIndex?: number;
  PageSize?: number;
  TuKhoa?: string;
  KhachHangID?: string | null;
  KhoXuatID?: string | null;
  DiaDiemID?: string | null;
  TrangThaiDonHangID?: number | null;
  TrangThaiThanhToanID?: number | null;
  LoaiDonHangID?: number | null;
  TuNgay?: string | null;
  DenNgay?: string | null;
}

export interface CreateChiTietDonHangPayload {
  BienTheSanPhamID: string;
  MaSKU?: string;
  TenSanPham?: string;
  DonViTinhID?: number | null;
  SoLuong: number;
  DonGiaBan: number;
  DonGiaVon?: number;
  TienGiamGia?: number;
  ThueVAT?: number;
  TienThueVAT?: number;
  ThanhTien: number;
  QuanLyTheoSerial: boolean;
  LaPhuongTien: boolean;
  SoThangBaoHanh?: number;
  GhiChu?: string | null;
  Serials?: Array<{
    SoSerialID: string;
    MaSerial: string;
    SoKhung?: string | null;
    SoMay?: string | null;
    SoPin?: string | null;
    BienSoXe?: string | null;
  }>;
}

export interface CreateDonHangPayload {
  KhachHangID: string;
  DiaDiemID: string;
  KhoXuatID: string;
  LoaiDonHangID: number;
  TrangThaiDonHangID?: number;
  TrangThaiThanhToanID?: number;
  TamTinh?: number;
  TienGiamGia?: number;
  TienThueVAT?: number;
  PhiVanChuyen?: number;
  PhiDichVuBienSo?: number;
  TongTien?: number;
  DaThanhToan?: number;
  DiemSuDung?: number;
  TenNguoiNhan?: string | null;
  DienThoaiNguoiNhan?: string | null;
  DiaChiGiaoHang?: string | null;
  TinhID?: number | null;
  XaID?: number | null;
  GhiChu?: string | null;
  ChiTiets: CreateChiTietDonHangPayload[];
}

export interface ChuyenTrangThaiDonHangPayload {
  DonHangID: string;
  TrangThaiDonHangID?: number;
  TrangThaiID?: number;
  GhiChu?: string | null;
}

export interface AddLichSuThanhToanPayload {
  DonHangID: string;
  MaGiaoDich: string;
  PhuongTucThanhToanID: number;
  SoTien: number;
  DonViTraGop?: string | null;
  MaHopDongTraGop?: string | null;
  GhiChu?: string | null;
}

export type ThanhToanDonHangPayload = AddLichSuThanhToanPayload;

export interface DonHangKPI {
  total_DonHang: number;
  total_ChoXuLyVaGiao: number;
  total_HoanThanh: number;
  total_DoanhThu: number;
}
