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
  hinhAnhs?: SP_SoSerial_HinhAnh[];
}

export interface SP_SoSerial_HinhAnh {
  id: string;
  soSerialID: string;
  donHangID?: string | null;
  phieuBaoHanhID?: string | null;
  loaiAnhID: number; // 1: Số khung/máy/pin, 2: Bàn giao xe, 3: Ngoại quan lúc bán, 4: Lỗi bảo hành, 5: Sau sửa chữa
  tenLoaiAnh?: string;
  duongDanAnh: string;
  tieuDe?: string | null;
  ghiChu?: string | null;
  nguoiTaoLap?: number | null;
  ngayTaoLap: string;
}

export interface UploadHinhAnhSerialPayload {
  soSerialID: string;
  donHangID?: string | null;
  phieuBaoHanhID?: string | null;
  loaiAnhID: number;
  ghiChu?: string | null;
  files: File[];
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

export interface SoSerialKPI {
  total_SoSerial: number;
  total_TrongKho: number;
  total_DaXuatBan: number;
  total_BaoHanhXuong: number;
}

