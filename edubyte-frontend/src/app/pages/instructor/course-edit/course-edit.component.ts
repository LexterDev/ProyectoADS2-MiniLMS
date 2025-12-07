import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { SidebarInstructorComponent } from '../sidebar-instructor/sidebar-instructor.component';

@Component({
  selector: 'app-course-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarInstructorComponent],
  templateUrl: './course-edit.component.html',
  styleUrl: './course-edit.component.css'
})
export class CourseEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  courseId!: string;
  courseForm!: FormGroup;
  isSubmitting = false;
  isLoading = true;
  imagePreview: string | null = null;

  categories = [
    { id: 1, name: 'Programación' },
    { id: 2, name: 'Diseño' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'Negocios' }
  ];

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadCourseData();
  }

  initializeForm(): void {
    this.courseForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      categoriaId: [null, Validators.required],
      estadoCodigo: ['BORRADOR'],
      imageFile: [null]
    });
  }

  loadCourseData(): void {
    this.isLoading = true;
    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (response: any) => {
        const course = response.data;

        this.courseForm.patchValue({
          titulo: course.titulo,
          descripcion: course.descripcion,
          precio: course.precio,
          categoriaId: course.categoriaId,
          estadoCodigo: course.estadoCodigo
        });

        if (course.adjunto?.url) {
          this.imagePreview = course.adjunto.url;
        }

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.snackbarService.showError('Error al cargar el curso');
        this.isLoading = false;
        this.router.navigate(['/instructor/instructor-courses']);
      }
    });
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.courseForm.patchValue({ imageFile: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  saveCourse(): void {
    if (!this.courseForm.valid) {
      this.snackbarService.showError('Por favor completa todos los campos requeridos');
      Object.keys(this.courseForm.controls).forEach(key => {
        this.courseForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.courseForm.value;

    const updateData = {
      id: Number(this.courseId),
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      precio: formValue.precio,
      estadoCodigo: formValue.estadoCodigo,
      categoriaId: formValue.categoriaId,
      instructorId: this.getInstructorId()
    };

    this.coursesService.updateCourse(updateData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackbarService.showSuccess('Curso actualizado exitosamente');
        this.router.navigate(['/instructor/instructor-courses']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error updating course:', error);
        this.snackbarService.showError(error.error?.message || 'Error al actualizar el curso');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/instructor/instructor-courses']);
  }

  getInstructorId(): number {
    const user = this.authService.getUserInfo();
    return user ? user.id : 0;
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.courseForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.courseForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Este campo es requerido';
      if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;
    }
    return '';
  }
}
