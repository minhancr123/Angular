import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// project import
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { AuthGuard } from './modules/auth/_services/auth.guard';

const routes: Routes = [
  {
    // path: '',
    // component: AdminComponent,
    // children: [
    //    {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full'
      // },
     {
      path: '',
      canActivate: [AuthGuard],
      loadChildren: () => import('./theme/pages-module').then(m => m.PagesModule)
    },
    {
      path : "error",
      loadChildren: () => import('./modules/errors/errors.module').then(m => m.ErrorsModule)
    },
     {
    path: '**',
    redirectTo: 'error', // hoặc path bạn muốn
    pathMatch: 'full'
  }

    // ]
  // },
  // {
  //   path: '',
  //   component: GuestComponent,
  //   children: [
  //     {
  //       path: 'login',
  //       loadComponent: () => import('./demo/pages/authentication/auth-signin/auth-signin.component').then((c) => c.AuthSigninComponent)
  //     },
  //     {
  //       path: 'register',
  //       loadComponent: () => import('./demo/pages/authentication/auth-signup/auth-signup.component').then((c) => c.AuthSignupComponent)
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
