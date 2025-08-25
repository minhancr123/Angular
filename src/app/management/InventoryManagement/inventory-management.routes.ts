import { Routes } from '@angular/router';
import { ItemTypeList } from './ItemTypeManagement/item-type-list/item-type-list';
import { InventoryManagementComponent } from './inventory-management-component';
import { ItemList } from './ItemMangament/item-list/item-list';
import { AddItemType } from './ItemTypeManagement/add-itemtype/add-itemtype';
import { AddItem } from './ItemMangament/add-item/add-item';
import { DVTComponent } from './DVTMangement/dvtcomponent/dvtcomponent';
import { BrandList } from './BrandManagement/brand-list/brand-list';
import { OriginList } from './OriginManagement/origin-list/origin-list';
import { InsurancePartnerList } from './InsurancePartnerManagement/insurance-partner-list/insurance-partner-list';
import { AssetTypeList } from './AssetTypeManagement/asset-type-list/asset-type-list';
import { GroupAssetList } from './GroupAssetManagement/group-asset-list/group-asset-list';
import { AssetReasonList } from './AssetReasonManagement/asset-reason-list/asset-reason-list';
import { ItemEdit } from './ItemMangament/item-edit/item-edit';
import { ItemDetailPage } from './ItemMangament/item-detail-page/item-detail-page';
import { AuthRouteGuard } from 'src/app/modules/auth/_services/auth-route/auth.guard';
export const inventoryManagementRoutes: Routes = [
  {
    path: 'itemtype',
    component: InventoryManagementComponent,
    canActivate: [AuthRouteGuard],
    children: [
      { path: '', component: ItemTypeList },
      { path: 'add', component: AddItemType }
    ]
  },
  {
    path: 'item',
    component: InventoryManagementComponent,
    canActivateChild: [AuthRouteGuard],
    children: [
      { path: '', component: ItemList },
      { path: 'add', component: AddItem },
      { path: 'edit/:id', component: ItemEdit },
      { path: 'detail/:id', component: ItemDetailPage }
    ]
  },
  {
    path: 'dvt',
    component: InventoryManagementComponent,
    canActivate: [AuthRouteGuard],
    children: [
      { path: '', component: DVTComponent },
      // { path: 'add', component: AddItem }
    ]
  },
  {
    path: 'brand',
    component: InventoryManagementComponent,
    canActivate: [AuthRouteGuard],
    children: [
      { path: '', component: BrandList }
    ]
  },
  {
    path: 'origin',
    component: InventoryManagementComponent,
    canActivate: [AuthRouteGuard],
    children: [
      { path: '', component: OriginList }
    ]
  },
  {
    path: 'InsurancePartner',
    component: InventoryManagementComponent,
    canActivate: [AuthRouteGuard],
    children: [
      { path: '', component: InsurancePartnerList }
    ]
  },
  {
    path: 'AssetType',
    component: InventoryManagementComponent,
    canActivate: [AuthRouteGuard],
    children: [
      { path: '', component: AssetTypeList }
    ]
  },
  {
    path: 'GroupAsset',
    component: InventoryManagementComponent,
    canActivate: [AuthRouteGuard],
    children: [
      { path: '', component: GroupAssetList }
    ]
  },
  {
    path: 'AssetReason',
    component: InventoryManagementComponent,
    canActivate: [AuthRouteGuard],
    children: [
      { path: '', component: AssetReasonList }
    ]
  }
];

