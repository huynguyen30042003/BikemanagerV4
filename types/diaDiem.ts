/**
 * Model DM_DiaDiem theo db.md & api.md
 */
export interface DM_DiaDiem {
  diaDiemID: string;
  diaDiemCapChaID?: string | null;
  loaiDiaDiemID?: number | null; // 1: Showroom/Cửa hàng, 2: Trạm bảo hành, 3: Kho hàng
  tenDiaDiem: string;
  moTa?: string | null;
  tinhID?: number | null;
  xaID?: number | null;
  kinhDo?: number | null;
  viDo?: number | null;
  diaChiSo?: string;
  anhDaiDien?: string;
  trangThai?: boolean | null;
  // Bổ trợ hiển thị từ Backend (nếu có)
  tenTinh?: string | null;
  tenXa?: string | null;
  tenDiaDiemCha?: string | null;
}

export interface DiaDiemFilter {
  TuKhoa?: string;
  TinhID?: number | null;
  PageIndex: number;
  PageSize: number;
  TrangThai?: boolean | null;
}

export interface CreateDiaDiemPayload {
  DiaDiemCapChaID?: string | null;
  LoaiDiaDiemID: number;
  TenDiaDiem: string;
  MoTa?: string;
  TinhID: number;
  XaID: number;
  KinhDo?: number | null;
  ViDo?: number | null;
  DiaChiSo: string;
  TrangThai: boolean;
  file?: File | null;
}

export interface UpdateDiaDiemPayload {
  DiaDiemID: string;
  DiaDiemCapChaID?: string | null;
  LoaiDiaDiemID: number;
  TenDiaDiem: string;
  MoTa?: string;
  TinhID: number;
  XaID: number;
  KinhDo?: number | null;
  ViDo?: number | null;
  DiaChiSo: string;
  TrangThai: boolean;
  XoaFile?: boolean;
  file?: File | null;
}
