import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { XuatXuModel } from 'src/app/management/Model/Inventory-management.model';
import { XuatXuService } from 'src/app/management/Services/origin-management.service';

@Component({
  selector: 'app-origin-edit-dialog',
  imports: [ CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule],
  templateUrl: './origin-edit-dialog.html',
  styleUrl: './origin-edit-dialog.scss'
})
export class OriginEditDialog {
editForm: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { item: XuatXuModel },
    private dialogRef: MatDialogRef<OriginEditDialog>,
    private xuatXuService: XuatXuService,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.initForm();
  }

  private initForm() {
    this.editForm = this.fb.group({
      TenXuatXu: [this.data.item.TenXuatXu, Validators.required]
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const updatedOrigin: XuatXuModel = {
        ...this.data.item,
        ...this.editForm.value,
        ModifiedDate: new Date()
      };

      this.xuatXuService.update(updatedOrigin).subscribe({
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
