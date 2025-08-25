import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-import-edit-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Import khách hàng</h2>
    <mat-dialog-content>
      <p>Tải lên file Excel chứa danh sách khách hàng</p>
      <input type="file" (change)="onFileChange($event)" />
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onClose()">Hủy</button>
      <button mat-raised-button color="primary" (click)="onImport()">Import</button>
    </mat-dialog-actions>
  `,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
  ],
})
export class CustomerImportEditDialog {
  selectedFile: File | null = null;

  constructor(public dialogRef: MatDialogRef<CustomerImportEditDialog>) {}

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onImport() {
    // TODO: Gọi API để import file ở đây
    this.dialogRef.close(true);
  }

  onClose() {
    this.dialogRef.close(false);
  }
}
