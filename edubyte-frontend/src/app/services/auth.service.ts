import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  readonly endpoints = API_ENDPOINTS;

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.endpoints.auth.login,
      {
        "correo": email,
        "clave": password
      }
    );
  }

  register(correo: string, clave: string, nombre: string, apellido: string): Observable<any> {
    return this.http.post(this.endpoints.auth.register,
      {
        "nombre": nombre,
        "apellido": apellido,
        "correo": correo,
        "clave": clave
      });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
  
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  
  getUserInfo(): any {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  getUserRole(): string | null {
    const userInfo = this.getUserInfo();
    return userInfo ? userInfo.rol : null;
  }

  forgotPassword(correo: string): Observable<any> {
    return this.http.post(this.endpoints.auth.forgotPassword, { correo });
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get(this.endpoints.auth.validateResetToken(token));
  }

  resetPassword(token: string, nuevaClave: string): Observable<any> {
    return this.http.post(this.endpoints.auth.resetPassword, {
      token,
      nuevaClave
    });
  }
}
