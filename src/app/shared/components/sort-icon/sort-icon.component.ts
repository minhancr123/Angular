import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sort-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span (click)="toggleSort()" style="cursor: pointer;">
      <ng-container [ngSwitch]="activeDirection">
        <span *ngSwitchCase="'asc'">🔼</span>
        <span *ngSwitchCase="'desc'">🔽</span>
        <span *ngSwitchDefault>↕️</span>
      </ng-container>
    </span>
  `
})
export class SortIconComponent {
  @Input() column: string;
  @Input() activeColumn: string;
  @Input() activeDirection: 'asc' | 'desc' | '';
  @Output() sort = new EventEmitter<{ column: string, direction: 'asc' | 'desc' }>();

  toggleSort() {
    let direction: 'asc' | 'desc' = 'asc';

    if (this.activeColumn === this.column && this.activeDirection === 'asc') {
      direction = 'desc';
    }

    this.sort.emit({ column: this.column, direction });
  }
}
