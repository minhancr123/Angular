import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const auth = authService.getAuthFromLocalStorage();

  console.log('[Auth Interceptor] Auth:', auth); // 👈 kiểm tra auth object
  console.log('[Auth Interceptor] Token:', auth?.token); // 👈 kiểm tra token

  if (auth && auth.token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${auth.token}`)
    });
    return next(cloned);
  }

  console.warn('[Auth Interceptor] Không có token, gửi request gốc.');
  return next(req);
};
