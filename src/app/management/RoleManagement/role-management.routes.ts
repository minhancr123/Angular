import { Routes } from '@angular/router';
import { UserList } from './user-list/user-list';
import { UserRoleEdit } from './user-role-edit/user-role-edit';
export const roleManagementRoutes: Routes = [
  { path: '', component: UserList },
  { path: 'edit/:id', component: UserRoleEdit }
];