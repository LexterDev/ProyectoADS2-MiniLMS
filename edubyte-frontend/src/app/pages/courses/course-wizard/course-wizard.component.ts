import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CoursesService } from '../../../services/courses.service';
import { CategoryService, Category } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { SnackbarService } from '../../../services/snackbar.service';

interface CourseWizardData {
  // Step 1: Course Information
  titulo: string;
  descripcion: string;
  esGratis: boolean;
  precio: number;
  precioOriginal?: number | null;
  categoriaId: number;
  adjunto: {
    nombreOriginal: string;
    tipoArchivo: string;
    base64: string;
  } | null;
  // Step 2: Content (sections + lessons)
  secciones: Array<{
    titulo: string;
    orden: number;
    duracionEstimada?: number;
    lecciones: Array<{
      titulo: string;
      url?: string;
      contenido?: string;
      orden: number;
      tipo: string;
    }>;
  }>;
}

@Component({
  selector: 'app-course-wizard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './course-wizard.component.html',
  styleUrl: './course-wizard.component.css'
})
export class CourseWizardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private coursesService = inject(CoursesService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private snackbarService = inject(SnackbarService);
  private router = inject(Router);

  currentStep: number = 1;
  totalSteps: number = 3;

  // Forms for each step
  courseInfoForm!: FormGroup;
  contentForm!: FormGroup;

  isSubmitting = false;
  imagePreview: string | null = null;
  loadingCategories = false;

  categories: Category[] = [];

  lessonTypes = [
    { value: 'VIDEO', label: 'Video' },
    { value: 'LECTURA', label: 'Lectura' },
    { value: 'INTRODUCCION', label: 'Introducción' },
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'RECURSO', label: 'Recurso' }
  ];

  ngOnInit(): void {
    this.initializeForms();
    this.loadCategories();
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categoryService.getActiveCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.snackbarService.showError('Error al cargar las categorías');
        this.loadingCategories = false;
      }
    });
  }

  getCategoryColor(color: string | undefined): string {
    if (!color) return 'bg-gray-500';
    return `bg-${color}-500`;
  }

  toggleFreeCourse(isFree: boolean): void {
    if (isFree) {
      this.courseInfoForm.patchValue({
        precio: 0,
        precioOriginal: null
      });
      this.courseInfoForm.get('precio')?.disable();
    } else {
      this.courseInfoForm.get('precio')?.enable();
    }
  }

  initializeForms(): void {
    // Step 1: Course Information
    this.courseInfoForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      esGratis: [false],
      precio: [0, [Validators.required, Validators.min(0)]],
      precioOriginal: [null],
      categoriaId: [null, Validators.required],
      imageFile: [null]
    });

    // Step 2: Content (sections and lessons)
    this.contentForm = this.fb.group({
      secciones: this.fb.array([])
    });
  }

  // Getters
  get secciones(): FormArray {
    return this.contentForm.get('secciones') as FormArray;
  }

  getLecciones(sectionIndex: number): FormArray {
    return this.secciones.at(sectionIndex).get('lecciones') as FormArray;
  }

  getSectionFormGroup(index: number): FormGroup {
    return this.secciones.at(index) as FormGroup;
  }

  getLessonFormGroup(sectionIndex: number, lessonIndex: number): FormGroup {
    return this.getLecciones(sectionIndex).at(lessonIndex) as FormGroup;
  }

  // Section management
  addSection(): void {
    const section = this.fb.group({
      titulo: ['', Validators.required],
      orden: [this.secciones.length + 1],
      duracionEstimada: [null],
      lecciones: this.fb.array([])
    });
    this.secciones.push(section);
  }

  removeSection(index: number): void {
    this.secciones.removeAt(index);
    // Reorder remaining sections
    this.secciones.controls.forEach((section, idx) => {
      section.patchValue({ orden: idx + 1 });
    });
  }

  // Lesson management
  addLesson(sectionIndex: number): void {
    const lecciones = this.getLecciones(sectionIndex);
    const lesson = this.fb.group({
      titulo: ['', Validators.required],
      url: [''],
      contenido: [''],
      orden: [lecciones.length + 1],
      tipo: ['VIDEO', Validators.required]
    });
    lecciones.push(lesson);
  }

  removeLesson(sectionIndex: number, lessonIndex: number): void {
    const lecciones = this.getLecciones(sectionIndex);
    lecciones.removeAt(lessonIndex);
    // Reorder remaining lessons
    lecciones.controls.forEach((lesson, idx) => {
      lesson.patchValue({ orden: idx + 1 });
    });
  }

  // Image handling
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.courseInfoForm.patchValue({ imageFile: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  // Navigation
  nextStep(): void {
    if (this.currentStep === 1 && !this.courseInfoForm.valid) {
      this.snackbarService.showError('Por favor completa todos los campos requeridos');
      Object.keys(this.courseInfoForm.controls).forEach(key => {
        this.courseInfoForm.get(key)?.markAsTouched();
      });
      return;
    }

    if (this.currentStep === 2 && this.secciones.length === 0) {
      this.snackbarService.showError('Debes agregar al menos una sección con lecciones');
      return;
    }

    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    this.currentStep = step;
  }

  // Get final data
  getFinalData(): CourseWizardData {
    const courseInfo = this.courseInfoForm.getRawValue(); // Use getRawValue to include disabled fields
    const content = this.contentForm.value;

    let adjuntoData = null;
    if (courseInfo.imageFile) {
      const base64Parts = courseInfo.imageFile.split(',');
      const mimeType = base64Parts[0].match(/:(.*?);/)[1];
      adjuntoData = {
        nombreOriginal: 'course-thumbnail.jpg',
        tipoArchivo: mimeType,
        base64: courseInfo.imageFile
      };
    }

    return {
      titulo: courseInfo.titulo,
      descripcion: courseInfo.descripcion,
      esGratis: courseInfo.esGratis || false,
      precio: courseInfo.esGratis ? 0 : courseInfo.precio,
      precioOriginal: courseInfo.precioOriginal || null,
      categoriaId: courseInfo.categoriaId,
      adjunto: adjuntoData,
      secciones: content.secciones
    };
  }

  // Submit
  saveDraft(): void {
    this.submitCourse(false);
  }

  publishCourse(): void {
    this.submitCourse(true);
  }

  private submitCourse(publish: boolean): void {
    if (!this.courseInfoForm.valid) {
      this.snackbarService.showError('Por favor completa la información del curso');
      this.goToStep(1);
      return;
    }

    if (this.secciones.length === 0) {
      this.snackbarService.showError('Debes agregar al menos una sección');
      this.goToStep(2);
      return;
    }

    const hasLessons = this.secciones.controls.some(section => {
      const lecciones = this.getLecciones(this.secciones.controls.indexOf(section));
      return lecciones.length > 0;
    });

    if (!hasLessons) {
      this.snackbarService.showError('Debes agregar al menos una lección');
      this.goToStep(2);
      return;
    }

    this.isSubmitting = true;
    const finalData = this.getFinalData();

    this.coursesService.createCourseBatch(finalData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        this.snackbarService.showSuccess(publish ? 'Curso creado y guardado como borrador' : 'Curso guardado como borrador');
        this.router.navigate(['/instructor/instructor-courses']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error creating course:', error);
        this.snackbarService.showError(error.error?.message || 'Error al crear el curso');
      }
    });
  }

  // Helper methods
  isStepValid(step: number): boolean {
    if (step === 1) {
      return this.courseInfoForm.valid;
    }
    if (step === 2) {
      return this.secciones.length > 0;
    }
    return true;
  }

  getStepIcon(step: number): string {
    if (step < this.currentStep) return '✓';
    return step.toString();
  }
}
