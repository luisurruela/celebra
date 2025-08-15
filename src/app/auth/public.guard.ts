import { User } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // El guardián se suscribe al observable del usuario
    return this.authService.currentUser.pipe(
      take(1), // Tomamos solo el primer valor emitido
      map((user: User | null) => {
        // Si el usuario existe, lo redirige al panel
        if (user) {
          return this.router.createUrlTree(['/panel']);
        } else {
          // Si no hay usuario, permite el acceso a la ruta
          return true;
        }
      })
    );
  }
}
