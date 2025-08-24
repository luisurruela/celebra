import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isRegister = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onLogin() {
    this.errorMessage = '';
    try {
      await this.authService.login(this.email, this.password);
      // La redirección se maneja en el servicio.
    } catch (error) {
      this.handleError(error);
    }
  }

  async onRegister() {
    this.errorMessage = '';
    try {
      await this.authService.register(this.email, this.password);
      // La redirección se maneja en el servicio.
    } catch (error) {
      this.handleError(error);
    }
  }

  async loginWithGoogle() {
    this.errorMessage = '';
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      this.handleError(error);
    }
  }

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

  toggleForm() {
    this.isRegister = !this.isRegister;
    this.email = '';
    this.password = '';
    this.errorMessage = '';
  }
}
