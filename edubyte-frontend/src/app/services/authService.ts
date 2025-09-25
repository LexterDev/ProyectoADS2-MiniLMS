import { Injectable } from '@angular/core';
import { ApiService } from './apiService';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private apiService: ApiService, private http: HttpClient) { }


  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiService.API_ENDPOINTS.authentication.login, { "email": email, "password": password })
      .pipe(tap((response: any) => {
        if (response && response.token) {
          sessionStorage.setItem('userEduByteData', JSON.stringify(response));
        }
      }));
  }
  
}
