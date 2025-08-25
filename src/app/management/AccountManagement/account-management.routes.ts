import { Routes } from '@angular/router';
import { AccountManagementList } from './account-management-list/account-management-list';
export const accountManagementRoutes: Routes = [
  {
    path: '',
    component: AccountManagementList,
    children: [
    

    //   { path: 'info/:id', component: CustomerThongTinListComponent },
    //   { path: 'rating', component: CustomerRatingComponent }
    ]
  }
];
