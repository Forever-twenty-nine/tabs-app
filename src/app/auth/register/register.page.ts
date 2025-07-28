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
  IonIcon,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  lockClosedOutline, 
  mailOutline, 
  peopleOutline, 
  informationCircleOutline,
  checkmarkCircleOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
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
    IonSelect,
    IonSelectOption,
    FormsModule
  ]
})
export class RegisterPage {
  formData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    role: 'cliente' as 'cliente' | 'entrenador' | 'gimnasio'
  };
  
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ 
      personOutline, 
      lockClosedOutline, 
      mailOutline,
      peopleOutline,
      informationCircleOutline,
      checkmarkCircleOutline,
      arrowBackOutline
    });
  }

  /**
   * Valida el formulario de registro
   */
  validateForm(): boolean {
    this.errorMessage = '';

    if (!this.formData.username || !this.formData.email || !this.formData.password || 
        !this.formData.confirmPassword || !this.formData.nombre) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios';
      return false;
    }

    if (this.formData.username.length < 3) {
      this.errorMessage = 'El usuario debe tener al menos 3 caracteres';
      return false;
    }

    if (!this.isValidEmail(this.formData.email)) {
      this.errorMessage = 'Por favor, ingresa un email válido';
      return false;
    }

    if (this.formData.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return false;
    }

    return true;
  }

  /**
   * Valida formato de email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Registra un nuevo usuario
   */
  async register() {
    if (!this.validateForm()) {
      return;
    }

    try {
      this.errorMessage = '';
      this.successMessage = '';

      // Llamar al servicio de registro
      const result = await this.authService.register({
        username: this.formData.username,
        email: this.formData.email,
        password: this.formData.password,
        nombre: this.formData.nombre,
        role: this.formData.role
      });

      if (result.success) {
        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
        
        // Simular delay y redirigir
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.errorMessage = result.message;
      }

    } catch (error) {
      this.errorMessage = 'Error al registrar usuario. Intenta nuevamente.';
      this.successMessage = '';
    }
  }

  /**
   * Navega de vuelta al login
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Navega de vuelta a la página de bienvenida
   */
  goToWelcome() {
    this.router.navigate(['/welcome']);
  }

  /**
   * Obtiene el texto descriptivo del rol seleccionado
   */
  getRoleDescription(role: string): string {
    switch (role) {
      case 'cliente':
        return 'Acceso a entrenamientos y seguimiento de progreso';
      case 'entrenador':
        return 'Gestión de clientes y creación de rutinas';
      case 'gimnasio':
        return 'Administración completa del gimnasio';
      default:
        return '';
    }
  }
}
