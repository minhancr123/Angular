export interface DVTModel {
    IdDVT: number;
    TenDVT: string;
    IdCustomer?: number;
    IsDel?: boolean;
    CreatedBy?: number;
    DeleteBy?: number;
    ModifiedBy?: number;
    CreatedDate?: Date;
    ModifiedDate?: Date;
    DeleteDate?: Date;
}