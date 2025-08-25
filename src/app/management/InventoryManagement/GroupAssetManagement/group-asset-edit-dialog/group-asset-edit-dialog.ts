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
import { GroupAssetModel } from 'src/app/management/Model/asset-management.model';
import { GroupAssetService } from 'src/app/management/Services/groupAsset-management.service';

@Component({
  selector: 'app-group-asset-edit-dialog',
  imports: [CommonModule, MatCardModule,MatCheckboxModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatDialogModule],
  templateUrl: './group-asset-edit-dialog.html',
  styleUrl: './group-asset-edit-dialog.scss'
})
export class GroupAssetEditDialog {
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GroupAssetModel,
    private dialogRef: MatDialogRef<GroupAssetEditDialog>,
    private fb: FormBuilder,
    private service: GroupAssetService,
    private layoutUtilsService : LayoutUtilsService
  ) {
    this.form = this.fb.group({
      IdPNTS: [data.IdPNTS],
      MaNhom: [data.MaNhom, Validators.required],
      TenNhom: [data.TenNhom, Validators.required],
      TrangThai: [data.TrangThai ?? false]
    });
  }

  save() {
    if (this.form.invalid) return;
    console.log(this.form.value);
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
