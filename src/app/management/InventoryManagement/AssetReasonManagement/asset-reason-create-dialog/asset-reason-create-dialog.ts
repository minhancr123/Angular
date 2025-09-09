import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { ReasonAssetService } from 'src/app/management/Services/assetReason-management.service';

@Component({
  selector: 'app-asset-reason-create-dialog',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatCheckboxModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatChipsModule , MatSelectModule , MatFormFieldModule,MatInputModule],
  templateUrl: './asset-reason-create-dialog.html',
  styleUrl: './asset-reason-create-dialog.scss',
  standalone: true
})
export class AssetReasonCreateDialog {
   form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssetReasonCreateDialog>,
    private service: ReasonAssetService,
    private layoutUtilsService: LayoutUtilsService
  ) {
    this.form = this.fb.group({
      LoaiTangGiam: ['1', Validators.required],
      MaTangGiam: ['', Validators.required],
      TenTangGiam: ['', Validators.required],
      TrangThai: [true]
    });
  }

  onSave(closeAfter : boolean) {
    if (this.form.invalid) return;

    const data = this.form.value;
    this.service.create(data).subscribe(() => {
      this.layoutUtilsService.showActionNotification(
        'Thêm lý do tăng/giảm tài sản thành công',
        MessageType.Create
      );
      this.service.fetch();
      if (closeAfter) {
        this.dialogRef.close(true);
      } else {
        this.form.reset({ LoaiTangGiam: '1', TrangThai: true });
      }
    });
  }
  

  onBack() {
    this.dialogRef.close(false);
  }
}
