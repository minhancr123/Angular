import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { GroupAssetService } from 'src/app/management/Services/groupAsset-management.service';
import { GroupAssetEditDialog } from '../group-asset-edit-dialog/group-asset-edit-dialog';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';

@Component({
  selector: 'app-group-asset-create-dialog',
  imports: [CommonModule, MatCardModule,MatCheckboxModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatDialogModule],
  templateUrl: './group-asset-create-dialog.html',
  styleUrl: './group-asset-create-dialog.scss'
})
export class GroupAssetCreateDialog {
   form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GroupAssetCreateDialog>,
    private service: GroupAssetService,
    private layoutUtilsService : LayoutUtilsService
  ) {
    this.form = this.fb.group({
      MaNhom: ['', Validators.required],
      TenNhom: ['', Validators.required],
      TrangThai: [false]
    });
  }

  save(closeAfter = true) {
    if (this.form.invalid) return;

    const data = this.form.value;
    this.service.create(data).subscribe(() => {
      this.layoutUtilsService.showActionNotification('Thêm nhóm tài sản thành công', MessageType.Create);
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
