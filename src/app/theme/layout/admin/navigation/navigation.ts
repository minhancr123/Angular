export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/admin/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'ui-element',
    title: 'UI ELEMENT',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/admin/basic/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/admin/basic/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/admin/basic/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/admin/basic/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/admin/basic/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/admin/basic/typography'
          }
        ]
      }
    ]
  },
  {
    id : 'managements',
    title : 'Management',
    type : 'group',
    icon : 'icon-group',
    children :[
      {
        id : 'CustomerManagement',
        title : 'Quản lý khách hàng',
        type : 'item',
        icon :'feather icon-user',
        url : '/admin/management/customers'
      },
       {
        id : 'AccountManagement',
        title : 'Quản lý tài khoản',
        type : 'item',
        icon :'feather icon-users',
        url : '/admin/management/accounts'
      },
      // {
      //   id : 'RoleManagement',
      //   title : 'Quản lý vai trò',
      //   type : 'item',
      //   icon :'feather icon-users',
      //   url : '/admin/management/roles'
      // }
    
    ]
  },

  //  {
  //   id : 'InventoryManagement',
  //   title : 'Inventory Management',
  //   type : 'group',
  //   icon : 'icon-group',
  //   children :[
  //     {
  //       id : 'ItemManagement',
  //       title : 'Quản lý hàng hóa',
  //       type : 'collapse',
  //       children :[
  //           {
  //       id : 'ItemTypeManagement',
  //       title : 'Danh sách loại mặt hàng',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/itemtype'
  //     },
  //      {
  //       id : 'ItemManagement',
  //       title : 'Danh sách mặt hàng',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/item'
  //     },
  //     {
  //       id : 'DVTManagement',
  //       title : 'Danh sách đơn vị tính',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/dvt'
  //     },
  //     {
  //       id : 'BrandManagement',
  //       title : 'Danh sách nhãn hiệu',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/brand'
  //     },
  //     {
  //       id : 'OriginManagement',
  //       title : 'Danh sách xuất xứ',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/origin'
  //     },
  //      {
  //       id : 'InsurancePartnerManagement',
  //       title : 'Danh mục đơn vị bảo hiểm ',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/InsurancePartner'
  //     },
  //     {
  //       id : 'AssetTypeManagement',
  //       title : 'Danh mục loại tài sản ',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/AssetType'
  //     },
  //      {
  //       id : 'GroupAssetManagement',
  //       title : 'Danh mục nhóm tài sản ',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/GroupAsset'
  //     },
  //     {
  //       id : 'AssetReasonManagement',
  //       title : 'Danh mục lý do tăng giảm tài sản ',
  //       type : 'item',
  //       icon :'feather icon-box',
  //       url : '/admin/management/inventory/AssetReason'
  //     }
  //       ]
  //     },
     
    
  //   ]
  // },
  {
    id: 'forms',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms-element',
        title: 'Form Elements',
        type: 'item',
        url: '/admin/forms',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'Tables',
        type: 'item',
        url: '/admin/tables',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  {
    id: 'chart-maps',
    title: 'Chart',
    type: 'group',
    icon: 'icon-charts',
    children: [
      {
        id: 'apexChart',
        title: 'ApexChart',
        type: 'item',
        url: 'apexchart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'auth',
        title: 'Authentication',
        type: 'collapse',
        icon: 'feather icon-lock',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/register',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/login',
            target: true,
            breadcrumbs: false
          }
        ]
      },
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'disabled-menu',
        title: 'Disabled Menu',
        type: 'item',
        url: 'javascript:',
        classes: 'nav-item disabled',
        icon: 'feather icon-power',
        external: true
      },
      {
        id: 'buy_now',
        title: 'Buy Now',
        type: 'item',
        icon: 'feather icon-book',
        classes: 'nav-item',
        url: 'https://codedthemes.com/item/datta-able-angular/',
        target: true,
        external: true
      }
    ]
  }
];
