import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// Importaciones para Angular Material
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog'; // <-- 1. IMPORTAR MÓDULO DE DIÁLOGO

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideHttpClient(),

    // --- Proveedores de Material ---
    provideAnimationsAsync(), // Necesario para las animaciones
    importProvidersFrom(
      MatSnackBarModule,
      MatDialogModule // <-- 2. AÑADIR EL PROVIDER AQUÍ
    ) 
  ]
};