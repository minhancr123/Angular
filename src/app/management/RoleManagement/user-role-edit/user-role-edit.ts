import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AccountManagementService } from '../../Services/account-management.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LayoutUtilsService, MessageType } from 'src/app/_core/utils/layout-utils.service';

@Component({
  selector: 'app-user-role-edit',
  standalone: true, // nếu là standalone component
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSortModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-role-edit.html',
  styleUrls: ['./user-role-edit.scss'] // <- sửa thành styleUrls (có s)
})
export class UserRoleEdit implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'checked', 'viewOnly'];
  userId!: string;
  userName: string = '';
  dataSource = new MatTableDataSource<any>(); // <-- dùng MatTableDataSource

  @ViewChild(MatSort) sort!: MatSort; // gán sort

  constructor(
    private accountService: AccountManagementService,
    private route: ActivatedRoute,
    private Utils : LayoutUtilsService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    this.accountService.GetUserById(Number(this.userId)).subscribe(user => {
      console.log(user);
      this.userName = user.data[0].Fullname;
      const roles = user.data.map((role: any) => (
        {
        id: role.Id_Permit,
        name: role.Description,
        checked: role.Visible || false,
        viewOnly: role.Edit || false
      }));
      this.dataSource.data = roles; // gán data
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort; // gán sort
    });
  }

  onClose() {
    history.back();
  }

  onSave() {
    console.log(this.dataSource.data);
    const updatedRoles = this.dataSource.data.map(role => ({
      Id_Permit: role.id,
      Description: role.name,
      Edit: role.checked ? 1 : 0,
      viewOnly: role.viewOnly ? 0 : 1
    }));
    this.accountService.UpdateUserRoles(this.userId, updatedRoles).subscribe(response => {
      console.log(response);
      // xử lý lưu dữ liệu
      if(response.status){
        this.Utils.showActionNotification('Cập nhật quyền thành công' , MessageType.Create, 4000 , true);
      }
      else{
        this.Utils.showError('Cập nhật quyền thất bại');
      }
    });
  }
 
}
