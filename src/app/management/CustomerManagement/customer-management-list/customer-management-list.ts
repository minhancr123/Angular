import { ChangeDetectorRef, Component, DestroyRef, HostListener, Inject, inject, OnInit } from "@angular/core";
import { LayoutUtilsService, MessageType } from "src/app/_core/utils/layout-utils.service";
import { CustomerImportEditDialog } from "../customer-import-edit-dialog/customer-import-edit-dialog";
import { CommonModule, DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { CustomerManagementService } from "../../Services/customer-management.service";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from "@angular/router";
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { CustomerManagementEditDialogComponent } from "../customer-management-edit-dialog/customer-edit-dialog";
import { BehaviorSubject, Subscription, take } from "rxjs";
import { right } from "@popperjs/core";
import { CustomerAddDeleteAppDialog } from "../customer-add-delete-app-dialog/customer-add-delete-app-dialog";
import { CustomerResetPassword } from "../customer-reset-password/customer-reset-password";
import { CustomerAddNumberStaffDialog } from "../customer-add-number-staff-dialog/customer-add-number-staff-dialog";
import { CustomerGiaHanEditDialog } from "../customer-gia-han-edit-dialog/customer-gia-han-edit-dialog";
import { GroupingState, PaginatorState, SortState } from "src/app/_metronic/shared/crud-table";
import { CustomerThongTinService } from "../../Services/customer-thong-tin.service";
import { AuthService } from "src/app/modules/auth";
import { DanhMucChungService } from "src/app/_core/services/danhmuc.service";
import { TokenStorage } from "src/app/modules/auth/_services/token-storage.service";
import { DateFilterCustomer } from "../../Model/DateFilter-customer.model";
import { SubheaderService } from "src/app/_metronic/partials/layout";
import { showSearchFormModel } from "src/app/shared/components/jee-search-form-1/jee-search-form.model";
import { JeeSearchFormComponent } from "src/app/shared/components/jee-search-form-1/jee-search-form.component";
import { SortIconComponent } from "src/app/_metronic/shared/crud-table/components/sort-icon/sort-icon.component";
import { PaginatorComponent } from "src/app/_metronic/shared/crud-table/components/paginator/paginator.component";
import { provideNativeDateAdapter } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { SharedModule } from "src/app/theme/shared/shared.module";
@Component({
  selector: 'app-customer-management-list',
  templateUrl: './customer-management-list.html',
  styleUrl: './customer-management-list.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    SharedModule,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    JeeSearchFormComponent,
    CustomerImportEditDialog,
    TranslateModule,
    MatMenuModule,
    MatIconModule,
    RouterModule,
    SortIconComponent,
    PaginatorComponent,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatSortModule,
    MatFormFieldModule,
    MatDividerModule,
    MatDialogModule
    // các import khác như jee-search, paginator... nếu cần
  ],
    providers: [DatePipe, provideNativeDateAdapter()]

})
export class CustomerManagementList implements OnInit {
   paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  dateFilter: DateFilterCustomer;
  loadingDateFilter$ = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = [];
  displayedColumns = ['thongtinkhachhang', 'thongtinnguoihotro', 'dienthoainguoidaidien', 'thongtinsudung', 'thaoTac'];
  showSearch = new showSearchFormModel();
  constructor(
    private changeDetect: ChangeDetectorRef,
    public customerManagementService: CustomerManagementService,
    private translate: TranslateService,
    public subheaderService: SubheaderService,
    private layoutUtilsService: LayoutUtilsService,
    private tokenStorage: TokenStorage,
    public dialog: MatDialog,
    public danhmuc: DanhMucChungService,
    private auth: AuthService,
    public customerThongTinService: CustomerThongTinService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDateFilter();
    this.customerManagementService.fetch();
    this.grouping = this.customerManagementService.grouping;
    this.paginator = this.customerManagementService.paginator;
    this.sorting = this.customerManagementService.sorting;
    const sb = this.customerManagementService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.subscriptions.push(sb);
    this.configShowSearch();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  getDateFilter() {
    this.loadingDateFilter$.next(true);
    const sb = this.customerManagementService.getDateFilterCustomer().subscribe(
      (res) => {
        this.loadingDateFilter$.next(false);
        this.dateFilter = res;
      },
      (error) => {
        console.log(error);
      }
    );
    this.subscriptions.push(sb);
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
    this.customerManagementService.patchState({ sorting });
  }

  paginate(paginator: PaginatorState) {
  this.customerManagementService.patchState({ paginator });
}
 

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 236;
    return tmp_height + 'px';
  }

  // 05/05/2021 09:40:58 => 05/05/2021
  getDate(date: string) {
    return date.split(' ')[0];
  }
  // 05/05/2021 09:40:58 => 09:40:58 05/05/2021
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
       width: '800px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    this.auth.updateLastlogin().subscribe();
  }

    giaHan(item) {
      let saveMessageTranslateParam = '';
      saveMessageTranslateParam += 'Cập nhật thành công';
      const saveMessage = this.translate.instant(saveMessageTranslateParam);
      const messageType = MessageType.Create;
      const dialogRef = this.dialog.open(CustomerGiaHanEditDialog, {
        data: { item: item },
        width: '900px',
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          this.customerManagementService.fetch();
        } else {
          this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
          this.customerManagementService.fetch();
        }
      });
    }

  addNumberStaff(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerAddNumberStaffDialog, {
      data: { item: item },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }

  resetPassword(item) {
    const CustomerID = item.RowID;
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerResetPassword, {
      data: { item: item, CustomerID: CustomerID },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }

  lockCustomer(item) {
    const message = 'Bạn có muốn khoá khách hàng này không? Lưu ý: Quá trình khoá không thể hoàn tác.';
    const dialog = this.layoutUtilsService.deleteElement('', message);
    dialog.afterClosed().subscribe((x) => {
      if (x) {
        this.customerThongTinService.UpdateLock(item.RowID).subscribe(
          () => {
            this.layoutUtilsService.showActionNotification('Cập nhật thành công', MessageType.Create, 4000, true, false);
            this.customerManagementService.fetch();
          },
          (error) => {
            this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
        );
      }
    });
  }
  addDeleteApp(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Cập nhật thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerAddDeleteAppDialog, {
      data: { item: item },
      width: '900px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }
  unLockCustomer(item) {
    const message = 'Bạn có muốn mở khoá khách hàng này không? Lưu ý: Quá trình mở khoá không thể hoàn tác.';
    const dialog = this.layoutUtilsService.deleteElement('', message);
    dialog.afterClosed().subscribe((x) => {
      if (x) {
        this.customerThongTinService.UpdateUnLock(item.RowID).subscribe(
          () => {
            this.layoutUtilsService.showActionNotification('Cập nhật thành công', MessageType.Create, 4000, true, false);
            this.customerManagementService.fetch();
          },
          (error) => {
            this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
        );
      }
    });
  }

  filter() {
    const filter = {};

    this.customerManagementService.patchState({ filter });
  }

  filterDaKhoa() {
    const filter = {};
    filter['dakhoa'] = true;
    this.customerManagementService.patchState({ filter });
  }
  filterDangSuDung() {
    const filter = {};
    filter['dangsudung'] = true;
    const ListCustomerIDSDangSuDung = this.dateFilter.ListCustomerIDSDangSuDung;
    filter['ListCustomerIDSDangSuDung'] = ListCustomerIDSDangSuDung;
    this.customerManagementService.patchState({ filter });
  }
  filterSapHetHan() {
    const filter = {};
    filter['saphethan'] = true;
    const ListCustomerIDSapHetHan = this.dateFilter.ListCustomerIDSapHetHan;
    filter['ListCustomerIDSapHetHan'] = ListCustomerIDSapHetHan;
    this.customerManagementService.patchState({ filter });
  }
  filterDaHetHan() {
    const filter = {};
    filter['dahethan'] = true;
    const ListCustomerIDHetHan = this.dateFilter.ListCustomerIDHetHan;
    filter['ListCustomerIDHetHan'] = ListCustomerIDHetHan;
    this.customerManagementService.patchState({ filter });
  }
  filterAll() {
    const filter = {};
    this.customerManagementService.patchState({ filter });
  }

changeKeyword(event: Event): void {
  const input = event.target as HTMLInputElement;
  const value = input.value;
  this.search(value);
}


  changeFilter(filter) {
    this.customerManagementService.patchState({ filter });
  }

  search(searchTerm: string) {
    this.customerManagementService.patchState({ searchTerm });
  }

  configShowSearch() {
    this.showSearch.dakhoa = false;
    this.showSearch.isAdmin = false;
    this.showSearch.username = false;
    this.showSearch.titlekeyword = 'SEARCH.SEARCH4';
    this.changeDetect.detectChanges();
  }

  import() {
    const saveMessage = this.translate.instant('COMMOM.IMPORTHANHCONG');
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(CustomerImportEditDialog, {
      data: {},
      width: '1200px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.customerManagementService.fetch();
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.customerManagementService.fetch();
      }
    });
  }
}


