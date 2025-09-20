import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private apiService: ApiService, private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiService.API_ENDPOINTS.authentication.login, { "email": email, "password": password })
      .pipe(tap((response: any) => {
        if (response && response.token) {
          sessionStorage.setItem('userEduByteData', JSON.stringify(response));
        }
      }));
  }

  /*register(userData: { email: string, password: string, name: string }) {
    return this.http.post(this.apiService.API_ENDPOINTS.authentication.register, userData);
  }*/

  logout() {
    sessionStorage.removeItem('userEduByteData');
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('userEduByteData') !== null;
  }

  getToken(): string | null {
    const userData = sessionStorage.getItem('userEduByteData');
    return userData ? JSON.parse(userData).token : null;
  }

}
