import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { AuthService } from './auth.service';

export interface InstructorDTO {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}

export interface FileDTO {
  id: number;
  rutaAdjunto: string;
  tipoAdjunto: string;
}

export interface InscriptionDTO {
  id: number;
  progreso: number;
  estadoCodigo: string;
  estadoNombre: string;
  estudianteId: number;
  cursoId: number;
  fechaInscripcion: string;
  actualizadoEn: string;
  fechaInicioCurso?: string;
  fechaFinCurso?: string;
  completado: boolean;
}

export interface EnrolledCourse {
  id: number;
  titulo: string;
  descripcion: string;
  precio: number;
  estadoCodigo: string;
  estadoNombre: string;
  categoriaId: number;
  categoriaNombre: string;
  creadoEn: string;
  actualizadoEn: string;
  adjunto?: FileDTO;
  inscripcion?: InscriptionDTO;
  instructor?: InstructorDTO;
  promedioCalificacion?: number;
  totalResenas?: number;
}

export interface MyCoursesResponse {
  status: number;
  message: string;
  data: EnrolledCourse[];
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  /**
   * Obtener todos los cursos en los que el estudiante está inscrito
   */
  getMyCourses(): Observable<MyCoursesResponse> {
    return this.http.get<MyCoursesResponse>(
      API_ENDPOINTS.enroll.myCourses,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }
    );
  }

  /**
   * Inscribirse en un curso
   */
  enrollInCourse(courseId: number): Observable<any> {
    return this.http.post(
      API_ENDPOINTS.courses.enroll,
      { cursoId: courseId },
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }
    );
  }
}
