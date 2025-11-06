import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  createLesson(lessonData: any) {
    return this.http.post(API_ENDPOINTS.lessons.create, lessonData, {
      headers: {
        'Authorization': `Bearer ${this.authService.getToken()}`
      }
    });
  }  
}
