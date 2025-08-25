import { ChangeDetectorRef, Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogActions } from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PartnerFilterDTO } from '../../Model/partner-management.model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomerThongTinService } from '../../Services/customer-thong-tin.service';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { GeneralService } from 'src/app/_core/services/general.service';
import { AuthService } from 'src/app/modules/auth';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ResultObjModel } from 'src/app/_metronic/core/models/_base.model';
import { AppCustomerDTO, CustomerAppGiaHanModel, CustomerModelDTO } from '../../Model/customer-management.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-customer-gia-han-edit-dialog',
  templateUrl: './customer-gia-han-edit-dialog.html',
  styleUrl :'./customer-gia-han-edit-dialog.scss',
  standalone : true,
  imports: [MatDialogContent, MatDialogActions , MatDialogModule , CommonModule , TranslateModule , ReactiveFormsModule , MatFormFieldModule , MatDatepickerModule ,MatNativeDateModule,
    MatInputModule,
    MatDatepickerModule,
    MatCheckboxModule],
  
})

export class CustomerGiaHanEditDialog {
  item: CustomerAppGiaHanModel = new CustomerAppGiaHanModel();
  isLoading;
  formGroup: FormGroup;
  partnerFilters: PartnerFilterDTO[] = [];
  private subscriptions: Subscription[] = [];
  filterForm: FormControl;
  selection = new SelectionModel<number>(true, []);
  minDate: Date;
  customer: CustomerModelDTO;
  LstAppCustomerDTO: AppCustomerDTO[] = [];
  isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CustomerGiaHanEditDialog>,
    private fb: FormBuilder,
    public customerThongTinService: CustomerThongTinService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public generalService: GeneralService,
    public authService: AuthService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translateService: TranslateService,

  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.item.empty();
    this.item.CustomerID = this.data.item.RowID;
    this.minDate = new Date();
    this.loadForm();
    const sb = this.customerThongTinService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    })
    this.subscriptions.push(sb);
    this.isLoading = false;
    const add = this.customerThongTinService.getInfoAppByCustomerID(this.item.CustomerID).subscribe((res) => {
      if (res && res.status === 1) {
        this.LstAppCustomerDTO = res.data;
        this.isLoading = true;
        this.LstAppCustomerDTO.forEach(element => {
          this.selection.select(element.AppID);
        });
        this.changeDetect.detectChanges();
      }
    });
    this.subscriptions.push(add);
    const customerSB = this.customerThongTinService.getCustomer(this.item.CustomerID).subscribe((res: ResultObjModel<CustomerModelDTO>) => {
      if (res && res.status === 1) {
        this.customer = res.data;
        this.setValueToForm(this.customer);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
    this.subscriptions.push(customerSB);
  }

  setValueToForm(model: CustomerModelDTO) {
    this.formGroup.controls['ghichu'].setValue(model.Note);
    if (model.GiaHanDenNgay) this.formGroup.controls['enddate'].setValue(this.generalService.f_string_date(model.GiaHanDenNgay));
  }

  loadForm() {
    this.formGroup = this.fb.group({
      ghichu: ['', Validators.compose([Validators.maxLength(500)])],
      enddate: ['', Validators.compose([Validators.required])],
    });
  }

  getTitle() {
    return this.translateService.instant('CUSTOMER_GIAHAN.TITLE');
  }

  private prepareData(): CustomerAppGiaHanModel {
    let model = new CustomerAppGiaHanModel();
    model.empty();
    model.CustomerID = this.item.CustomerID;
    model.EndDate = (this.formGroup.controls['enddate'].value) ? this.generalService.format_date(this.formGroup.controls['enddate'].value) : '';
    model.Note = this.formGroup.controls['ghichu'].value;
    model.LstAppCustomerID = this.selection.selected;
    return model;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const model = this.prepareData();
      this.update(model);
    } else {
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

 update(item: CustomerAppGiaHanModel) {
  this.isLoadingSubmit$.next(true);

  this.customerThongTinService.UpdateCustomerAppGiaHanModel(item).subscribe((res) => {
    console.log('Response từ UpdateCustomerAppGiaHanModel:', res); // 👈 Debug tại đây

    this.isLoadingSubmit$.next(false);

    if (res && res.status === 1) {
      this.dialogRef.close(res);
    } else {
      this.layoutUtilsService.showActionNotification(
        res?.error?.message || 'Lỗi không xác định', // thêm fallback để tránh lỗi null
        MessageType.Read,
        999999999,
        true,
        false,
        3000,
        'top',
        0
      );
    }
  }, (error) => {
    console.error('Lỗi HTTP khi gọi UpdateCustomerAppGiaHanModel:', error); 
    this.isLoadingSubmit$.next(false);
    this.layoutUtilsService.showActionNotification(
      error?.message || 'Lỗi kết nối máy chủ',
      MessageType.Read,
      999999999,
      true,
      false,
      3000,
      'top',
      0
    );
  });
}


  goBack() {
    if (this.checkDataBeforeClose()) {
      this.dialogRef.close();
    } else {
      const _title = this.translateService.instant('CHECKPOPUP.TITLE');
      const _description = this.translateService.instant('CHECKPOPUP.DESCRIPTION');
      const _waitDesciption = this.translateService.instant('CHECKPOPUP.WAITDESCRIPTION');
      const popup = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
      popup.afterClosed().subscribe((res) => {
        res ? this.dialogRef.close() : undefined
      })
    }
  }

  checkDataBeforeClose(): boolean {
    const model = this.prepareData();
    if (model.EndDate === this.customer.GiaHanDenNgay && model.Note === this.customer.Note) return true;
    return false;
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
