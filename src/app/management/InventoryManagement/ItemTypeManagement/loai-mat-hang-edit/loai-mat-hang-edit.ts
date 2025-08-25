import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-loai-mat-hang-edit',
  imports: [MatFormFieldModule ,ReactiveFormsModule ,MatDialogModule , MatInputModule , MatButtonModule ],
  templateUrl: './loai-mat-hang-edit.html',
  styleUrl: './loai-mat-hang-edit.scss'
})
export class LoaiMatHangEdit {
form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoaiMatHangEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      tenLoai: [data.item?.TenLMH || '', Validators.required],
      loaiChaId: [data.item?.IdLMHParent || null],
      doUuTien: [data.item?.DoUuTien || 0],
      moTa: [data.item?.Mota || '']
    });
  }

  save(): void {
    if (this.form.valid) {
      const updatedItem = {
        ...this.data.item,
        TenLMH: this.form.value.tenLoai,
        IdLMHParent: this.form.value.loaiChaId,
        DoUuTien: this.form.value.doUuTien,
        Mota: this.form.value.moTa
      };
      this.dialogRef.close(updatedItem);
    }
  }
}
