import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Rol } from '../../core/enums/rol.enum';
import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    FormsModule
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ arrowBackOutline, personOutline, lockClosedOutline });
  }

  /**
   * Navega a la página de registro
   */
  goToRegister() {
    this.router.navigate(['/register']);
  }

  /**
   * Navega a la página de recuperación de contraseña
   */
  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  /**
   * Navega de vuelta a la página de bienvenida
   */
  goToWelcome() {
    this.router.navigate(['/welcome']);
  }

  async login() {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, ingresa email y contraseña';
      return;
    }
    try {
      await this.authService.login(this.email, this.password);
      const user = this.authService.getCurrentUser();
      if (user) {
        // Redirigir según el rol del usuario
        switch (user.role ?? user.roles?.[0]) {
          case Rol.GIMNASIO:
            this.router.navigate(['/gimnasio-tabs']);
            break;
          case Rol.CLIENTE:
            this.router.navigate(['/cliente-tabs']);
            break;
          case Rol.ENTRENADOR:
            this.router.navigate(['/entrenador-tabs']);
            break;
          default:
            this.router.navigate(['/cliente-tabs']);
        }
      } else {
        this.errorMessage = 'Email o contraseña incorrectos';
      }
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión';
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const success = await this.authService.loginWithGoogle();
      if (success) {
        this.router.navigate(['/cliente-tabs']);
      } else {
        this.errorMessage = 'Error al autenticar con Google';
      }
    } catch (error) {
      this.errorMessage = 'Ocurrió un error inesperado';
    }
  }
}
