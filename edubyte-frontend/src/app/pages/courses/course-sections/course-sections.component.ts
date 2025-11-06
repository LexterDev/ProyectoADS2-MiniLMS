import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Importamos los componentes compartidos que usaremos
import { ButtonComponent } from '../../../components/shared/button/button.component';
import { SnackbarService } from '../../../services/snackbar.service';

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
    ButtonComponent // Importamos nuestro botón reutilizable
  ],
  templateUrl: './course-sections.component.html',
})
export class CourseSectionsComponent implements OnInit {
  
  sectionForm: FormGroup;
  secciones: Section[] = []; // Para la lista de secciones existentes
  cursoId: number = 0;
  submitted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute, 
    private snackbarService: SnackbarService,
    private router: Router
  ) {
    // Inicializamos el formulario con los campos que pediste
    this.sectionForm = this.fb.group({
      titulo: ['', Validators.required],
      orden: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    // 1. Obtenemos el ID del curso desde la URL
    // (El '+' convierte el string 'id' en un número)
    this.cursoId = +this.route.snapshot.paramMap.get('id')!;
    
    // 2. Cargamos las secciones existentes (simulado)
    this.loadSections();
  }

  // Simulación de carga de datos
  loadSections(): void {
    // (Aquí harías tu llamada a la API: this.api.getSections(this.cursoId)...)
    this.secciones = [
      { id: 1, titulo: 'Bienvenida al curso', orden: 1, cursoId: this.cursoId },
      { id: 2, titulo: 'Fundamentos de HTML', orden: 2, cursoId: this.cursoId }
    ];
    
    // Ajustamos el 'orden' del formulario al siguiente número disponible
    this.sectionForm.patchValue({ orden: this.secciones.length + 1 });
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
      ...this.sectionForm.value,
      cursoId: this.cursoId
    };

    console.log('Enviando a API:', payload);

    // Simulamos la llamada a la API
    setTimeout(() => {
      // (Respuesta simulada)
      const newSection: Section = {
        id: Math.floor(Math.random() * 1000), // ID simulado
        ...payload
      };
      
      this.secciones.push(newSection);
      this.secciones.sort((a, b) => a.orden - b.orden); // Re-ordenamos la lista
      
      this.isLoading = false;
      this.submitted = false;
      this.snackbarService.showSuccess('Sección creada exitosamente');
      
      // Reseteamos el formulario para la siguiente sección
      this.sectionForm.reset({
        titulo: '',
        orden: this.secciones.length + 1 // Siguiente número de orden
      });
    }, 1000);
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

  addLesson(sectionId: number): void {
    this.router.navigate(['/instructor/add-lesson', sectionId]);
  }
}