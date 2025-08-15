import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotFoundComponent } from './pages/notFound/notFound/notFound.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { HomeComponent } from './pages/home/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Celebra - Inicio' },
    { path: 'login', component: LoginComponent, title: 'Celebra - Inicia sesión' },
    {
        path: 'panel',
        component: AdminLayoutComponent,
        children: [
            { path: '', component: AdminComponent, title: 'Celebra - Panel de Administración' },
        ],
        title: 'Celebra - Panel de Administración'
    },
    { path: '**', component: NotFoundComponent, title: 'Celebra - No se encontró la página' }
];
