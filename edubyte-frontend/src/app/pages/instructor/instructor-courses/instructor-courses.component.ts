import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importaciones de Angular Material para el Menú de Acciones
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Definimos la estructura de un curso del instructor
type CourseStatus = 'Publicado' | 'Borrador' | 'En revisión' | 'Rechazado';

interface InstructorCourse {
  id: string;
  thumbnailUrl: string;
  title: string;
  status: CourseStatus;
  students: number;
  rating: number;
  revenue: number;
  lastUpdated: string; // Formato YYYY-MM-DD
}

@Component({
  selector: 'app-instructor-courses', // <-- Nombre del selector
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Pipes para formatear la tabla
    DatePipe,
    CurrencyPipe,
    DecimalPipe,
    // Módulos de Material
    MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './instructor-courses.component.html', // <-- Nombre del HTML
})
export class InstructorCoursesComponent implements OnInit { // <-- Nombre de la Clase

  // --- Datos de ejemplo ---
  allCourses: InstructorCourse[] = [
    { id: '1', thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', title: 'Curso de Desarrollo Web Moderno', status: 'Publicado', students: 125, rating: 4.8, revenue: 5250, lastUpdated: '2025-08-15' },
    { id: '2', thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', title: 'Curso de Marketing Digital Avanzado', status: 'Borrador', students: 0, rating: 0, revenue: 0, lastUpdated: '2025-09-20' },
    { id: '3', thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766', title: 'Curso de Diseño UX/UI Profesional', status: 'En revisión', students: 50, rating: 4.5, revenue: 2500, lastUpdated: '2025-07-10' },
    { id: '4', thumbnailUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23', title: 'Curso de Finanzas Personales', status: 'Rechazado', students: 20, rating: 4.2, revenue: 800, lastUpdated: '2025-06-05' },
    { id: '5', thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32', title: 'Curso de Fotografía para Principiantes', status: 'Publicado', students: 80, rating: 4.7, revenue: 3200, lastUpdated: '2025-05-01' }
  ];

  filteredCourses: InstructorCourse[] = [];
  activeTab: string = 'Todos'; // Coincide con el texto de la pestaña

  constructor() { }

  ngOnInit(): void {
    // Carga inicial de todos los cursos
    this.applyFilters();
  }

  /**
   * Actualiza la pestaña activa y vuelve a filtrar la lista de cursos.
   */
  setTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  /**
   * Filtra la lista 'allCourses' basándose en 'activeTab'.
   */
  applyFilters(): void {
    if (this.activeTab === 'Todos') {
      this.filteredCourses = [...this.allCourses];
    } else {
      // Filtra para que coincida con el estado (ej. 'Publicados' -> 'Publicado')
      const filterStatus = this.activeTab.replace('s', ''); // 'Publicados' -> 'Publicado'
      this.filteredCourses = this.allCourses.filter(course => course.status === filterStatus);
    }
  }

  // --- Métodos de Acciones (Simulados) ---
  editCourse(courseId: string): void {
    console.log('Editando curso:', courseId);
    // this.router.navigate(['/courses/edit', courseId]);
  }

  deleteCourse(courseId: string): void {
    console.log('Eliminando curso:', courseId);
    // (Aquí iría la lógica para llamar al servicio y eliminar)
    this.allCourses = this.allCourses.filter(c => c.id !== courseId);
    this.applyFilters(); // Actualiza la vista
  }
}