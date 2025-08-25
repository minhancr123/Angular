export interface AssetTypeModel {
  IdLoaiTS: number;
  MaLoai: string;
  TenLoai: string;
  TrangThai?: boolean;
}

export interface GroupAssetModel {
  IdPNTS: number;
  MaNhom: string;
  TenNhom: string;
  TrangThai?: boolean;
}

export interface AssetReasonModel {
  IdRow: number;
  LoaiTangGiam : number;
  MaTangGiam: string;
  TenTangGiam: string;
  TrangThai?: boolean;
}