import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html'

})
export class CourseCardComponent {
  
  // Usamos @Input() para que esta tarjeta sea reutilizable.
  // El componente "padre" (FeaturedCourses) le pasará estos datos.
  @Input() imageUrl: string = '';
  @Input() title: string = 'Título del Curso';
  @Input() description: string = 'Descripción del curso no disponible.';

}

