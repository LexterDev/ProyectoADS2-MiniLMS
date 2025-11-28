import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { AuthService } from './auth.service';

export interface Category {
  id?: number;
  nombre: string;
  descripcion: string;
  icono?: string;
  color?: string;
  activa?: number;
  cursosCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getAllCategories(): Observable<any> {
    return this.http.get(API_ENDPOINTS.categories.getAll, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  getActiveCategories(): Observable<any> {
    return this.http.get(API_ENDPOINTS.categories.getActive);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.categories.getById(id), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  createCategory(category: Category): Observable<any> {
    return this.http.post(API_ENDPOINTS.categories.create, category, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.put(API_ENDPOINTS.categories.update(id), category, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(API_ENDPOINTS.categories.delete(id), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  toggleStatus(id: number): Observable<any> {
    return this.http.patch(API_ENDPOINTS.categories.toggleStatus(id), {}, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
