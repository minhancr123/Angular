import { Component, Inject } from '@angular/core';
  import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';
import { MatDialogActions } from "@angular/material/dialog";

@Component({
  selector: 'app-customer-reset-password',
  template: `
    <h2 mat-dialog-title>Reset mật khẩu</h2>
    <mat-dialog-content>
      <p>Bạn có chắc chắn muốn reset mật khẩu cho khách hàng {{ data.item.name }}?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Hủy</button>
      <button mat-raised-button color="warn" (click)="onReset()">Xác nhận</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogContent, MatDialogActions],
})
export class CustomerResetPassword {
   constructor(
    public dialogRef: MatDialogRef<CustomerResetPassword>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onReset() {
    // Gọi API reset mật khẩu ở đây nếu muốn
    this.dialogRef.close(true);
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
