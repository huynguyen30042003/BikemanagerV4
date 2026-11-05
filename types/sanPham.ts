import { SP_BienTheSanPham } from "./bienTheSanPham";
import { SP_HinhAnhSanPham } from "./hinhAnhSanPham";
import { SP_SoSerial } from "./soSerial";
import { SP_ThuongHieu } from "./thuongHieu";

export interface SP_SanPham {
  sanPhamID: string;
  danhMucChiTietID: number;
  tenDanhMucChiTiet?: string;
  thuongHieuID: string;
  tenThuongHieu?: string;
  maSanPham: string;
  tenSanPham: string;
  duongDan: string;
  donViTinhID?: number | null;
  tenDonViTinh?: string | null;
  anhDaiDien?: string | null;
  maxSize?: number | null;
  moTaNgan?: string | null;
  moTa?: string | null;
  thongSoKyThuatJson?: string | null;
  soThangBaoHanhMacDinh: number;
  laPhuongTien: boolean;
  daXuatBan: boolean;
  trangThai: boolean;
  soBienThe?: number;
  ngayTao?: string;
  nguoiTao?: string;
}

/**
 * Dữ liệu trả về từ POST /api/SanPhamApi/Get (Chi tiết sản phẩm / xe)
 * Bao gồm thông tin gốc sản phẩm, thương hiệu, danh sách biến thể, hình ảnh và danh sách số serial hiện có
 */
export interface SP_SanPhamDetail extends SP_SanPham {
  // Thông tin Thương hiệu phẳng (nếu join trực tiếp) hoặc object lồng nhau
  maThuongHieu?: string | null;
  duongDanThuongHieu?: string | null;
  logoThuongHieu?: string | null;
  maxSizeLogo?: number | null;
  quocGiaThuongHieu?: string | null;
  moTaThuongHieu?: string | null;
  thuongHieu?: SP_ThuongHieu | null;

  // Danh sách dữ liệu con đi kèm của sản phẩm / xe
  bienThes?: SP_BienTheSanPham[];
  hinhAnhs?: SP_HinhAnhSanPham[];
  soSerials?: SP_SoSerial[];
}

export interface SanPhamFilter {
  TuKhoa?: string;
  DanhMucChiTietID?: number | null;
  ThuongHieuID?: string | null;
  PageIndex?: number;
  PageSize?: number;
  TrangThai?: boolean | null;
}

export interface CreateSanPhamPayload {
  MaSanPham: string;
  TenSanPham: string;
  DanhMucChiTietID: number;
  ThuongHieuID: string;
  DuongDan: string;
  DonViTinhID?: number | null;
  MoTaNgan?: string;
  MoTa?: string;
  ThongSoKyThuatJson?: string;
  SoThangBaoHanhMacDinh: number;
  LaPhuongTien: boolean;
  DaXuatBan: boolean;
  TrangThai: boolean;
  file?: File | null;
}

export interface UpdateSanPhamPayload extends CreateSanPhamPayload {
  SanPhamID: string;
  XoaFile?: boolean;
  AnhDaiDien?: string;
}

export interface SP_ProductNavTabs {
  total_ThuongHieu?: number;
  total_SanPham?: number;
  total_BienTheSanPham?: number;
  total_HinhAnhSanPham?: number;
  total_SoSerial?: number;
  totalThuongHieu?: number;
  totalSanPham?: number;
  totalBienTheSanPham?: number;
  totalHinhAnhSanPham?: number;
  totalSoSerial?: number;
}

export interface SanPhamKPI {
  total_SanPham: number;
  total_LaPhuongTien: number;
  total_DaXuatBan: number;
  total_HoatDong: number;
}
