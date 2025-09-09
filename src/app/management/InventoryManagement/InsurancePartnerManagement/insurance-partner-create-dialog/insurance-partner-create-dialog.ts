import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { InsurancePartnerModel } from 'src/app/management/Model/Inventory-management.model';
import { InsurancePartnerService } from 'src/app/management/Services/insurancePartner-management.service';
import { InsurancePartnerList } from '../insurance-partner-list/insurance-partner-list';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-insurance-partner-create-dialog',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './insurance-partner-create-dialog.html',
  styleUrl: './insurance-partner-create-dialog.scss',
  standalone: true
})
export class InsurancePartnerCreateDialog {
form: FormGroup;
userId : number;
  constructor(
    private fb: FormBuilder,
    private service: InsurancePartnerService,
    private layoutUtilsService: LayoutUtilsService,
    public dialogRef: MatDialogRef<InsurancePartnerList>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
     tenDonVi: ['', Validators.required],
      diaChi: ['', Validators.required],
      soDT: ['', Validators.required],
      nguoiLienHe: ['', Validators.required],
      ghiChu: ['']
    });
    
    const {user} = JSON.parse(localStorage.getItem("6.2.0-auth-user")!);
    this.userId = user.Id;

  }

  ngOnInit(): void {
    // Nếu có data thì patch form (edit mode - không yêu cầu trong yêu cầu hiện tại)
  }

  submit(closeAfterSave: boolean) {
   if (this.form.valid) {
    const formValue = this.form.value;
    const newPartner: InsurancePartnerModel = {
      Id_DV: 0,
      TenDonVi: formValue.tenDonVi,
      DiaChi: formValue.diaChi,
      SoDT: formValue.soDT,
      NguoiLienHe: formValue.nguoiLienHe,
      GhiChu: formValue.ghiChu,
      IdCustomer: 1,
      IsDisable: false,
      NgayTao: new Date(),
      NguoiTao: this.userId
    };

    this.service.createPartner(newPartner).subscribe({
      next: () => {
        this.layoutUtilsService.showActionNotification('Thêm đơn vị bảo hiểm thành công', MessageType.Create);
        this.service.fetch();

        if (closeAfterSave) {
          this.dialogRef.close(true);
        } else {
          this.form.reset(); // reset form nếu tiếp tục thêm mới
          this.form.markAsPristine();
        }
      },
      error: () => {
        this.layoutUtilsService.showActionNotification('Thêm thất bại', MessageType.Error);
      }
    });
  } else {
    this.form.markAllAsTouched();
  }
  }

  close() {
    this.dialogRef.close();
  }
}
