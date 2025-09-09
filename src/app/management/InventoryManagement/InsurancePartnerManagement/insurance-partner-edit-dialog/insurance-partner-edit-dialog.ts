import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { InsurancePartnerModel } from 'src/app/management/Model/Inventory-management.model';
import { InsurancePartnerService } from 'src/app/management/Services/insurancePartner-management.service';

@Component({
  selector: 'app-insurance-partner-edit-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './insurance-partner-edit-dialog.html',
  styleUrl: './insurance-partner-edit-dialog.scss',
  standalone: true
})
export class InsurancePartnerEditDialog {
  form: FormGroup;
  userId: number;

  constructor(
    private fb: FormBuilder,
    private service: InsurancePartnerService,
    private layoutUtilsService: LayoutUtilsService,
    public dialogRef: MatDialogRef<InsurancePartnerEditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: InsurancePartnerModel
  ) {
    this.form = this.fb.group({
      tenDonVi: [data?.TenDonVi || '', Validators.required],
      diaChi: [data?.DiaChi || ''],
      soDT: [data?.SoDT || ''],
      nguoiLienHe: [data?.NguoiLienHe || ''],
      ghiChu: [data?.GhiChu || '']
    });

    const { user } = JSON.parse(localStorage.getItem("6.2.0-auth-user")!);
    this.userId = user.Id;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const updated: InsurancePartnerModel = {
      ...this.data,
      TenDonVi: this.form.value.tenDonVi,
      DiaChi: this.form.value.diaChi,
      SoDT: this.form.value.soDT,
      NguoiLienHe: this.form.value.nguoiLienHe,
      GhiChu: this.form.value.ghiChu,
      NguoiSua: this.userId,
      NgaySua: new Date()
    };

    this.service.updatePartner(updated).subscribe({
      next: () => {
        this.layoutUtilsService.showActionNotification('Cập nhật thành công', MessageType.Update);
        this.dialogRef.close(true);
      },
      error: () => {
        this.layoutUtilsService.showError('Cập nhật thất bại');
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
