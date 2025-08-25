import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { AssetTypeModel } from 'src/app/management/Model/asset-management.model';
import { AssetTypeService } from 'src/app/management/Services/asset-management.service';
import { AssetTypeCreateDialog } from '../asset-type-create-dialog/asset-type-create-dialog';
import { AssetTypeEditDialog } from '../asset-type-edit-dialog/asset-type-edit-dialog';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { PaginatorComponent } from 'src/app/_metronic/shared/crud-table/components/paginator/paginator.component';
import { SearchInput } from 'src/app/shared/components/search-input/search-input';

@Component({
  selector: 'app-asset-type-list',
  imports: [CommonModule, SearchInput, MatCardModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatDialogModule , SharedModule , TranslateModule , PaginatorComponent ],
  templateUrl: './asset-type-list.html',
  styleUrl: './asset-type-list.scss'
})
export class AssetTypeList implements OnInit, OnDestroy {
   displayedColumns = ['stt', 'maLoai', 'tenLoai', 'trangThai', 'thaotac'];
  searchGroup: FormGroup;
  paginator: PaginatorState;
  sorting : SortState;
  grouping : GroupingState;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public service: AssetTypeService,
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

    this.searchGroup = this.fb.group({
      maLoai: [''],
      tenLoai: ['']
    });

    const search$ = this.searchGroup.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((val) => {
        this.service.patchState({ filter: val });
      });

    this.subscriptions.push(search$);
    this.subscriptions.push(this.service.isLoading$.subscribe(val => this.isLoading = val));
  }
  onSearch(event: any) {
    this.service.patchState({ searchTerm: event.target.value });
  }
  paginate(paginator: PaginatorState): void {
    this.service.patchState({ paginator });
  }
  create() {
    const dialogRef = this.dialog.open(AssetTypeCreateDialog, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.service.fetch();
    });
  }

  edit(item: AssetTypeModel) {
    const dialogRef = this.dialog.open(AssetTypeEditDialog, {
      width: '600px',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.service.fetch();
    });
  }

  delete(item: AssetTypeModel) {
    const dialogRef = this.layoutUtilsService.deleteElement(
      'Xác nhận xoá',
      `Xoá loại tài sản "${item.TenLoai}"?`,
      'Đang xoá...',
      'Xóa'
    );

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      this.service.delete(item.IdLoaiTS).subscribe({
        next: () => {
          this.layoutUtilsService.showActionNotification('Xóa thành công', MessageType.Delete);
          this.service.fetch();
        },
        error: () => {
          this.layoutUtilsService.showError('Xóa thất bại');
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
