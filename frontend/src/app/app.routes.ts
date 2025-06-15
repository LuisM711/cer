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
    { path: 'login', component: LoginComponent, title: 'Inicio de sesión' },
    { path: 'afiliacion', component: AfiliacionComponent, canActivate: [verificarGuard], title: 'Afiliación' },
    { path: 'main', component: MainComponent, canActivate: [verificarGuard], title: 'Consejo Empresarial Restaurantero' },
    { path: 'comercios', component: ComerciosComponent, canActivate: [verificarGuard], title: 'Comercios' },
    { path: 'restaurantes', component: RestaurantesComponent, canActivate: [verificarGuard], title: 'Restaurantes' },




    { path: '**', component: NotFoundComponent }
];
