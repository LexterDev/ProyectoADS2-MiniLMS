import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Importamos los componentes compartidos que usaremos
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { SnackbarService } from '../../../services/snackbar.service';
import { AuthService } from '../../../services/auth.service';
import { CoursesService } from '../../../services/courses.service';
import { SectionsService } from '../../../services/sections.service';
import { SidebarInstructorComponent } from '../../instructor/sidebar-instructor/sidebar-instructor.component';


// Interfaz para la sección (simulada)
interface Section {
  id: number;
  titulo: string;
  orden: number;
  cursoId: number;
}

@Component({
  selector: 'app-course-sections',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonComponent,
    SidebarInstructorComponent
  ],
  templateUrl: './course-sections.component.html',
})
export class CourseSectionsComponent implements OnInit {

  sectionForm: FormGroup;
  secciones: Section[] = []; // Para la lista de secciones existentes
  cursoId: string = '';
  submitted = false;
  isLoading = false;
  courseTitle: string = '';


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
    public router: Router,
    private authService: AuthService,
    private coursesService: CoursesService,
    private sectionsService: SectionsService
  ) {
    // Inicializamos el formulario con los campos que pediste
    this.sectionForm = this.fb.group({
      titulo: ['', Validators.required],
      orden: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // 1. Obtenemos el ID del curso desde la URL
    this.cursoId = this.route.snapshot.paramMap.get('courseId') || '';

    // 2. Cargamos las secciones existentes (simulado)
    // this.loadSections();
    this.getCourseInfo();
    console.log('Curso ID:', this.cursoId);
  }

  // Simulación de carga de datos
  loadSections(): void {
    // (Aquí harías tu llamada a la API: this.api.getSections(this.cursoId)...)
    // this.secciones = [
    //   { id: 1, titulo: 'Bienvenida al curso', orden: 1, cursoId: this.cursoId },
    //   { id: 2, titulo: 'Fundamentos de HTML', orden: 2, cursoId: this.cursoId }
    // ];

    // Ajustamos el 'orden' del formulario al siguiente número disponible
    // this.sectionForm.patchValue({ orden: this.secciones.length + 1 });
  }

  // Getter para acceso fácil en el HTML
  get f() { return this.sectionForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.sectionForm.invalid) {
      this.snackbarService.showError('Formulario inválido. Revisa los campos.');
      return;
    }

    this.isLoading = true;

    // --- ¡AQUÍ ESTÁ LA MAGIA! ---
    // Construimos el JSON exactamente como lo pediste
    const payload = {
      "titulo": this.sectionForm.get('titulo')?.value,
      "orden": this.sectionForm.get('orden')?.value,
      "cursoId": this.cursoId
    };

    this.sectionsService.createSection(payload).subscribe({
      next: (response: any) => {
        console.log('Sección creada:', response);
        this.snackbarService.showSuccess('Sección creada exitosamente.');
        this.isLoading = false;
        this.sectionForm.reset();
        this.secciones.push(response.data);
      },
      error: (error: any) => {
        console.error('Error al crear sección:', error);
        this.snackbarService.showError('Error al crear sección.');
        this.isLoading = false;
      }
    });
  }

  // Simulación de borrado
  deleteSection(id: number): void {
    console.log('Borrando seccion:', id);
    this.secciones = this.secciones.filter(s => s.id !== id);
    // (Aquí llamarías a tu API para borrar)
    this.snackbarService.showSuccess('Sección eliminada.');
    // Re-calculamos el 'orden' por si acaso
    this.sectionForm.patchValue({ orden: this.secciones.length + 1 });
  }

  addLesson(sectionId: number, courseId: string): void {
    this.router.navigate(['/instructor/add-lesson', courseId, sectionId]);
  }

  getCourseInfo(): void {
    this.coursesService.getCourseById(this.cursoId).subscribe({
      next: (course: any) => {
        const secciones = course.data.secciones;
        this.secciones = secciones;
        this.courseTitle = course.data.titulo;
        console.log('Secciones del curso:', this.secciones);
      },
      error: (error: any) => {
        console.error('Error al obtener información del curso:', error);
      }
    });
  }
  // Lógica para obtener cursos por instructorId
}