import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { DVTModel } from 'src/app/management/Model/DVT-management.model';
import { DVTService } from 'src/app/management/Services/DVT-management.service';

@Component({
  selector: 'app-dvtedit-dialog',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './dvtedit-dialog.html',
  styleUrl: './dvtedit-dialog.scss'
})
export class DVTEditDialog {
    form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DVTEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DVTModel,
    private dvtService: DVTService,
    private layout: LayoutUtilsService
  ) {
    this.form = this.fb.group({
      IdDVT: [data.IdDVT],
      TenDVT: [data.TenDVT, Validators.required]
    });
  }

  save() {
    if (this.form.invalid) return;
    this.dvtService.update(this.form.value).subscribe({
      next: () => {
        this.layout.showActionNotification('Cập nhật thành công', MessageType.Update);
        this.dialogRef.close(true);
      },
      error: () => {
        this.layout.showError('Cập nhật thất bại');
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
