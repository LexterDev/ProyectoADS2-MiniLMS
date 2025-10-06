import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

import { provideHttpClient } from '@angular/common/http';

// Importar e inicializar ionicons
import { addIcons } from 'ionicons';
import { 
  menu, 
  close, 
  arrowForward, 
  home, 
  person, 
  book, 
  documents, 
  newspaper, 
  mail 
} from 'ionicons/icons';

// Registrar los iconos que vas a usar
addIcons({ 
  menu, 
  close, 
  arrowForward, 
  home, 
  person, 
  book, 
  documents, 
  newspaper, 
  mail 
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes, withPreloading(PreloadAllModules)), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    provideHttpClient(),
  ],
});
