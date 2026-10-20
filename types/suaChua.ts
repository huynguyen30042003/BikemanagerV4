export interface SC_DichVu {
  dichVuID: string;
  maDichVu: string;
  tenDichVu: string;
  danhMucChiTietID: number; // LOAI_DICH_VU_SUA_CHUA
  tenNhomDichVu?: string | null;
  moTa?: string | null;
  giaCoBan: number;
  giaKhuyenMai?: number | null;
  thoiGianDuKienPhut: number;
  thuTu: number;
  trangThai: boolean;
}

export interface DichVuFilter {
  PageIndex?: number;
  PageSize?: number;
  TuKhoa?: string;
  DanhMucChiTietID?: number | null;
  TrangThai?: boolean | null;
}

export interface CreateDichVuPayload {
  MaDichVu?: string;
  TenDichVu: string;
  DanhMucChiTietID: number;
  MoTa?: string | null;
  GiaCoBan: number;
  GiaKhuyenMai?: number | null;
  ThoiGianDuKienPhut?: number;
  ThuTu?: number;
  TrangThai?: boolean;
}

export interface UpdateDichVuPayload extends CreateDichVuPayload {
  DichVuID: string;
}

export interface SC_ChiTietSuaChua {
  id?: string;
  phieuSuaChuaID?: string;
  loaiHangMuc: number; // 1: Tiền công dịch vụ, 2: Phụ tùng / Linh kiện thay thế
  dichVuID?: string | null;
  bienTheSanPhamID?: string | null;
  maHangMuc: string;
  tenHangMuc: string;
  donViTinhID?: number | null;
  donViTinhTen?: string | null;
  soLuong: number;
  donGia: number;
  donGiaVon?: number;
  tienGiamGia: number;
  thanhTien: number;
  kyThuatVienID?: number | null;
  kyThuatVienTen?: string | null;
  xuatKhoThanhCong?: boolean;
  thoiGianBaoHanhThang?: number | null;
  ghiChu?: string | null;
}

export interface SC_LichSuThanhToan {
  id: string;
  phieuSuaChuaID: string;
  maGiaoDich: string;
  phuongTucThanhToanID: number;
  phuongTucThanhToanTen?: string | null;
  soTien: number;
  ngayThanhToan: string;
  ghiChu?: string | null;
}

export interface SC_PhieuSuaChua {
  phieuSuaChuaID: string;
  maPhieuSuaChua: string;
  khachHangID: string;
  tenKhachHang?: string | null;
  dienThoaiKhachHang?: string | null;
  phuongTienKhachHangID: string;
  tenModelXe?: string | null;
  bienSoXe?: string | null;
  diaDiemID: string;
  tenDiaDiem?: string | null;
  khoID: string;
  tenKho?: string | null;
  nhanVienTiepNhanID?: number | null;
  kyThuatVienChinhID?: number | null;
  tenKyThuatVien?: string | null;
  phieuBaoHanhID?: string | null;

  loaiDichVuID: number; // LOAI_DICH_VU_SUA_CHUA
  tenLoaiDichVu?: string | null;
  soKmHienTai?: number | null;
  moTaVanDe?: string | null;
  ketQuaChanDoan?: string | null;
  giaiPhapXuLy?: string | null;

  trangThaiID: number; // TRANG_THAI_PHIEU_SUA_CHUA
  tenTrangThai?: string | null;
  trangThaiThanhToanID: number; // TRANG_THAI_THANH_TOAN
  tenTrangThaiThanhToan?: string | null;

  tienCongDichVu: number;
  tienPhuTung: number;
  tienGiamGia: number;
  tienThueVAT: number;
  tongTien: number;
  daThanhToan: number;
  conNo: number;

  thoiGianTiepNhan: string;
  thoiGianHenTra?: string | null;
  thoiGianHoanThanh?: string | null;
  soThangBaoHanhSuaChua?: number | null;
  ghiChu?: string | null;

  chiTiets?: SC_ChiTietSuaChua[];
  lichSuThanhToans?: SC_LichSuThanhToan[];
}

export interface PhieuSuaChuaFilter {
  PageIndex?: number;
  PageSize?: number;
  TuKhoa?: string;
  KhachHangID?: string | null;
  TrangThaiID?: number | null;
  TrangThaiThanhToanID?: number | null;
  LoaiDichVuID?: number | null;
  DiaDiemID?: string | null;
}

export interface CreatePhieuSuaChuaPayload {
  KhachHangID: string;
  PhuongTienKhachHangID: string;
  DiaDiemID: string;
  KhoID: string;
  LoaiDichVuID: number;
  SoKmHienTai?: number | null;
  MoTaVanDe?: string | null;
  KetQuaChanDoan?: string | null;
  GiaiPhapXuLy?: string | null;
  TrangThaiID?: number;
  TrangThaiThanhToanID?: number;
  ThoiGianHenTra?: string | null;
  GhiChu?: string | null;
  ChiTiets: Array<{
    LoaiHangMuc: number;
    DichVuID?: string | null;
    BienTheSanPhamID?: string | null;
    MaHangMuc: string;
    TenHangMuc: string;
    DonViTinhID?: number | null;
    SoLuong: number;
    DonGia: number;
    TienGiamGia?: number;
    ThanhTien: number;
    GhiChu?: string | null;
  }>;
}

export interface ThanhToanSuaChuaPayload {
  PhieuSuaChuaID: string;
  MaGiaoDich: string;
  PhuongTucThanhToanID: number;
  SoTien: number;
  GhiChu?: string | null;
}

export type AddLichSuThanhToanSuaChuaPayload = ThanhToanSuaChuaPayload;

export interface DV_ServiceNavTabs {
  total_BaoHanh?: number;
  total_PhieuBaoHanh?: number;
  total_PhieuSuaChua?: number;
  total_DichVu?: number;
  // Aliases hỗ trợ linh hoạt
  totalBaoHanh?: number;
  totalPhieuBaoHanh?: number;
  totalPhieuSuaChua?: number;
  totalDichVu?: number;
}

export type ServiceNavTabsData = DV_ServiceNavTabs;

/** POST/GET /api/DichVuApi/GetKPI */
export interface SC_DichVuKPI {
  total_DichVu?: number;
  total_DangKinhDoanh?: number;
  total_NgungKinhDoanh?: number;
  total_CoKhuyenMai?: number;
  avg_GiaTienCong?: number;
  avg_ThoiGianPhut?: number;
}

/** POST/GET /api/PhieuSuaChuaApi/GetKPI */
export interface SC_PhieuSuaChuaKPI {
  total_PhieuSuaChua?: number;
  total_DangXuLy?: number;
  total_HoanThanh?: number;
  total_DoanhThu?: number;
  total_DaThanhToan?: number;
  total_ConNo?: number;
  total_PhieuConNo?: number;
}
