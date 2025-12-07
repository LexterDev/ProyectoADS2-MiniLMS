import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../../../services/admin.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { ConfirmationDialogComponent } from '../../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { CourseReviewDialogComponent } from '../../../components/shared/course-review-dialog/course-review-dialog.component';

interface Course {
  id: number;
  titulo: string;
  descripcion: string;
  instructor?: {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
  };
  categoriaNombre?: string;
  precio: number;
  estadoCodigo: string;
  estadoNombre: string;
  creadoEn: string;
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
    MatChipsModule,
    MatDialogModule
  ],
  templateUrl: './course-overview.component.html',
  styleUrl: './course-overview.component.css'
})
export class CourseOverviewComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackbarService = inject(SnackbarService);
  private dialog = inject(MatDialog);

  courses: Course[] = [];
  filteredCourses: Course[] = [];
  loading = false;
  searchQuery = '';
  selectedStatus = 'TODOS';

  statusOptions = [
    { value: 'TODOS', label: 'Todos los Estados' },
    { value: 'PUB', label: 'Publicados' },
    { value: 'BOR', label: 'Borradores' },
    { value: 'REV', label: 'En Revisión' }
  ];

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.adminService.getAllCourses().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.courses = response.data;
          this.filteredCourses = [...this.courses];
        } else {
          this.snackbarService.showError('Error al cargar cursos');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.snackbarService.showError('Error al cargar la lista de cursos');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredCourses = this.courses.filter(course => {
      const instructorName = course.instructor
        ? `${course.instructor.nombre} ${course.instructor.apellido}`
        : '';

      const matchesSearch = !this.searchQuery ||
        course.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        instructorName.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.selectedStatus === 'TODOS' || course.estadoCodigo === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  changeCourseStatus(course: Course, newStatus: string, statusLabel: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Cambiar Estado del Curso',
        message: `¿Estás seguro de que deseas cambiar el estado de "${course.titulo}" a ${statusLabel}?`,
        confirmText: 'Cambiar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.changeCourseStatus(course.id, newStatus).subscribe({
          next: (response: any) => {
            if (response.data) {
              const index = this.courses.findIndex(c => c.id === course.id);
              if (index !== -1) {
                this.courses[index] = response.data;
                this.applyFilters();
              }
              this.snackbarService.showSuccess(`Estado del curso actualizado a ${statusLabel}`);
            } else {
              this.snackbarService.showError('Error al actualizar el estado del curso');
            }
          },
          error: (error) => {
            console.error('Error changing course status:', error);
            const errorMsg = error.error?.message || 'Error al cambiar el estado del curso';
            this.snackbarService.showError(errorMsg);
          }
        });
      }
    });
  }

  publishCourse(course: Course): void {
    this.changeCourseStatus(course, 'PUB', 'Publicado');
  }

  setToDraft(course: Course): void {
    this.changeCourseStatus(course, 'BOR', 'Borrador');
  }

  setToReview(course: Course): void {
    this.changeCourseStatus(course, 'REV', 'En Revisión');
  }

  reviewCourse(course: Course): void {
    const dialogRef = this.dialog.open(CourseReviewDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { courseId: course.id },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action) {
        this.loadCourses(); // Reload courses after approval/rejection
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PUB':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'BOR':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'REV':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'INA':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  }

  getInstructorName(course: Course): string {
    if (course.instructor) {
      return `${course.instructor.nombre} ${course.instructor.apellido}`;
    }
    return 'Sin instructor';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
