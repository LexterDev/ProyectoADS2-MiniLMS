import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// Importaciones de Angular Material para el Menú de Acciones
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CoursesService } from '../../../services/courses.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { SidebarInstructorComponent } from '../sidebar-instructor/sidebar-instructor.component';
import { ConfirmationDialogComponent } from '../../../components/shared/confirmation-dialog/confirmation-dialog.component';

// Definimos la estructura de un curso del instructor
type CourseStatus = 'Publicado' | 'Borrador' | 'En revisión' | 'Rechazado';

// interface InstructorCourse {
//   id: string;
//   adjunto: { url: string };
//   titulo: string;
//   status: CourseStatus;
//   students: number;
//   rating: number;
//   revenue: number;
//   lastUpdated: string;
// }

@Component({
  selector: 'app-instructor-courses', // <-- Nombre del selector
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // Pipes para formatear la tabla
    DatePipe,
    CurrencyPipe,
    // Módulos de Material
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    SidebarInstructorComponent
  ],
  templateUrl: './instructor-courses.component.html', // <-- Nombre del HTML
})
export class InstructorCoursesComponent implements OnInit {
  allCourses: any[] = [];

  // --- Datos de ejemplo ---
  // allCourses: InstructorCourse[] = [
  //   { id: '1', thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', title: 'Curso de Desarrollo Web Moderno', status: 'Publicado', students: 125, rating: 4.8, revenue: 5250, lastUpdated: '2025-08-15' },
  //   { id: '2', thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71', title: 'Curso de Marketing Digital Avanzado', status: 'Borrador', students: 0, rating: 0, revenue: 0, lastUpdated: '2025-09-20' },
  //   { id: '3', thumbnailUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766', title: 'Curso de Diseño UX/UI Profesional', status: 'En revisión', students: 50, rating: 4.5, revenue: 2500, lastUpdated: '2025-07-10' },
  //   { id: '4', thumbnailUrl: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23', title: 'Curso de Finanzas Personales', status: 'Rechazado', students: 20, rating: 4.2, revenue: 800, lastUpdated: '2025-06-05' },
  //   { id: '5', thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32', title: 'Curso de Fotografía para Principiantes', status: 'Publicado', students: 80, rating: 4.7, revenue: 3200, lastUpdated: '2025-05-01' }
  // ];

  filteredCourses: any[] = [];
  activeTab: string = 'Todos'; // Coincide con el texto de la pestaña
  loading: boolean = false;
  searchQuery: string = '';

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

  /**
   * Actualiza la pestaña activa y vuelve a filtrar la lista de cursos.
   */
  setTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  /**
   * Filtra la lista 'allCourses' basándose en 'activeTab' y 'searchQuery'.
   */
  applyFilters(): void {
    let filtered = [...this.allCourses];

    // Apply tab filter
    if (this.activeTab === 'Publicados') {
      filtered = filtered.filter(course => course.estadoCodigo === 'PUBLICADO');
    } else if (this.activeTab === 'Borrador') {
      filtered = filtered.filter(course => course.estadoCodigo === 'BORRADOR');
    } else if (this.activeTab === 'En revisión') {
      filtered = filtered.filter(course => course.estadoCodigo === 'EN_REVISION');
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

  /**
   * Handler for search input
   */
  onSearch(): void {
    this.applyFilters();
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  // --- Métodos de Acciones ---
  editCourse(courseId: string): void {
    this.router.navigate(['/instructor/edit-course', courseId]);
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

  togglePublishStatus(course: any): void {
    const newStatus = course.estadoCodigo === 'PUBLICADO' ? 'BORRADOR' : 'PUBLICADO';
    const newStatusName = newStatus === 'PUBLICADO' ? 'publicar' : 'despublicar';

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '500px',
      data: {
        title: newStatus === 'PUBLICADO' ? 'Publicar Curso' : 'Despublicar Curso',
        message: `¿Deseas ${newStatusName} el curso "${course.titulo}"?`,
        confirmText: newStatus === 'PUBLICADO' ? 'Publicar' : 'Despublicar',
        cancelText: 'Cancelar',
        type: newStatus === 'PUBLICADO' ? 'info' : 'warning'
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
            const actionText = newStatus === 'PUBLICADO' ? 'publicado' : 'despublicado';
            this.snackbarService.showSuccess(`Curso ${actionText} exitosamente`);
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

  addSection(courseId: string): void {
    this.router.navigate(['/instructor/manage-course', courseId]);
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

        // Fetch the full course details including sections and lessons
        this.coursesService.getCourseById(courseId).subscribe({
          next: (response: any) => {
            const originalCourse = response.data;

            // Prepare the duplicate course data
            const duplicateCourseData = {
              titulo: `${originalCourse.titulo} (Copia)`,
              descripcion: originalCourse.descripcion,
              precio: originalCourse.precio,
              estadoCodigo: 'BORRADOR',
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

            // Create the duplicate course using batch endpoint
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
}