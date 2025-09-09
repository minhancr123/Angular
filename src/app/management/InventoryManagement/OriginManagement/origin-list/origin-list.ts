import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, forkJoin } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { PaginatorComponent } from 'src/app/_metronic/shared/crud-table/components/paginator/paginator.component';
import { SortIconComponent } from 'src/app/_metronic/shared/crud-table/components/sort-icon/sort-icon.component';
import { GroupingState } from 'src/app/_metronic/shared/crud-table/grouping.model';
import { SortState } from 'src/app/_metronic/shared/crud-table/sort.model';
import { XuatXuModel } from 'src/app/management/Model/Inventory-management.model';
import { XuatXuService } from 'src/app/management/Services/origin-management.service';
import { OriginEditDialog } from '../origin-edit-dialog/origin-edit-dialog';
import { OriginCreateDialog } from '../origin-create-dialog/origin-create-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-origin-list',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    PaginatorComponent,
    MatCheckboxModule,
    MatMenuModule,
    MatCheckboxModule,
    SortIconComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './origin-list.html',
  styleUrl: './origin-list.scss',
  standalone: true
})
export class OriginList {
paginator: PaginatorState;
 xuatXuForm: FormGroup;
 isLoading : boolean;
 sorting : SortState;
 grouping : GroupingState;
  dataSource = new MatTableDataSource<XuatXuModel>();
 displayedColumns: string[] = ['select', 'stt', 'tenXuatXu', 'thaoTac'];
  isEdit = false;
  
  currentId = 0;
selection = new SelectionModel<XuatXuModel>(true, []);
  searchControl = new FormControl('');
  selectedItems: XuatXuModel[] = [];

  constructor(
    public xuatXuService: XuatXuService,
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private matdialog: MatDialog
  ) {
      this.xuatXuForm = this.fb.group({
        TenXuatXu: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.loadData();
    this.paginator = this.xuatXuService.paginator;
    this.sorting = this.xuatXuService.sorting;
    this.grouping = this.xuatXuService.grouping;
    this.xuatXuService.isLoading$.subscribe(res => this.isLoading = res);
    this.setupSearch();
    this.setupSubscriptions();
  }

  loadData(): void {
    this.xuatXuService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: () => {
        this.layoutUtilsService.showError('Lỗi khi tải dữ liệu');
      }
    });
  }
  private setupSearch() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.xuatXuService.patchState({ searchTerm: value || '' });
    });
  }
  sort(column : string) : void {
    const sorting = this.sorting;
    const isActivecolumn = sorting.column == column;
    if(!isActivecolumn){
      sorting.column = column;
      sorting.direction = 'asc';
    }
    else{
      sorting.direction = sorting.direction  === "asc" ? "desc" : "asc";
    }
    this.xuatXuService.patchState({ sorting });
  }
    private setupSubscriptions() {
    this.xuatXuService.items$.subscribe(items => {
      this.dataSource.data = items;
    });
    this.xuatXuService.isLoading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
  paginate(paginator: PaginatorState): void {
    this.xuatXuService.patchState({ paginator });
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(event: any) {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
      this.selectedItems = this.dataSource.data;
    } else {
      this.selection.clear();
      this.selectedItems = [];
    }
  }
isSelected(row: XuatXuModel): boolean {
  return this.selection.isSelected(row);
}

toggleSelection(row: XuatXuModel): void {
  this.selection.toggle(row);
  if (this.selection.isSelected(row)) {
    this.selectedItems.push(row);
  } else {
    const index = this.selectedItems.findIndex(item => item.IdXuatXu === row.IdXuatXu);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
    }
  }
}
 getHeight() {
      return window.innerHeight - 250 + 'px';
    }
  onSubmit(): void {
    // if (this.nhanHieuForm.valid) {
    //   const nhanHieu: NhanHieuModel = {
    //     IdNhanHieu: this.currentId,
    //     ...this.nhanHieuForm.value
    //   };

     this.matdialog.open(OriginCreateDialog, {
        width: '600px',
        disableClose: true
      }).afterClosed().subscribe(result => {
        if (result) {
          this.loadData();
        }
      })
        
  }

  onEdit(nhanHieu: XuatXuModel): void {
    // this.isEdit = true;
    // this.currentId = nhanHieu.IdNhanHieu;
    // this.nhanHieuForm.patchValue({
    //   TenNhanHieu: nhanHieu.TenNhanHieu
    // });
    this.matdialog.open(OriginEditDialog, {
      data: { item: nhanHieu },
      width: '600px',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    })
    
  }

  onDelete(id: number): void {
    const title = 'Xác nhận xoá';
    const description = 'Bạn có chắc chắn muốn xóa xuất xứ này?';
    const waitDesciption = 'Đang xoá dữ liệu...';

    const dialogRef = this.layoutUtilsService.deleteElement(
      title,
      description,
      waitDesciption,
      'Xoá'
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.xuatXuService.delete(id).subscribe({
          next: () => {
            this.layoutUtilsService.showActionNotification('Xóa thành công', MessageType.Delete);
            this.loadData();
          },
          error: () => {
            this.layoutUtilsService.showError('Lỗi khi xóa');
          }
        });
      }
    });
  }
  deleteSelected() {
  const title = 'Xác nhận xoá';
  const description = `Bạn có chắc muốn xoá ${this.selectedItems.length} xuất xứ đã chọn?`;
  const waitDesciption = 'Đang xoá dữ liệu...';

  const dialogRef = this.layoutUtilsService.deleteElement(
    title,
    description,
    waitDesciption
  );

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const deleteRequests = this.selectedItems.map(item =>
        this.xuatXuService.delete(item.IdXuatXu)
      );

      forkJoin(deleteRequests).subscribe(() => {
  this.layoutUtilsService.showActionNotification(
    'Xóa thành công',
    MessageType.Delete
  );
  this.selection.clear();
  this.selectedItems = [];
  this.xuatXuService.fetch();
});
    }
  });
}


  resetForm(): void {
    this.isEdit = false;
    this.currentId = 0;
    this.xuatXuForm.reset();
  }
}
