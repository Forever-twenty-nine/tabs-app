import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const gimnasioGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isGimnasio()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const clienteGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isCliente()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const entrenadorGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isEntrenador()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
