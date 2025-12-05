import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// Importaciones de Angular Material para el Menú de Acciones
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CoursesService } from '../../../services/courses.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { SidebarInstructorComponent } from '../sidebar-instructor/sidebar-instructor.component';
import { ConfirmationDialogComponent } from '../../../components/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatChipsModule,
    SidebarInstructorComponent
  ],
  templateUrl: './instructor-courses.component.html',
})
export class InstructorCoursesComponent implements OnInit {
  allCourses: any[] = [];
  filteredCourses: any[] = [];
  activeTab: string = 'Todos';
  loading: boolean = false;
  searchQuery: string = '';

  statusOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'PUB', label: 'Publicados' },
    { value: 'BOR', label: 'Borradores' },
    { value: 'REV', label: 'En Revisión' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private coursesService: CoursesService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCoursesByInstructor();
  }

  setTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.allCourses];

    // Apply tab filter
    if (this.activeTab !== 'Todos') {
      filtered = filtered.filter(course => course.estadoCodigo === this.activeTab);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.titulo.toLowerCase().includes(query) ||
        course.descripcion?.toLowerCase().includes(query)
      );
    }

    this.filteredCourses = filtered;
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  editCourse(courseId: string): void {
    this.router.navigate(['/instructor/edit-course', courseId]);
  }

  manageCourse(courseId: string): void {
    this.router.navigate(['/instructor/manage-course', courseId]);
  }

  deleteCourse(courseId: string): void {
    const course = this.allCourses.find(c => c.id == courseId);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Eliminar Curso',
        message: `¿Estás seguro de eliminar el curso "${course?.titulo}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        this.coursesService.deleteCourse(Number(courseId)).subscribe({
          next: () => {
            this.snackbarService.showSuccess('Curso eliminado exitosamente');
            this.getCoursesByInstructor();
          },
          error: (error) => {
            console.error('Error al eliminar curso:', error);
            this.snackbarService.showError('Error al eliminar el curso');
            this.loading = false;
          }
        });
      }
    });
  }

  changeCourseStatus(course: any, newStatus: string, statusLabel: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Cambiar Estado del Curso',
        message: `¿Deseas cambiar el estado de "${course.titulo}" a ${statusLabel}?`,
        confirmText: 'Cambiar',
        cancelText: 'Cancelar',
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;
        const updateData = {
          id: course.id,
          titulo: course.titulo,
          descripcion: course.descripcion,
          precio: course.precio,
          estadoCodigo: newStatus,
          categoriaId: course.categoriaId,
          instructorId: this.getInstructorId()
        };

        this.coursesService.updateCourse(updateData).subscribe({
          next: () => {
            this.snackbarService.showSuccess(`Estado actualizado a ${statusLabel}`);
            this.getCoursesByInstructor();
          },
          error: (error) => {
            console.error('Error al cambiar estado del curso:', error);
            this.snackbarService.showError('Error al actualizar el curso');
            this.loading = false;
          }
        });
      }
    });
  }

  publishCourse(course: any): void {
    this.changeCourseStatus(course, 'PUB', 'Publicado');
  }

  setToDraft(course: any): void {
    this.changeCourseStatus(course, 'BOR', 'Borrador');
  }

  setToReview(course: any): void {
    this.changeCourseStatus(course, 'REV', 'En Revisión');
  }

  duplicateCourse(courseId: string): void {
    const course = this.allCourses.find(c => c.id == courseId);

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: 'Duplicar Curso',
        message: `¿Deseas crear una copia del curso "${course?.titulo}"? Se creará un nuevo curso con el estado "Borrador".`,
        confirmText: 'Duplicar',
        cancelText: 'Cancelar',
        type: 'info'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loading = true;

        this.coursesService.getCourseById(courseId).subscribe({
          next: (response: any) => {
            const originalCourse = response.data;

            const duplicateCourseData = {
              titulo: `${originalCourse.titulo} (Copia)`,
              descripcion: originalCourse.descripcion,
              precio: originalCourse.precio,
              estadoCodigo: 'BOR',
              categoriaId: originalCourse.categoriaId,
              instructorId: this.getInstructorId(),
              secciones: originalCourse.secciones?.map((seccion: any) => ({
                titulo: seccion.titulo,
                orden: seccion.orden,
                duracionEstimada: seccion.duracionEstimada,
                lecciones: seccion.lecciones?.map((leccion: any) => ({
                  titulo: leccion.titulo,
                  url: leccion.url,
                  contenido: leccion.contenido,
                  orden: leccion.orden,
                  tipoCodigo: leccion.tipoCodigo
                })) || []
              })) || []
            };

            this.coursesService.createCourseBatch(duplicateCourseData).subscribe({
              next: () => {
                this.snackbarService.showSuccess('Curso duplicado exitosamente');
                this.getCoursesByInstructor();
              },
              error: (error) => {
                console.error('Error al duplicar curso:', error);
                this.snackbarService.showError('Error al duplicar el curso');
                this.loading = false;
              }
            });
          },
          error: (error) => {
            console.error('Error al obtener detalles del curso:', error);
            this.snackbarService.showError('Error al obtener los detalles del curso');
            this.loading = false;
          }
        });
      }
    });
  }

  getInstructorId(): number {
    const user = this.authService.getUserInfo();
    return user ? user.id : 0;
  }

  getCoursesByInstructor(): void {
    this.loading = true;
    this.coursesService.getCoursesByInstructorId(this.getInstructorId()).subscribe({
      next: (courses: any) => {
        this.allCourses = courses.data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al obtener cursos del instructor:', error);
        this.snackbarService.showError('Error al cargar los cursos');
        this.loading = false;
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
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PUB':
        return 'Publicado';
      case 'BOR':
        return 'Borrador';
      case 'REV':
        return 'En Revisión';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
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
