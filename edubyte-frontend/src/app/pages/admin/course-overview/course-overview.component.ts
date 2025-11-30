import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';

interface Course {
  id: number;
  titulo: string;
  instructor: string;
  categoria: string;
  precio: number;
  estudiantes: number;
  estado: 'BORRADOR' | 'PUBLICADO' | 'INACTIVO';
  fechaCreacion: string;
}

@Component({
  selector: 'app-course-overview',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './course-overview.component.html',
  styleUrl: './course-overview.component.css'
})
export class CourseOverviewComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = false;
  searchQuery = '';
  selectedStatus = 'TODOS';

  statusOptions = [
    { value: 'TODOS', label: 'Todos los Estados' },
    { value: 'PUBLICADO', label: 'Publicados' },
    { value: 'BORRADOR', label: 'Borradores' },
    { value: 'INACTIVO', label: 'Inactivos' }
  ];

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    // TODO: Replace with actual API call
    setTimeout(() => {
      this.courses = [
        {
          id: 1,
          titulo: 'Introducción a Angular 19',
          instructor: 'María González',
          categoria: 'Desarrollo Web',
          precio: 49.99,
          estudiantes: 156,
          estado: 'PUBLICADO',
          fechaCreacion: '2024-10-15'
        },
        {
          id: 2,
          titulo: 'Spring Boot Avanzado',
          instructor: 'Juan Pérez',
          categoria: 'Desarrollo Web',
          precio: 59.99,
          estudiantes: 89,
          estado: 'PUBLICADO',
          fechaCreacion: '2024-09-20'
        },
        {
          id: 3,
          titulo: 'Diseño UX/UI Moderno',
          instructor: 'Carlos Rodríguez',
          categoria: 'Diseño',
          precio: 39.99,
          estudiantes: 0,
          estado: 'BORRADOR',
          fechaCreacion: '2024-11-01'
        }
      ];
      this.filteredCourses = [...this.courses];
      this.loading = false;
    }, 500);
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      const matchesSearch = !this.searchQuery ||
        course.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.selectedStatus === 'TODOS' || course.estado === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PUBLICADO':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'BORRADOR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'INACTIVO':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
