import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { clienteGuard, entrenadorGuard, gimnasioGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () => import('./auth/welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'gimnasio-tabs',
    loadChildren: () => import('./gimnasio/gimnasio-tabs/gimnasio-tabs.routes').then((m) => m.routes),
    canActivate: [authGuard, gimnasioGuard]
  },
  {
    path: 'cliente-tabs',
    loadChildren: () => import('./cliente/cliente-tabs/cliente-tabs.routes').then((m) => m.routes),
    canActivate: [authGuard, clienteGuard]
  },
  {
    path: 'entrenador-tabs',
    loadChildren: () => import('./entrenador/entrenador-tabs/entrenador-tabs.routes').then((m) => m.routes),
    canActivate: [authGuard, entrenadorGuard]
  },
];
