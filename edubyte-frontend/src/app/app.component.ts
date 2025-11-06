import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // <-- ¡IMPORTANTE!

// ¡AQUÍ ESTÁ LA MAGIA!
// Importamos el componente del navbar
import { NavbarComponent } from './components/navbar/navbar.component'; 
// Importamos el del footer para el futuro
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true, // <-- Debe ser standalone
  
  // ¡AQUÍ ESTÁ LA SOLUCIÓN!
  // Añadimos NavbarComponent y RouterOutlet a los imports
  imports: [
    CommonModule, 
    RouterOutlet, // <-- Necesario para que funcionen las rutas
    NavbarComponent, // <-- ¡Soluciona el error NG8001!
    FooterComponent  // <-- Lo añadimos para el siguiente paso
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'edubyte-frontend';
}
