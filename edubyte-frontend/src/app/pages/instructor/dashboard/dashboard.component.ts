// src/app/pages/instructor/dashboard/dashboard.component.ts

import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common'; // Importa DecimalPipe
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DecimalPipe // Añade DecimalPipe para el formateo de números
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  // 1. Datos para las "Métricas Clave"
  metrics = {
    totalStudents: 1250,
    monthlyRevenue: 5750,
    averageRating: 4.8,
    publishedCourses: 12
  };

  // 2. Datos para "Cursos Más Populares" (simulados)
  popularCourses = [
    { title: 'Curso A (Spring Boot)', percentage: 75 },
    { title: 'Curso B (Angular)', percentage: 60 },
    { title: 'Curso C (Power Automate)', percentage: 45 }
  ];

  // 3. Datos para "Actividad Reciente" (simulados)
  recentActivity = [
    { 
      imageUrl: 'https://placehold.co/40x40/E9D8FD/7f13ec?text=UA', 
      description: 'Nueva Inscripción en Curso de Angular', 
      time: 'Hace 2 horas' 
    },
    { 
      imageUrl: 'https://placehold.co/40x40/E9D8FD/7f13ec?text=RB', 
      description: 'Reseña de 5 estrellas en Curso de Java', 
      time: 'Hace 4 horas' 
    },
    { 
      imageUrl: 'https://placehold.co/40x40/E9D8FD/7f13ec?text=MC', 
      description: 'Pregunta sin Responder en Curso de Spring', 
      time: 'Hace 6 horas' 
    },
    { 
      imageUrl: 'https://placehold.co/40x40/E9D8FD/7f13ec?text=ED', 
      description: 'Curso de IEX Pendiente de Aprobación', 
      time: 'Hace 8 horas' 
    }
  ];

  constructor() { }

  // Helper para formatear la moneda
  formatCurrency(value: number): string {
    // Usamos toLocaleString para un formato de moneda correcto
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
}