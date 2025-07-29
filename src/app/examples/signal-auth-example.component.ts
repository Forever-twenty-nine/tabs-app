import { Component, computed, effect } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signal-auth-example',
  template: `
    <div>
      <!-- Usando signals de forma reactiva -->
      <p>Usuario actual: {{ currentUser()?.username || 'No autenticado' }}</p>
      <p>Está autenticado: {{ isAuthenticated() ? 'Sí' : 'No' }}</p>
      <p>Es gimnasio: {{ isGimnasio() ? 'Sí' : 'No' }}</p>
      <p>Estado inicializado: {{ isInitialized() ? 'Sí' : 'No' }}</p>
      
      <!-- Badge dinámico basado en el rol -->
      <div class="user-badge" [attr.data-role]="userRole()">
        {{ userRoleDisplay() }}
      </div>
    </div>
  `,
  styles: [`
    .user-badge {
      padding: 8px 16px;
      border-radius: 4px;
      color: white;
    }
    .user-badge[data-role="gimnasio"] { background-color: #3880ff; }
    .user-badge[data-role="cliente"] { background-color: #10dc60; }
    .user-badge[data-role="entrenador"] { background-color: #ffce00; color: black; }
  `],
  standalone: true
})
export class SignalAuthExampleComponent {
  // Signals del AuthService (ya son reactivos)
  currentUser = this.authService.currentUser$;
  isAuthenticated = this.authService.isAuthenticated$;
  isInitialized = this.authService.isInitialized$;
  isGimnasio = this.authService.isGimnasio$;
  isCliente = this.authService.isCliente$;
  isEntrenador = this.authService.isEntrenador$;

  // Computed signals derivados
  userRole = computed(() => this.currentUser()?.role || '');
  userRoleDisplay = computed(() => {
    const role = this.userRole();
    switch (role) {
      case 'gimnasio': return 'Administrador de Gimnasio';
      case 'cliente': return 'Cliente';
      case 'entrenador': return 'Entrenador';
      default: return 'Sin rol asignado';
    }
  });

  constructor(private authService: AuthService) {
    // Effect para reaccionar a cambios en la autenticación
    effect(() => {
      if (this.isAuthenticated()) {
        console.log('Usuario autenticado:', this.currentUser());
      } else {
        console.log('Usuario no autenticado');
      }
    });

    // Effect para manejar la inicialización
    effect(() => {
      if (this.isInitialized()) {
        console.log('AuthService inicializado correctamente');
      }
    });
  }
}
