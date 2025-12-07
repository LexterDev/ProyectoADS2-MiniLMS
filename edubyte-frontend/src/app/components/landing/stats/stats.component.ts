import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaz
interface Stat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [
    CommonModule
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