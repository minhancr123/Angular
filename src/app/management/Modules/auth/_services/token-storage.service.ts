// src/app/Modules/auth/_services/token-storage.service.ts

import { Injectable } from '@angular/core';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  signOut(): void {
    window.localStorage.clear();
  }

  saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
}
