import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MatHang } from 'src/app/management/Model/Inventory-management.model';
import { DVTService } from 'src/app/management/Services/DVT-management.service';
import { MatHangService } from 'src/app/management/Services/item-management.service';
import { LoaiMatHangService } from 'src/app/management/Services/itemtype-management.service';
import { MatCardHeader, MatCardModule } from "@angular/material/card";

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.html',
  styleUrls: ['./item-edit.scss'],
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule, MatSelectModule, MatFormFieldModule, CommonModule, MatCheckboxModule, MatCardHeader , MatCardModule],
  providers: [DVTService, LoaiMatHangService]
})
export class ItemEdit implements OnInit {
  form: FormGroup;
  dvtList: any[] = [];
  loaiMatHangList: any[] = [];
  itemId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private matHangService: MatHangService,
    private dvtService: DVTService,
    private loaiMatHangService: LoaiMatHangService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.loadItem(this.itemId);
    }

    this.loadDVTList();
    this.loadLoaiMatHang();
  }

  private initForm() {
    this.form = this.fb.group({
      maHang: ['', Validators.required],
      tenMatHang: ['', Validators.required],
      idLMH: [null],
      tenOnSite: [''],
      giaMua: [0],
      dvtCap2: [''],
      theoDoiLo: [false],
      moTa: [''],
      donViTinh: [null],
      vat: [0],
      giaBan: [0],
      quyDoiDvtCap2: [0],
      laTaiSan: [false],
      soKyKhauHaoToiThieu: [0],
      soKyKhauHaoToiDa: [0],
      tonToiThieu: [0],
      tonToiDa: [0],
      dvtCap3: [''],
      quyDoiDvtCap3: [0],
      chiTietMoTa: ['']
    });
  }

  private loadItem(id: string) {
    this.isLoading = true;
    this.matHangService.getById(id).subscribe(val => {
      const item: MatHang = val.data;
      console.log("Loaded item:", item);
      this.form.patchValue({
        maHang: item.MaHang,
        tenMatHang: item.TenMatHang,
        idLMH: item.IdLMH,
        tenOnSite: item.TenOnSite,
        giaMua: item.GiaMua,
        dvtCap2: item.IdDVTCap2,
        theoDoiLo: item.TheoDoiLo,
        moTa: item.MoTa,
        donViTinh: item.IdDVT,
        vat: item.Vat,
        giaBan: item.GiaBan,
        quyDoiDvtCap2: item.QuyDoiDVTCap2,
        laTaiSan: item.IsTaiSan,
        soKyKhauHaoToiThieu: item.SoKyTinhKhauHaoToiThieu,
        soKyKhauHaoToiDa: item.SoKyTinhKhauHaoToiDa,
        tonToiThieu: item.LowerLimit,
        tonToiDa: item.UpperLimit,
        dvtCap3: item.IdDVTCap3,
        quyDoiDvtCap3: item.QuyDoiDVTCap3,
        chiTietMoTa: item.ChiTietMoTa
      });
      this.isLoading = false;
    });
  }

  loadDVTList() {
    this.dvtService.getAll().subscribe(data => {
      this.dvtList = data;
    });
  }

  loadLoaiMatHang() {
    this.loaiMatHangService.getLoaiChaList().subscribe(data => {
      this.loaiMatHangList = data;
    });
  }

save(): void {
  if (this.form.invalid) return;

  const formValue = this.form.value;

  const updatedItem: MatHang = {
    IdMH: this.itemId ? parseInt(this.itemId, 10) : 0,
    MaHang: formValue.maHang,
    TenMatHang: formValue.tenMatHang,
    IdLMH: formValue.idLMH,
    TenOnSite: formValue.tenOnSite,
    GiaMua: formValue.giaMua,
    GiaBan: formValue.giaBan,
    Vat: formValue.vat,
    TheoDoiLo: formValue.theoDoiLo,
    MoTa: formValue.moTa,
    IdDVT: formValue.donViTinh,
    IsTaiSan: formValue.laTaiSan,
    SoKyTinhKhauHaoToiThieu: formValue.soKyKhauHaoToiThieu,
    SoKyTinhKhauHaoToiDa: formValue.soKyKhauHaoToiDa,
    LowerLimit: formValue.tonToiThieu,
    UpperLimit: formValue.tonToiDa,
    IdDVTCap2: formValue.dvtCap2,
    QuyDoiDVTCap2: formValue.quyDoiDvtCap2,
    IdDVTCap3: formValue.dvtCap3,
    QuyDoiDVTCap3: formValue.quyDoiDvtCap3,
    ChiTietMoTa: formValue.chiTietMoTa,
    ModifiedDate: new Date(),
    // ModifiedBy: 'admin',        // hoặc lấy từ auth service
    // CreatedDate: new Date(),    // có thể giữ lại giá trị cũ nếu là update
    // CreatedBy: 'admin',         // như trên
  };

  this.matHangService.updateMatHang(updatedItem).subscribe(() => {
    alert('Cập nhật thành công!');
    // this.router.navigate(['/item']);
  });
}


  onCancel(): void {
    history.back();
  }
}
