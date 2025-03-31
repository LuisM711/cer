import { Routes } from '@angular/router';
import { AfiliacionComponent } from './components/afiliacion/afiliacion.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './components/not-found/not-found.component';




export const routes: Routes = [

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'afiliacion', component: AfiliacionComponent },
    { path: 'main', component: MainComponent},



    { path: '**', component: NotFoundComponent } 
];
