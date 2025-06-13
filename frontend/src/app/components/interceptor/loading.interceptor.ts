import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from './loading.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  let timeoutId: any;
  const delay = 300;//despues de 300ms es cuando se muestra el interceptor

  timeoutId = setTimeout(() => {
    loadingService.show();
  }, delay);

  return next(req).pipe(
    finalize(() => {
      clearTimeout(timeoutId);
      loadingService.hide();
    })
  );
};