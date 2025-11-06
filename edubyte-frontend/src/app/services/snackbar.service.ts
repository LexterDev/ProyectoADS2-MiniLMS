// src/app/services/snackbar.service.ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  // Inyectamos el MatSnackBar de Angular Material
  constructor(private snackBar: MatSnackBar) { }

  /**
   * Muestra una notificación de éxito (verde).
   * @param message El mensaje a mostrar.
   */
  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, // Duración en milisegundos
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar'] // ¡Nuestra clase de Tailwind!
    });
  }

  /**
   * Muestra una notificación de error (roja).
   * @param message El mensaje a mostrar.
   */
  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000, // Más tiempo para leer errores
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'] // ¡Nuestra clase de Tailwind!
    });
  }

  /**
   * Muestra una notificación genérica (info).
   */
  showInfo(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      // (Puedes crear una clase 'info-snackbar' si lo deseas)
    });
  }
}