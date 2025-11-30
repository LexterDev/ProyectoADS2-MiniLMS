import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalCategories: number;
  activeEnrollments: number;
  totalInstructors: number;
  totalStudents: number;
}

export interface Estado {
  codigo: string;
  descripcion: string;
}

export interface Rol {
  codigo: string;
  descripcion: string;
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: Rol;
  estado: Estado;
  creadoEn: string;
  actualizadoEn: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);

  getAdminStats(): Observable<any> {
    return this.http.get(API_ENDPOINTS.admin.stats);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(API_ENDPOINTS.admin.users);
  }

  createUser(userData: any): Observable<any> {
    return this.http.post(API_ENDPOINTS.admin.createUser, userData);
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.patch(API_ENDPOINTS.admin.toggleUserStatus(userId), {});
  }
}
