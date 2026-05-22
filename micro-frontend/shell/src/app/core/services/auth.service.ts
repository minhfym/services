import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'gov_token';
  private userKey = 'gov_user';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
      })
    );
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.clearSession())
    );
  }

  getCurrentUser(): User | null {
    const s = localStorage.getItem(this.userKey);
    return s ? JSON.parse(s) : null;
  }

  getToken(): string | null { return localStorage.getItem(this.tokenKey); }
  isLoggedIn(): boolean { return !!this.getToken(); }
  isAdmin(): boolean { return this.getCurrentUser()?.role === 'admin'; }
  isOfficer(): boolean { const r = this.getCurrentUser()?.role; return r === 'officer' || r === 'admin'; }
  isCitizen(): boolean { return this.getCurrentUser()?.role === 'citizen'; }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
