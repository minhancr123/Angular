import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { AssetTypeModel } from 'src/app/management/Model/asset-management.model';
import { AssetTypeService } from 'src/app/management/Services/asset-management.service';

@Component({
  selector: 'app-asset-type-edit-dialog',
  imports: [CommonModule, MatCardModule,MatCheckboxModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatDialogModule],
  templateUrl: './asset-type-edit-dialog.html',
  styleUrl: './asset-type-edit-dialog.scss'
})
export class AssetTypeEditDialog {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AssetTypeModel,
    private dialogRef: MatDialogRef<AssetTypeEditDialog>,
    private fb: FormBuilder,
    private service: AssetTypeService,
    private layoutUtilsService : LayoutUtilsService
  ) {
    this.form = this.fb.group({
      IdLoaiTS: [data.IdLoaiTS],
      MaLoai: [data.MaLoai, Validators.required],
      TenLoai: [data.TenLoai, Validators.required],
      TrangThai: [data.TrangThai ?? false]
    });
  }

  save() {
    if (this.form.invalid) return;
    this.service.update(this.form.value).subscribe({
          next: () => {
            this.layoutUtilsService.showActionNotification('Cập nhật thành công', MessageType.Update);
            this.dialogRef.close(true);
          },
          error: () => {
            this.layoutUtilsService.showError('Cập nhật thất bại');
          }
        });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
