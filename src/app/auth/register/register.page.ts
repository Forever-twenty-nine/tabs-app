import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
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
import { 
  lockClosedOutline, 
  mailOutline,
  checkmarkCircleOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.css'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
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
    ReactiveFormsModule
  ]
})
export class RegisterPage {
  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitDisabled: boolean = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    addIcons({ 
      lockClosedOutline, 
      mailOutline,
      checkmarkCircleOutline,
      arrowBackOutline
    });

    // Crear el formulario reactivo
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Suscribirse a cambios del formulario para actualizar el estado del botón
    this.registerForm.statusChanges.subscribe(() => {
      this.updateSubmitButtonState();
    });

    this.registerForm.valueChanges.subscribe(() => {
      this.updateSubmitButtonState();
    });

    // Inicializar el estado del botón
    this.updateSubmitButtonState();
  }

  /**
   * Actualiza el estado del botón de envío
   */
  private updateSubmitButtonState(): void {
    this.isSubmitDisabled = !this.registerForm.valid || !!this.successMessage;
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   */
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value && confirmPassword.value) {
      if (password.value !== confirmPassword.value) {
        return { passwordMismatch: true };
      }
    }
    
    return null;
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario
   */
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Verifica si un campo específico es válido y ha sido tocado o tiene contenido
   */
  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.valid && (field.touched || field.value));
  }

  /**
   * Verifica si un campo específico es inválido y ha sido tocado o tiene contenido
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || field.value));
  }

  /**
   * Valida el formulario de registro
   */
  validateForm(): boolean {
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      if (this.f['email'].errors) {
        if (this.f['email'].errors['required']) {
          this.errorMessage = 'El email es requerido';
        } else if (this.f['email'].errors['email']) {
          this.errorMessage = 'Por favor, ingresa un email válido';
        }
      } else if (this.f['password'].errors) {
        if (this.f['password'].errors['required']) {
          this.errorMessage = 'La contraseña es requerida';
        } else if (this.f['password'].errors['minlength']) {
          this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        }
      } else if (this.f['confirmPassword'].errors) {
        if (this.f['confirmPassword'].errors['required']) {
          this.errorMessage = 'La confirmación de contraseña es requerida';
        } else if (this.f['confirmPassword'].errors['passwordMismatch']) {
          this.errorMessage = 'Las contraseñas no coinciden';
        }
      }
      return false;
    }

    return true;
  }

  /**
   * Valida formato de email (ya no es necesario, Validators.email lo maneja)
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Genera un username automáticamente basado en el email
   */
  generateUsername(email: string): string {
    // Extraer la parte antes del @ y limpiarla
    const username = email.split('@')[0]
      .replace(/[^a-zA-Z0-9]/g, '') // Remover caracteres especiales
      .toLowerCase();
    
    // Agregar timestamp para evitar duplicados
    const timestamp = Date.now().toString().slice(-4);
    return `${username}${timestamp}`;
  }

  /**
   * Registra un nuevo usuario
   */
  async register() {
    // Marcar todos los campos como tocados para mostrar errores
    this.registerForm.markAllAsTouched();

    if (!this.validateForm()) {
      return;
    }

    try {
      this.errorMessage = '';
      this.successMessage = '';

      const formValues = this.registerForm.value;

      // Generar username automáticamente
      const generatedUsername = this.generateUsername(formValues.email);

      // Llamar al servicio de registro
      const result = await this.authService.register({
        username: generatedUsername,
        email: formValues.email,
        password: formValues.password
      });

      if (result.success) {
        this.successMessage = '¡Registro exitoso! Redirigiendo...';
        this.updateSubmitButtonState(); // Actualizar estado del botón
        
        // Redirigir al onboarding después del registro
        setTimeout(() => {
          this.router.navigate(['/onboarding']);
        }, 1500);
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
   * Navega directamente al onboarding (solo para testing)
   */
  goToOnboarding() {
    this.router.navigate(['/onboarding']);
  }
}
