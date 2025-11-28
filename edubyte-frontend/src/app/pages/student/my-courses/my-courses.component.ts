// src/app/pages/student/my-courses/my-courses.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgressService } from '../../../services/progress.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { SnackbarService } from '../../../services/snackbar.service';

interface StudentCourse {
  id: string;
  title: string;
  instructor: string;
  imageUrl: string;
  progress: number;
  lastLesson: string;
  isCompleted: boolean;
  isFavorite: boolean;
  timeSpent?: number; // Tiempo en segundos
}

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-courses.component.html',
  // ¡styleUrl ELIMINADO!
})
export class MyCoursesComponent implements OnInit {

  allCourses: StudentCourse[] = [];
  filteredCourses: StudentCourse[] = [];
  activeButtonFilter: string = 'Todos';
  activeTabFilter: string = 'Todos';
  searchTerm: string = '';
  sortOrder: string = 'recent';
  loading: boolean = true;

  private progressService = inject(ProgressService);
  private enrollmentService = inject(EnrollmentService);
  private snackbarService = inject(SnackbarService);

  constructor() { }

  ngOnInit(): void {
    this.loadMyCourses();
  }

  loadMyCourses(): void {
    this.loading = true;
    this.enrollmentService.getMyCourses().subscribe({
      next: (response) => {
        this.allCourses = response.data.map(course => ({
          id: course.id.toString(),
          title: course.titulo,
          instructor: course.instructor ? `${course.instructor.nombre} ${course.instructor.apellido}` : 'Instructor',
          imageUrl: course.adjunto?.rutaAdjunto || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
          progress: course.inscripcion?.progreso || 0,
          lastLesson: '', // TODO: Obtener de la API
          isCompleted: course.inscripcion?.completado || false,
          isFavorite: false, // TODO: Implementar favoritos
          timeSpent: undefined // TODO: Obtener del backend si está disponible
        }));
        this.loading = false;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.snackbarService.showError('Error al cargar tus cursos');
        this.loading = false;
      }
    });
  }

  setButtonFilter(filter: string): void {
    this.activeButtonFilter = filter;
    this.applyFilters();
  }

  setTabFilter(tab: string): void {
    this.activeTabFilter = tab;
    console.log('Filtro de pestaña:', tab);
    this.applyFilters();
  }

  setSort(sort: string): void {
    this.sortOrder = sort;
    this.applyFilters();
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  applyFilters(): void {
    let courses = [...this.allCourses];

    if (this.activeButtonFilter === 'En progreso') {
      courses = courses.filter(c => c.progress > 0 && c.progress < 100);
    } else if (this.activeButtonFilter === 'Completados') {
      courses = courses.filter(c => c.isCompleted);
    } else if (this.activeButtonFilter === 'Favoritos') {
      courses = courses.filter(c => c.isFavorite);
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      courses = courses.filter(c => 
        c.title.toLowerCase().includes(term) || 
        c.instructor.toLowerCase().includes(term)
      );
    }

    if (this.sortOrder === 'name') {
      courses.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortOrder === 'progress') {
      courses.sort((a, b) => b.progress - a.progress);
    }

    this.filteredCourses = courses;
  }

  formatTimeSpent(seconds: number | undefined): string {
    if (!seconds) return '0m';
    return this.progressService.formatTimeSpent(seconds);
  }

  /**
   * Get the first lesson ID for a course to start or continue
   * In a real app, this would fetch from the backend
   * For now, we'll use lesson ID 1 as default
   */
  getFirstLessonId(courseId: string): number {
    // TODO: Replace with actual API call to get first/next lesson
    return 1;
  }
}