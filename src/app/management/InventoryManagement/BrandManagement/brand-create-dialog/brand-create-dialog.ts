import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NhanHieuModel } from '../../../Model/Inventory-management.model';
import { NhanHieuService } from '../../../Services/brand-magement.service';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';

@Component({
  selector: 'app-brand-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './brand-create-dialog.html',
  styleUrls: ['./brand-create-dialog.scss']
})
export class BrandCreateDialog {
  createForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BrandCreateDialog>,
    private nhanHieuService: NhanHieuService,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.initForm();
  }

  private initForm() {
    this.createForm = this.fb.group({
      TenNhanHieu: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.createForm.valid) {
      const newBrand: NhanHieuModel = {
        ...this.createForm.value,
        CreatedDate: new Date()
      };

      this.nhanHieuService.create(newBrand).subscribe({
        next: () => {
          this.layoutUtilsService.showActionNotification(
            'Thêm mới thành công',
            MessageType.Create
          );
          this.dialogRef.close(true);
        },
        error: () => {
          this.layoutUtilsService.showError('Lỗi khi thêm mới nhãn hiệu');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
