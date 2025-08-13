import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Estado del formulario
  email = '';
  password = '';
  errorMessage = '';
  isRegister = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Maneja el inicio de sesión del usuario.
   */
  async onLogin() {
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      // La redirección se maneja en el servicio.
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Maneja el registro de un nuevo usuario.
   */
  async onRegister() {
    this.errorMessage = '';
    try {
      await this.authService.register(this.email, this.password);
      // La redirección se maneja en el servicio.
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Inicia sesión con Google. La lógica está en el servicio.
   */
  async loginWithGoogle() {
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
      // La redirección se maneja en el servicio.
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Muestra un mensaje de error basado en el código del error de Firebase.
   * @param error El objeto de error de Firebase.
   */
  handleError(error: any) {
    switch (error.code) {
      case 'auth/invalid-email':
        this.errorMessage = 'El correo electrónico no es válido.';
        break;
      case 'auth/user-not-found':
        this.errorMessage = 'No se encontró un usuario con este correo.';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'La contraseña es incorrecta.';
        break;
      case 'auth/email-already-in-use':
        this.errorMessage = 'El correo electrónico ya está en uso.';
        break;
      case 'auth/weak-password':
        this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        break;
      default:
        this.errorMessage = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
        break;
    }
    console.error("Firebase Auth Error:", error);
  }

  /**
   * Alterna entre el formulario de inicio de sesión y registro.
   */
  toggleForm() {
    this.isRegister = !this.isRegister;
    this.email = '';
    this.password = '';
    this.errorMessage = '';
  }
}
