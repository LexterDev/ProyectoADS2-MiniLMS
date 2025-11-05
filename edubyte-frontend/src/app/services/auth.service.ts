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
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

}
