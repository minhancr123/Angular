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
  selector: 'app-asset-type-create-dialog',
  imports: [CommonModule, MatCardModule,MatCheckboxModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatDialogModule ],
  templateUrl: './asset-type-create-dialog.html',
  styleUrl: './asset-type-create-dialog.scss'
})
export class AssetTypeCreateDialog {
    form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssetTypeCreateDialog>,
    private service: AssetTypeService,
    private layoutUtilsService : LayoutUtilsService
  ) {
    this.form = this.fb.group({
      MaLoai: ['', Validators.required],
      TenLoai: ['', Validators.required],
      TrangThai: [false]
    });
  }

  save(closeAfter = true) {
    if (this.form.invalid) return;

    const data = this.form.value;
    this.service.create(data).subscribe(() => {
      this.layoutUtilsService.showActionNotification('Thêm loại tài sản thành công', MessageType.Create);
      this.service.fetch();
      if (closeAfter) {
        this.dialogRef.close(true);
      } else {
        this.form.reset({ TrangThai: false }); // reset giữ checkbox false
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
