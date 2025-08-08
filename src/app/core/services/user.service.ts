import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  getMainRole(user?: User | null): string | null {
    const u = user ?? this.getCurrentUser();
    return u?.role ?? null;
  }
  private readonly _user = signal<User | null>(null);
  private readonly USER_KEY = 'current_user';

  constructor(private storageService: StorageService) {
    this.restoreUser();
  }

  async setUser(user: User | null): Promise<void> {
    this._user.set(user);
    if (user) {
      await this.storageService.set(this.USER_KEY, user);
    } else {
      await this.storageService.remove(this.USER_KEY);
    }
  }

  get user() {
    return this._user;
  }

  getCurrentUser(): User | null {
    return this._user();
  }

  getUserRole(): string | null {
    return this._user()?.role ?? null;
  }

  getUserEmail(): string | null {
    return this._user()?.email ?? null;
  }

  getUserId(): string | null {
    return this._user()?.uid ?? null;
  }

  async clearUser(): Promise<void> {
    this._user.set(null);
    await this.storageService.remove(this.USER_KEY);
  }

  async restoreUser(): Promise<void> {
    const user = await this.storageService.get(this.USER_KEY);
    if (user) {
      this._user.set(user);
    }
  }
}
