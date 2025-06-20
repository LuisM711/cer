// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { loadingInterceptor } from './components/interceptor/loading.interceptor';
import { errorInterceptor } from './components/interceptor/error.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

// Importa tu adapter y formatos
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LocalDateAdapter, MY_DATE_FORMATS } from './app-local-date-adapter';
import { dateInterceptorFn } from './components/interceptor/date.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([dateInterceptorFn, loadingInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'es-MX' },
    // Reemplaza el adapter nativo por el tuyo
    { provide: DateAdapter, useClass: LocalDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // Si tenías provideNativeDateAdapter(), ya no es necesario:
    // provideNativeDateAdapter(),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
