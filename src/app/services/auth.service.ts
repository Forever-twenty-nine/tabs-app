import { Injectable } from '@angular/core';

export interface User {
  username: string;
  email: string;
  role: 'gimnasio' | 'user' | 'cliente' | 'entrenador';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private currentUser: User | null = null;
  private readonly STORAGE_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  constructor() {
    // Verificar si hay una sesión guardada al inicializar
    this.isAuthenticated = !!localStorage.getItem(this.STORAGE_KEY);
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    // Simulación de autenticación con diferentes roles
    let user: User | null = null;
    
    if (email === 'gimnasio@ftn.com' && password === '123456') {
      user = { username: 'gimnasio', email: 'gimnasio@ftn.com', role: 'gimnasio' };
    } else if (email === 'cliente@ftn.com' && password === '123456') {
      user = { username: 'cliente', email: 'cliente@ftn.com', role: 'cliente' };
    } else if (email === 'entrenador@ftn.com' && password === '123456') {
      user = { username: 'entrenador', email: 'entrenador@ftn.com', role: 'entrenador' };
    }
    
    if (user) {
      this.isAuthenticated = true;
      this.currentUser = user;
      localStorage.setItem(this.STORAGE_KEY, 'authenticated');
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isGimnasio(): boolean {
    return this.currentUser?.role === 'gimnasio';
  }

  isUser(): boolean {
    return this.currentUser?.role === 'user';
  }

  isCliente(): boolean {
    return this.currentUser?.role === 'cliente';
  }

  isEntrenador(): boolean {
    return this.currentUser?.role === 'entrenador';
  }

  // Mantener compatibilidad con código existente
  isAdmin(): boolean {
    return this.isGimnasio();
  }

  /**
   * Registra un nuevo usuario
   */
  async register(userData: {
    username: string;
    email: string;
    password: string;
    nombre: string;
    role: 'cliente' | 'entrenador' | 'gimnasio';
  }): Promise<{ success: boolean; message: string }> {
    try {
      // Simular validaciones del lado del servidor
      
      // Verificar si el usuario ya existe (simulado)
      const existingUsers = ['gimnasio', 'usuario', 'manager', 'cliente', 'entrenador'];
      if (existingUsers.includes(userData.username)) {
        return {
          success: false,
          message: 'El nombre de usuario ya existe'
        };
      }

      // Verificar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          message: 'El formato del email no es válido'
        };
      }

      // Simular el registro exitoso con delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // En una aplicación real, aquí enviarías los datos al servidor
      console.log('Registrando usuario:', userData);

      return {
        success: true,
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al registrar usuario'
      };
    }
  }
}
