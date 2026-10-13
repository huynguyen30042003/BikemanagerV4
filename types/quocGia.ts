/**
 * Model DM_QuocGia theo db.md & api.md
 */
export interface DM_QuocGia {
  quocGiaID: number;
  maQuocGia: string;
  ten: string;
  tenKhongDau?: string | null;
  thuTu?: number | null;
  trangThai?: boolean | null;
}

export interface QuocGiaFilter {
  TuKhoa?: string;
  PageIndex: number;
  PageSize: number;
  TrangThai?: boolean | null;
}

export interface CreateQuocGiaPayload {
  MaQuocGia: string;
  Ten: string;
  TenKhongDau?: string;
  ThuTu: number;
  TrangThai: boolean;
}

export interface UpdateQuocGiaPayload {
  QuocGiaID: number;
  MaQuocGia: string;
  Ten: string;
  TenKhongDau?: string;
  ThuTu: number;
  TrangThai: boolean;
}
