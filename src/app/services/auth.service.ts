import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, LoginResponse, AuthUser } from '../models/auth.model';
import { environment } from '../../environments/environment';
import { CommonResponse } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl || 'http://freeelib.runasp.net/api';
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check for existing token on service initialization
    const token = this.getStoredToken();
    if (token) {
      this.tokenSubject.next(token);
      // You might want to validate the token here
    }
  }

  login(credentials: LoginRequest): Observable<CommonResponse<LoginResponse>> {
    return this.http.post<CommonResponse<LoginResponse>>(`${this.baseUrl}/User/Login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.data.jwtToken);
          this.currentUserSubject.next(response.data.jwtToken);
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return this.tokenSubject.value || this.getStoredToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  getCurrentUser(): string | null {
    return this.currentUserSubject.value;
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.tokenSubject.next(token);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }
}
