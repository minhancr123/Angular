import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerAppAddNumberStaffModel, CustomerAppDTO } from '../../Model/customer-management.model';
import { BehaviorSubject, finalize, Subscription, tap } from 'rxjs';
import { ResultModel } from 'src/app/_metronic/core/models/_base.model';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from 'src/app/modules/auth';
import { DanhMucChungService } from 'src/app/_core/services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { CustomerManagementService } from '../../Services/customer-management.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-customer-add-number-staff-dialog',
  imports: [CommonModule , TranslateModule , FormsModule,ReactiveFormsModule , MatFormFieldModule , MatTableModule],
  templateUrl: './customer-add-number-staff-dialog.html',
  styleUrl: './customer-add-number-staff-dialog.scss'
})
export class CustomerAddNumberStaffDialog {
 item: CustomerAppAddNumberStaffModel;
  isLoading;
  paginator: PaginatorState;
  private subscriptions: Subscription[] = [];
  displayedColumns = ['tenapp', 'soluongnhansudangsudung', 'addsoluongnhansu', 'ketqua'];
  appCustomerCodes$ = new BehaviorSubject<CustomerAppDTO[]>([]);
  soluongnhansuArrayFrom: FormControl[] = [];
  inputSoLuongForm: FormControl = new FormControl('', Validators.pattern(/^-?(0|[0-9]\d*)?$/));
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerAddNumberStaffDialog>,
    private fb: FormBuilder,
    public customerManagementService: CustomerManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public danhmuc: DanhMucChungService,
    private authService: AuthService,
    public datepipe: DatePipe,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.item = new CustomerAppAddNumberStaffModel();
    this.item.empty();
    this.item.CustomerID = this.data.item.RowID;
    const request = this.customerManagementService.getListAppFromJeeAccount(this.data.item.RowID)
      .pipe(
        tap((res: ResultModel<CustomerAppDTO>) => {
          if (res && res.status === 1) {
            this.appCustomerCodes$.next(res.data);
            this.addSoluongnhansuArrayFrom();
            this.item.lstCustomerAppDTO = JSON.parse(JSON.stringify((res.data)));
            this.deteachChangeValueFromArray();
          } else {
            return this.appCustomerCodes$.next([]);
          }
        }),
        finalize(() => {
          this.isLoading = true;
        })
      ).subscribe();
    this.subscriptions.push(request);
    const sb = this.customerManagementService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    })
    this.subscriptions.push(sb);
  }

  onSubmit() {
    const customer = this.item;
    if (!this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom)) {
      this.update(customer);
    }
  }

  changeSoLuong() {
    this.soluongnhansuArrayFrom.forEach((formControl) => {
      formControl.setValue(this.inputSoLuongForm.value);
    });
    this.validateAllSoLuongNhanSu(this.soluongnhansuArrayFrom);
  }

  validateAllSoLuongNhanSu(formControl: FormControl[]): boolean {
    let isMark = false;
    for (let index = 0; index < this.appCustomerCodes$.value.length; index++) {
      if (!formControl[index].value) {
        isMark = true;
        formControl[index].markAllAsTouched();
      } else {
        formControl[index].markAsUntouched();
      }
    }
    return isMark;
  }

  update(customer: CustomerAppAddNumberStaffModel) {
    this.isLoadingSubmit$.next(true);
    this.customerManagementService.updateCustomerAppAddNumberStaff(customer).subscribe((res) => {
      this.isLoadingSubmit$.next(false);
      if (res && res.status === 1) {
        this.dialogRef.close(res);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  goBack() {
    this.dialogRef.close();
  }

  private addSoluongnhansuArrayFrom() {
    this.appCustomerCodes$.getValue().forEach((item) => this.soluongnhansuArrayFrom.push(new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)])));
  }

  private deteachChangeValueFromArray() {
    for (let index = 0; index < this.soluongnhansuArrayFrom.length; index++) {
      this.soluongnhansuArrayFrom[index].valueChanges.subscribe((value) => {
        this.item.lstCustomerAppDTO[index].SoLuongNhanSu = +value + this.appCustomerCodes$.value[index].SoLuongNhanSu;
      });
    }
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
}
