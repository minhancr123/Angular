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
import { GroupAssetModel } from 'src/app/management/Model/asset-management.model';
import { GroupAssetService } from 'src/app/management/Services/groupAsset-management.service';
import { GroupAssetCreateDialog } from '../group-asset-create-dialog/group-asset-create-dialog';
import { GroupAssetEditDialog } from '../group-asset-edit-dialog/group-asset-edit-dialog';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { PaginatorComponent } from 'src/app/_metronic/shared/crud-table/components/paginator/paginator.component';
import { SearchInput } from 'src/app/shared/components/search-input/search-input';

@Component({
  selector: 'app-group-asset-list',
  imports: [CommonModule, SearchInput, SharedModule , TranslateModule, MatCardModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatTableModule, MatInputModule, MatDialogModule , PaginatorComponent],
  templateUrl: './group-asset-list.html',
  styleUrl: './group-asset-list.scss',
  standalone: true
})
export class GroupAssetList implements OnInit , OnDestroy {
     displayedColumns = ['stt', 'maNhom', 'tenNhom', 'trangThai', 'thaotac'];
  searchGroup: FormGroup;
  isLoading = false;
  paginator: PaginatorState;
    sorting : SortState;
    grouping : GroupingState;
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    public service: GroupAssetService,
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
      maNhom: [''],
      tenNhom: ['']
    });

    const search$ = this.searchGroup.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((val) => {
        this.service.patchState({ filter: val });
      });

    this.subscriptions.push(search$);
    this.subscriptions.push(this.service.isLoading$.subscribe(val => this.isLoading = val));
  }
  paginate(paginator: PaginatorState): void {
    this.service.patchState({ paginator });
  }
  onSearch(value: any): void {
    this.service.patchState({ searchTerm: value.target.value });
  }
  create() {
    const dialogRef = this.dialog.open(GroupAssetCreateDialog, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.service.fetch();
    });
  }

  edit(item: GroupAssetModel) {
    const dialogRef = this.dialog.open(GroupAssetEditDialog, {
      width: '600px',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.service.fetch();
    });
  }

  delete(item: GroupAssetModel) {
    const dialogRef = this.layoutUtilsService.deleteElement(
      'Xác nhận xoá',
      `Xoá nhóm tài sản "${item.TenNhom}"?`,
      'Đang xoá...',
      'Xóa'
    );

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      this.service.delete(item.IdPNTS).subscribe({
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
