import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- 1. IMPORTAR ROUTERMODULE

// Definimos los tipos de botón que aceptaremos
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // <-- 2. AÑADIR A IMPORTS
  ],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  
  @Input() variant: ButtonVariant = 'primary';
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() fullWidth: boolean = false;

  // --- 3. AÑADIR ESTE NUEVO INPUT ---
  @Input() routerLink: string | any[] | null | undefined = null;

  // (El método getButtonClasses() se queda exactamente igual)
  public getButtonClasses(): string {
    let classes = 'flex items-center justify-center rounded-lg h-10 px-5 text-sm font-bold shadow-sm transition-all ';

    if (this.disabled || this.isLoading) {
      classes += 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed ';
    } else {
      switch (this.variant) {
        case 'primary':
          classes += 'bg-primary text-white hover:bg-primary/90 ';
          break;
        case 'secondary':
          classes += 'bg-primary/10 text-primary dark:bg-primary/20 hover:bg-primary/20 ';
          break;
        case 'danger':
          classes += 'bg-red-600 text-white hover:bg-red-700 ';
          break;
        case 'ghost':
          classes += 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ';
          break;
      }
    }
    
    if (this.fullWidth) {
      classes += 'w-full ';
    }

    return classes;
  }
}