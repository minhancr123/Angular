// angular import
import { Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterModule } from '@angular/router';

// project import
import { NavigationItem } from '../../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-item',
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  private location = inject(Location);

  // public props
  item = input<NavigationItem>();

  // constructor

  // public method
 closeOtherMenu(event: MouseEvent) {
  const ele = event.target as HTMLElement;
  const parent = ele.closest('.pcoded-hasmenu') as HTMLElement;

  if (parent) {
    parent.classList.add('active');
    parent.classList.add('pcoded-trigger');
  }

  // Đóng menu mobile nếu có
  const nav = document.querySelector('app-navigation.pcoded-navbar');
  if (nav?.classList.contains('mob-open')) {
    nav.classList.remove('mob-open');
  }
}

}
