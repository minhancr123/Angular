import { Component, OnInit } from '@angular/core';
import { AccountManagementService } from '../../Services/account-management.service';
import { CommonModule } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule , MatTableModule, MatSortModule , ReactiveFormsModule , MatIconModule , RouterModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
   displayedColumns: string[] = ['id_nv', 'hoTen', 'tenDangNhap', 'tacVu'];

    constructor(public accountService: AccountManagementService , private router : Router , private route : ActivatedRoute) {}
   ngOnInit(): void {
      this.accountService.fetch();
   }
   onEdit(userId: number){
      this.router.navigate(['edit', userId], { relativeTo: this.route });
   }
}
