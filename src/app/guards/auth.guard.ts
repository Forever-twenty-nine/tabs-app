import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = async (): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperar a que el AuthService esté inicializado
  return new Promise<boolean>((resolve) => {
    // Si ya está inicializado, verificar inmediatamente
    if (authService.isInitialized$()) {
      if (authService.isLoggedIn()) {
        resolve(true);
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
      return;
    }

    // Si no está inicializado, usar un polling simple
    const checkInitialization = () => {
      if (authService.isInitialized$()) {
        if (authService.isLoggedIn()) {
          resolve(true);
        } else {
          router.navigate(['/login']);
          resolve(false);
        }
      } else {
        // Verificar cada 50ms hasta que esté inicializado
        setTimeout(checkInitialization, 50);
      }
    };
    
    checkInitialization();
  });
};
