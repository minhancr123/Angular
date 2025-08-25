import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { XuatXuModel } from 'src/app/management/Model/Inventory-management.model';
import { XuatXuService } from 'src/app/management/Services/origin-management.service';

@Component({
  selector: 'app-origin-create-dialog',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './origin-create-dialog.html',
  styleUrl: './origin-create-dialog.scss'
})
export class OriginCreateDialog {
createForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OriginCreateDialog>,
    private xuatXuService: XuatXuService,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.initForm();
  }

  private initForm() {
    this.createForm = this.fb.group({
      TenXuatXu: ['', Validators.required]
    });
  }
 resetForm() {
    this.createForm.reset({
      TenXuatXu: '',
    });
  }
  onSubmitAndClose() {
    if (this.createForm.valid) {
      const newOrigin: XuatXuModel = {
        ...this.createForm.value,
        CreatedDate: new Date()
      };

      this.xuatXuService.create(newOrigin).subscribe({
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

  onSubmitAndReset() {
  if (this.createForm.valid) {
    const newOrigin: XuatXuModel = {
      ...this.createForm.value,
      CreatedDate: new Date()
    };

    this.xuatXuService.create(newOrigin).subscribe({
      next: () => {
        this.layoutUtilsService.showActionNotification(
          'Thêm mới thành công',
          MessageType.Create
        );
        this.resetForm(); // reset form để thêm mới tiếp
      },
      error: () => {
        this.layoutUtilsService.showError('Lỗi khi thêm mới nhãn hiệu');
      }
    });
  }
}

  onCancel() {
    this.dialogRef.close(true);
  }
   
}
