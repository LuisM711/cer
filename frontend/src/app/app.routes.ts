import { Routes } from '@angular/router';
import { AfiliacionComponent } from './components/afiliacion/afiliacion.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { ComerciosComponent } from './components/comercios/comercios.component';
import { RestaurantesComponent } from './components/restaurantes/restaurantes.component';



export const routes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'afiliacion', component: AfiliacionComponent },
    { path: 'main', component: MainComponent},
    { path: 'comercios', component: ComerciosComponent },
    { path: 'restaurantes', component: RestaurantesComponent },




    { path: '**', component: NotFoundComponent } 
];
