import { Routes } from '@angular/router';
import { AfiliacionComponent } from './components/afiliacion/afiliacion.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { ComerciosComponent } from './components/comercios/comercios.component';
import { RestaurantesComponent } from './components/restaurantes/restaurantes.component';

import { verificarGuard } from './verificar.guard';

export const routes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'afiliacion', component: AfiliacionComponent, canActivate: [verificarGuard] },
    { path: 'main', component: MainComponent, canActivate: [verificarGuard] },
    { path: 'comercios', component: ComerciosComponent, canActivate: [verificarGuard] },
    { path: 'restaurantes', component: RestaurantesComponent, canActivate: [verificarGuard] },




    { path: '**', component: NotFoundComponent }
];
