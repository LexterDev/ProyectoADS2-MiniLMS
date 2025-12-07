import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { CoursesService } from '../../../services/courses.service';
import { AdminService } from '../../../services/admin.service';
import { SnackbarService } from '../../../services/snackbar.service';

@Component({
  selector: 'app-course-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatExpansionModule
  ],
  templateUrl: './course-review-dialog.component.html',
  styleUrl: './course-review-dialog.component.css'
})
export class CourseReviewDialogComponent implements OnInit {
  courseDetails: any = null;
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<CourseReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { courseId: number },
    private coursesService: CoursesService,
    private adminService: AdminService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadCourseDetails();
  }

  loadCourseDetails(): void {
    this.loading = true;
    this.coursesService.getCourseById(this.data.courseId.toString()).subscribe({
      next: (response: any) => {
        this.courseDetails = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading course details:', error);
        this.snackbarService.showError('Error al cargar los detalles del curso');
        this.loading = false;
        this.dialogRef.close();
      }
    });
  }

  approveCourse(): void {
    this.adminService.changeCourseStatus(this.data.courseId, 'PUB').subscribe({
      next: () => {
        this.snackbarService.showSuccess('Curso aprobado y publicado exitosamente');
        this.dialogRef.close({ action: 'approved' });
      },
      error: (error) => {
        console.error('Error approving course:', error);
        this.snackbarService.showError('Error al aprobar el curso');
      }
    });
  }

  rejectCourse(): void {
    this.adminService.changeCourseStatus(this.data.courseId, 'BOR').subscribe({
      next: () => {
        this.snackbarService.showSuccess('Curso rechazado. Se ha marcado como borrador');
        this.dialogRef.close({ action: 'rejected' });
      },
      error: (error) => {
        console.error('Error rejecting course:', error);
        this.snackbarService.showError('Error al rechazar el curso');
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  getTotalLessons(): number {
    if (!this.courseDetails?.secciones) return 0;
    return this.courseDetails.secciones.reduce(
      (total: number, section: any) => total + (section.lecciones?.length || 0),
      0
    );
  }

  getTotalDuration(): number {
    if (!this.courseDetails?.secciones) return 0;
    return this.courseDetails.secciones.reduce(
      (total: number, section: any) => total + (section.duracionEstimada || 0),
      0
    );
  }

  getLessonTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'VIDEO': 'Video',
      'LECTURA': 'Lectura',
      'INTRODUCCION': 'Introducción',
      'EVALUACION': 'Evaluación'
    };
    return types[type] || type;
  }

  getLessonTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'VIDEO': 'play_circle',
      'LECTURA': 'article',
      'INTRODUCCION': 'info',
      'EVALUACION': 'quiz'
    };
    return icons[type] || 'description';
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }
}
