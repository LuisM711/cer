// src/app/interceptors/date.interceptor.fn.ts
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';

export const dateInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse && event.body != null) {
        return event.clone({ body: convertDates(event.body) });
      }
      return event;
    })
  );
};

// Función recursiva que detecta strings "YYYY-MM-DD" y los convierte en Date locales
function convertDates(body: any): any {
  if (body === null || body === undefined) {
    return body;
  }
  if (typeof body === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body)) {
    const [y, m, d] = body.split('-').map(s => parseInt(s, 10));
    return new Date(y, m - 1, d);
  }
  if (Array.isArray(body)) {
    return body.map(item => convertDates(item));
  }
  if (typeof body === 'object') {
    const out: any = {};
    for (const key of Object.keys(body)) {
      out[key] = convertDates(body[key]);
    }
    return out;
  }
  return body;
}
