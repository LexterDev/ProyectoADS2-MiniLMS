import { Injectable } from '@angular/core';

// Import environment to access API URL
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor() { }

  // APi Endpoints
  API_ENDPOINTS = {
    authentication: {
      login: `${this.apiUrl}/auth/login`,
      register: `${this.apiUrl}/auth/register`
    }
  };
  
}
