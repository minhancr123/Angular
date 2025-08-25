import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pakage } from '../../Model/customer-management.model';
import { BehaviorSubject, of, ReplaySubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { LayoutUtilsService, MessageType } from '../../../_core/utils/layout-utils.service';
import { DanhMucChungService } from '../../../_core/services/danhmuc.service';
import { CustomerManagementService } from '../../Services/customer-management.service';
import { GroupingState, IGroupingState, PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { CommonModule, DatePipe } from '@angular/common';
import { finalize, tap } from 'rxjs/operators';
// import { element } from 'protractor';
import { SelectionModel } from '@angular/cdk/collections';
import { AppListDTO, CustomerModel } from '../../Model/customer-management.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { ResultModel } from 'src/app/_metronic/core/models/_base.model';

interface CustomerForm {
  tencongty: FormControl<string | null>
  nguoidaidien: FormControl<string | null>
  ngaybatdausudung: FormControl<string | null>
  diachi: FormControl<string | null>
  gioitinh: FormControl<string | null>
  sodienthoai: FormControl<string | null>
  ngayhethan: FormControl<string | null>
  code: FormControl<string | null>
  email: FormControl<string | null>
  linhvuchoatdong: FormControl<string | null>
  ghichu: FormControl<string | null>
  username: FormControl<string | null>
  password: FormControl<string | null>
  repassword: FormControl<string | null>
}

@Component({
  selector: "app-customer-add-dialog",
  templateUrl: "./customer-edit-dialog.html",
  styleUrls: ["./customer-edit-dialog.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
     MatNativeDateModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
  ],
  providers: [DatePipe, provideNativeDateAdapter()],
})
export class CustomerManagementEditDialogComponent implements OnInit, OnDestroy {
  item: any = [];
  isLoading;
  paginator: PaginatorState;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  displayedColumns = ['select', 'tenapp', 'goisudung', 'soluongnhansu'];

  appCodes$ = new BehaviorSubject<AppListDTO[]>([]);
  itemIds: number[] = [];
  selection = new SelectionModel<number>(true, []);
  goisudungArrayFrom: FormControl[] = [];
  soluongnhansuArrayFrom: FormControl[] = [];
  inputSoLuongForm: FormControl<number | null> = new FormControl<number | null>(null, [
  Validators.pattern(/^-?(0|[0-9]\d*)?$/)
]);
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerManagementEditDialogComponent>,
    private fb: FormBuilder,
    public customerManagementService: CustomerManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public danhmuc: DanhMucChungService,
    private authService: AuthService,
    public datepipe: DatePipe
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
get isTwoColumns(): boolean {
  return Object.keys(this.formGroup.controls).length > 5;
}
  ngOnInit(): void {
    //this.item = this.data.item;
    const request = this.customerManagementService
      .getListApp()
      .pipe(
        tap((res: ResultModel<AppListDTO>) => {
          if (res && res.status === 1) {
            const sb = this.customerManagementService.getPakageList().subscribe((data) => {
              res.data.forEach((element) => {
                const pakeges = data.filter((item) => item.AppID == element.AppID);
                element.LstPakage = pakeges;
              });

              this.appCodes$.next([...res.data]);
              this.addGoisudungArrayFrom();
              this.addSoluongnhansuArrayFrom();
              res.data.forEach((element) => {
                this.itemIds.push(element.AppID);
              });
            });
            this.subscriptions.push(sb);
          } else {
            return this.appCodes$.next([]);
          }
        }),
        finalize(() => {
          this.isLoading = true;
        })
      )
      .subscribe();
    this.subscriptions.push(request);
    const sb = this.customerManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
    this.subscriptions.push(sb);
    this.loadCustomer();
  }

  loadCustomer() {
    this.loadForm();
    this.selection.changed.subscribe((res) => {
      this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom);
    });
  }

  loadForm() {
    this.formGroup = this.fb.group({
      tencongty: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      nguoidaidien: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(200)])],
      ngaybatdausudung: ['', Validators.compose([Validators.required])],
      diachi: ['', Validators.compose([Validators.required])],
      gioitinh: ['Nam', Validators.compose([Validators.required])],
      sodienthoai: ['', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)])],
      ngayhethan: [''],
      code: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      linhvuchoatdong: [''],
      ghichu: [''],
      username: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      repassword: ['', Validators.compose([Validators.required])],
    });

    this.formGroup.controls['code'].valueChanges.subscribe((res) => {
      res ? this.formGroup.controls['username'].setValue(res + '.') : this.formGroup.controls['username'].setValue(undefined);
    });
  }
  private prepareData(): CustomerModel {
    const customer = new CustomerModel();
    customer.empty();
    customer.Address = this.formGroup.controls['diachi'].value;
    customer.Code = this.formGroup.controls['code'].value;
    customer.CompanyName = this.formGroup.controls['tencongty'].value;
    customer.RegisterName = this.formGroup.controls['nguoidaidien'].value;
    customer.Gender = this.formGroup.controls['gioitinh'].value;
    customer.LinhVuc = this.formGroup.controls['linhvuchoatdong'].value;
    customer.Note = this.formGroup.controls['ghichu'].value;
    customer.Phone = this.formGroup.controls['sodienthoai'].value;
    customer.Email = this.formGroup.controls['email'].value;
    customer.RegisterDate = this.format_date(this.formGroup.controls['ngaybatdausudung'].value);
    customer.DeadlineDate = this.format_date(this.formGroup.controls['ngayhethan'].value);
    customer.Username = this.formGroup.controls['username'].value;
    customer.Password = this.formGroup.controls['password'].value;

    const numberNhanSu: number[] = [];
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (customer.AppID.includes(value)) {
        numberNhanSu.push(this.soluongnhansuArrayFrom[index].value);
      }
    }
    customer.SoLuongNhanSu = numberNhanSu;

    const goisudung: number[] = [];
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (customer.AppID.includes(value)) {
        goisudung.push(this.goisudungArrayFrom[index].value);
      }
    }
    customer.GoiSuDung = goisudung;

    const lstDBCurrentID: number[] = [];
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (customer.AppID.includes(value)) {
        lstDBCurrentID.push(-1);
      }
    }
    customer.CurrentDBID = lstDBCurrentID;
    return customer;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      if (this.formGroup.controls['username'].value.length <= this.formGroup.controls['code'].value.length + 1) {
        this.layoutUtilsService.showActionNotification('Username không hợp lệ', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        return;
      }
      if (this.selection.selected.length === 0) {
        this.layoutUtilsService.showActionNotification('App chưa được chọn', MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        return;
      }
      if (this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom) === true) return;
      if (this.formGroup.controls['password'].value !== this.formGroup.controls['repassword'].value) {
        this.layoutUtilsService.showActionNotification(
          'Mật khẩu không trùng khớp',
          MessageType.Read,
          999999999,
          true,
          false,
          3000,
          'top',
          0
        );
        return;
      }
      const customer = this.prepareData();
      this.create(customer);
    } else {
      this.validateAllFormFields(this.formGroup);
    }
  }
  changeSoLuong() {
    this.soluongnhansuArrayFrom.forEach((formControl) => {
      formControl.setValue(this.inputSoLuongForm.value);
    });
    this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom);
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
  validateAllSoLuongNhanSu(formControl: FormControl[]): boolean {
    let isMark = false;
    for (let index = 0; index < this.appCodes$.value.length; index++) {
      const value = this.appCodes$.value[index].AppID;
      if (this.selection.selected.includes(value) && !formControl[index].value) {
        isMark = true;
        formControl[index].markAllAsTouched();
      } else {
        formControl[index].markAsUntouched();
      }
    }
    return isMark;
  }

  create(customer: CustomerModel) {
    this.isLoadingSubmit$.next(true);
    this.customerManagementService.createCustomer(customer).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  goBack() {
    console.log("Close");
    this.dialogRef.close();
  }

  paginate(paginator: PaginatorState) {
    this.customerManagementService.patchState({ paginator });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.itemIds.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.itemIds.forEach((row) => this.selection.select(row));
  }

  private addGoisudungArrayFrom() {
    this.appCodes$
      .getValue()
      .forEach((item) => this.goisudungArrayFrom.push(new FormControl(item.LstPakage[0].RowID, [Validators.required])));
  }

  private addSoluongnhansuArrayFrom() {
    this.appCodes$
      .getValue()
      .forEach((item) =>
        this.soluongnhansuArrayFrom.push(new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)]))
      );
  }

  f_number(value: any) {
    return Number((value + '').replace(/,/g, ''));
  }

  f_currency(value: any, args?: any): any {
    let nbr = Number((value + '').replace(/,|-/g, ''));
    return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  format_date(value: any, args?: any): any {
    let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
    return latest_date;
  }

  eventHandler(event) {
    if (
      event.target.value.length == this.formGroup.controls['code'].value.length + 1 &&
      (event.code == 'Backspace' || event.code == 'Delete')
    ) {
      return false;
    }
    if (event.target.value === '') {
      event.target.value = this.formGroup.controls['code'].value + '.';
    }
    return true;
  }

  disableApp(AppID: number) {
    if (AppID == 14 || AppID == 16 || AppID == 3) {
      this.selection.select(AppID);
      return true;
    } else {
      return false;
    }
  }
}


