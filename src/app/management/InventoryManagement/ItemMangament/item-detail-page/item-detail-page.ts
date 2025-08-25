import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatHang } from 'src/app/management/Model/Inventory-management.model';
import { MatHangService } from 'src/app/management/Services/item-management.service';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';

@Component({
  selector: 'app-item-detail-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './item-detail-page.html',
  styleUrl: './item-detail-page.scss',
  providers: [MatHangService]
})
export class ItemDetailPage implements OnInit {
  item: MatHang | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private matHangService: MatHangService,
    private layoutUtilsService: LayoutUtilsService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadItemDetail(id);
    }
  }

  loadItemDetail(id: string): void {
    this.loading = true;
    this.matHangService.getById(id).subscribe({
      next: (response) => {
        console.log('Item detail response:', response);
        this.item = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading item detail:', error);
        this.layoutUtilsService.showActionNotification('Không thể tải thông tin mặt hàng', MessageType.Error);
        this.loading = false;
        this.goBack();
      }
    });
  }

  goBack(): void {
    history.back();
  }

  editItem(): void {
    if (this.item) {
      this.router.navigate(['/management/inventory/item/edit', this.item.IdMH]);
    }
  }
}
