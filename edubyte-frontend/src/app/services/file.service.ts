import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  // --- ¡IMPORTANTE! Reemplaza esto con tus datos de Cloudinary ---
  // 1. Ve a tu Dashboard de Cloudinary -> Settings -> "Cloud name"
  private CLOUDINARY_CLOUD_NAME = 'djqtf9mwo'; 
  
  // 2. Ve a Settings -> Upload -> "Upload presets"
  //    Crea uno (si no tienes) y ponlo en modo "Unsigned"
  private CLOUDINARY_UPLOAD_PRESET = 'ml_default'; 
  
  private CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`;

  constructor(private http: HttpClient) { }

  /**
   * Sube una imagen a Cloudinary y reporta el progreso.
   * @param file El archivo a subir (de un input type="file")
   * @returns Un Observable que emite eventos de progreso y la URL final.
   */
  uploadImage(file: File): Observable<{ progress: number, url?: string }> {
    
    // 1. Crear el FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);

    // 2. Crear la petición POST con 'reportProgress'
    const req = new HttpRequest('POST', this.CLOUDINARY_UPLOAD_URL, formData, {
      reportProgress: true // ¡Esto es clave para la barra de progreso!
    });

    // 3. Enviar la petición y transformar la respuesta
    return this.http.request(req).pipe(
      map(event => this.handleUploadEvent(event))
    );
  }

  /**
   * Helper para procesar los eventos de subida
   */
  private handleUploadEvent(event: HttpEvent<any>): { progress: number, url?: string } {
    switch (event.type) {
      
      // Evento de Progreso
      case HttpEventType.UploadProgress:
        if (event.total) {
          const progress = Math.round(100 * event.loaded / event.total);
          return { progress: progress };
        }
        return { progress: 0 }; // Si no hay 'total', asumimos 0

      // Evento de Respuesta Recibida (Éxito)
      case HttpEventType.Response:
        // Cloudinary devuelve la URL segura en 'secure_url'
        return { progress: 100, url: event.body.secure_url };

      // Otros eventos (Sent, etc.) no nos interesan por ahora
      default:
        return { progress: 0 };
    }
  }
}