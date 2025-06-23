import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AppService } from './app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const verificarGuard: CanActivateFn = (route, state) => {
    const appService = inject(AppService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);
    return appService.verifyToken().toPromise().then(
        (data) => {
            console.log(data);
            if (data.success) return true;
            snackBar.open('Debes iniciar sesión para ingresar a esta página.', 'Cerrar', {
                duration: 3000,
            });
            return router.navigate(['/login']);
        },
        (error: any) => {
            snackBar.open('Debes iniciar sesión para acceder a esta página.', 'Cerrar', {
                duration: 3000,
            });
            console.error("Error al verificar:", error);
            return router.navigate(['/login']);
        }
    );
};

export const verificarGuardAdmin: CanActivateFn = (route, state) => {
    const appService = inject(AppService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);
    return appService.verifyAdmin().toPromise().then(
        (data) => {
            if (data.success) return true;
            snackBar.open('No tienes privilegios para entrar a esta página.', 'Cerrar', {
                duration: 3000,
            });
            return router.navigate(['/login']);
        },
        (error: any) => {
            snackBar.open('Ha ocurrido un error al momento de tratar de ingresar a la página.', 'Cerrar', {
                duration: 3000,
            });
            console.error("Error al verificar:", error);
            return router.navigate(['/login']);
        }
    );
};

export const verificarGuardOperador: CanActivateFn = (route, state) => {
    const appService = inject(AppService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);
    return appService.verifyOperador().toPromise().then(
        (data) => {
            if (data.success) return true;
            snackBar.open('No tienes privilegios para entrar a esta página.', 'Cerrar', {
                duration: 3000,
            });
            return router.navigate(['/login']);
        },
        (error: any) => {
            snackBar.open('Ha ocurrido un error al momento de tratar de ingresar a la página.', 'Cerrar', {
                duration: 3000,
            });
            console.error("Error al verificar:", error);
            return router.navigate(['/login']);
        }
    );
};