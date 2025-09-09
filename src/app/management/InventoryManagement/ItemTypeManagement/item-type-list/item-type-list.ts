  import { CommonModule } from '@angular/common';
  import { Component, OnDestroy, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
  import { MatDialog, MatDialogModule } from '@angular/material/dialog';
  import { MatIconModule } from '@angular/material/icon';
  import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
  import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
  import { LoaiMatHangService } from 'src/app/management/Services/itemtype-management.service';
  import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
  import { PaginatorComponent } from "src/app/_metronic/shared/crud-table/components/paginator/paginator.component";
  import { MatTableModule } from '@angular/material/table';
  import { ActivatedRoute, Router } from '@angular/router';
import { LoaiMatHangEdit } from '../loai-mat-hang-edit/loai-mat-hang-edit';
import { LoaiMatHangModel } from 'src/app/management/Model/Inventory-management.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { ItemImport } from '../../ItemMangament/item-import/item-import';

  @Component({
    selector: 'app-item-type-list',
    imports: [CommonModule , SharedModule , MatCardModule, TranslateModule, MatIconModule , PaginatorComponent , MatTableModule ,MatFormFieldModule , MatButtonModule,MatDialogModule , ReactiveFormsModule , MatInputModule],
    templateUrl: './item-type-list.html',
    styleUrl: './item-type-list.scss',
    standalone: true
  })
  export class ItemTypeList implements OnInit, OnDestroy {
    showFilter : boolean = false;
      sorting: SortState;
      grouping: GroupingState;
      isLoading: boolean;
    searchGroup : FormGroup;
    subscriptions : Subscription[] = [];
  displayedColumns = ['stt', 'tenLoai', 'loaiCha', 'doUuTien', 'moTa', 'thaotac'];
  paginator: PaginatorState;

    constructor(
      private fb: FormBuilder,
      public dialog: MatDialog,
      public loaiMatHangService: LoaiMatHangService,
      private layoutUtilsService: LayoutUtilsService,
      private router: Router,
      private route: ActivatedRoute, 
    ) {}

    ngOnInit(): void {
      this.loaiMatHangService.fetch();
      this.grouping = this.loaiMatHangService.grouping;
      this.sorting = this.loaiMatHangService.sorting;
      this.paginator = this.loaiMatHangService.paginator;

      const sb = this.loaiMatHangService.isLoading$.subscribe((res) => (this.isLoading = res));
      this.subscriptions.push(sb);
      this.searchGroup = this.fb.group({
        searchTerm: [''],
         tenLoai: [''],
        idLMHParent: [''],
        doUuTien: ['']
      })

      const search$ = this.searchGroup.valueChanges.pipe(debounceTime(150), distinctUntilChanged()).subscribe((val) => {console.log(val); const {searchTerm , ...filterval} = val;  this.loaiMatHangService.patchState({filter :filterval , searchTerm : searchTerm});})
      this.subscriptions.push(search$)
    }

    

    create(){
  
      this.router.navigate(['add'], { relativeTo: this.route });
    }

    paginate(paginator: PaginatorState) {
      this.loaiMatHangService.fetchStateSort({ paginator });
    }

   
  edit(item: LoaiMatHangModel) {
  const dialogRef = this.dialog.open(LoaiMatHangEdit, {
    width: '800px',
    disableClose: true,
    data: { item }
  });

  dialogRef.afterClosed().subscribe(res => {
    if (res) {
      const updatedItem = res as LoaiMatHangModel;

      // GỌI API cập nhật ở đây
      this.loaiMatHangService.updateLoaiMatHang(updatedItem).subscribe({
        next: () => {
          this.layoutUtilsService.showActionNotification('Cập nhật thành công', MessageType.Update);
          this.loaiMatHangService.fetch(); // refresh danh sách
        },
        error: (err) => {
          console.error('Lỗi cập nhật:', err);
          this.layoutUtilsService.showActionNotification('Cập nhật thất bại', MessageType.Error);
        }
      });
    }
  });
}


delete(item: LoaiMatHangModel): void {
  const title = 'Xác nhận xoá';
  const description = `Bạn có chắc muốn xoá loại mặt hàng "${item.TenLMH}" không?`;
  const waitDesciption = 'Đang xoá dữ liệu...';
  const deleteMessage = `"${item.TenLMH}" đã được xoá thành công`;

  const dialogRef = this.layoutUtilsService.deleteElement(title, description, waitDesciption, 'Xoá');

  dialogRef.afterClosed().subscribe(res => {
    if (!res) return;

    this.loaiMatHangService.delete(item.IdLMH).subscribe({
      next: () => {
        this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete,4000, true, false);
        this.loaiMatHangService.fetch(); // Tải lại danh sách
      },
      error: () => {
        this.layoutUtilsService.showError('Đã xảy ra lỗi khi xoá loại mặt hàng');
      }
    });
  });
}


   
    exportExcel() {
  // this.loaiMatHangService.exportExcel().subscribe({
  //   next: () => {
  //     this.layoutUtilsService.showActionNotification(
  //       'Xuất Excel thành công',
  //       MessageType.Create
  //     );
  //   },
  //   error: (err) => {
  //     console.error('Lỗi xuất Excel:', err);
  //     this.layoutUtilsService.showActionNotification(
  //       'Xuất Excel thất bại',
  //       MessageType.Error
  //     );
  //   }
  // });
}

    toggleFilter() {
      this.showFilter = !this.showFilter;
      if (this.showFilter) {
        // Nếu có bộ lọc riêng bạn xử lý tại đây
      }
    }
    ngOnDestroy(): void {
      this.subscriptions.forEach(sb => sb.unsubscribe());
    }
  }
