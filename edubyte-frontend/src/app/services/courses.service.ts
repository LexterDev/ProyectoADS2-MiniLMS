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
    const token = this.authService.getToken();
    const headers: any = {};

    // Only add Authorization header if user is logged in
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.http.get(API_ENDPOINTS.courses.getById(id), {
      headers: headers
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

  createCourseBatch(courseData: any) {
    return this.http.post(API_ENDPOINTS.courses.createBatch, courseData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Update existing course
   */
  updateCourse(courseData: any) {
    return this.http.put(API_ENDPOINTS.courses.update, courseData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Delete course (soft delete)
   */
  deleteCourse(courseId: number) {
    return this.http.delete(API_ENDPOINTS.courses.delete(courseId), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Create a new section for a course
   */
  createSection(sectionData: any) {
    return this.http.post(API_ENDPOINTS.sections.create, sectionData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Update existing section
   */
  updateSection(sectionData: any) {
    return this.http.put(API_ENDPOINTS.sections.update, sectionData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Delete section
   */
  deleteSection(sectionId: number) {
    return this.http.delete(API_ENDPOINTS.sections.delete(sectionId), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Create a new lesson for a section
   */
  createLesson(lessonData: any) {
    return this.http.post(API_ENDPOINTS.lessons.create, lessonData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Update existing lesson
   */
  updateLesson(lessonData: any) {
    return this.http.put(API_ENDPOINTS.lessons.update, lessonData, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Delete lesson
   */
  deleteLesson(lessonId: number) {
    return this.http.delete(API_ENDPOINTS.lessons.delete(lessonId), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  constructor() { }
}
