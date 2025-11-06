import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Importamos componentes compartidos
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { SidebarInstructorComponent } from '../../instructor/sidebar-instructor/sidebar-instructor.component';
import { CoursesService } from '../../../services/courses.service';
import { LessonsService } from '../../../services/lessons.service';

// Interfaz para la Lección (basada en tu JSON)
interface Lesson {
  id: number;
  titulo: string;
  url: string;
  contenido: string;
  orden: number;
  tipo: 'VIDEO' | 'TEXTO' | 'DOCUMENTO';
  seccionId: number;
}

@Component({
  selector: 'app-course-lessons',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonComponent,
    SidebarInstructorComponent
  ],
  templateUrl: './course-lessons.component.html',
})
export class CourseLessonsComponent implements OnInit {

  lessonForm: FormGroup;
  lessons: Lesson[] = []; // Lista de lecciones existentes
  seccionId: number = 0;
  submitted = false;
  isLoading = false;
  courseId: string = '';
  sectionTitle: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    private coursesService: CoursesService,
    private lessonsService: LessonsService
  ) {
    // Inicializamos el formulario con los campos de tu JSON
    this.lessonForm = this.fb.group({
      titulo: ['', Validators.required],
      url: ['', Validators.required],
      contenido: ['', Validators.required],
      orden: [1, [Validators.required, Validators.min(1)]],
      tipo: ['VIDEO', Validators.required] // 'VIDEO' como valor por defecto
    });
  }

  ngOnInit(): void {
    // 1. Obtenemos el ID de la SECCIÓN desde la URL
    this.seccionId = +this.route.snapshot.paramMap.get('sectionId')!;
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';

    // 2. Cargamos las lecciones existentes (simulado)
    this.loadLessons();
    this.getCourseInfo();
  }

  // Simulación de carga de datos
  loadLessons(): void {
    // (Aquí harías tu llamada a la API: this.api.getLessons(this.seccionId)...)
    // this.lessons = [
    //   { id: 1, titulo: 'Lección 1: ¿Qué es HTML?', url: 'https://youtu.be/123', contenido: '...', orden: 1, tipo: 'VIDEO', seccionId: this.seccionId },
    //   { id: 2, titulo: 'Lección 2: Etiquetas básicas', url: 'https://youtu.be/456', contenido: '...', orden: 2, tipo: 'VIDEO', seccionId: this.seccionId }
    // ];

    // Ajustamos el 'orden' del formulario al siguiente
    this.lessonForm.patchValue({ orden: this.lessons.length + 1 });
  }

  // Getter para acceso fácil en el HTML
  get f() { return this.lessonForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.lessonForm.invalid) {
      this.snackbarService.showError('Formulario inválido. Revisa los campos.');
      return;
    }

    this.isLoading = true;

    // --- ¡AQUÍ ESTÁ LA MAGIA! ---
    // Construimos el JSON exactamente como lo pediste
    const payload = {
      "titulo": this.lessonForm.get('titulo')?.value,
      "url": this.lessonForm.get('url')?.value,
      "contenido": this.lessonForm.get('contenido')?.value,
      "orden": this.lessonForm.get('orden')?.value,
      "tipo": this.lessonForm.get('tipo')?.value,
      "seccionId": this.seccionId
    };

    console.log('Enviando a API:', payload);
    this.lessonsService.createLesson(payload).subscribe({
      next: (response: any) => {
        console.log('Lección creada:', response);
        this.snackbarService.showSuccess('Lección creada exitosamente.');
        this.lessons.push(response.data);
        this.lessonForm.reset();
        this.lessonForm.patchValue({ orden: this.lessons.length + 1 });
      },
      error: (error: any) => {
        console.error('Error al crear lección:', error);
        this.snackbarService.showError('Error al crear lección.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Simulación de borrado
  deleteLesson(id: number): void {
    console.log('Borrando lección:', id);
    this.lessons = this.lessons.filter(l => l.id !== id);
    this.snackbarService.showSuccess('Lección eliminada.');
    this.lessonForm.patchValue({ orden: this.lessons.length + 1 });
  }


  getCourseInfo(): void {
    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (response: any) => {
        console.log('Datos del curso:', response);
        const section = response.data.secciones.find((sec: any) => sec.id === this.seccionId);
        this.lessons = section ? section.lecciones : [];
        console.log('Lecciones de la sección:', this.lessons);
        this.sectionTitle = section ? section.titulo : '';

      },
      error: (error: any) => {
        console.error('Error al obtener info del curso:', error);
      }
    });
  }

}