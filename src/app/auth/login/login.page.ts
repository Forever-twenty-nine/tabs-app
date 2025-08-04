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
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

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
      const success = await this.authService.login(this.email, this.password);
      
      if (success) {
        const user = this.authService.getCurrentUser();

        // Redirigir según el rol del usuario
        switch (user?.role) {
          case 'gimnasio':
            this.router.navigate(['/gimnasio-tabs']);
            break;
          case 'cliente':
            this.router.navigate(['/cliente-tabs']);
            break;
          case 'entrenador':
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

  /**
   * Muestra alert de confirmación para Google y procesa login
   */
  async loginWithGoogle() {
    const alert = await this.alertController.create({
      header: 'Iniciar sesión con Google',
      message: '¿Deseas continuar con Google? Se creará una cuenta de cliente automáticamente.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: async () => {
            await this.processGoogleLogin();
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Procesa el login con Google (mock)
   */
  private async processGoogleLogin() {
    // Mostrar loading
    const loading = await this.alertController.create({
      header: 'Autenticando...',
      message: 'Conectando con Google',
      buttons: []
    });
    await loading.present();

    try {
      const result = await this.authService.loginWithGoogle();
      
      await loading.dismiss();
      
      if (result.success && result.user) {
        // Mostrar mensaje de éxito
        const successAlert = await this.alertController.create({
          header: '¡Bienvenido!',
          message: `Hola ${result.user.username}, has iniciado sesión exitosamente con Google.`,
          buttons: [{
            text: 'OK',
            handler: () => {
              // Redirigir como cliente
              this.router.navigate(['/cliente-tabs']);
            }
          }]
        });
        await successAlert.present();
      } else {
        // Mostrar error
        const errorAlert = await this.alertController.create({
          header: 'Error',
          message: result.message || 'Error al autenticar con Google',
          buttons: ['OK']
        });
        await errorAlert.present();
      }
    } catch (error) {
      await loading.dismiss();
      
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error inesperado',
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}
