import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, user, User, UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private user$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.user$ = user(this.auth);
  }

  /**
   * Inicia sesión con correo electrónico y contraseña.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns Un Promise que se resuelve al completar la operación.
   */
  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      // Redirige al panel después de un inicio de sesión exitoso.
      this.ngZone.run(() => {
        this.router.navigate(['/panel']);
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      // Puedes manejar el error aquí o dejar que el componente lo haga.
      throw error;
    }
  }

  /**
   * Crea un nuevo usuario con correo electrónico y contraseña.
   * @param email El correo electrónico del nuevo usuario.
   * @param password La contraseña del nuevo usuario.
   * @returns Un Promise que se resuelve al completar la operación.
   */
  async register(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      // Redirige al panel después de un registro exitoso.
      this.ngZone.run(() => {
        this.router.navigate(['/panel']);
      });
    } catch (error) {
      console.error("Error al registrarse:", error);
      throw error;
    }
  }
  
  /**
   * Inicia sesión con Google usando un popup.
   * @returns Un Promise que se resuelve al completar la operación.
   */
  async loginWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      this.ngZone.run(() => {
        this.router.navigate(['/panel']);
      });
      return result;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  }


  /**
   * Cierra la sesión del usuario actual.
   * @returns Un Promise que se resuelve al completar la operación.
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // Redirige a la página de login después de cerrar la sesión.
      this.ngZone.run(() => {
        this.router.navigate(['/login']);
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  }

  /**
   * Devuelve un Observable que emite el usuario autenticado.
   * @returns Un Observable de tipo User | null.
   */
  get currentUser(): Observable<User | null> {
    return this.user$;
  }
}
