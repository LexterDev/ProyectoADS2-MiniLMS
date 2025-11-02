import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Eliminamos MatCardModule

// Interfaz (¡buena práctica de tu compañero!)
interface Stat {
  label: string;
  value: string;
}

@Component({
  selector: 'app-stats',
  standalone: true, // <-- 2. Lo mantenemos standalone
  imports: [
    CommonModule
    // 3. MatCardModule eliminado
  ],
  templateUrl: './stats.component.html'
  // <-- 4. 'styleUrl' eliminado
})
export class StatsComponent {

    // 5. La lógica del compañero se mantiene
    stats: Stat[] = [
     { label: 'Cursos', value: '10,000+' },
     { label: 'Estudiantes', value: '500,000+' },
     { label: 'Instructores', value: '1,000+' }
   ];

}

