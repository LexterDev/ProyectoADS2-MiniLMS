import { inject, Injectable,  } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../config/api-endpoints.config';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAllCourses(page: number, size: number) {
    return this.http.get(API_ENDPOINTS.courses.getAll(page, size), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getCourseById(id: string) {
    return this.http.get(API_ENDPOINTS.courses.getById(id), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  createCourse(courseData: any) {
    return this.http.post(API_ENDPOINTS.courses.create, courseData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getCoursesByInstructorId(instructorId: number) {
    return this.http.get(API_ENDPOINTS.courses.getByInstructorId(instructorId), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getCoursesByStudentId(studentId: number) {
    return this.http.get(API_ENDPOINTS.courses.getCoursesByStudentId, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  enrollInCourse(courseId: number) {
    return this.http.post(API_ENDPOINTS.courses.enroll, {
      "cursoId": courseId
    }, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  constructor() { }



}
