import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="paginator-container">
      <button (click)="prevPage()" [disabled]="paginator.page === 1">Trước</button>
      <span>Trang {{ paginator.page }} / {{ totalPages }}</span>
      <button (click)="nextPage()" [disabled]="paginator.page >= totalPages">Sau</button>
    </div>
  `,
  styles: [`
    .paginator-container {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  `]
})
export class PaginatorComponent {
  @Input() paginator: { page: number, size: number, total: number };
  @Input() isLoading: boolean = false;
  @Output() paginate = new EventEmitter<{ page: number, size: number }>();

  get totalPages() {
    return Math.ceil(this.paginator.total / this.paginator.size);
  }

  prevPage() {
    if (this.paginator.page > 1) {
      this.paginate.emit({ page: this.paginator.page - 1, size: this.paginator.size });
    }
  }

  nextPage() {
    if (this.paginator.page < this.totalPages) {
      this.paginate.emit({ page: this.paginator.page + 1, size: this.paginator.size });
    }
  }
}
