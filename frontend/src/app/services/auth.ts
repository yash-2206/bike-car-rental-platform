import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

interface TokenResp { access: string; refresh: string; }

@Injectable({ providedIn: 'root' })
export class Auth {
  private base = environment.apiUrl;
  private logged$ = new BehaviorSubject<boolean>(this.hasAccessToken());
  private role$ = new BehaviorSubject<string | null>(this.extractRole());

  constructor(private http: HttpClient) { }

  private hasAccessToken() { return !!localStorage.getItem('access_token'); }
  isLoggedIn() { return this.logged$.asObservable(); }
  roleObservable() { return this.role$.asObservable(); }

  login(username: string, password: string) {
    return this.http.post<TokenResp>(`${this.base}/token/`, { username, password }).pipe(
      tap(res => this.setTokens(res))
    );
  }

  register(username: string, email: string, password: string, role: string) {
    return this.http.post(`${this.base}/auth/register/`, { username, email, password, role });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.logged$.next(false);
    this.role$.next(null);
  }

  getAccessToken() { return localStorage.getItem('access_token'); }
  getRefreshToken() { return localStorage.getItem('refresh_token'); }

  refreshToken() {
    const refresh = this.getRefreshToken();
    if (!refresh) return this.http.post<TokenResp>(`${this.base}/token/refresh/`, { refresh: '' });
    return this.http.post<TokenResp>(`${this.base}/token/refresh/`, { refresh });
  }

  private setTokens(res: TokenResp) {
    localStorage.setItem('access_token', res.access);
    localStorage.setItem('refresh_token', res.refresh);
    this.logged$.next(true);
    this.role$.next(this.extractRole());
  }

  private extractRole(): string | null {
    const token = this.getAccessToken(); if (!token) return null;
    try {
      const payload: any = jwtDecode(token);
      // adjust key if your payload stores role under different claim
      return payload.role || payload.user_role || payload.role_name || null;
    } catch { return null; }
  }
}
