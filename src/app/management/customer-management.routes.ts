import { Routes } from '@angular/router';
import { CustomerManagementList } from './CustomerManagement/customer-management-list/customer-management-list';
import { CustomerManagementComponent } from './customer-management.component';
import { CustomerAppListComponent } from './CustomerManagement/customer-thong-tin-list/customer-thong-tin-list';
import { AccountManagementList } from './AccountManagement/account-management-list/account-management-list';
export const customerManagementRoutes: Routes = [
  {
    path: '',
    component: CustomerManagementComponent,
    children: [
      { path: '', component: CustomerManagementList },
      {
          path: 'info/:id',
          component: CustomerAppListComponent
        },
         {
          path: 'management/accounts',
          component: AccountManagementList
        }

    //   { path: 'info/:id', component: CustomerThongTinListComponent },
    //   { path: 'rating', component: CustomerRatingComponent }
    ]
  }
];
