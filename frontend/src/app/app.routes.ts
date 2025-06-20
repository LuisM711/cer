import { Routes } from '@angular/router';
import { AfiliacionComponent } from './components/afiliacion/afiliacion.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ComerciosComponent } from './components/comercios/comercios.component';
import { RestaurantesComponent } from './components/restaurantes/restaurantes.component';
import { OperadoresComponent } from './components/operadores/operadores.component';
import { SubgirosComponent } from './components/subgiros/subgiros.component';
import { FechasImportantesComponent } from './components/fechas-importantes/fechas-importantes.component';

import { verificarGuard, verificarGuardAdmin } from './verificar.guard';

export const routes: Routes = [

    { path: '', redirectTo: '/main', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, title: 'Inicio de sesión' },
    { path: 'afiliacion', component: AfiliacionComponent, canActivate: [verificarGuard], title: 'Afiliación' },
    { path: 'main', component: MainComponent, canActivate: [verificarGuard], title: 'Consejo Empresarial Restaurantero' },
    { path: 'comercios', component: ComerciosComponent, canActivate: [verificarGuard], title: 'Comercios' },
    { path: 'restaurantes', component: RestaurantesComponent, canActivate: [verificarGuard], title: 'Restaurantes' },
    { path: 'operadores', component: OperadoresComponent, canActivate: [verificarGuardAdmin], title: 'Operadores' },
    { path: 'subgiros', component: SubgirosComponent, canActivate: [verificarGuardAdmin], title: 'Subgiros' },
    { path: 'fechas-importantes', component: FechasImportantesComponent, canActivate: [verificarGuard], title: 'Fechas Importantes' },
    // {path: 'afiliado', component: AfiliadoComponent, canActivate: [verificarGuardAfiliado], title: 'Afiliado' },


    { path: '**', component: NotFoundComponent }
];
