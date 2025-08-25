import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './layout/admin/admin.component';
import { GuestComponent } from './layout/guest/guest.component';

const routes: Routes = [
  // Admin routes
  {
    path: 'admin',
    component: AdminComponent,
    children: [
       {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      // { path: '', redirectTo: 'default', pathMatch: 'full' },
      // {
      //   path: 'default',
      //   loadComponent: () => import('../demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      // },
      {
        path: 'management/customers',
        loadChildren: () =>
          import('../management/customer-management.routes').then((m) => m.customerManagementRoutes)
      },
      {
        path: 'management/accounts',
        loadChildren: () =>
          import('../management/AccountManagement/account-management.routes').then((m) => m.accountManagementRoutes)
      },
      {
        path: 'management/roles',
        loadChildren: () =>
          import('../management/RoleManagement/role-management.routes').then((m) => m.roleManagementRoutes)
      },
       {
        path: 'management/inventory',
        loadChildren: () =>
          import('../management/InventoryManagement/inventory-management.routes').then((m) => m.inventoryManagementRoutes)
      },
      
      {
        path: 'dashboard',
        loadComponent: () => import('../demo/dashboard/dashboard.component').then((c) => c.DashboardComponent)
      },
      {
        path: 'basic',
        loadChildren: () => import('../demo/ui-elements/ui-basic/ui-basic.module').then((m) => m.UiBasicModule)
      },
      {
        path: 'forms',
        loadComponent: () => import('../demo/pages/form-element/form-element').then((c) => c.FormElement)
      },
      {
        path: 'tables',
        loadComponent: () => import('../demo/pages/tables/tbl-bootstrap/tbl-bootstrap.component').then((c) => c.TblBootstrapComponent)
      },
      {
        path: 'apexchart',
        loadComponent: () => import('../demo/pages/core-chart/apex-chart/apex-chart.component').then((c) => c.ApexChartComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('../demo/extra/sample-page/sample-page.component').then((c) => c.SamplePageComponent)
      }
    ]
  },

  // Guest routes
  {
    path: 'guest',
    component: GuestComponent,
    children: [
     {
        path: 'login',
        loadComponent: () => import('../demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('../demo/pages/authentication/auth-signup/auth-signup.component').then((c) => c.AuthSignupComponent)
      }
    ]
  },

  // Default redirect
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  // { path: '**', redirectTo: 'admin' } // fallback route
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
