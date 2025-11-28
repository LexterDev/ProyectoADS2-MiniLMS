import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { SidebarInstructorComponent } from '../sidebar-instructor/sidebar-instructor.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../components/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-manage-course',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SidebarInstructorComponent,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './manage-course.component.html',
  styleUrl: './manage-course.component.css'
})
export class ManageCourseComponent implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  courseId!: string;
  course: any = null;
  isLoading = true;
  contentForm!: FormGroup;

  lessonTypes = [
    { value: 'VIDEO', label: 'Video' },
    { value: 'LECTURA', label: 'Lectura' },
    { value: 'INTRODUCCION', label: 'Introducción' },
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'RECURSO', label: 'Recurso' }
  ];

  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.initializeForm();
    this.loadCourseData();
  }

  initializeForm(): void {
    this.contentForm = this.fb.group({
      secciones: this.fb.array([])
    });
  }

  get secciones(): FormArray {
    return this.contentForm.get('secciones') as FormArray;
  }

  getSectionFormGroup(index: number): FormGroup {
    return this.secciones.at(index) as FormGroup;
  }

  getLecciones(sectionIndex: number): FormArray {
    return this.secciones.at(sectionIndex).get('lecciones') as FormArray;
  }

  getLessonFormGroup(sectionIndex: number, lessonIndex: number): FormGroup {
    return this.getLecciones(sectionIndex).at(lessonIndex) as FormGroup;
  }

  loadCourseData(): void {
    this.isLoading = true;
    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (response: any) => {
        this.course = response.data;

        // Load existing sections and lessons into the form
        if (this.course.secciones && this.course.secciones.length > 0) {
          this.course.secciones.forEach((seccion: any) => {
            const sectionGroup = this.fb.group({
              id: [seccion.id],
              titulo: [seccion.titulo, Validators.required],
              orden: [seccion.orden],
              duracionEstimada: [seccion.duracionEstimada],
              lecciones: this.fb.array([])
            });

            // Add lessons to this section
            if (seccion.lecciones && seccion.lecciones.length > 0) {
              const leccionesArray = sectionGroup.get('lecciones') as FormArray;
              seccion.lecciones.forEach((leccion: any) => {
                leccionesArray.push(this.fb.group({
                  id: [leccion.id],
                  titulo: [leccion.titulo, Validators.required],
                  url: [leccion.url],
                  contenido: [leccion.contenido],
                  orden: [leccion.orden],
                  tipo: [leccion.tipoCodigo || 'VIDEO', Validators.required]
                }));
              });
            }

            this.secciones.push(sectionGroup);
          });
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

  addSection(): void {
    const section = this.fb.group({
      id: [null],
      titulo: ['Nueva Sección', Validators.required],
      orden: [this.secciones.length + 1],
      duracionEstimada: [null],
      lecciones: this.fb.array([])
    });
    this.secciones.push(section);
  }

  removeSection(index: number): void {
    const section = this.secciones.at(index).value;

    if (section.id) {
      // If section exists in backend, delete it
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: 'Eliminar Sección',
          message: '¿Estás seguro de eliminar esta sección? Se eliminarán todas sus lecciones.',
          confirmText: 'Eliminar',
          cancelText: 'Cancelar',
          type: 'danger'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.coursesService.deleteSection(section.id).subscribe({
            next: () => {
              this.secciones.removeAt(index);
              this.reorderSections();
              this.snackbarService.showSuccess('Sección eliminada exitosamente');
            },
            error: (error) => {
              console.error('Error deleting section:', error);
              this.snackbarService.showError('Error al eliminar la sección');
            }
          });
        }
      });
    } else {
      // New section, just remove from form
      this.secciones.removeAt(index);
      this.reorderSections();
    }
  }

  reorderSections(): void {
    this.secciones.controls.forEach((section, idx) => {
      section.patchValue({ orden: idx + 1 });
    });
  }

  addLesson(sectionIndex: number): void {
    const lecciones = this.getLecciones(sectionIndex);
    const lesson = this.fb.group({
      id: [null],
      titulo: ['Nueva Lección', Validators.required],
      url: [''],
      contenido: [''],
      orden: [lecciones.length + 1],
      tipo: ['VIDEO', Validators.required]
    });
    lecciones.push(lesson);
  }

  removeLesson(sectionIndex: number, lessonIndex: number): void {
    const lecciones = this.getLecciones(sectionIndex);
    const lesson = lecciones.at(lessonIndex).value;

    if (lesson.id) {
      // If lesson exists in backend, delete it
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: 'Eliminar Lección',
          message: '¿Estás seguro de eliminar esta lección?',
          confirmText: 'Eliminar',
          cancelText: 'Cancelar',
          type: 'danger'
        }
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        if (confirmed) {
          this.coursesService.deleteLesson(lesson.id).subscribe({
            next: () => {
              lecciones.removeAt(lessonIndex);
              this.reorderLessons(sectionIndex);
              this.snackbarService.showSuccess('Lección eliminada exitosamente');
            },
            error: (error) => {
              console.error('Error deleting lesson:', error);
              this.snackbarService.showError('Error al eliminar la lección');
            }
          });
        }
      });
    } else {
      // New lesson, just remove from form
      lecciones.removeAt(lessonIndex);
      this.reorderLessons(sectionIndex);
    }
  }

  reorderLessons(sectionIndex: number): void {
    const lecciones = this.getLecciones(sectionIndex);
    lecciones.controls.forEach((lesson, idx) => {
      lesson.patchValue({ orden: idx + 1 });
    });
  }

  saveSection(sectionIndex: number): void {
    const section = this.secciones.at(sectionIndex).value;

    if (!section.titulo) {
      this.snackbarService.showError('El título de la sección es requerido');
      return;
    }

    const sectionData = {
      id: section.id,
      titulo: section.titulo,
      orden: section.orden,
      duracionEstimada: section.duracionEstimada,
      cursoId: Number(this.courseId)
    };

    if (section.id) {
      // Update existing section
      this.coursesService.updateSection(sectionData).subscribe({
        next: () => {
          this.snackbarService.showSuccess('Sección actualizada exitosamente');
        },
        error: (error) => {
          console.error('Error updating section:', error);
          this.snackbarService.showError('Error al actualizar la sección');
        }
      });
    } else {
      // Create new section
      this.coursesService.createSection(sectionData).subscribe({
        next: (response: any) => {
          // Update the section ID in the form
          this.secciones.at(sectionIndex).patchValue({ id: response.data.id });
          this.snackbarService.showSuccess('Sección creada exitosamente');
        },
        error: (error) => {
          console.error('Error creating section:', error);
          this.snackbarService.showError('Error al crear la sección');
        }
      });
    }
  }

  saveLesson(sectionIndex: number, lessonIndex: number): void {
    const section = this.secciones.at(sectionIndex).value;
    const lesson = this.getLecciones(sectionIndex).at(lessonIndex).value;

    if (!section.id) {
      this.snackbarService.showError('Primero debes guardar la sección');
      return;
    }

    if (!lesson.titulo) {
      this.snackbarService.showError('El título de la lección es requerido');
      return;
    }

    const lessonData = {
      id: lesson.id,
      titulo: lesson.titulo,
      url: lesson.url,
      contenido: lesson.contenido,
      orden: lesson.orden,
      tipoCodigo: lesson.tipo,
      seccionId: section.id
    };

    if (lesson.id) {
      // Update existing lesson
      this.coursesService.updateLesson(lessonData).subscribe({
        next: () => {
          this.snackbarService.showSuccess('Lección actualizada exitosamente');
        },
        error: (error) => {
          console.error('Error updating lesson:', error);
          this.snackbarService.showError('Error al actualizar la lección');
        }
      });
    } else {
      // Create new lesson
      this.coursesService.createLesson(lessonData).subscribe({
        next: (response: any) => {
          // Update the lesson ID in the form
          this.getLecciones(sectionIndex).at(lessonIndex).patchValue({ id: response.data.id });
          this.snackbarService.showSuccess('Lección creada exitosamente');
        },
        error: (error) => {
          console.error('Error creating lesson:', error);
          this.snackbarService.showError('Error al crear la lección');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/instructor/instructor-courses']);
  }
}
