import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { NhanHieuModel } from 'src/app/management/Model/Inventory-management.model';
import { NhanHieuService } from 'src/app/management/Services/brand-magement.service';
import { BrandEditDialog } from '../brand-edit-dialog/brand-edit-dialog';
import { BrandCreateDialog } from '../brand-create-dialog/brand-create-dialog';
import { SortIconComponent } from 'src/app/_metronic/shared/crud-table/components/sort-icon/sort-icon.component';
import { SortState } from 'src/app/_metronic/shared/crud-table/sort.model';
import { GroupingState } from 'src/app/_metronic/shared/crud-table/grouping.model';
@Component({
  selector: 'app-brand-list',
  imports: [   CommonModule,
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
    SortIconComponent
  ],
  templateUrl: './brand-list.html',
  styleUrl: './brand-list.scss',
  standalone: true
})
export class BrandList {
  paginator: PaginatorState;
 nhanHieuForm: FormGroup;
 isLoading : boolean;
 sorting : SortState;
 grouping : GroupingState;
  dataSource = new MatTableDataSource<NhanHieuModel>();
 displayedColumns: string[] = ['select', 'stt', 'tenNhanHieu', 'thaoTac'];
  isEdit = false;
  
  currentId = 0;
selection = new SelectionModel<NhanHieuModel>(true, []);
  searchControl = new FormControl('');
  selectedItems: NhanHieuModel[] = [];

  constructor(
    public nhanHieuService: NhanHieuService,
    private fb: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private matdialog: MatDialog
  ) {
    this.nhanHieuForm = this.fb.group({
      TenNhanHieu: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.loadData();
    this.paginator = this.nhanHieuService.paginator;
    this.sorting = this.nhanHieuService.sorting;
    this.grouping = this.nhanHieuService.grouping;
    this.nhanHieuService.isLoading$.subscribe(res => this.isLoading = res);
    this.setupSearch();
    this.setupSubscriptions();
  }

  loadData(): void {
    this.nhanHieuService.getAll().subscribe({
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
      this.nhanHieuService.patchState({ searchTerm: value || '' });
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
    this.nhanHieuService.patchState({ sorting });
  }
    private setupSubscriptions() {
    this.nhanHieuService.items$.subscribe(items => {
      this.dataSource.data = items;
    });
    this.nhanHieuService.isLoading$.subscribe(loading => {
      this.isLoading = loading;
    });
  }
  paginate(paginator: PaginatorState): void {
    this.nhanHieuService.patchState({ paginator });
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
isSelected(row: NhanHieuModel): boolean {
  return this.selection.isSelected(row);
}

toggleSelection(row: NhanHieuModel): void {
  this.selection.toggle(row);
  if (this.selection.isSelected(row)) {
    this.selectedItems.push(row);
  } else {
    const index = this.selectedItems.findIndex(item => item.IdNhanHieu === row.IdNhanHieu);
    if (index >= 0) {
      this.selectedItems.splice(index, 1);
    }
  }
}

  onSubmit(): void {
    // if (this.nhanHieuForm.valid) {
    //   const nhanHieu: NhanHieuModel = {
    //     IdNhanHieu: this.currentId,
    //     ...this.nhanHieuForm.value
    //   };

     this.matdialog.open(BrandCreateDialog, {
        width: '600px',
        disableClose: true
      }).afterClosed().subscribe(result => {
        if (result) {
          this.loadData();
        }
      })
        
  }

  onEdit(nhanHieu: NhanHieuModel): void {
    // this.isEdit = true;
    // this.currentId = nhanHieu.IdNhanHieu;
    // this.nhanHieuForm.patchValue({
    //   TenNhanHieu: nhanHieu.TenNhanHieu
    // });
    this.matdialog.open(BrandEditDialog, {
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
    const description = 'Bạn có chắc chắn muốn xóa nhãn hiệu này?';
    const waitDesciption = 'Đang xoá dữ liệu...';

    const dialogRef = this.layoutUtilsService.deleteElement(
      title,
      description,
      waitDesciption,
      'Xoá'
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.nhanHieuService.delete(id).subscribe({
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
    const description = `Bạn có chắc muốn xoá ${this.selectedItems.length} nhãn hiệu đã chọn?`;
    const waitDesciption = 'Đang xoá dữ liệu...';

    const dialogRef = this.layoutUtilsService.deleteElement(
      title,
      description,
      waitDesciption
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const deleteRequests = this.selectedItems.map(item =>
          this.nhanHieuService.delete(item.IdNhanHieu)
        );

        forkJoin(deleteRequests).subscribe(() => {
          this.layoutUtilsService.showActionNotification(
            'Xóa thành công',
            MessageType.Delete
          );
          this.selection.clear();
          this.selectedItems = [];
          this.nhanHieuService.fetch();
        });
      }
    });
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentId = 0;
    this.nhanHieuForm.reset();
  }
}
