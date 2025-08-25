import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { showSearchFormModel } from './jee-search-form.model';
import { JeeSearchFormService } from './jee-search-form.service';
import { DanhMucChungService } from 'src/app/_core/services/danhmuc.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InlineSvgComponent } from 'src/app/_metronic/shared/crud-table/components/InlineSVG/inlineSVGComponent';

@Component({
  selector: 'app-jee-search-form',
  templateUrl: './jee-search-form.component.html',
  styleUrls: ['jee-search-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule , MatFormFieldModule ,TranslateModule ,ReactiveFormsModule , InlineSvgComponent  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JeeSearchFormComponent {
 private _errorMessage$ = new BehaviorSubject<string>('');
  private subscriptions: Subscription[] = [];
  searchGroup: FormGroup;
  filterGroup: FormGroup;
  @Input() showSearch?: showSearchFormModel = new showSearchFormModel();
  @Output() keywordEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterEvent: EventEmitter<any> = new EventEmitter<any>();
  isAdmin: boolean = false;
  daKhoa: boolean = false;
  showFilter: boolean = false;

  clickSelection: boolean = false;
  titlekeyword: string = '';

  get errorMessage$() {
    return this._errorMessage$.asObservable();
  }

  constructor(
    public service: JeeSearchFormService,
    public cd: ChangeDetectorRef,
    public generalService: DanhMucChungService,
    private fb: FormBuilder,
    public trans: TranslateService
  ) {}

  ngOnInit() {
    this.titlekeyword = this.trans.instant(this.showSearch.titlekeyword);
    this.searchForm();
    this.filterForm();
  }

  ngOnDestroy(): void {
    this.clearFilter();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      keyword: [''],
    });
    const searchEvent = this.searchGroup.controls['keyword'].valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((val) => {
        this.search(val);
      });
    this.subscriptions.push(searchEvent);
  }

  search(val) {
    this.keywordEvent.emit(val);
  }

  filterForm() {
    this.filterGroup = this.fb.group({
      keyword: [''],
      username: [''],
      tennhanvien: [''],
    });
  }

  clickSearch() {
    const filter = {};
    if (this.filterGroup.controls['keyword'].value) filter['keyword'] = this.filterGroup.controls['keyword'].value;
    if (this.filterGroup.controls['username'].value) filter['username'] = this.filterGroup.controls['username'].value;
    if (this.filterGroup.controls['tennhanvien'].value) filter['tennhanvien'] = this.filterGroup.controls['tennhanvien'].value;

    if (this.isAdmin) filter['isadmin'] = this.isAdmin;
    if (this.daKhoa) filter['dakhoa'] = this.daKhoa;

    this.filterEvent.emit(filter);
  }

  clickShowFilter(val: boolean) {
    this.showFilter = !val;
  }
  clearFilter() {
    this.searchGroup.reset();
    this.filterGroup.reset();
    this.daKhoa = false;
    this.showFilter = false;
    this.clickSearch();
  }

  clickOutSideFilter() {
    if (!this.clickSelection) this.showFilter = false;
    setTimeout(() => {
      this.clickSelection = false;
    }, 3000);
  }
  clickSelect() {
    this.clickSelection = true;
  }
}
