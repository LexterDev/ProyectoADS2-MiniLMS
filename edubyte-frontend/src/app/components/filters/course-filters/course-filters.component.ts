import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

// Interfaz para definir la estructura de los valores del filtro
export interface CourseFilterValues {
  search?: string | null;
  category?: string | null;
  level?: string | null;
  price?: string | null;
}

@Component({
  selector: 'app-course-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // Necesario para [formGroup]
  ],
  templateUrl: './course-filters.component.html'
  // No hay styleUrl, usamos Tailwind
})
export class CourseFiltersComponent implements OnInit, OnDestroy {
  
  // 1. Formulario Reactivo
  filtersForm: FormGroup;
  
  // 2. Event Emitter para notificar al componente "padre"
  // Este @Output() enviará los nuevos valores del filtro cada vez que cambien.
  @Output() filterChange = new EventEmitter<CourseFilterValues>();

  // 3. Subject para manejar la desuscripción de observables
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    // Inicializamos el formulario
    this.filtersForm = this.fb.group({
      search: [''],
      category: ['todos'],
      level: ['todos'],
      price: ['todos']
    });
  }

  ngOnInit(): void {
    // 4. Lógica de "autoguardado"
    // Escuchamos CUALQUIER cambio en CUALQUIER campo del formulario.
    this.filtersForm.valueChanges.pipe(
      // Esperamos 300ms después de que el usuario deja de teclear
      debounceTime(300),
      // Nos aseguramos de que el observable se destruya cuando el componente se destruya
      takeUntil(this.destroy$)
    ).subscribe(values => {
      // 5. Emitimos los valores al componente padre (CourseListComponent)
      this.filterChange.emit(values as CourseFilterValues);
    });
  }

  ngOnDestroy(): void {
    // 6. Limpiamos la suscripción para evitar fugas de memoria
    this.destroy$.next();
    this.destroy$.complete();
  }
}

