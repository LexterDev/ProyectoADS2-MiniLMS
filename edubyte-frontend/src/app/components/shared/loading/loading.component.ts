// src/app/components/shared/loading/loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  @Input() text: string = 'Cargando...'; // Texto opcional
}