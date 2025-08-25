// logging.interceptor.ts
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('📤 HTTP Request:', req.method, req.url, req.body);
  const startTime = Date.now();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsedTime = Date.now() - startTime;
          console.log(
            '✅ HTTP Response:',
            event.status,
            event.statusText,
            `(${elapsedTime} ms)`,
            'Response body:',
            event.body
          );
        }
      },
      error: (error) => {
        const elapsedTime = Date.now() - startTime;
        console.error(
          '❌ HTTP Error:',
          error.status,
          error.statusText,
          `(${elapsedTime} ms)`,
          'Error message:',
          error.message
        );
      }
    })
  );
};
