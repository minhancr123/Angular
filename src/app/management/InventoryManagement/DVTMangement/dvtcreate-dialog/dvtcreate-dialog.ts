import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { DVTService } from 'src/app/management/Services/DVT-management.service';

@Component({
  selector: 'app-dvtcreate-dialog',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './dvtcreate-dialog.html',
  styleUrl: './dvtcreate-dialog.scss',
  standalone : true
})
export class DVTCreateDialog {
     form: FormGroup;
   @ViewChild('TenDVTInput') TenDVTInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DVTCreateDialog>,
    private service: DVTService,
    private layoutUtilsService : LayoutUtilsService
  ) {
    this.form = this.fb.group({
      TenDVT: ['', Validators.required],
    });
  }

  save(closeAfter = true) {
    if (this.form.invalid) return;

    const data = this.form.value;
    this.service.create(data).subscribe(() => {
      this.layoutUtilsService.showActionNotification('Thêm đơn vị tính thành công', MessageType.Create);
      this.service.fetch();
      if (closeAfter) {
        this.dialogRef.close(true);
      } else {
        this.form.reset({ TenDVT: '' }); 
         setTimeout(() => this.TenDVTInput.nativeElement.focus(), 0);
      }
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
