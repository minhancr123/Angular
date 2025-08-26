import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { AssetTypeService } from "src/app/management/Services/asset-management.service";
import { ReasonAssetService } from "src/app/management/Services/assetReason-management.service";
import { NhanHieuService } from "src/app/management/Services/brand-magement.service";
import { DVTService } from "src/app/management/Services/DVT-management.service";
import { GroupAssetService } from "src/app/management/Services/groupAsset-management.service";
import { InsurancePartnerService } from "src/app/management/Services/insurancePartner-management.service";
import { MatHangService } from "src/app/management/Services/item-management.service";
import { XuatXuService } from "src/app/management/Services/origin-management.service";

@Injectable({
  providedIn: 'root'
})
export class AuthRouteGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private itemService: MatHangService,
    private dvtService: DVTService,
    private brandService: NhanHieuService,
    private originService: XuatXuService,
    private insurancePartnerService: InsurancePartnerService,
    private assetTypeService: AssetTypeService,
    private groupAssetService: GroupAssetService,
    private assetReasonService: ReasonAssetService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.handleCheck(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.handleCheck(route);
  }

  private async handleCheck(route: ActivatedRouteSnapshot): Promise<boolean> {
    try {
      const lastSegment = route.url.length > 0 ? route.url[route.url.length - 1].path : '';
      
      // ✅ Thêm await ở đây
      const permissionResult = await this.checkUserPermission(lastSegment, route);
      const isAuthorize = localStorage.getItem("6.2.0-auth-user");
      if (!isAuthorize || !JSON.parse(isAuthorize)) {
        this.router.navigate(['/error/401']);
        console.log("Unauthorized access - redirecting to error page");
        return false; 
      }
      console.log("Route segment:", lastSegment, " => PermissionResult:", permissionResult);

      if (permissionResult.hasPermission === false)  {
        // ✅ Navigate đến trang lỗi phù hợp
        if (permissionResult.isVisibleIssue) {
          this.router.navigate(['/error/403']); // Unauthorized - không có quyền xem
        } 
        else {
          this.router.navigate(['/error/403']); // Forbidden - không có quyền thực hiện hành động
        }
        return false;
      }

      return permissionResult.hasPermission;
    } catch (error) {
      console.error("Error in route guard:", error);
      this.router.navigate(['/error/500']); // Server Error
      return false;
    }
  }

  private async checkUserPermission(segment: string, route: ActivatedRouteSnapshot): Promise<{hasPermission: boolean, isVisibleIssue: boolean}> {
    try {
      // Trường hợp item
      if (route.parent?.routeConfig?.path === 'item') {
        // ✅ Sử dụng fetchForGuard() thay vì fetch()
          await this.itemService.fetchForGuard();

        // Đối với list/view, cần HasPermission = true
        if (!this.itemService.HasPermission) {
  if (segment === 'add' || segment === 'edit') {
    if (!this.itemService.Visible) {
      return { hasPermission: false, isVisibleIssue: false };
    }
    return { hasPermission: this.itemService.Visible, isVisibleIssue: false };
  }
  return { hasPermission: this.itemService.HasPermission, isVisibleIssue: false };
}

        
      }

      // Trường hợp dvt
      if (segment === 'dvt') {
        // Bạn cần implement fetchForGuard cho DVTService tương tự
          await this.dvtService.fetchForGuard(); // Cần implement method này
 
        console.log("DVTService permission:", this.dvtService.HasPermission, "Visible:", this.dvtService.Visible);
        if (this.dvtService.HasPermission === false) {
          return { hasPermission: false, isVisibleIssue: true }; // 401 - Không có quyền xem
        }
        
        return { hasPermission: this.dvtService.HasPermission === true, isVisibleIssue: false };
      }

      
      // Trường hợp brand
      if (segment === 'brand') {
        // Bạn cần implement fetchForGuard cho BrandService tương tự
          await this.brandService.fetchForGuard(); // Cần implement method này

        console.log("BrandService permission:", this.brandService.HasPermission, "Visible:", this.brandService.Visible);
        if (this.brandService.HasPermission === false) {
          return { hasPermission: false, isVisibleIssue: true }; // 401 - Không có quyền xem
        }

        return { hasPermission: this.brandService.HasPermission === true, isVisibleIssue: false };
      }

      // Trường hợp origin
      if (segment === 'origin') {
        // Bạn cần implement fetchForGuard cho OriginService tương tự
          await this.originService.fetchForGuard(); // Cần implement method này

        console.log("OriginService permission:", this.originService.HasPermission, "Visible:", this.originService.Visible);
        if (this.originService.HasPermission === false) {
          return { hasPermission: false, isVisibleIssue: true }; // 401 - Không có quyền xem
        }

        return { hasPermission: this.originService.HasPermission === true, isVisibleIssue: false };
      }

       // Trường hợp InsurancePartner
      if (segment === 'InsurancePartner') {
        // Bạn cần implement fetchForGuard cho InsurancePartnerService tương tự
          await this.insurancePartnerService.fetchForGuard(); // Cần implement method này

        console.log("InsurancePartnerService permission:", this.insurancePartnerService.HasPermission, "Visible:", this.insurancePartnerService.Visible);
        if (this.insurancePartnerService.HasPermission === false) {
          return { hasPermission: false, isVisibleIssue: true }; // 401 - Không có quyền xem
        }

        return { hasPermission: this.insurancePartnerService.HasPermission === true, isVisibleIssue: false };
      }

       // Trường hợp AssetType
      if (segment === 'AssetType') {
        // Bạn cần implement fetchForGuard cho AssetTypeService tương tự
          await this.assetTypeService.fetchForGuard(); // Cần implement method này

        console.log("AssetTypeService permission:", this.assetTypeService.HasPermission, "Visible:", this.assetTypeService.Visible);
        if (this.assetTypeService.HasPermission === false) {
          return { hasPermission: false, isVisibleIssue: true }; // 401 - Không có quyền xem
        }

        return { hasPermission: this.assetTypeService.HasPermission === true, isVisibleIssue: false };
      }

       // Trường hợp GroupAsset
      if (segment === 'GroupAsset') {
        // Bạn cần implement fetchForGuard cho GroupAssetService tương tự
          await this.groupAssetService.fetchForGuard(); // Cần implement method này

        console.log("GroupAssetService permission:", this.groupAssetService.HasPermission, "Visible:", this.groupAssetService.Visible);
        if (this.groupAssetService.HasPermission === false) {
          return { hasPermission: false, isVisibleIssue: true }; // 401 - Không có quyền xem
        }

        return { hasPermission: this.groupAssetService.HasPermission === true, isVisibleIssue: false };
      }

      // Trường hợp AssetReason
      if (segment === 'AssetReason') {
        // Bạn cần implement fetchForGuard cho AssetReasonService tương tự
          await this.assetReasonService.fetchForGuard(); // Cần implement method này
        console.log("AssetReasonService permission:", this.assetReasonService.HasPermission, "Visible:", this.assetReasonService.Visible);
        if (this.assetReasonService.HasPermission === false) {
          return { hasPermission: false, isVisibleIssue: true }; // 401 - Không có quyền xem
        }

        return { hasPermission: this.assetReasonService.HasPermission === true, isVisibleIssue: false };
      }

      // Profile cho phép tất cả
      if (segment === 'profile') {
        return { hasPermission: true, isVisibleIssue: false };
      }

      return { hasPermission: true, isVisibleIssue: false };
    } catch (error) {
      console.error("Error checking user permission:", error);
      return { hasPermission: false, isVisibleIssue: false }; // ✅ Trả về false khi có lỗi
    }
  }
}