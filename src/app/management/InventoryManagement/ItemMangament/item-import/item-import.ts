import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatHangService } from 'src/app/management/Services/item-management.service';
import { MatHang } from 'src/app/management/Model/Inventory-management.model';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-item-import',
  imports: [MatButtonModule, MatInputModule , MatIconModule , MatFormFieldModule],
  templateUrl: './item-import.html',
  styleUrl: './item-import.scss',
  standalone: true
})
export class ItemImport {
  selectedFile: File | null = null;
  importedData: any[] = [];
  constructor(public MatHangService : MatHangService , public layoutService: LayoutUtilsService ,

    private dialogRef: MatDialogRef<ItemImport>,
  ) {}
  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      alert('Chỉ được chọn một file Excel');
      return;
    }
    this.selectedFile = target.files[0];
  }

 importData() {
  if (!this.selectedFile) {
    alert('⚠️ Vui lòng chọn file trước khi import');
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = (e: any) => {
    try {
      const bstr: string = e.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });

      // Lấy sheet đầu tiên
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Chuyển sang JSON
      const importedRaw = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      console.log('📄 Dữ liệu import:', importedRaw);

      if (!importedRaw.length) {
        alert('⚠️ File Excel không có dữ liệu');
        return;
      }

      // Map thành mảng MatHang[]
      const listMatHang: MatHang[] = importedRaw.map((item: any) => ({
        IdMH: null,
        MaHang: item.MaHang || '',
        TenMatHang: item.TenMatHang || '',
        IdLMH: Number(item.IdLMH) || 0,
        TenOnSite: item.TenOnSite || '',
        GiaMua: Number(item.GiaMua) || 0,
        IdDVTCap2: item.IdDVTCap2 ? Number(item.IdDVTCap2) : null,
        TheoDoiLo: item.TheoDoiLo?.toString().toLowerCase() === 'true',
        MoTa: item.MoTa || '',
        IdDVT: item.IdDVT ? Number(item.IdDVT) : null,
        Vat: Number(item.Vat) || 0,
        GiaBan: Number(item.GiaBan) || 0,
        QuyDoiDVTCap2: Number(item.QuyDoiDVTCap2) || 0,
        IsTaiSan: item.IsTaiSan?.toString().toLowerCase() === 'true',
        SoKyTinhKhauHaoToiThieu: Number(item.SoKyTinhKhauHaoToiThieu) || 0,
        SoKyTinhKhauHaoToiDa: Number(item.SoKyTinhKhauHaoToiDa) || 0,
        LowerLimit: Number(item.LowerLimit) || 0,
        UpperLimit: Number(item.UpperLimit) || 0,
        IdDVTCap3: item.IdDVTCap3 ? Number(item.IdDVTCap3) : null,
        QuyDoiDVTCap3: Number(item.QuyDoiDVTCap3) || 0,
        ChiTietMoTa: item.ChiTietMoTa || ''
      }));

      // Gọi API 1 lần truyền cả mảng
      this.MatHangService.importMatHang(listMatHang).subscribe({
        next: (res) => {
          console.log('✅ Import thành công:', res);
          this.layoutService.showActionNotification('Import dữ liệu thành công', MessageType.Create , 4000 ,true);
          this.selectedFile = null;
        },
        error: (err) => {
          console.error('❌ Lỗi khi import:', err);
          this.layoutService.showError('Lỗi khi import dữ liệu');
        }
      });

    } catch (error) {
      console.error('❌ Lỗi khi đọc file Excel:', error);
      alert('❌ Không thể đọc file Excel. Vui lòng kiểm tra lại.');
    }
  };

  fileReader.readAsBinaryString(this.selectedFile);
}



   


  downloadTemplate() {
    // Tạo dữ liệu mẫu
    const data = [
    {
      MaHang: 'MH001',
      TenMatHang: 'Sản phẩm 1',
      IdLMH: 2,
      TenOnSite: 'OnSite 1',
      GiaMua: 100000,
      IdDVTCap2: 1,
      TheoDoiLo: true,
      MoTa: 'Mô tả sản phẩm 1',
      IdDVT: 3,
      Vat: 10,
      GiaBan: 120000,
      QuyDoiDVTCap2: 100,
      IsTaiSan: false,
      SoKyTinhKhauHaoToiThieu: 12,
      SoKyTinhKhauHaoToiDa: 60,
      LowerLimit: 10,
      UpperLimit: 100,
      IdDVTCap3: 5,
      QuyDoiDVTCap3: 10,
      ChiTietMoTa: 'Chi tiết mô tả sản phẩm 1'
    },
    {
      MaHang: 'MH002',
      TenMatHang: 'Sản phẩm 2',
      IdLMH: 3,
      TenOnSite: 'OnSite 2',
      GiaMua: 200000,
      IdDVTCap2: 2,
      TheoDoiLo: false,
      MoTa: 'Mô tả sản phẩm 2',
      IdDVT: 4,
      Vat: 5,
      GiaBan: 220000,
      QuyDoiDVTCap2: 50,
      IsTaiSan: true,
      SoKyTinhKhauHaoToiThieu: 6,
      SoKyTinhKhauHaoToiDa: 36,
      LowerLimit: 20,
      UpperLimit: 200,
      IdDVTCap3: 6,
      QuyDoiDVTCap3: 20,
      ChiTietMoTa: 'Chi tiết mô tả sản phẩm 2'
    }
  ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = {
      Sheets: { 'Mẫu loại mặt hàng': worksheet },
      SheetNames: ['Mẫu loại mặt hàng'],
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'MauLoaiMatHang.xlsx');
  }
  goBack() {
   this.dialogRef.close();
  }
}
