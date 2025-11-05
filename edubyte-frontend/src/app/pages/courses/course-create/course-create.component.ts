import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule, 
  FormArray 
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    // NgClass ya no es necesario si no lo usas
  ],
  templateUrl: './course-create.component.html'
})
export class CourseCreateComponent implements OnInit {

  courseForm: FormGroup;
  submitted = false;
  selectedImageFile: File | null = null;
  
  // --- ¡NUEVAS PROPIEDADES! ---
  isLoading = false;   // Para mostrar un spinner y deshabilitar botones
  isPublished = false; // Para mostrar la escena de "Publicado"

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      subtitle: ['', [Validators.required, Validators.minLength(10)]],
      shortDescription: ['', [Validators.required, Validators.minLength(20)]],
      longDescription: ['', [Validators.required]],
      category: ['', [Validators.required]],
      level: ['', [Validators.required]],
      language: ['', [Validators.required]],
      thumbnail: [null, Validators.required],
      learningObjectives: this.fb.array(
        [this.fb.control('', Validators.required)],
        Validators.required
      )
    });
  }

  ngOnInit(): void {
    // (Vacío está bien)
  }

  // --- GETTERS (Sin cambios) ---
  get f() {
    return this.courseForm.controls;
  }
  
  get learningObjectives() {
    return this.courseForm.get('learningObjectives') as FormArray;
  }

  // --- Métodos FormArray (Sin cambios) ---
  addObjective() {
    this.learningObjectives.push(this.fb.control('', Validators.required));
  }

  removeObjective(index: number) {
    if (this.learningObjectives.length > 1) {
      this.learningObjectives.removeAt(index);
    }
  }

  // --- Lógica de Archivos (Sin cambios) ---
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.courseForm.patchValue({ thumbnail: file });
      this.courseForm.get('thumbnail')?.markAsTouched();
      this.selectedImageFile = file;
    }
  }

  // --- ¡FUNCIÓN ONSUBMIT ACTUALIZADA! ---
  onSubmit() {
    this.submitted = true;
    
    if (this.courseForm.invalid) {
      console.error('Formulario inválido. Por favor, revisa los campos.');
      this.courseForm.markAllAsTouched();
      return;
    }
    
    // 1. Inicia el estado de carga
    this.isLoading = true;
    
    // (Tu lógica de FormData sigue aquí)
    const formData = new FormData();
    const formValue = this.courseForm.value;
    Object.keys(formValue).forEach(key => {
      if (key !== 'thumbnail' && key !== 'learningObjectives') {
        formData.append(key, formValue[key]);
      }
    });
    if (this.selectedImageFile) {
      formData.append('file', this.selectedImageFile, this.selectedImageFile.name);
    }
    formData.append('learningObjectives', JSON.stringify(formValue.learningObjectives));

    console.log('--- Enviando FormData a la API (simulado) ---');

    // --- 2. SIMULACIÓN DE LLAMADA A LA API ---
    // (En un caso real, esto sería this.courseService.createCourse(formData).subscribe(...))
    setTimeout(() => {
      // --- ÉXITO DE LA API ---
      console.log('¡Curso publicado exitosamente!');
      
      // 3. Oculta el formulario y muestra el mensaje de "Publicado"
      this.isLoading = false;
      this.isPublished = true; // <-- ¡AQUÍ ESTÁ LA MAGIA!

      // 4. Espera 2.5 segundos para que el usuario lea el mensaje
      setTimeout(() => {
        // 5. Redirige al "home" (dashboard del instructor)
        this.router.navigate(['/instructor/dashboard']); 
      }, 2500); // 2.5 segundos de espera

    }, 1500); // 1.5 segundos de simulación de red
  }
}