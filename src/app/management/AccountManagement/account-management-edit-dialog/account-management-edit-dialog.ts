import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { BehaviorSubject, of, ReplaySubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { ResultModel,ResultObjModel } from 'src/app/_metronic/core/models/_base.model';
import { CommonModule, DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs/operators';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { AccountManagementService } from '../../Services/account-management.service';
import { AccountModel } from '../../Model/account-management.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PartnerFilterDTO } from '../../Model/partner-management.model';
import { GeneralService } from '../../../_core/services/general.service';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-account-management-edit-dialog',
  templateUrl: './account-management-edit-dialog.html',
  styleUrl : './account-management-edit-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatInputModule, MatSelectModule,MatDialogModule ,MatFormFieldModule, TranslateModule , FormsModule , CommonModule , ReactiveFormsModule],
  providers :[DatePipe],
  standalone : true
})
export class AccountManagementEditDialogComponent implements OnInit, OnDestroy {
  item: AccountModel = new AccountModel();
  isLoading;
  formGroup: FormGroup;
  partnerFilters: PartnerFilterDTO[] = [];
  private subscriptions: Subscription[] = [];
  filterForm: FormControl;
  isInitData: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountManagementEditDialogComponent>,
    private fb: FormBuilder,
    public accountManagementService: AccountManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public general: GeneralService,
    public authService: AuthService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translateService: TranslateService,

  ) { }

  get isTwoColumns(): boolean {
  return Object.keys(this.formGroup.controls).length > 5;
}

// Helper để xác định màu control
getControlColor(controlName: string): 'primary' | 'warn' | 'accent' {
  const control = this.formGroup.get(controlName);
  if (!control) return 'primary';
  if (control.invalid && (control.dirty || control.touched)) return 'warn';
  if (control.valid) return 'accent'; // màu xanh lá
  return 'primary';
}
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.item.empty();
    this.item.RowId = this.data.item.RowId;
    this.loadForm();
    const sb = this.accountManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    })
    this.subscriptions.push(sb);
    const add = this.accountManagementService.getPartnerFilters().subscribe((res: ResultModel<PartnerFilterDTO>) => {
      if (res && res.status === 1) {
        this.partnerFilters = res.data;
        this.filterForm = new FormControl(this.partnerFilters[0].RowId);
        this.isInitData.next(true);
      }
    });
    this.subscriptions.push(add);
    this.loadInitData();
  }

  loadInitData() {
    if (this.item.RowId !== 0) {
      const sbGet = this.accountManagementService.getAccountModelByRowID(this.item.RowId).pipe(tap((res: ResultObjModel<AccountModel>) => {
        if (res.status === 1) {
          this.item = res.data;
          this.setValueToForm(res.data);
        }
      })).subscribe();
      this.subscriptions.push(sbGet);
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      hoten: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      sodienthoai: ['', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/), Validators.maxLength(50)])],
      gioitinh: ['Nam', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(50)])],
      ghichu: ['', Validators.compose([Validators.maxLength(500)])],
      username: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      password: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      repassword: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    });
  }

  setValueToForm(model: AccountModel) {
    this.formGroup.controls['hoten'].setValue(model.Fullname);
this.formGroup.controls['gioitinh'].setValue(model.Gender);
this.formGroup.controls['sodienthoai'].setValue(model.Mobile);
this.formGroup.controls['email'].setValue(model.Email);
this.formGroup.controls['ghichu'].setValue(model.Note);
this.formGroup.controls['username'].setValue(model.Username);
this.formGroup.controls['password'].setValue(model.Password);
this.formGroup.controls['repassword'].setValue(model.Password);

  }

  getTitle() {
    if (this.item.RowId === 0) {
      return this.translateService.instant('ACCOUNTMANAGEMENT.TAOTAIKHOANSUDUNG');
    }
    return this.translateService.instant('ACCOUNTMANAGEMENT.SUATAIKHOAN') + ' ' + this.data.item.Username;
  }

  private prepareData(): AccountModel {
    let model = new AccountModel();
    model.empty();
    model.RowId = this.item.RowId;
    model.Email = this.formGroup.controls['email'].value;
model.Fullname = this.formGroup.controls['hoten'].value;
model.Gender = this.formGroup.controls['gioitinh'].value;
model.Mobile = this.formGroup.controls['sodienthoai'].value;
model.Note = this.formGroup.controls['ghichu'].value;
model.PartnerId = this.item.PartnerId;
model.Password = this.formGroup.controls['password'].value;
model.Username = this.formGroup.controls['username'].value;

    return model;
  }

 onSubmit() {
  console.log("Form submitted");

  if (this.formGroup.valid) {
    console.log("Form is valid");

    const password = this.formGroup.controls['password'].value;
    const repassword = this.formGroup.controls['repassword'].value;

    console.log("Password:", password);
    console.log("Re-password:", repassword);

    if (password !== repassword) {
      const message = this.translateService.instant('ERROR.MATKHAUKHONGTRUNGKHOP');
      console.warn("Passwords do not match:", message);

      this.layoutUtilsService.showActionNotification(
        message, MessageType.Read, 999999999, true, false, 3000, 'top', 0
      );
      return;
    }

    const model = this.prepareData();
    console.log("Model prepared:", model);

    if (this.item.RowId === 0) {
      console.log("Calling create()");
      this.create(model);
    } else {
      console.log("Calling update()");
      this.update(model);
    }

  } else {
    console.warn("Form is invalid");
    this.validateAllFormFields(this.formGroup);
  }
}

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  create(item: AccountModel) {
    this.isLoadingSubmit$.next(true);
    if (this.authService.currentUserValue.IsMasterAccount) item.PartnerId = this.filterForm.value;
    this.accountManagementService.createAccount(item).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  update(item: AccountModel) {
    this.isLoadingSubmit$.next(true);
    this.accountManagementService.updateAccount(item).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  goBack() {
    // if (this.checkDataBeforeClose()) {
    //   this.dialogRef.close();
    // } else {
    //   const _title = this.translateService.instant('CHECKPOPUP.TITLE');
    //   const _description = this.translateService.instant('CHECKPOPUP.DESCRIPTION');
    //   const _waitDesciption = this.translateService.instant('CHECKPOPUP.WAITDESCRIPTION');
    //   const popup = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    //   popup.afterClosed().subscribe((res) => {
    //     res ? this.dialogRef.close() : undefined
    //   })
    // }

    this.dialogRef.close();
  }

  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (this.item.RowId === 0) {
      const empty = new AccountModel();
      empty.empty();
      return this.general.isEqual(empty, model);
    };
    return this.general.isEqual(model, this.item);
  }


 @HostListener('window:beforeunload', ['$event'])
beforeunloadHandler(e: BeforeUnloadEvent): string | void {
  if (!this.checkDataBeforeClose()) {
    e.preventDefault(); // Firefox
    e.returnValue = ''; // Chrome
    return '';          // Trả về chuỗi để cảnh báo người dùng
  }

  return; // Trường hợp dữ liệu OK, không cảnh báo => return undefined
}

}
