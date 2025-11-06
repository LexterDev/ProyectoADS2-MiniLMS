import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para @if

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {

  @Input() title: string = "Título";
  
  // --- ✅ ¡AQUÍ ESTÁ LA LÍNEA QUE FALTA! ---
  @Input() value: string | number = "0"; 
  
  @Input() change?: string; // Opcional
  @Input() icon?: string;   // Opcional

  constructor() { }

}