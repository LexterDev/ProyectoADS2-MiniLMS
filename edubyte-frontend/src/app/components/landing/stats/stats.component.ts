import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface Stat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-stats',
  imports: [
    CommonModule,
    MatCardModule
  ],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent {

   stats: Stat[] = [
    { label: 'Cursos', value: '10,000+' },
    { label: 'Estudiantes', value: '500,000+' },
    { label: 'Instructores', value: '1,000+' }
  ];

}
