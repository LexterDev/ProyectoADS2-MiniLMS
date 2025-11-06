// dashboard.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarInstructorComponent } from '../sidebar-instructor/sidebar-instructor.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarInstructorComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  metrics = {
    totalStudents: 1250,
    monthlyRevenue: 5750,
    averageRating: 4.8,
    publishedCourses: 12
  };

  popularCourses = [
    { title: 'Curso A', percentage: 85 },
    { title: 'Curso B', percentage: 70 },
    { title: 'Curso C', percentage: 60 }
  ];

  recentActivity = [
    {
      description: 'Nueva Inscripción en Curso A',
      time: 'Hace 2 horas',
      imageUrl: 'https://via.placeholder.com/40'
    },
    {
      description: 'Reseña de 5 estrellas en Curso B',
      time: 'Hace 4 horas',
      imageUrl: 'https://via.placeholder.com/40'
    },
    {
      description: 'Pregunta sin Responder en Curso C',
      time: 'Hace 6 horas',
      imageUrl: 'https://via.placeholder.com/40'
    },
    {
      description: 'Curso D Pendiente de Aprobación',
      time: 'Hace 8 horas',
      imageUrl: 'https://via.placeholder.com/40'
    }
  ];

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }
}