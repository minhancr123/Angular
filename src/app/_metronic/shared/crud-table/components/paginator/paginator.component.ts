import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { PageSizes, PaginatorState } from '../../models/paginator.model';
import { NgPagination } from './ng-pagination/ng-pagination.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  imports : [NgPagination , FormsModule  , CommonModule, NgbPaginationModule],
  standalone: true
})
export class  PaginatorComponent implements OnInit {
  @Input() paginator: PaginatorState;
  @Input() isLoading;
  @Output() paginate: EventEmitter<PaginatorState> = new EventEmitter();
  pageSizes: number[] = PageSizes;
  sodonghientai: number = 1;
  sodongcuoitrang: number = 1;
  constructor(
    public translate: TranslateService,
    public translationService: TranslationService,

  ) {

  }

  ngOnInit(): void {
     this.paginator.pageSize = +this.paginator.pageSize;
  this.paginator.page = 1;
  this.paginate.emit(this.paginator);
  this.updateDisplayRange();
  }

  updateDisplayRange() {
  if (this.paginator.page > 1)
    this.sodonghientai = this.paginator.pageSize * (this.paginator.page - 1) + 1;
  else
    this.sodonghientai = 1;

  this.sodongcuoitrang = this.sodonghientai + this.paginator.pageSize - 1;
  
  if (this.sodongcuoitrang > this.paginator.total)
    this.sodongcuoitrang = this.paginator.total;
}

  pageChange(num: number) {
     this.paginator.page = num;
  this.paginate.emit(this.paginator);
  this.updateDisplayRange();
  }

  sizeChange() {
   this.paginator.pageSize = +this.paginator.pageSize;
  this.paginator.page = 1;
  this.paginate.emit(this.paginator);
  this.updateDisplayRange();
  }
}
