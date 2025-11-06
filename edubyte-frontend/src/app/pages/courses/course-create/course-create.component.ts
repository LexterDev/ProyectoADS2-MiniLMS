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

// --- 1. IMPORTACIONES AÑADIDAS ---
import { SnackbarService } from '../../../services/snackbar.service'; // (Ajusta la ruta)
import { ImageUploadComponent } from '../../../components/shared/image-upload/image-upload.component';
import { CoursesService } from '../../../services/courses.service';
import { SidebarInstructorComponent } from '../../instructor/sidebar-instructor/sidebar-instructor.component';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    // NgClass (si lo usas)
    ImageUploadComponent,
    SidebarInstructorComponent
  ],
  templateUrl: './course-create.component.html'
})
export class CourseCreateComponent implements OnInit {

  courseForm: FormGroup;
  submitted = false;

  // selectedImageFile ya no es necesario aquí, 
  // app-image-upload maneja el archivo localmente.
  // selectedImageFile: File | null = null; 

  isLoading = false;
  isPublished = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    // --- 3. INYECTA EL SNACKBAR ---
    private snackbarService: SnackbarService,
    private courseService: CoursesService
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
    });
  }

  ngOnInit(): void {
    // (Vacío está bien)
  }

  // --- Getters (Sin cambios) ---
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

  // --- 4. 'onImageSelected' REEMPLAZADO ---
  /**
   * Se llama cuando app-image-upload emite la URL (uploadComplete).
   * Guarda la URL de Cloudinary en el FormGroup.
   */
  onThumbnailUploaded(url: string): void {
    if (url) {
      // Convertir URL a base64
      this.urlToBase64(url).then(base64 => {
        this.courseForm.patchValue({ thumbnail: base64 });
        this.courseForm.get('thumbnail')?.markAsTouched();
        console.log('Base64 guardado');
      }).catch(error => {
        console.error('Error al convertir a base64:', error);
      });
    }
  }

  /**
   * Convierte una URL de imagen a base64
   */
  private async urlToBase64(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw new Error('No se pudo convertir la imagen a base64');
    }
  }

  // --- 5. 'onSubmit' ACTUALIZADO ---
  onSubmit() {
    this.submitted = true;

    if (this.courseForm.invalid) {
      console.error('Formulario inválido. Por favor, revisa los campos.');
      this.courseForm.markAllAsTouched();
      // --- 6. MUESTRA EL ERROR ---
      this.snackbarService.showError('Formulario inválido. Revisa los campos marcados.');
      return;
    }

    // 1. Inicia el estado de carga
    this.isLoading = true;

    // --- 7. FORMDATA SIMPLIFICADO ---
    // Ya no necesitamos construir el FormData aquí para la imagen,
    // ¡porque ya se subió! El formControl 'thumbnail' ya tiene la URL.
    const formValue = this.courseForm.value;

    // Simplemente enviamos el JSON
    console.log('--- Enviando JSON a la API (simulado) ---');
    console.log(formValue);

    const coursePayload = {
      titulo: this.courseForm.get('title')?.value,
      descripcion: this.courseForm.get('shortDescription')?.value,
      precio: 99.99,
      categoriaId: this.courseForm.get('category')?.value,
      adjunto: {
        nombreOriginal: 'thumbnail.jpg',
        tipoArchivo: 'image/jpeg',
        base64: this.courseForm.get('thumbnail')?.value
      }
    };

    // (Tu lógica de servicio ahora enviaría formValue, no formData)
    this.courseService.createCourse(coursePayload).subscribe({
      next: (response) => {
        console.log('Curso creado exitosamente:', response);
        this.isLoading = false;
        this.isPublished = true;
        this.snackbarService.showSuccess('¡Curso creado exitosamente!');
      },
      error: (error) => {
        console.error('Error al crear el curso:', error);
        this.isLoading = false;
        this.snackbarService.showError('Error al crear el curso. Por favor, intenta nuevamente.');
      }
    });

    console.log(coursePayload);

    // --- 8. SIMULACIÓN DE ÉXITO (sin cambios) ---
    /*setTimeout(() => {
      // --- ÉXITO DE LA API ---
      console.log('¡Curso publicado exitosamente!');
      
      this.isLoading = false;
      this.isPublished = true; 
      
      // ¡Mostramos el snackbar de éxito!
      this.snackbarService.showSuccess('¡Curso publicado exitosamente!');

      setTimeout(() => {
        this.router.navigate(['/instructor/dashboard']); 
      }, 2500);

    }, 1500);*/
  }
}