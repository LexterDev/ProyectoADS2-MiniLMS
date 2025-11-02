import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// ¡Refactorizado! Ya no se usa Angular Material ni FormsModule
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // <-- ¡Usamos Reactive forms!
  ],
  templateUrl: './hero.component.html',
  // ¡Refactorizado! Ya no se usa hero.component.css
  // styleUrl: './hero.component.css' 
})
export class HeroComponent {

  // ¡Refactorizado!
  searchForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // ¡AQUÍ ESTÁ EL ARREGLO!
    // Ahora el FormGroup se inicializa con el control 'query'
    this.searchForm = this.fb.group({
      query: [''] 
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      console.log('Buscando:', this.searchForm.value.query);
    }
  }
}

