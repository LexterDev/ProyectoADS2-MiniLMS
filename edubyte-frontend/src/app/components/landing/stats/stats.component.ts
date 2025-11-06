import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. ✅ ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ BIEN
// (La ruta debe ser correcta desde 'landing/stats' hasta 'stat-card')
import { StatCardComponent } from '../../stat-card/stat-card.component';

// Interfaz
interface Stat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-stats',
  standalone: true, 
  imports: [
    CommonModule,
    StatCardComponent // <-- 2. ✅ Y ASEGÚRATE DE QUE ESTÉ AQUÍ
  ],
  templateUrl: './stats.component.html'
})
export class StatsComponent {

    // Tus datos
    stats: Stat[] = [
     { label: 'Cursos', value: '10,000+' },
     { label: 'Estudiantes', value: '500,000+' },
     { label: 'Instructores', value: '1,000+' }
   ];

}