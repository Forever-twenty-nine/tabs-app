import { Injectable, signal, computed, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Auth,GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { Rol } from '../enums/rol.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  // Elimina la propiedad de clase para evitar el warning de AngularFire

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
  /** Computed signals para roles usando role o roles[0] */
  private getUserRole(user: User | null): Rol | undefined {
    return user?.role ?? user?.roles?.[0];
  }
  public readonly isGimnasio$ = computed(() => this.getUserRole(this.currentUser$()) === Rol.GIMNASIO);
  public readonly isCliente$ = computed(() => this.getUserRole(this.currentUser$()) === Rol.CLIENTE);
  public readonly isEntrenador$ = computed(() => this.getUserRole(this.currentUser$()) === Rol.ENTRENADOR);
  public readonly isAdmin$ = computed(() => this.isGimnasio$());

  constructor(private storageService: StorageService) {}

  /** Login con Google y actualiza el estado con el modelo User */
  async loginWithGoogle(): Promise<boolean> {
    try {
      const auth = inject(Auth);
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const firebaseUser = cred.user;
      if (firebaseUser) {
        const newUser: User = {
          uid: firebaseUser.uid,
          nombre: firebaseUser.displayName || firebaseUser.email || 'Google User',
          email: firebaseUser.email || '',
          username: firebaseUser.displayName || firebaseUser.email || 'google_user',
          role: Rol.CLIENTE,
          roles: [Rol.CLIENTE]
        };
        const token = await firebaseUser.getIdToken();
        await this.saveUserSession(newUser, token);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  /** Login con email y contraseña y actualiza el estado con el modelo User */
  async login(email: string, password: string): Promise<void> {
    const auth = inject(Auth);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = cred.user;
    if (firebaseUser) {
      const newUser: User = {
        uid: firebaseUser.uid,
        nombre: firebaseUser.displayName || firebaseUser.email || 'Usuario',
        email: firebaseUser.email || '',
        username: firebaseUser.displayName || firebaseUser.email || 'user',
        role: Rol.CLIENTE,
        roles: [Rol.CLIENTE]
      };
      const token = await firebaseUser.getIdToken();
      await this.saveUserSession(newUser, token);
    }
  }

  /** Guarda el usuario y token en storage y actualiza signals */
  private async saveUserSession(user: User, token: string): Promise<void> {
    this.isAuthenticated = true;
    this.currentUser = user;
    this._isAuthenticatedSignal.set(true);
    this._currentUserSignal.set(user);
    await this.storageService.set(this.STORAGE_KEY, token);
    await this.storageService.set(this.USER_KEY, user);
  }

  /** Logout del usuario */
  async logout(): Promise<void> {
    this.isAuthenticated = false;
    this.currentUser = null;
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
    return this.getUserRole(this.currentUser) === Rol.GIMNASIO;
  }

  isCliente(): boolean {
    return this.getUserRole(this.currentUser) === Rol.CLIENTE;
  }

  isEntrenador(): boolean {
    return this.getUserRole(this.currentUser) === Rol.ENTRENADOR;
  }

  // Mantener compatibilidad con código existente
  isAdmin(): boolean {
    return this.isGimnasio();
  }

}
