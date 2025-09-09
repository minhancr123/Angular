import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { InsurancePartnerModel } from 'src/app/management/Model/Inventory-management.model';
import { InsurancePartnerService } from 'src/app/management/Services/insurancePartner-management.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { InsurancePartnerCreateDialog } from '../insurance-partner-create-dialog/insurance-partner-create-dialog';
import { InsurancePartnerEditDialog } from '../insurance-partner-edit-dialog/insurance-partner-edit-dialog';
import { PaginatorComponent } from 'src/app/_metronic/shared/crud-table/components/paginator/paginator.component';

@Component({
  selector: 'app-insurance-partner-list',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatDialogModule, TranslateModule, SharedModule , PaginatorComponent],
  templateUrl: './insurance-partner-list.html',
  styleUrl: './insurance-partner-list.scss',
  standalone: true
})
export class InsurancePartnerList {
   displayedColumns = ['stt', 'tenDonVi', 'diaChi', 'soDT', 'nguoiLienHe', 'ghiChu', 'thaotac'];
  searchGroup: FormGroup;
  paginator: PaginatorState;
   sorting : SortState;
   grouping : GroupingState;
  isLoading = false;
  showFilter = false;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public service: InsurancePartnerService,
    private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog
  ) {
    this.paginator = this.service.paginator;
    this.sorting = this.service.sorting;
    this.grouping = this.service.grouping;
    this.service.isLoading$.subscribe(res => this.isLoading = res);
  }

  ngOnInit(): void {
    this.service.fetch();
    this.paginator = this.service.paginator;

    this.searchGroup = this.fb.group({
      searchTerm: [''],
      tenDonVi: [''],
      diaChi: [''],
      soDT: [''],
      nguoiLienHe: ['']
    });

    const search$ = this.searchGroup.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((val) => {
        const { searchTerm, ...filter } = val;
        this.service.patchState({ searchTerm, filter });
      });

    this.subscriptions.push(search$);
    this.subscriptions.push(this.service.isLoading$.subscribe(val => this.isLoading = val));
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  create() {
   const dialogRef = this.dialog.open(InsurancePartnerCreateDialog, {
    width: '700px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.service.fetch(); // nếu cần fetch lại
    }
  });
  }

  edit(item: InsurancePartnerModel) {
    const dialogRef = this.dialog.open(InsurancePartnerEditDialog, {
    width: '700px',
    disableClose: true,
    data: item
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.service.fetch();
    }
  });
  }
  paginate(paginator: PaginatorState): void {
    this.service.patchState({ paginator });
  }
  delete(item: InsurancePartnerModel) {
    const dialogRef = this.layoutUtilsService.deleteElement(
      'Xác nhận xoá',
      `Bạn có chắc muốn xoá đơn vị "${item.TenDonVi}" không?`,
      'Đang xoá...',
      'Xoá'
    );

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      this.service.delete(item.Id_DV).subscribe({
        next: () => {
          this.layoutUtilsService.showActionNotification('Xoá thành công', MessageType.Delete);
          this.service.fetch();
        },
        error: () => {
          this.layoutUtilsService.showError('Xoá thất bại');
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
