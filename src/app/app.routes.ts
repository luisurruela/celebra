import { getAuth, provideAuth } from '@angular/fire/auth';
// Importa los módulos de Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotFoundComponent } from './pages/notFound/notFound/notFound.component';
import { NewEventComponent } from './pages/admin/new-event/new-event.component';
import { EventsComponent } from './pages/admin/events/events.component';
import { HomeComponent } from './pages/home/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { environment } from '../environment/environment';
import { PublicGuard } from './auth/public.guard';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'Celebra - Inicio' },
    { 
        path: 'login',
        component: LoginComponent,
        title: 'Celebra - Inicia sesión',
        canActivate: [PublicGuard],
    },
    {
        path: 'panel',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard], // Usa AuthGuard para las rutas protegidas
        children: [
            { path: '', component: EventsComponent, title: 'Celebra - Panel de Administración' },
            { path: 'nuevo-evento', component: NewEventComponent, title: 'Celebra - Panel de Administración' },
        ],
        title: 'Celebra - Panel de Administración',
    },
    { path: '**', component: NotFoundComponent, title: 'Celebra - No se encontró la página' }
];
