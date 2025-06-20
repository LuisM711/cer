import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { loadingInterceptor } from './components/interceptor/loading.interceptor';
import { errorInterceptor } from './components/interceptor/error.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'es-MX' },
    provideNativeDateAdapter(),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};