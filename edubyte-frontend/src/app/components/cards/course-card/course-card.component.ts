import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// --- 1. IMPORTAMOS EL BOTÓN DE INSCRIPCIÓN ---
import { EnrollButtonComponent } from '../../enroll-button/enroll-button.component';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    EnrollButtonComponent // <-- 2. LO AÑADIMOS A LOS IMPORTS
  ],
  templateUrl: './course-card.component.html'
})
export class CourseCardComponent {

  // --- 3. DEFINIMOS LOS INPUTS ---
  @Input() imageUrl: string = 'https://placehold.co/600x400/f7f6f8/e9e5f0?text=?';
  @Input() title: string = 'Título del Curso';
  @Input() description: string = 'Descripción no disponible.';
  
  // --- 4. AÑADIMOS LOS INPUTS NUEVOS ---
  @Input() courseId: string = ''; // ID para el botón y el enlace
  @Input() courseName: string = ''; // Nombre para el modal de confirmación

  constructor() { }
}