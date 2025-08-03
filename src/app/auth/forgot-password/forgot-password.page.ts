import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: 'forgot-password.page.html',
  styleUrls: ['forgot-password.page.css'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    FormsModule
  ]
})
export class ForgotPasswordPage {
  email: string = '';
  emailError: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ arrowBackOutline, mailOutline });
  }

  /**
   * Navega de vuelta a la página de login
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Valida el formato del email
   */
  validateEmail() {
    this.emailError = '';
    this.successMessage = '';
    
    if (this.email && !this.isValidEmail(this.email)) {
      this.emailError = 'Por favor, ingresa un email válido';
    }
  }

  /**
   * Verifica si el email tiene un formato válido
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Verifica si el email es válido y no está vacío
   */
  isEmailValid(): boolean {
    return this.email.length > 0 && this.isValidEmail(this.email) && !this.emailError;
  }

  /**
   * Verifica si el email es inválido
   */
  isEmailInvalid(): boolean {
    return this.email.length > 0 && (!this.isValidEmail(this.email) || !!this.emailError);
  }

  /**
   * Envía el enlace de recuperación de contraseña
   */
  async resetPassword() {
    if (!this.isEmailValid()) {
      this.emailError = 'Por favor, ingresa un email válido';
      return;
    }

    this.isLoading = true;
    this.emailError = '';
    this.successMessage = '';

    try {
      const result = await this.authService.resetPassword(this.email);
      
      if (result.success) {
        this.successMessage = result.message;
        // Opcional: redirigir a login después de unos segundos
        setTimeout(() => {
          this.goToLogin();
        }, 3000);
      } else {
        this.emailError = result.message;
      }
    } catch (error) {
      console.error('Error al enviar enlace de recuperación:', error);
      this.emailError = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}
