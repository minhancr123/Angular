import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { AssetReasonModel } from 'src/app/management/Model/asset-management.model';
import { ReasonAssetService } from 'src/app/management/Services/assetReason-management.service';
import { AssetReasonCreateDialog } from '../asset-reason-create-dialog/asset-reason-create-dialog';
import { AssetReasonEditDialog } from '../asset-reason-edit-dialog/asset-reason-edit-dialog';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { PaginatorComponent } from 'src/app/_metronic/shared/crud-table/components/paginator/paginator.component';
import { SearchInput } from 'src/app/shared/components/search-input/search-input';

@Component({
  selector: 'app-asset-reason-list',
  imports: [CommonModule, SearchInput, MatCardModule, SharedModule , TranslateModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatChipsModule , PaginatorComponent],
  templateUrl: './asset-reason-list.html',
  styleUrl: './asset-reason-list.scss'
})
export class AssetReasonList implements OnInit, OnDestroy {
  displayedColumns = ['stt', 'maTangGiam', 'tenTangGiam', 'loaiTangGiam', 'actions'];
  subscriptions: Subscription[] = [];
  paginator: PaginatorState;
  sorting : SortState;
  grouping : GroupingState;
  isLoading : boolean;
  constructor(
    public service: ReasonAssetService,
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
  }
  paginate(paginator: PaginatorState): void {
    this.service.patchState({ paginator });
  }
  create() {
    const dialogRef = this.dialog.open(AssetReasonCreateDialog, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.service.fetch();
    });
  }
  onSearch(value: any): void {
    this.service.patchState({ searchTerm: value.target.value });
  }
  edit(item: AssetReasonModel) {
    const dialogRef = this.dialog.open(AssetReasonEditDialog, {
      width: '600px',
      disableClose: true,
      data: item
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.service.fetch();
    });
  }

  delete(item: AssetReasonModel) {
    const dialogRef = this.layoutUtilsService.deleteElement(
      'Xác nhận xoá',
      `Xoá lý do "${item.TenTangGiam}"?`,
      'Đang xoá...',
      'Xóa'
    );

    dialogRef.afterClosed().subscribe(res => {
      if (!res) return;
      this.service.delete(item.IdRow).subscribe({
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
