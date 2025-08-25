import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NhanHieuModel } from '../../../Model/Inventory-management.model';
import { NhanHieuService } from '../../../Services/brand-magement.service';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';

@Component({
  selector: 'app-brand-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './brand-edit-dialog.html',
  styleUrls: ['./brand-edit-dialog.scss']
})
export class BrandEditDialog {
  editForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { item: NhanHieuModel },
    private dialogRef: MatDialogRef<BrandEditDialog>,
    private nhanHieuService: NhanHieuService,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.initForm();
  }

  private initForm() {
    this.editForm = this.fb.group({
      TenNhanHieu: [this.data.item.TenNhanHieu, Validators.required]
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const updatedBrand: NhanHieuModel = {
        ...this.data.item,
        ...this.editForm.value,
        ModifiedDate: new Date()
      };

      this.nhanHieuService.update(updatedBrand).subscribe({
        next: () => {
          this.layoutUtilsService.showActionNotification(
            'Cập nhật thành công',
            MessageType.Update
          );
          this.dialogRef.close(true);
        },
        error: () => {
          this.layoutUtilsService.showError('Lỗi khi cập nhật nhãn hiệu');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
