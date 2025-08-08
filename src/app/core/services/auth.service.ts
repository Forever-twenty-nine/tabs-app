import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';
import { User } from '../models/user.model';
import { Rol } from '../enums/rol.enum';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private readonly STORAGE_KEY = 'auth_token';

  constructor(
    private storageService: StorageService,
    private auth: Auth,
    private userService: UserService,
    private router: Router,
    private firestore: Firestore
  ) {}

  async loginWithGoogle(): Promise<boolean> {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(this.auth, provider);
      const firebaseUser = cred.user;
      if (firebaseUser) {
        // 🔥 Consulta Firestore para obtener el usuario real
        const userDocRef = doc(this.firestore, `usuarios/${firebaseUser.uid}`);
        const userSnap = await getDoc(userDocRef);
        let newUser: User;
        if (userSnap.exists()) {
          newUser = userSnap.data() as User;
        } else {
          // Si no existe, crea usuario básico
          newUser = {
            uid: firebaseUser.uid,
            nombre: firebaseUser.displayName || firebaseUser.email || 'Google User',
            email: firebaseUser.email || '',
            role: undefined,
            onboarded: false
          };
        }
        // Inferir el rol si no está definido
        if (!newUser.role) {
          if (newUser.entrenadorId) {
            newUser.role = 'entrenador';
          } else if (newUser.gimnasioId) {
            newUser.role = 'gimnasio';
          } else if (newUser.roles && newUser.roles.length > 0) {
            newUser.role = newUser.roles[0];
          } else {
            newUser.role = 'cliente';
          }
        }
        const token = await firebaseUser.getIdToken();
        await this.userService.setUser(newUser);
        await this.storageService.set(this.STORAGE_KEY, token);
        this.isAuthenticated = true;
        this.redirectByRole();
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const firebaseUser = cred.user;
    if (firebaseUser) {
      // 🔥 Consulta Firestore para obtener el usuario real
      const userDocRef = doc(this.firestore, `usuarios/${firebaseUser.uid}`);
      const userSnap = await getDoc(userDocRef);
      let newUser: User;
      if (userSnap.exists()) {
        newUser = userSnap.data() as User;
      } else {
        newUser = {
          uid: firebaseUser.uid,
          nombre: firebaseUser.displayName || firebaseUser.email || 'Usuario',
          email: firebaseUser.email || '',
          role: undefined,
          onboarded: false
        };
      }
      // Inferir el rol si no está definido
      if (!newUser.role) {
        if (newUser.entrenadorId) {
          newUser.role = 'entrenador';
        } else if (newUser.gimnasioId) {
          newUser.role = 'gimnasio';
        } else if (newUser.roles && newUser.roles.length > 0) {
          newUser.role = newUser.roles[0];
        } else {
          newUser.role = 'cliente';
        }
      }
      const token = await firebaseUser.getIdToken();
      await this.userService.setUser(newUser);
      await this.storageService.set(this.STORAGE_KEY, token);
      this.isAuthenticated = true;
      this.redirectByRole();
    }
  }
  redirectByRole(): void {
    const user = this.userService.getCurrentUser();
    const role = user?.role;
    switch (role) {
      case 'gimnasio':
        this.router.navigate(['/gimnasio-tabs']);
        break;
      case 'entrenador':
        this.router.navigate(['/entrenador-tabs']);
        break;
      case 'cliente':
        this.router.navigate(['/cliente-tabs']);
        break;
      default:
        this.router.navigate(['/cliente-tabs']);
    }
  }

  async logout(): Promise<void> {
    this.isAuthenticated = false;
    await this.userService.clearUser();
    try {
      await this.storageService.remove(this.STORAGE_KEY);
    } catch (error) {
  // Error al eliminar el token del storage
    }
  }
}