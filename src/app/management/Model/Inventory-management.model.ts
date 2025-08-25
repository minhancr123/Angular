export class LoaiMatHangModel {
  IdLMH: number;
  MaLMH: string;
  TenLMH: string;
  IdCustomer?: number;
  IdKho: number;
  IdLMHParent: number;
  DoUuTien: number;
  Mota: string;
  HinhAnh?: string;
  CreatedDate?: string;
  isDel?: boolean;
}

export class MatHang {
  IdMH: number;
  MaHang: string;
  TenMatHang: string;
  IdLMH?: number;
  IdDVT?: number;
  MoTa?: string;
  GiaMua?: number;
  GiaBan?: number;
  CreatedBy?: number;
  CreatedDate?: Date;
  IsDel?: boolean;
  ModifiedBy?: number;
  ModifiedDate?: Date;
  DeletedBy?: number;
  DeletedDate?: Date;
  Vat?: number;
  Barcode?: string;
  NgungKinhDoanh?: boolean;
  IdDVTCap2?: number;
  QuyDoiDVTCap2?: number;
  IdDVTCap3?: number;
  QuyDoiDVTCap3?: number;
  TenOnSite?: string;
  IdNhanHieu?: number;
  IdXuatXu?: number;
  HinhAnh?: string;
  ChiTietMoTa?: string;
  MaPhu?: string;
  KichThuoc?: string;
  ThongSo?: string;
  TheoDoiTonKho?: boolean;
  TheoDoiLo?: boolean;
  MaLuuKho?: string;
  MaViTriKho?: string;
  UpperLimit?: number;
  LowerLimit?: number;
  IsTaiSan?: boolean;
  SoKyTinhKhauHaoToiThieu?: number;
  SoKyTinhKhauHaoToiDa?: number;
  SoNamDeNghi?: number;
  TiLeHaoMon?: number;
}

export interface NhanHieuModel {
    IdNhanHieu: number;
    TenNhanHieu: string;
    CreatedBy?: number;
    DeletedBy?: number;
    ModifiedBy?: number;
    CreatedDate?: Date;
    ModifiedDate?: Date;
    DeletedDate?: Date;
    isDel?: boolean;
    IdCustomer?: number;
}

export interface XuatXuModel {
    IdXuatXu: number;
    TenXuatXu: string;
    CreatedBy?: number;
    DeletedBy?: number;
    ModifiedBy?: number;
    CreatedDate?: Date;
    ModifiedDate?: Date;
    DeletedDate?: Date;
    isDel?: boolean;
    IdCustomer?: number;
}

export interface InsurancePartnerModel {
  Id_DV: number;
  TenDonVi: string;
  DiaChi: string;
  SoDT: string;
  NguoiLienHe: string;
  GhiChu: string;
  NguoiTao?: number;
  NguoiSua?: number;
  NgayTao?: Date;
  NgaySua?: Date;
  IsDisable?: boolean;
  IdCustomer?: number;
}


