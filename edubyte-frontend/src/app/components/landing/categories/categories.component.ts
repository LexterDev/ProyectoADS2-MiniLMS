import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html'
  // ¡Sin styleUrl!
})
export class CategoriesComponent {
  
  // Array de categorías que mostraremos
  categories: string[] = [
    'Desarrollo web',
    'Diseño UX/UI',
    'Marketing digital',
    'Ciencia de datos',
    'Negocios',
    'Idiomas'
  ];

}

