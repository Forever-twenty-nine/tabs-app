import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

// Helper function para esperar la inicialización
const waitForAuthInitialization = async (
  authService: AuthService, 
  router: Router, 
  roleCheckFn: (authService: AuthService) => boolean
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    const checkAuth = () => {
      if (authService.isInitialized$()) {
        if (authService.isLoggedIn() && roleCheckFn(authService)) {
          resolve(true);
        } else {
          router.navigate(['/login']);
          resolve(false);
        }
      } else {
        setTimeout(checkAuth, 50);
      }
    };
    checkAuth();
  });
};

export const gimnasioGuard = async (): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForAuthInitialization(authService, router, (auth) => auth.isGimnasio());
};

export const clienteGuard = async (): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForAuthInitialization(authService, router, (auth) => auth.isCliente());
};

export const entrenadorGuard = async (): Promise<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return waitForAuthInitialization(authService, router, (auth) => auth.isEntrenador());
};
