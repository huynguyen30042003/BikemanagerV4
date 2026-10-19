export interface SP_HinhAnhSanPham {
  hinhAnhID: string;
  sanPhamID: string;
  tenSanPham?: string;
  bienTheSanPhamID?: string | null;
  tenBienThe?: string | null;
  duongDanAnh: string;
  tieuDe?: string | null;
  thuTu: number;
  laAnhDaiDien: boolean;
  ngayTao?: string;
}

export interface HinhAnhFilter {
  SanPhamID: string;
  BienTheSanPhamID?: string | null;
}

export interface CreateHinhAnhPayload {
  SanPhamID: string;
  BienTheSanPhamID?: string | null;
  TieuDe?: string;
  ThuTuSapXep: number;
  LaAnhDaiDien: boolean;
  file: File;
}
