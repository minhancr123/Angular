import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerThongTinService  } from '../../Services/customer-thong-tin.service';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { PaginatorComponent } from 'src/app/_metronic/shared/crud-table/components/paginator/paginator.component';
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SortIconComponent } from 'src/app/_metronic/shared/crud-table/components/sort-icon/sort-icon.component';
import { catchError, map, of, Subscription } from 'rxjs';
import { CustomerModelDTO } from '../../Model/customer-management.model';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { DanhMucChungService } from 'src/app/_core/services/danhmuc.service';
import { AuthService } from 'src/app/modules/auth';
import { ResultObjModel } from 'src/app/_metronic/core/models/_base.model';
import { CustomerManagementEditDialogComponent } from '../customer-management-edit-dialog/customer-edit-dialog';
import { CustomerStatusDialog } from '../customer-status-dialog/customer-status-dialog';
const COLOR_DANGHIEULUC = '#3699ff';
const COLOR_THANHLY = '#1bc5bd';
const COLOR_CHUAHIEULUC = '#ffa800';
const COLOR_HETHIEULUC = '#f64e60';
@Component({
  selector: 'customer-thong-tin-list',
  templateUrl: './customer-thong-tin-list.html',
  styleUrl : "./customer-thong-tin-list.scss",
  standalone: true,
  imports: [PaginatorComponent, MatCardModule,SortIconComponent, MatToolbarModule , MatSlideToggleModule, CommonModule ,TranslateModule,FormsModule,ReactiveFormsModule,MatTableModule ],
  providers :[DatePipe]

})
export class CustomerAppListComponent implements OnInit {
   paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  displayedColumns = ['stt', 'tenungdung', 'ngayhethan', 'tinhtrang', 'ghichu'];
  idParam: string;
  customerModel: CustomerModelDTO;
  constructor(
    private changeDetect: ChangeDetectorRef,
    public customerThongTinService: CustomerThongTinService,
    private translate: TranslateService,
    public subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
    public danhmuc: DanhMucChungService,
    private auth: AuthService,
    private route: ActivatedRoute,
    public datepipe: DatePipe
  ) {}

 ngOnInit(): void {
  this.idParam = this.route.snapshot.paramMap.get('id');
  console.log('[DEBUG] ID param:', this.idParam);

  const getCustomersb = this.customerThongTinService
    .getCustomer(+this.idParam)
    .pipe(
      map((res: ResultObjModel<CustomerModelDTO>) => {
        console.log('[DEBUG] API response:', res);
        if (res && res.status === 1) {
          this.customerModel = res.data;
          console.log('[DEBUG] Customer model:', this.customerModel);
        } else {
          console.warn('[WARN] API returned non-success status:', res?.status);
        }
      }),
      catchError((err) => {
        console.error('[ERROR] Failed to get customer:', err);
        return of(); // Trả về observable rỗng để không bị crash
      })
    )
    .subscribe();

  this.subscriptions.push(getCustomersb);

  this.filter();

  this.grouping = this.customerThongTinService.grouping;
  this.paginator = this.customerThongTinService.paginator;
  this.sorting = this.customerThongTinService.sorting;

  const sb = this.customerThongTinService.isLoading$.subscribe((res) => {
    this.isLoading = res;
    console.log('[DEBUG] Loading status:', res);
  });
  this.subscriptions.push(sb);
}


  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  sort(column: string): void {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.customerThongTinService.fetchStateSort({ sorting });
  }

  filter() {
    const filter = {};
    filter['CustomerID'] = this.idParam;
    this.customerThongTinService.patchState({ filter });
  }

  paginate(paginator: PaginatorState) {
    this.customerThongTinService.fetchStateSort({ paginator });
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 236;
    return tmp_height + 'px';
  }

  getDate(date: string) {
    return date.split(' ')[0];
  }
  getDateTime(date: string) {
    const time = date.split(' ')[1];
    const day = date.split(' ')[0];
    return time + ' ' + day;
  }

  create() {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Thêm thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerManagementEditDialogComponent, {
      data: {},
      width: '1200px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerThongTinService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerThongTinService.fetch();
      }
    });
  }

  format_date(value: any): any {
    let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
    return latest_date;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    this.auth.updateLastlogin().subscribe();
  }

  getTileStatus(value: boolean) {
    if (value) return this.translate.instant('COMMOM.TAMKHOA');
    return this.translate.instant('COMMOM.DANGSUDUNG');
  }

  getColorStatus(value: boolean) {
    if (!value) return COLOR_DANGHIEULUC;
    return COLOR_HETHIEULUC;
  }
  updateStatus(item) {
    const CustomerID = +this.idParam;
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerStatusDialog, {
      data: { item: item, CustomerID: CustomerID },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerThongTinService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerThongTinService.fetch();
      }
    });
  }
  goBack(): void {
    window.history.back();
  }
}
