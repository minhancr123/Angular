import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { AssetReasonModel } from 'src/app/management/Model/asset-management.model';
import { ReasonAssetService } from 'src/app/management/Services/assetReason-management.service';

@Component({
  selector: 'app-asset-reason-edit-dialog',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule],
  templateUrl: './asset-reason-edit-dialog.html',
  styleUrl: './asset-reason-edit-dialog.scss',
  standalone: true
})
export class AssetReasonEditDialog {
    form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AssetReasonModel,
    private dialogRef: MatDialogRef<AssetReasonEditDialog>,
    private fb: FormBuilder,
    private service: ReasonAssetService,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.form = this.fb.group({
      IdRow: [data.IdRow],
      MaTangGiam: [data.MaTangGiam, Validators.required],
      TenTangGiam: [data.TenTangGiam, Validators.required],
      LoaiTangGiam: [data.LoaiTangGiam ?? 1, Validators.required],
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
