import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { MatHang } from 'src/app/management/Model/Inventory-management.model';
import { DVTService } from 'src/app/management/Services/DVT-management.service';
import { MatHangService } from 'src/app/management/Services/item-management.service';
import { LoaiMatHangService } from 'src/app/management/Services/itemtype-management.service';

@Component({
  selector: 'app-add-item',
  imports: [MatFormFieldModule , MatCheckboxModule , MatButtonModule , MatInputModule , CommonModule , MatTabsModule,
    MatIconModule,MatCardModule, MatButtonToggleModule, ReactiveFormsModule, MatSelectModule, MatOptionModule, MatRadioModule],
  templateUrl: './add-item.html',
  styleUrl: './add-item.scss',
  providers: [DVTService, LoaiMatHangService, MatHangService]
})
export class AddItem {
form!: FormGroup;
  loaiMatHangList: any[] = [];
  dvtList: any[] = [];
  matHangList: any[] = [];
  selectedMatHang: MatHang | null = null;
  selectedFile: File | null = null;
previewUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private MatHangService: MatHangService,  private LoaiMatHangService : LoaiMatHangService,
  private dvtService : DVTService , private layoutUtilsService : LayoutUtilsService

  ) {}
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      selectedMatHang: [null], // Field để chọn mặt hàng cho upload ảnh
      maHang: ['', Validators.required],
    tenMatHang: ['', Validators.required],
      idLMH: ['',Validators.required],
      tenOnSite: [''],
       giaMua: [null, [Validators.min(0) , Validators.required]],
      dvtCap2: [''],
      theoDoiLo: [false],
      moTa: [''],
      donViTinh: ['',Validators.required],
        vat: [null, [Validators.min(0), Validators.max(100)]],
      giaBan: [null, [Validators.min(0) , Validators.required]],
      quyDoiDvtCap2: [0],
      laTaiSan: [false],
      soKyKhauHaoToiThieu: [0],
      soKyKhauHaoToiDa: [0],
      tonToiThieu: [0],
      tonToiDa: [0],
      dvtCap3: [''],
      quyDoiDvtCap3: [0],
      chiTietMoTa: [''],
       hinhAnh: [null]
    });

    this.loadLoaiMatHang();
    this.loadDVTList();
    this.loadMatHangList();
  }

  loadDVTList() {
    this.dvtService.getAll().subscribe((data) => {
      this.dvtList = data;
    });
  }

  loadLoaiMatHang() {
    this.LoaiMatHangService.getLoaiChaList().subscribe((data) => {
      this.loaiMatHangList = data;
    });
  }

  loadMatHangList() {
    // Sử dụng observable item$ từ service để lấy danh sách mặt hàng
    this.MatHangService.item$.subscribe((data) => {
      this.matHangList = data;
    });
    
    // Trigger load data nếu chưa có
    if (this.matHangList.length === 0) {
      this.MatHangService.fetch();
    }
  }

  onMatHangSelected(event: any) {
    const selectedItem = event.value;
    this.selectedMatHang = selectedItem;
    
    if (selectedItem) {
      console.log('Selected item for image upload:', selectedItem);
    }
  }
onUploadImage(){
  if(this.selectedFile && this.selectedMatHang) {
    // Upload file first
    this.MatHangService.uploadFile(this.selectedFile).subscribe({
        next: (url: any) => {
          // Then update the selected item with new image URL
          const updatedItem = { ...this.selectedMatHang };
          updatedItem.HinhAnh = url.data;
          this.MatHangService.updateMatHang(updatedItem).subscribe({
            next: (response) => {
              console.log('Image updated successfully', response);
              this.layoutUtilsService.showActionNotification('Cập nhật hình ảnh thành công', MessageType.Update);
              // Update selected item with new image
              this.selectedMatHang.HinhAnh = response.data.HinhAnh;
              // Clear preview
              this.previewUrl = null;
              this.selectedFile = null;
            },
            error: (error) => {
              console.error('Error updating image', error);
              this.layoutUtilsService.showActionNotification('Cập nhật hình ảnh thất bại', MessageType.Error);
            }
          });
        },
        error: () => {
          this.layoutUtilsService.showActionNotification('Upload ảnh thất bại', MessageType.Error);
        }
      });
  } else if (!this.selectedMatHang) {
    this.layoutUtilsService.showActionNotification('Vui lòng chọn mặt hàng trước', MessageType.Error);
  } else if (!this.selectedFile) {
    this.layoutUtilsService.showActionNotification('Vui lòng chọn file ảnh', MessageType.Error);
  }
}
  onSave() {
    if (this.form.valid) {
      const formValue = this.form.value;
      
      const newItem: MatHang = {
        IdMH: null, // ID sẽ được tự động tạo khi lưu
        MaHang: formValue.maHang,
        TenMatHang: formValue.tenMatHang,
        IdLMH: formValue.idLMH,
        IdDVT: formValue.donViTinh,
        MoTa: formValue.moTa,
        GiaMua: formValue.giaMua,
        GiaBan: formValue.giaBan,
        CreatedBy: 1, // Gán ID người dùng nếu có từ token
        CreatedDate: new Date(),
        IsDel: false,
        ModifiedBy: null,
        ModifiedDate: null,
        DeletedBy: null,
        DeletedDate: null,
        Vat: formValue.vat,
        Barcode: '', // Nếu có thể quét mã sau
        NgungKinhDoanh: false,
        IdDVTCap2: null,
        QuyDoiDVTCap2: formValue.quyDoiDvtCap2,
        IdDVTCap3: null,
        QuyDoiDVTCap3: formValue.quyDoiDvtCap3,
        TenOnSite: formValue.tenOnSite,
        IdNhanHieu: null,
        IdXuatXu: null,
        HinhAnh: formValue.hinhAnh || '', // Hình ảnh đã upload (nếu có)
        ChiTietMoTa: formValue.chiTietMoTa,
        MaPhu: '',
        KichThuoc: '',
        ThongSo: '',
        TheoDoiTonKho: true,
        TheoDoiLo: formValue.theoDoiLo,
        MaLuuKho: '',
        MaViTriKho: '',
        UpperLimit: formValue.tonToiDa,
        LowerLimit: formValue.tonToiThieu,
        IsTaiSan: formValue.laTaiSan,
        SoKyTinhKhauHaoToiThieu: formValue.soKyKhauHaoToiThieu,
        SoKyTinhKhauHaoToiDa: formValue.soKyKhauHaoToiDa,
        SoNamDeNghi: null,
        TiLeHaoMon: null
      };
      
      // Gọi service để lưu mặt hàng mới
      this.MatHangService.createMatHang(newItem).subscribe({
        next: (response) => {
          console.log('Item saved successfully', response);
          this.layoutUtilsService.showActionNotification('Thêm mới mặt hàng thành công', MessageType.Create);
          this.onReset();
        },
        error: (error) => {
          console.error('Error saving item', error);
          this.layoutUtilsService.showActionNotification('Thêm mới mặt hàng thất bại', MessageType.Error);
        }
      });
    } else {
      this.form.markAllAsTouched(); // đánh dấu để hiển thị lỗi
      return;
    }
  }

  onReset() {
    this.form.reset();
    this.selectedMatHang = null;
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onBack() {
    // Quay lại trang trước
    history.back();
  }
}
