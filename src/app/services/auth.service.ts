import { Injectable, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';

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

  // Signals para estado reactivo
  private _currentUserSignal = signal<User | null>(null);
  private _isAuthenticatedSignal = signal<boolean>(false);
  private _isInitializedSignal = signal<boolean>(false);

  // Signals públicos (readonly)
  public readonly currentUser$ = this._currentUserSignal.asReadonly();
  public readonly isAuthenticated$ = this._isAuthenticatedSignal.asReadonly();
  public readonly isInitialized$ = this._isInitializedSignal.asReadonly();

  // Computed signals para roles
  public readonly isGimnasio$ = computed(() => this.currentUser$()?.role === 'gimnasio');
  public readonly isCliente$ = computed(() => this.currentUser$()?.role === 'cliente');
  public readonly isEntrenador$ = computed(() => this.currentUser$()?.role === 'entrenador');
  public readonly isAdmin$ = computed(() => this.isGimnasio$());

  constructor(private storageService: StorageService) {
    this.initializeFromStorage();
    
    // Timeout de seguridad: si no se inicializa en 5 segundos, marcar como inicializado
    setTimeout(() => {
      if (!this._isInitializedSignal()) {
        console.warn('AuthService initialization timeout, marking as initialized with default values');
        this._isInitializedSignal.set(true);
      }
    }, 5000);
  }

  private async initializeFromStorage(): Promise<void> {
    try {
      // Verificar si hay una sesión guardada al inicializar
      const authToken = await this.storageService.get(this.STORAGE_KEY);
      this.isAuthenticated = !!authToken;
      this._isAuthenticatedSignal.set(!!authToken);
      
      const savedUser = await this.storageService.get(this.USER_KEY);
      if (savedUser) {
        this.currentUser = savedUser;
        this._currentUserSignal.set(savedUser);
      }
    } catch (error) {
      console.error('Error initializing auth from storage:', error);
      // En caso de error, usar valores por defecto
      this.isAuthenticated = false;
      this.currentUser = null;
      this._isAuthenticatedSignal.set(false);
      this._currentUserSignal.set(null);
    } finally {
      this._isInitializedSignal.set(true);
    }
  }

  /**
   * Método público para forzar la inicialización desde storage
   * Útil cuando se necesita asegurar que el estado esté sincronizado
   */
  async refreshFromStorage(): Promise<void> {
    await this.initializeFromStorage();
  }

  async login(email: string, password: string): Promise<boolean> {
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
      
      // Actualizar signals
      this._isAuthenticatedSignal.set(true);
      this._currentUserSignal.set(user);
      
      try {
        await this.storageService.set(this.STORAGE_KEY, 'authenticated');
        await this.storageService.set(this.USER_KEY, user);
      } catch (error) {
        console.error('Error saving to storage:', error);
        // En caso de error, revertir el estado
        this.isAuthenticated = false;
        this.currentUser = null;
        this._isAuthenticatedSignal.set(false);
        this._currentUserSignal.set(null);
        return false;
      }
      
      return true;
    }
    
    return false;
  }

  async logout(): Promise<void> {
    this.isAuthenticated = false;
    this.currentUser = null;
    
    // Actualizar signals
    this._isAuthenticatedSignal.set(false);
    this._currentUserSignal.set(null);
    
    try {
      await this.storageService.remove(this.STORAGE_KEY);
      await this.storageService.remove(this.USER_KEY);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
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
    nombre?: string;
    role?: 'cliente' | 'entrenador' | 'gimnasio';
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

      // Simular autenticación automática después del registro
      const newUser: User = {
        username: userData.username,
        email: userData.email,
        role: userData.role || 'cliente' // valor por defecto
      };

      // Marcar como autenticado y guardar usuario
      this.isAuthenticated = true;
      this.currentUser = newUser;
      this._isAuthenticatedSignal.set(true);
      this._currentUserSignal.set(newUser);

      // Guardar en storage
      await this.storageService.set(this.STORAGE_KEY, 'mock_token_' + Date.now());
      await this.storageService.set(this.USER_KEY, newUser);

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

  /**
   * Actualiza el perfil del usuario actual
   */
  async updateProfile(profileData: any): Promise<{ success: boolean; message: string }> {
    try {
      // Validaciones básicas
      if (profileData.nombre && profileData.nombre.trim().length < 2) {
        return {
          success: false,
          message: 'El nombre debe tener al menos 2 caracteres'
        };
      }

      // Simular actualización con delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // En una aplicación real, aquí enviarías los datos al servidor
      console.log('Actualizando perfil:', profileData);

      // Actualizar usuario actual si existe
      if (this.currentUser) {
        const updatedUser = {
          ...this.currentUser,
          ...profileData
        };
        
        this.currentUser = updatedUser;
        this._currentUserSignal.set(updatedUser);
        
        // Guardar en storage
        await this.storageService.set(this.USER_KEY, updatedUser);
      }

      return {
        success: true,
        message: 'Perfil actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar el perfil'
      };
    }
  }

  /**
   * Método para testing: simula un usuario autenticado
   */
  async simulateAuthenticatedUser(): Promise<void> {
    const mockUser: User = {
      username: 'test_user_' + Date.now(),
      email: 'test@example.com',
      role: 'cliente'
    };

    this.isAuthenticated = true;
    this.currentUser = mockUser;
    this._isAuthenticatedSignal.set(true);
    this._currentUserSignal.set(mockUser);

    // Guardar en storage
    await this.storageService.set(this.STORAGE_KEY, 'mock_token_' + Date.now());
    await this.storageService.set(this.USER_KEY, mockUser);
  }
}
