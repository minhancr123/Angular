// angular import
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

// bootstrap import
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [SharedModule,RouterModule , CommonModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig ]
})
export class NavRightComponent {
  public user;
  // public props
  constructor() {
    const config = inject(NgbDropdownConfig);
    // constructor
    this.user = JSON.parse(localStorage.getItem('6.2.0-auth-user') || '{}');
    console.log('User from localStorage:', this.user);
    config.placement = 'bottom-right';
  }
}
