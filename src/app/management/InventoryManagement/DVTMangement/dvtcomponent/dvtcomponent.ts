import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCell, MatHeaderCell, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';
import { DVTModel } from 'src/app/management/Model/DVT-management.model';
import { DVTService } from 'src/app/management/Services/DVT-management.service';
import { DVTEditDialog } from '../dvtedit-dialog/dvtedit-dialog';
import { DVTCreateDialog } from '../dvtcreate-dialog/dvtcreate-dialog';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { GroupingState, PaginatorState, SortState } from 'src/app/_metronic/shared/crud-table';
import { PaginatorComponent } from 'src/app/_metronic/shared/crud-table/components/paginator/paginator.component';


@Component({
  selector: 'app-dvt',
  templateUrl: './dvtcomponent.html',
  styleUrls: ['./dvtcomponent.scss'],
  imports: [FormsModule , ReactiveFormsModule,MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
  CommonModule,
  SharedModule,
  TranslateModule,
  PaginatorComponent,
  MatHeaderCell
  ]
})
export class DVTComponent implements OnInit {
  dvtList: DVTModel[] = [];
  dvtForm: FormGroup;
  sorting: SortState;
  grouping: GroupingState;
  paginator: PaginatorState;
  isLoading: boolean;
  searchControl = new FormControl('');
  dataSource = new MatTableDataSource<DVTModel>();
  isEdit = false;
  currentId: number = 0;
 displayedColumns: string[] = ['stt', 'tenDVT', 'thaoTac'];
  constructor(
    public dvtService: DVTService,
    private fb: FormBuilder,
   private layoutUtilsService: LayoutUtilsService,
   private dialog : MatDialog
    // private toastr: ToastrService
  ) {
    this.grouping = this.dvtService.grouping;
      this.sorting = this.dvtService.sorting;
      this.paginator = this.dvtService.paginator;

      this.dvtService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.dvtForm = this.fb.group({
      TenDVT: ['', Validators.required],
    });
  }
    paginate(paginator: PaginatorState) {
      this.dvtService.patchState({ paginator });
    }
  ngOnInit(): void {
    this.loadData();
    this.searchControl.valueChanges.pipe(
    debounceTime(150),
    distinctUntilChanged()
  ).subscribe(val => {
    this.dvtService.patchState({ searchTerm: val });
     this.dvtService.items$.subscribe(items => {
      this.dataSource.data = items;
    });
  });

  }

  loadData(): void {
    this.dvtService.getAll().subscribe({
      next: (data) => {
         this.dataSource.data = data;
      console.log('DVT List:', this.dataSource.data);
      },
      error: (error) => {
        this.layoutUtilsService.showError('Lỗi khi tải dữ liệu');
      }
    });
  }

  onSubmit(): void {
    const dialogRef = this.dialog.open(DVTCreateDialog ,{ width : "600px",});

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadData();
    }
  });
  }

  onEdit(dvt: DVTModel): void {
   const dialogRef = this.dialog.open(DVTEditDialog,  {
    width : "600px",
    data: dvt
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loadData();
    }
  });
  }

  onDelete(id: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa?')) {
      this.dvtService.delete(id).subscribe({
        next: () => {
          this.layoutUtilsService.showInfo('Xóa thành công');
          this.loadData();
        },
        error: () => {
          this.layoutUtilsService.showError('Lỗi khi xóa');
        }
      });
    }
  }

  resetForm(): void {
    this.isEdit = false;
    this.currentId = 0;
    this.dvtForm.reset();
  }
}
