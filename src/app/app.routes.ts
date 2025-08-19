import { Routes } from '@angular/router';

import { EventDetailsComponent } from './pages/admin/event-details/event-details.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NotFoundComponent } from './pages/notFound/notFound/notFound.component';
import { NewEventComponent } from './pages/admin/new-event/new-event.component';
import { EventsComponent } from './pages/admin/events/events.component';
import { HomeComponent } from './pages/home/home/home.component';
import { LoginComponent } from './pages/login/login.component';
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
            { path: 'nuevo-evento', component: NewEventComponent, title: 'Celebra - Nuevo Evento' },
            { path: 'editar-evento/:id', component: NewEventComponent, title: 'Celebra - Editar Evento' },
            { path: ':id', component: EventDetailsComponent, title: 'Celebra - Detalles delEvento' },
        ],
        title: 'Celebra - Panel de Administración',
    },
    { path: '**', component: NotFoundComponent, title: 'Celebra - No se encontró la página' }
];
