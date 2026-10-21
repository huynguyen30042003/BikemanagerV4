export interface KHO_TonKho {
  khoID: string;
  tenKho?: string;
  bienTheSanPhamID: string;
  tenBienThe?: string;
  maSKU?: string;
  maVach?: string;
  tenSanPham?: string;
  TenBienThe?: string;
  mauSac?: string;
  dungLuongPin?: string;
  soLuong: number;
  soLuongDaDat: number;
  soLuongDangChuyen: number;
  soLuongKhaDung: number;
  soLuongToiThieu?: number | null;
  viTriLuuTru?: string | null;
  giaNhap?: number;
  giaBan?: number;
  ngayCapNhat?: string | null;
}

export interface KHO_GiaoDichTonKho {
  giaoDichID: string;
  khoID: string;
  tenKho?: string;
  bienTheSanPhamID: string;
  tenBienThe?: string;
  maSKU?: string;
  soSerialID?: string | null;
  maSerial?: string | null;
  loaiGiaoDichID: number;
  tenLoaiGiaoDich?: string;
  soLuong: number;
  soLuongTruoc: number;
  soLuongSau: number;
  donGiaVon: number;
  giaTri: number;
  loaiThamChieu?: string | null;
  idThamChieu?: string | null;
  ghiChu?: string | null;
  nguoiTaoLap?: number | null;
  ngayTaoLap: string;
}

export interface TonKhoFilter {
  KhoID?: string | null;
  TuKhoa?: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface UpdateDinhMucPayload {
  KhoID: string;
  BienTheSanPhamID: string;
  SoLuongToiThieu: number;
  ViTriLuuTru?: string;
}

export interface KHO_LoChiPhiTonKho {
  loID: string;
  khoID: string;
  tenKho?: string;
  bienTheSanPhamID: string;
  tenBienThe?: string;
  maSKU?: string;
  soSerialID?: string | null;
  maSerial?: string | null;
  soKhung?: string | null;
  loaiThamChieu?: string | null; // DonNhapHang / ChuyenKho / KhachTra / KiemKe
  idThamChieu?: string | null;
  giaNhap: number;
  chiPhiPhanBo: number; // Phí vận chuyển phân bổ trên mỗi đơn vị
  giaVonThucTe: number; // = giaNhap + chiPhiPhanBo
  soLuongNhap: number;
  soLuongConLai: number;
  ngayNhap: string;
}

export interface LoChiPhiFilter {
  KhoID?: string | null;
  BienTheSanPhamID?: string | null;
  TuKhoa?: string;
  PageIndex?: number;
  PageSize?: number;
}

export interface GiaoDichFilter {
  KhoID?: string | null;
  BienTheSanPhamID?: string | null;
  TuNgay?: string | null;
  DenNgay?: string | null;
  PageIndex?: number;
  PageSize?: number;
}

export interface KHO_TonKhoKPI {
  total_TonKho?: number;
  total_TonKhaDung?: number;
  total_SapHetHang?: number;
  total_HetHang?: number;
  totalTonKho?: number;
  totalTonKhaDung?: number;
  totalSapHetHang?: number;
  totalHetHang?: number;
}

export interface KHO_TonKho_SerialNhap_Item {
  MaSerial: string;
  SoKhung?: string | null;
  SoMay?: string | null;
  SoPin?: string | null;
  NgaySanXuat?: string | null;
  ViTriLuuTru?: string | null;
}

export interface KHO_TonKho_NhapTonDauKy_Request {
  DiaDiemID?: string | null;
  KhoID: string;
  BienTheSanPhamID: string;
  SoLuong: number;
  DonGiaVon?: number | null;
  SoLuongToiThieu?: number | null;
  ViTriLuuTru?: string | null;
  LoaiGiaoDichID?: number | null;
  TrangThaiSerialID?: number;
  GhiChu?: string | null;
  Serials?: KHO_TonKho_SerialNhap_Item[] | null;
}

export interface KHO_TonKho_NhapTonDauKy_Response {
  khoID: string;
  bienTheSanPhamID: string;
  soLuongTruoc: number;
  soLuongBoSung: number;
  soLuongSau: number;
  soLuongDaDat: number;
  soLuongKhaDung: number;
  soLuongToiThieu?: number | null;
  viTriLuuTru?: string | null;
  donGiaVon: number;
  ngayCapNhat?: string | null;
}
