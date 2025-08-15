import { User } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // El guardián se suscribe al observable del usuario
    return this.authService.currentUser.pipe(
      take(1), // Tomamos solo el primer valor emitido para evitar bucles
      map((user: User | null) => {
        // Si el usuario existe, permite la activación de la ruta
        if (user) {
          return true;
        } else {
          // Si no hay usuario, redirige a la página de login
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}
