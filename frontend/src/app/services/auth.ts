import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

interface TokenResp { access: string; refresh: string; }
interface JWTPayload {
  user_id?: string | number;
  role?: string;
  user_role?: string;
  role_name?: string;
  user?: { role?: string };
  [key: string]: any; // allow extra fields from backend
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private base = environment.apiUrl;

  private logged$ = new BehaviorSubject<boolean>(this.hasAccessToken());
  private role$ = new BehaviorSubject<string | null>(this.extractRole());

  constructor(private http: HttpClient) { }

  /** ----------------------
   *   TOKEN UTILITIES
   *  ---------------------- */
  private hasAccessToken(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private decodeToken(): JWTPayload | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      return jwtDecode<JWTPayload>(token);
    } catch (e) {
      console.error('Error decoding JWT:', e);
      return null;
    }
  }

  /** ----------------------
   *   AUTH STATE
   *  ---------------------- */
  isLoggedIn(): Observable<boolean> {
    return this.logged$.asObservable();
  }

  roleObservable(): Observable<string | null> {
    return this.role$.asObservable();
  }

  /** ----------------------
   *   AUTH ACTIONS
   *  ---------------------- */
  login(username: string, password: string) {
    return this.http.post<TokenResp>(`${this.base}/token/`, { username, password }).pipe(
      tap(res => this.setTokens(res))
    );
  }

  register(username: string, email: string, password: string, role: string) {
    return this.http.post(`${this.base}/auth/register/`, { username, email, password, role });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.logged$.next(false);
    this.role$.next(null);
  }

  refreshToken() {
    const refresh = this.getRefreshToken() || '';
    return this.http.post<TokenResp>(`${this.base}/token/refresh/`, { refresh });
  }

  private setTokens(res: TokenResp): void {
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('refresh_token', res.refresh);
    this.logged$.next(true);
    this.role$.next(this.extractRole());
  }

  /** ----------------------
   *   DATA FROM TOKEN
   *  ---------------------- */
  getUserId(): string | null {
    const payload = this.decodeToken();
    const id = payload?.user_id ?? null;
    console.log('Decoded user_id from JWT:', id);
    return id ? String(id) : null;
  }

  private extractRole(): string | null {
    const payload = this.decodeToken();
    const role =
      payload?.role ||
      payload?.user_role ||
      payload?.role_name ||
      payload?.user?.role ||
      null;

    console.log('Decoded role from JWT:', role);
    return role;
  }

  getRole(): string | null {
    return this.extractRole();
  }
}
