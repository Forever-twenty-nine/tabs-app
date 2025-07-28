import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    FormsModule
  ]
})
export class LoginPage {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({arrowBackOutline,personOutline,lockClosedOutline});
  }

  /**
   * Navega a la página de registro
   */
  goToRegister() {
    this.router.navigate(['/register']);
  }

  /**
   * Navega de vuelta a la página de bienvenida
   */
  goToWelcome() {
    this.router.navigate(['/welcome']);
  }

  async login() {
    this.errorMessage = '';
    
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, ingresa usuario y contraseña';
      return;
    }

    try {
      const success = await this.authService.login(this.username, this.password);
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
        this.errorMessage = 'Usuario o contraseña incorrectos';
      }
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión';
    }
  }
}
