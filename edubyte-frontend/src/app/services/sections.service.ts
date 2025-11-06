import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SectionsService {

  constructor(private http: HttpClient, private authService: AuthService) { }


  createSection(sectionData: any) {
    return this.http.post(API_ENDPOINTS.sections.create, sectionData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
