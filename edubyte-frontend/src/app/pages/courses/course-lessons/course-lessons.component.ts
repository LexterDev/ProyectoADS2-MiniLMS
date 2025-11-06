import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Importamos componentes compartidos
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { SnackbarService } from '../../../services/snackbar.service';

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
    ButtonComponent
  ],
  templateUrl: './course-lessons.component.html',
})
export class CourseLessonsComponent implements OnInit {

  lessonForm: FormGroup;
  lessons: Lesson[] = []; // Lista de lecciones existentes
  seccionId: number = 0;
  submitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, // Para leer el ID de la sección
    private snackbarService: SnackbarService
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
    
    // 2. Cargamos las lecciones existentes (simulado)
    this.loadLessons();
  }

  // Simulación de carga de datos
  loadLessons(): void {
    // (Aquí harías tu llamada a la API: this.api.getLessons(this.seccionId)...)
    this.lessons = [
      { id: 1, titulo: 'Lección 1: ¿Qué es HTML?', url: 'https://youtu.be/123', contenido: '...', orden: 1, tipo: 'VIDEO', seccionId: this.seccionId },
      { id: 2, titulo: 'Lección 2: Etiquetas básicas', url: 'https://youtu.be/456', contenido: '...', orden: 2, tipo: 'VIDEO', seccionId: this.seccionId }
    ];
    
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
      ...this.lessonForm.value,
      seccionId: this.seccionId // Añadimos el ID de la sección
    };

    console.log('Enviando a API:', payload);

    // Simulamos la llamada a la API
    setTimeout(() => {
      // (Respuesta simulada)
      const newLesson: Lesson = {
        id: Math.floor(Math.random() * 1000), // ID simulado
        ...payload
      };
      
      this.lessons.push(newLesson);
      this.lessons.sort((a, b) => a.orden - b.orden); // Re-ordenamos la lista
      
      this.isLoading = false;
      this.submitted = false;
      this.snackbarService.showSuccess('Lección creada exitosamente');
      
      // Reseteamos el formulario
      this.lessonForm.reset({
        titulo: '',
        url: '',
        contenido: '',
        tipo: 'VIDEO',
        orden: this.lessons.length + 1 // Siguiente número de orden
      });
    }, 1000);
  }
  
  // Simulación de borrado
  deleteLesson(id: number): void {
     console.log('Borrando lección:', id);
     this.lessons = this.lessons.filter(l => l.id !== id);
     this.snackbarService.showSuccess('Lección eliminada.');
     this.lessonForm.patchValue({ orden: this.lessons.length + 1 });
  }
}