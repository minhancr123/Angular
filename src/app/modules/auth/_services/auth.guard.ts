import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (!this.authService.isAuthenticated()) {
        console.log("UnAuthenticated");
        this.authService.logout();
        this.router.navigate(['/error/401']);
        return resolve(false);
      }
      const user = this.authService.currentUserValue;

      // Nếu truy cập "/"
      if (state.url === '/') {
        if (user?.IsMasterAccount) {
          this.router.navigate(['/admin']); // Redirect đến admin
        } else {
          this.router.navigate(['/guest']); // Redirect đến guest
        }
        return resolve(false); // Không cho vào "/" nữa
      }

      return resolve(true);
    });
  }
}
