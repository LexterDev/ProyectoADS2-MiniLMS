import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { Observable } from 'rxjs';

export interface UpdateTimeSpentRequest {
  leccionId: number;
  tiempoDedicadoSegundos: number;
}

export interface InscriptionProgressResponse {
  status: number;
  message: string;
  data: {
    id: number;
    inscripcionId: number;
    cursoId: number;
    leccionId: number;
    completado: boolean;
    fechaCompletado: string | null;
    notaEvaluacion: number | null;
    progresoCurso: number;
    tiempoDedicado: number;
    ultimaActualizacion: string | null;
  };
}

export interface TotalTimeResponse {
  status: number;
  message: string;
  data: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  updateTimeSpent(cursoId: number, data: UpdateTimeSpentRequest): Observable<InscriptionProgressResponse> {
    return this.http.post<InscriptionProgressResponse>(
      `${API_ENDPOINTS.enroll.base}/courses/${cursoId}/time-spent`,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }
    );
  }

  getTotalTimeSpent(cursoId: number): Observable<TotalTimeResponse> {
    return this.http.get<TotalTimeResponse>(
      `${API_ENDPOINTS.enroll.base}/courses/${cursoId}/total-time`,
      {
        headers: {
          Authorization: `Bearer ${this.authService.getToken()}`
        }
      }
    );
  }

  /**
   * Formatea segundos a formato legible (ej: "2h 30m", "45m", "30s")
   */
  formatTimeSpent(seconds: number): string {
    if (!seconds || seconds === 0) {
      return '0m';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const parts: string[] = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 && hours === 0) parts.push(`${secs}s`);

    return parts.join(' ') || '0m';
  }
}
