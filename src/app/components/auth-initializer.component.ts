import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonSpinner, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-initializer',
  template: `
    <ion-content class="auth-loading">
      <div class="loading-container">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p>Inicializando aplicación...</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .auth-loading {
      --background: var(--ion-color-light);
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      gap: 16px;
    }
    ion-spinner {
      transform: scale(1.5);
    }
    p {
      color: var(--ion-color-medium);
      font-size: 16px;
    }
  `],
  standalone: true,
  imports: [IonSpinner, IonContent]
})
export class AuthInitializerComponent {
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.handleInitialization();
  }

  private async handleInitialization() {
    // Esperar hasta que el auth esté inicializado
    const checkInitialization = () => {
      if (this.authService.isInitialized$()) {
        // Una vez inicializado, redirigir según el estado
        if (this.authService.isLoggedIn()) {
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
              this.router.navigate(['/login']);
          }
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        // Si no está inicializado, seguir esperando
        setTimeout(checkInitialization, 100);
      }
    };

    checkInitialization();
  }
}
