import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginatorState } from 'src/app/_metronic/shared/crud-table';
import { MatHang } from 'src/app/management/Model/Inventory-management.model';
import { DVTService } from 'src/app/management/Services/DVT-management.service';
import { MatHangService } from 'src/app/management/Services/item-management.service';
import { LoaiMatHangService } from 'src/app/management/Services/itemtype-management.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
  import { PaginatorComponent } from "src/app/_metronic/shared/crud-table/components/paginator/paginator.component";
  import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemEdit } from '../item-edit/item-edit';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardHeader, MatCardModule } from '@angular/material/card';
import { ItemImport } from '../item-import/item-import';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-item-list',
  imports: [MatTableModule , ReactiveFormsModule,SharedModule, TranslateModule, PaginatorComponent ,MatIconModule , MatCheckboxModule , MatFormFieldModule , MatSelectModule , MatOptionModule ,MatCardHeader , MatCardModule, MatButtonModule , MatInputModule , CommonModule],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
  providers: [DVTService, MatHangService , LoaiMatHangService , LayoutUtilsService]
})
export class ItemList implements OnInit {
displayedColumns: string[] = ['select', 'stt', 'maHang', 'tenMatHang', 'hinhAnh', 'soKyMin', 'soKyMax', 'actions'];
isLoading : boolean;
searchForm: FormGroup;
paginator : PaginatorState;
showFilter: boolean = false;
loaiMatHangList: any[] = [];
dvtList: any[] = [];
private subscriptions: Subscription[] = [];

constructor(private fb: FormBuilder ,public mathangService : MatHangService,private router: Router,
      private route: ActivatedRoute ,  private LoaiMatHangService : LoaiMatHangService,private dvtService : DVTService,
      private layoutUtilsService: LayoutUtilsService,private dialog: MatDialog) 
     {    
       this.initSearchForm();
      this.setupSearchSubscriptions();
   }




  // Optionally, handle paginator state changes
  // onPageChange(paginator: PaginatorState) {
  //   this.paginate(paginator);
  // }
private initSearchForm() {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      donViTinh: [''],
      loaiMatHang: ['']
    });
  }
 
  private setupSearchSubscriptions() {
    // Theo dõi thay đổi của searchTerm
    const searchTerm$ = this.searchForm.get('searchTerm').valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      console.log("searchTerm thay đổi:", value);
      this.applySearch();
    });

    // Theo dõi thay đổi của đơn vị tính
    const dvt$ = this.searchForm.get('donViTinh').valueChanges.subscribe(value => {
      this.applySearch();
    });

    // Theo dõi thay đổi của loại mặt hàng
    const loai$ = this.searchForm.get('loaiMatHang').valueChanges.subscribe(value => {
      this.applySearch();
    });

    this.subscriptions.push(searchTerm$, dvt$, loai$);
  }
 importExcel(){
      this.dialog.open(ItemImport, {
        width: '600px',
      });
    }
    private applySearch() {
    const searchValue = this.searchForm.value;
    console.log("Search value : ",searchValue);
    const filter = {
      idDVT: searchValue.donViTinh,
      idLMH: searchValue.loaiMatHang
    };

    this.mathangService.patchState({ searchTerm: searchValue.searchTerm, filter: filter });
  }
  selectedItems: MatHang[] = [];

  get hasCheckedItem(): boolean {
    return this.selectedItems.length > 0;
  }
  paginate(paginator: PaginatorState) {
      this.mathangService.fetchStateSort({ paginator });
    
  }
  isSelected(row: MatHang): boolean {
    return this.selectedItems.includes(row);
  }
  matHangList: MatTableDataSource<MatHang> = new MatTableDataSource<MatHang>();

  ngOnInit(): void {
    this.isLoading = true;
    this.mathangService.fetch();
    this.mathangService.item$.subscribe(items => {
      this.matHangList.data = items;
    });
    this.paginator = this.mathangService.paginator;
    console.log('Paginator:', this.paginator);
    this.mathangService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
   
    this.loadDVTList();
    this.loadLoaiMatHang();
  }

  loadDVTList() {
    this.dvtService.getAll().subscribe((data) => {
      console.log(data);
      this.dvtList = data;
    });
  }

  loadLoaiMatHang() {
    this.LoaiMatHangService.getLoaiChaList().subscribe((data) => {
      this.loaiMatHangList = data;
    });
  }
  isAllSelected(): boolean {
    return this.selectedItems.length === this.matHangList.data.length;
  }

  toggleSelection(row: MatHang) {
    if (this.isSelected(row)) {
      this.selectedItems = this.selectedItems.filter(x => x !== row);
    } else {
      this.selectedItems.push(row);
    }
  }

  toggleAll(event: any) {
    if (event.checked) {
      this.selectedItems = [...this.matHangList.data];
    } else {
      this.selectedItems = [];
    }
  }

  create() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  edit(item: MatHang) {
  //   console.log('Editing item:', item);
  //   const dialogRef = this.dialog.open(ItemEdit, {
  //   width: '1000px',
  //   data: { item }
  // });
this.router.navigate(['edit', item.IdMH], { relativeTo: this.route });

  // dialogRef.afterClosed().subscribe(result => {
  //   if (result) {
  //     console.log('Edited item:', result);
  //     this.mathangService.updateMatHang(result).subscribe({
  //       next: () => {
  //         this.layoutUtilsService.showActionNotification(
  //           'Cập nhật thành công',
  //           MessageType.Update
  //         );
  //         this.mathangService.fetch();
  //       },
  //       error: (err) => {
  //         console.error('Lỗi cập nhật:', err);
  //         this.layoutUtilsService.showActionNotification(
  //           'Cập nhật thất bại',
  //           MessageType.Error
  //         );
  //       }
  //     });
  //   }
  // });
  }

  delete(row : MatHang) {
    console.log('Deleting item:', row);
     const selectedCount = this.selectedItems.length;
  const title = 'Xác nhận xoá';
  const description = `Bạn có chắc muốn xoá ${selectedCount} mặt hàng đã chọn không?`;
  const waitDesciption = 'Đang xoá dữ liệu...';
  const deleteMessage = `Đã xoá thành công ${selectedCount} mặt hàng`;

  const dialogRef = this.layoutUtilsService.deleteElement(
    title,
    description,
    waitDesciption,
    'Xoá'
  );
  dialogRef.afterClosed().subscribe(res => {
    if (!res) return;

    this.mathangService.delete(row.IdMH).subscribe({
      next: () => {
        this.layoutUtilsService.showActionNotification(deleteMessage, MessageType.Delete, 4000, true, false);
        this.mathangService.fetch(); // Tải lại danh sách
      },
      error: (err) => {
        console.error('Lỗi xoá:', err);
        this.layoutUtilsService.showError('Đã xảy ra lỗi khi xoá mặt hàng');
      }
    });
  })};
 getHeight() {
      return window.innerHeight - 250 + 'px';
    }
 deleteSelected() {
  const selectedCount = this.selectedItems.length;
  const title = 'Xác nhận xoá';
  const description = `Bạn có chắc muốn xoá ${selectedCount} mặt hàng đã chọn không?`;
  const waitDesciption = 'Đang xoá dữ liệu...';
  const deleteMessage = `Đã xoá thành công ${selectedCount} mặt hàng`;

  const dialogRef = this.layoutUtilsService.deleteElement(
    title,
    description,
    waitDesciption,
    'Xoá'
  );

  dialogRef.afterClosed().subscribe(res => {
    if (!res) return;

    const deleteRequests = this.selectedItems.map(item =>
      new Promise<void>((resolve, reject) => {
        this.mathangService.delete(item.IdMH).subscribe({
          next: () => {
            this.layoutUtilsService.showActionNotification(
              deleteMessage,
              MessageType.Delete,
              4000,
              true,
              false
            );
            resolve();
          },
          error: (err) => {
            console.error('Lỗi xoá:', err);
            this.layoutUtilsService.showError('Đã xảy ra lỗi khi xoá mặt hàng');
            reject(err);
          }
        });
      })
    );

    Promise.allSettled(deleteRequests).then(() => {
      this.mathangService.fetch(); // Tải lại danh sách
      this.selectedItems = []; // Xoá lựa chọn
    });
  });
}

viewDetail(item: MatHang) {
  // Navigate to detail page instead of opening dialog
  this.router.navigate(['detail', item.IdMH], { relativeTo: this.route });
}

exportExcel() {
  // Lấy dữ liệu đầy đủ từ matHangList
  const data = this.matHangList.data.map((item, index) => ({
    STT: index + 1,
    'Mã hàng': item.MaHang,
    'Tên mặt hàng': item.TenMatHang,
    'Loại mặt hàng': item.IdLMH,
    'Đơn vị tính': item.IdDVT,
    'Mô tả': item.MoTa,
    'Giá mua': item.GiaMua,
    'Giá bán': item.GiaBan,
    'VAT': item.Vat,
    'Barcode': item.Barcode,
    'Ngừng kinh doanh': item.NgungKinhDoanh ? 'Có' : 'Không',
    'Quy đổi DVT cấp 2': item.QuyDoiDVTCap2,
    'Quy đổi DVT cấp 3': item.QuyDoiDVTCap3,
    'Tên OnSite': item.TenOnSite,
    'Chi tiết mô tả': item.ChiTietMoTa,
    'Theo dõi tồn kho': item.TheoDoiTonKho ? 'Có' : 'Không',
    'Theo dõi lô': item.TheoDoiLo ? 'Có' : 'Không',
    'Tồn tối đa': item.UpperLimit,
    'Tồn tối thiểu': item.LowerLimit,
    'Là tài sản': item.IsTaiSan ? 'Có' : 'Không',
    'Số kỳ khấu hao tối thiểu': item.SoKyTinhKhauHaoToiThieu,
    'Số kỳ khấu hao tối đa': item.SoKyTinhKhauHaoToiDa,
    'Ngày tạo': item.CreatedDate ? new Date(item.CreatedDate).toLocaleDateString() : '',
    'Người tạo': item.CreatedBy,
    'Ngày sửa': item.ModifiedDate ? new Date(item.ModifiedDate).toLocaleDateString() : '',
    'Người sửa': item.ModifiedBy
  }));

  // Tạo worksheet từ JSON
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

  // Tạo workbook và gắn sheet
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'MatHang');

  // Xuất file Excel
  const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const fileName = `DanhSachMatHang_${new Date().getTime()}.xlsx`;

  const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, fileName);
}

}


