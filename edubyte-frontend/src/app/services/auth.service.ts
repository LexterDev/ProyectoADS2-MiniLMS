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
    return this.http.post(this.endpoints.auth.login, { email, password });
  }

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post(this.endpoints.auth.register, { email, password, name });
  }

  
}
