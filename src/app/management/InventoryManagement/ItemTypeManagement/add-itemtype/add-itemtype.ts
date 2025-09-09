import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { LoaiMatHangModel } from 'src/app/management/Model/Inventory-management.model';
import { LoaiMatHangService } from 'src/app/management/Services/itemtype-management.service';

@Component({
  selector: 'app-add-item',
  imports: [MatFormFieldModule ,MatIcon , MatSelectModule , MatOptionModule ,MatDialogModule ,ReactiveFormsModule,CommonModule, MatInputModule  , MatButtonModule  ] ,
  templateUrl: './add-itemtype.html',
  styleUrl: './add-itemtype.scss',
  standalone: true
})
export class AddItemType implements OnInit  {
  form: FormGroup;
  loaiChaList = []; // Lấy từ service
  khoList = []; // Lấy từ service
  fileName = '';  
  ma : string;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private router : Router,
    private route : ActivatedRoute,
    private LoaiMatHangService : LoaiMatHangService,
    private layoutUtilsService : LayoutUtilsService,
   @Optional() public dialogRef: MatDialogRef<AddItemType>,
  @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
   this.form = this.fb.group({
  tenLoai: ['', Validators.required],        // map với TenLMH
  loaiChaId: [0],                            // map với IdLMHParent
  moTa: [''],                                // map với Mota
  doUuTien: [0],                             // map với DoUuTien
  khoMacDinhId: [null],                      // map với IdKho
});
;
  this.loadLoaiChaList();
    // TODO: Load loaiChaList và khoList từ service
  }
  ngOnInit(): void {
  this.LoaiMatHangService.generateNewMaLMH().subscribe((val) => {console.log(val); this.ma = val});
}
  loadLoaiChaList(): void {
  this.LoaiMatHangService.getLoaiChaList()
    .subscribe((res: any[]) => {
      this.loaiChaList = res;
    });
}

  chonHinhAnh() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.fileName = input.files[0].name;
      this.form.patchValue({ hinhAnh: input.files[0] });
    }
  }

  resetForm() {
    this.form.reset();
    this.fileName = '';
  }
  Back(){
    this.router.navigate(['../'] , {relativeTo : this.route}  );
  }
 submit() {
  if (this.form.valid) {
    const formValue = this.form.value;

    const newItem: LoaiMatHangModel = {
      IdLMH: 0, // hoặc bỏ nếu API tự tạo
      MaLMH: this.ma, // nếu không có trong form, để rỗng hoặc sinh tự động nếu cần
      TenLMH: formValue.tenLoai,
      IdCustomer: 1, // hoặc lấy từ token/user hiện tại nếu có
      IdKho: formValue.khoMacDinhId,
      IdLMHParent: formValue.loaiChaId,
      DoUuTien: formValue.doUuTien,
      Mota: formValue.moTa,
      HinhAnh: '', // nếu có upload thì xử lý thêm
      CreatedDate: new Date().toISOString(),
      isDel: false
    };

    this.LoaiMatHangService.createLoaiMatHang(newItem).subscribe({
      next: () => {
        this.layoutUtilsService.showActionNotification(
          'Thêm loại mặt hàng thành công',
          MessageType.Create
        );
        this.LoaiMatHangService.fetch(); // refresh danh sách
        this.dialogRef?.close(); // đóng dialog nếu có
      },
      error: (err) => {
        console.error('Lỗi thêm:', err);
        this.layoutUtilsService.showActionNotification(
          'Thêm loại mặt hàng thất bại',
          MessageType.Error
        );
      }
    });
  } else {
    this.form.markAllAsTouched();
  }
}


 
}
