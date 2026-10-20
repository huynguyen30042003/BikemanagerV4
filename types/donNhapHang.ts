/**
 * Model NH_DonNhapHang, Chi tiết nhập hàng & Serial theo db.md & api.md
 */

export interface NH_SerialNhapHang {
  id?: string;
  chiTietDonNhapHangID?: string;
  bienTheSanPhamID: string;
  maSerial: string;
  soKhung?: string | null;
  soMay?: string | null;
  soPin?: string | null;
  ngaySanXuat?: string | null;
  viTriLuuTru?: string | null;
  soSerialID?: string | null;
}

export interface NH_ChiTietDonNhapHang {
  id?: string;
  chiTietID?: string;
  donNhapHangID?: string;
  bienTheSanPhamID: string;
  maSKU?: string;
  tenSanPham?: string;
  soLuong: number;
  donGiaNhap: number;
  phanTramGiamGia?: number;
  tienGiamGia?: number;
  thueVAT?: number;
  tienThueVAT?: number;
  thanhTien: number;
  quanLyTheoSerial?: boolean;
  ghiChu?: string | null;
}

export interface NH_LichSuThanhToan {
  id: string;
  donNhapHangID: string;
  nhaCungCapID?: string;
  maGiaoDich: string;
  phuongTucThanhToanID: number;
  tenPhuongThuc?: string;
  soTien: number;
  ngayThanhToan: string;
  ghiChu?: string | null;
}

export interface NH_DonNhapHang {
  donNhapHangID: string;
  maDonNhap: string;
  nhaCungCapID: string;
  tenNhaCungCap?: string;
  khoID: string;
  tenKho?: string;
  trangThaiID: number;
  tenTrangThai?: string;
  soHoaDonChungTu?: string | null;
  ngayHoaDon?: string | null;
  tamTinh: number;
  tienGiamGia: number;
  tienThueVAT: number;
  chiPhiVanChuyen: number;
  tongTien: number;
  daThanhToan: number;
  conNo: number;
  hanThanhToan?: string | null;
  nguoiDuyetID?: number | null;
  ngayDuyet?: string | null;
  nguoiNhapKhoID?: number | null;
  ngayNhapKho?: string | null;
  ghiChu?: string | null;
  chiTiets?: NH_ChiTietDonNhapHang[];
  serials?: NH_SerialNhapHang[];
  lichSuThanhToans?: NH_LichSuThanhToan[];
  ngayTaoLap?: string | null;
  ngayHieuChinh?: string | null;
}

export interface DonNhapHangFilter {
  TuKhoa?: string;
  NhaCungCapID?: string | null;
  KhoID?: string | null;
  TrangThaiID?: number | null;
  PageIndex?: number;
  PageSize?: number;
}

export interface CreateDonNhapHangPayload {
  MaDonNhap?: string | null;
  NhaCungCapID: string;
  KhoID: string;
  TrangThaiID?: number;
  SoHoaDonChungTu?: string;
  NgayHoaDon?: string | null;
  ChiPhiVanChuyen?: number;
  HanThanhToan?: string | null;
  GhiChu?: string;
  ChiTiets: Array<{
    ChiTietID?: string;
    BienTheSanPhamID: string;
    MaSKU?: string;
    TenSanPham?: string;
    SoLuong: number;
    DonGiaNhap: number;
    PhanTramGiamGia?: number;
    TienGiamGia?: number;
    ThueVAT?: number;
    TienThueVAT?: number;
    ThanhTien: number;
    QuanLyTheoSerial?: boolean;
    GhiChu?: string;
  }>;
  Serials?: Array<{
    ChiTietDonNhapHangID?: string;
    BienTheSanPhamID: string;
    MaSerial: string;
    SoKhung?: string;
    SoMay?: string;
    SoPin?: string;
    ViTriLuuTru?: string;
  }>;
}

export interface UpdateDonNhapHangPayload {
  DonNhapHangID: string;
  NhaCungCapID: string;
  KhoID: string;
  SoHoaDonChungTu?: string;
  NgayHoaDon?: string | null;
  ChiPhiVanChuyen?: number;
  HanThanhToan?: string | null;
  GhiChu?: string;
  ChiTiets: Array<{
    ChiTietID?: string;
    BienTheSanPhamID: string;
    MaSKU?: string;
    TenSanPham?: string;
    SoLuong: number;
    DonGiaNhap: number;
    PhanTramGiamGia?: number;
    TienGiamGia?: number;
    ThueVAT?: number;
    TienThueVAT?: number;
    ThanhTien: number;
    QuanLyTheoSerial?: boolean;
    GhiChu?: string;
  }>;
}

export interface ChuyenTrangThaiDonNhapPayload {
  DonNhapHangID: string;
  TrangThaiID: number;
  GhiChu?: string;
}

export interface ThanhToanDonNhapPayload {
  DonNhapHangID: string;
  MaGiaoDich: string;
  PhuongTucThanhToanID: number;
  SoTien: number;
  GhiChu?: string;
}

export interface DonNhapHangKPI {
  total_DonNhapHang: number;
  total_ChoDuyet: number;
  total_DaNhapKho: number;
  total_ConNo: number;
  totalDonNhapHang?: number;
  totalChoDuyet?: number;
  totalDaNhapKho?: number;
  totalConNo?: number;
}


