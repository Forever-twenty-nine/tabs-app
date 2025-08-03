import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonProgressBar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  peopleOutline,
  bookmarkOutline,
  checkmarkCircleOutline,
  arrowForwardOutline,
  fitnessOutline,
  rocketOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';
import { Objetivo } from '../../enums/objetivo.enum';

@Component({
  selector: 'app-onboarding',
  templateUrl: 'onboarding.page.html',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonText,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonProgressBar,
    FormsModule
  ]
})
export class OnboardingPage {
  currentStep: number = 1;
  totalSteps: number = 2;

  formData = {
    nombre: '',
    role: 'cliente' as 'cliente' | 'entrenador' | 'gimnasio',
    objetivo: '' as keyof typeof Objetivo | ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  // Enum para el template
  objetivos = Objetivo;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      personOutline,
      peopleOutline,
      bookmarkOutline,
      checkmarkCircleOutline,
      arrowForwardOutline,
      fitnessOutline,
      rocketOutline
    });

    // Para testing: simular usuario autenticado si no hay uno
    this.initializeForTesting();
  }

  /**
   * Inicializa el componente para testing
   */
  async initializeForTesting() {
    // Si no hay usuario autenticado, simular uno para testing
    if (!this.authService.currentUser$()) {
      await this.authService.simulateAuthenticatedUser();
    }
  }

  /**
   * Avanza al siguiente paso
   */
  nextStep() {
    if (this.currentStep === 1) {
      if (!this.validateStep1()) {
        return;
      }

      // Si no es cliente, completar onboarding directamente
      if (this.formData.role !== 'cliente') {
        this.totalSteps = 1;
        this.completeOnboarding();
        return;
      }

      this.totalSteps = 2;
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (!this.validateStep2()) {
        return;
      }
      this.completeOnboarding();
    }
  }

  /**
   * Valida el primer paso (nombre y rol)
   */
  validateStep1(): boolean {
    this.errorMessage = '';

    if (!this.formData.nombre.trim()) {
      this.errorMessage = 'Por favor, ingresa tu nombre completo';
      return false;
    }

    if (this.formData.nombre.trim().length < 2) {
      this.errorMessage = 'El nombre debe tener al menos 2 caracteres';
      return false;
    }

    if (!this.formData.role) {
      this.errorMessage = 'Por favor, selecciona tu tipo de usuario';
      return false;
    }

    return true;
  }

  /**
   * Valida el segundo paso (objetivo para clientes)
   */
  validateStep2(): boolean {
    this.errorMessage = '';

    if (this.formData.role === 'cliente' && !this.formData.objetivo) {
      this.errorMessage = 'Por favor, selecciona tu objetivo principal';
      return false;
    }

    return true;
  }

  /**
   * Completa el proceso de onboarding
   */
  async completeOnboarding() {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      // Actualizar perfil del usuario
      const updateData: any = {
        nombre: this.formData.nombre,
        role: this.formData.role
      };

      if (this.formData.role === 'cliente' && this.formData.objetivo) {
        updateData.objetivo = this.formData.objetivo;
      }

      const result = await this.authService.updateProfile(updateData);

      if (result.success) {
        // Redirigir según el rol
        this.redirectToRolePage();
      } else {
        this.errorMessage = result.message || 'Error al completar el perfil';
        this.isLoading = false;
      }

    } catch (error) {
      this.errorMessage = 'Error al completar el perfil. Intenta nuevamente.';
      this.isLoading = false;
    }
  }

  /**
   * Redirige según el rol del usuario
   */
  redirectToRolePage() {
    switch (this.formData.role) {
      case 'cliente':
        this.router.navigate(['/cliente-tabs']);
        break;
      case 'entrenador':
        this.router.navigate(['/entrenador-tabs']);
        break;
      case 'gimnasio':
        this.router.navigate(['/gimnasio-tabs']);
        break;
      default:
        this.router.navigate(['/welcome']);
    }
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

  /**
   * Obtiene el texto descriptivo del objetivo seleccionado
   */
  getObjetivoDescription(objetivo: string): string {
    switch (objetivo) {
      case 'BAJAR_PESO':
        return 'Te ayudaremos a alcanzar tu peso ideal de forma saludable';
      case 'AUMENTAR_MUSCULO':
        return 'Rutinas específicas para ganar masa muscular';
      case 'MANTENER_PESO':
        return 'Mantén tu peso actual con ejercicios de mantenimiento';
      default:
        return '';
    }
  }

  /**
   * Calcula el progreso del onboarding
   */
  getProgress(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
}
