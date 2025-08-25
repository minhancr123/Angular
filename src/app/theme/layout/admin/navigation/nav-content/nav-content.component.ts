// angular import
import { Component, inject, OnInit, output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { NavGroupComponent } from './nav-group/nav-group.component';
import { MenuConfigService } from 'src/app/_metronic/core/services/menu-config.service';
import { MenuServices } from 'src/app/_metronic/core/services/menu.service';

@Component({
  selector: 'app-nav-content',
  imports: [SharedModule, NavGroupComponent, CommonModule],
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss'],
  providers: [MenuConfigService, MenuServices]
})
export class NavContentComponent implements OnInit {
  private location = inject(Location);
  private menuService = inject(MenuServices);
  // public method
  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  navigations!: NavigationItem[];
  wrapperWidth: number;
  windowWidth = window.innerWidth;

  NavCollapsedMob = output();

  ngOnInit(): void {
    const {user} = JSON.parse(localStorage.getItem('6.2.0-auth-user') || '{}');
     let ApproveMenu : NavigationItem = null;
    if(user.IsMasterAccount){
       ApproveMenu = {
         id : 'managements',
    title : 'Management',
    type : 'group',
    icon : 'icon-group',
    children :[
      {
        id: "RoleApproveManagement",
        title: "Phân quyền người dùng",
        type: "item",
        icon: "feather icon-users",
        url: "management/roles"
      },]
        
      }
    }
    this.menuService.layMenuChucNang().subscribe((data) => {
      console.log("API result:", data);
    const newMenus: NavigationItem[] = data.data.map(parent => ({
    id: parent.Code,
    title: parent.Title,
    type: "group",
    icon: parent.Icon || 'icon-group',
    children: [
    {
      id: parent.Code + '_collapse',
      title: parent.Title,
      type: "collapse",
      children: parent.Child.map(child => ({
        id: child.Code,
        title: child.Title,
        icon: child.Icon || 'feather icon-box',
        type: "item",
        url: child.ALink || '#'
      }))
    }
  ]
}));

this.navigations = [...NavigationItems, ApproveMenu, ...newMenus];



  console.log(this.navigations);
});

  }

  // constructor
  constructor() {
  }

  fireOutClick() {
    let current_url = this.location.path();
    if (this.location['_baseHref']) {
      current_url = this.location['_baseHref'] + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent.parentElement.parentElement;
      const last_parent = up_parent.parentElement;
      if (parent.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }
}
