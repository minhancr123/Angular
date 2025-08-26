import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';
import { Error1Component } from './error1/error1.component';
import { Error2Component } from './error2/error2.component';
import { Error3Component } from './error3/error3.component';
import { Error4Component } from './error4/error4.component';
import { Error5Component } from './error5/error5.component';

const routes: Routes = [
  {
    path: '',
    component: ErrorsComponent,
    children: [
      {
        path: '404',
        component: Error1Component,
      },
      {
        path: '401',
        component: Error2Component,
      },
      {
        path: '403',
        component: Error3Component,
      },
      {
        path: '500',
        component: Error4Component,
      },
      {
        path: 'error-5',
        component: Error5Component,
      },
      { path: '', redirectTo: '404', pathMatch: 'full' },
      {
        path: '**',
        component: Error1Component,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorsRoutingModule {}
