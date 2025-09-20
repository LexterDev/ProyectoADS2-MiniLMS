import { Injectable } from '@angular/core';

// Importamos el environment para usar la URL base de la API
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl: string = environment.apiUrl;

  constructor() { }

  // APi Endpoints
  API_ENDPOINTS = {
    authentication: {
      login: `${this.apiUrl}/auth/login`,
      register: `${this.apiUrl}/auth/register`
    }
  };
}
