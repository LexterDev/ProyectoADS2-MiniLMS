import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  FormArray
} from '@angular/forms';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
  ],
  templateUrl: './course-create.component.html'
})
export class CourseCreateComponent implements OnInit {

  // --- Propiedades del Formulario ---
  courseForm!: FormGroup;
  submitted = false;

  // --- Propiedades del Stepper Personalizado ---
  currentStep: number = 1;
  
  // Array para construir el stepper visual
  steps = [
    { label: 'Información Básica', form: 'info' },
    { label: 'Objetivos', form: 'objectives' },
    { label: 'Contenido', form: 'content' },
    { label: 'Precio', form: 'price' },
    { label: 'Configuración', form: 'config' },
    { label: 'Publicación', form: 'publish' }
  ];
  
  totalSteps: number = this.steps.length;

  // --- Estado de UI y Vistas Previas ---
  progressPercentage = 0;
  currentStepLabel = 'Paso 1 de 6'; // Se actualizará en updateProgress

  // ... (imágenes y videos sin cambios)
  imagePreviewUrl: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;
  videoPreviewUrl: string | null = null; 
  selectedVideoFile: File | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
    this.updateProgress(); 
  }

  private initializeForm(): void {
    // Usamos los 'form' del array 'steps' para construir el FormGroup
    this.courseForm = this.fb.group({
      info: this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        subtitle: ['', [Validators.required]],
        shortDescription: ['', [Validators.required]],
        longDescription: ['', [Validators.required]],
        category: ['', [Validators.required]],
        subcategory: ['', [Validators.required]],
        level: ['', [Validators.required]],
        language: ['', [Validators.required]],
        thumbnail: [null, [Validators.required]],
        promoVideo: [null] 
      }),
      objectives: this.fb.group({
        learningObjectives: this.fb.array(
          [this.fb.control('', Validators.required)],
          Validators.minLength(1)
        )
      }),
      content: this.fb.group({}), // Placeholder
      price: this.fb.group({}),   // Placeholder
      config: this.fb.group({}),  // Placeholder
      publish: this.fb.group({}) // Placeholder
    });
  }

  // --- Getters (sin cambios) ---
  get infoForm(): FormGroup { return this.courseForm.get('info') as FormGroup; }
  get objectivesForm(): FormGroup { return this.courseForm.get('objectives') as FormGroup; }
  get f_info() { return this.infoForm.controls; }
  get learningObjectives(): FormArray {
    return this.objectivesForm.get('objectives') as FormArray;
  }

  // --- Métodos FormArray (sin cambios) ---
  addObjective(): void { this.learningObjectives.push(this.fb.control('', Validators.required)); }
  removeObjective(index: number): void { if (this.learningObjectives.length > 1) { this.learningObjectives.removeAt(index); } }

  // --- Métodos Carga Archivos (sin cambios) ---
  onImageSelected(event: any): void { /* ...lógica idéntica... */ 
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.selectedImageFile = file;
      this.infoForm.patchValue({ thumbnail: file });
      this.infoForm.get('thumbnail')?.markAsTouched();
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onVideoSelected(event: any): void { /* ...lógica idéntica... */ 
    const fileList = (event.target as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.selectedVideoFile = file;
      this.videoPreviewUrl = file.name;
      this.infoForm.patchValue({ promoVideo: file });
    }
  }

  // --- Métodos del Stepper y Progreso (¡ACTUALIZADOS!) ---

  /**
   * Navega al siguiente paso, validando el actual.
   */
  nextStep(): void {
    this.submitted = true;
    
    // 1. Obtener el nombre del form group actual
    const currentFormName = this.steps[this.currentStep - 1].form;
    const currentFormGroup = this.courseForm.get(currentFormName) as FormGroup;

    // 2. Validar solo ese form group
    if (currentFormGroup.invalid) {
      currentFormGroup.markAllAsTouched(); // Marcar errores solo en este paso
      this.scrollToTop();
      return; // No avanza si el paso actual es inválido
    }

    // 3. Avanzar si es válido
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateProgress();
      this.scrollToTop();
      this.submitted = false; // Resetea 'submitted' al avanzar
    }
  }

  /**
   * Regresa al paso anterior.
   */
  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
      this.scrollToTop();
    }
  }
  
  /**
   * (NUEVO) Permite navegar a un paso anterior haciendo clic en el stepper.
   * Solo permite ir hacia atrás, no hacia adelante.
   */
  goToStep(stepNumber: number): void {
    // Solo permite ir a un paso anterior (o al actual, sin efecto)
    if (stepNumber < this.currentStep) {
      this.currentStep = stepNumber;
      this.updateProgress();
      this.scrollToTop();
    }
  }

  private updateProgress(): void {
    this.progressPercentage = Math.round(((this.currentStep -1) / (this.totalSteps - 1)) * 100);
    // Corrección: El progreso es 0% en el paso 1 y 100% en el paso 6.
    
    this.currentStepLabel = `Paso ${this.currentStep} de ${this.totalSteps}`;
  }

  private scrollToTop(): void {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }

  /**
   * (ACTUALIZADO) Se ejecuta al hacer clic en el botón final "Guardar y Publicar".
   */
  onSubmit(): void {
    this.submitted = true;
    this.courseForm.markAllAsTouched(); 

    if (this.courseForm.invalid) {
      console.error('Formulario inválido. Revisa los pasos.');
      
      // (MEJORADO) Ir al primer paso que tenga un error
      for (let i = 0; i < this.steps.length; i++) {
        const formName = this.steps[i].form;
        if (this.courseForm.get(formName)!.invalid) {
          this.currentStep = i + 1; // i + 1 es el número del paso
          this.updateProgress();
          this.scrollToTop();
          return; // Detenerse en el primer paso inválido
        }
      }
      return;
    }

    console.log('Formulario enviado exitosamente!');
    console.log('Valor del formulario:', this.courseForm.value);
  }
}