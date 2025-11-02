import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // <-- Importamos RouterLink y RouterLinkActive

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [
    CommonModule,
    RouterLink,         // <-- Lo añadimos aquí
    RouterLinkActive    // <-- Y este para la "línea morada"
  ],
  templateUrl: './navbar.component.html'
  // No hay styleUrl, usamos Tailwind
})
export class NavbarComponent {

  // Inyectamos el Router para las funciones de navegación
  private router = inject(Router);
  
  // Array de enlaces de navegación
  menuItems = [
     { label: 'Inicio', link: '/' },
     { label: 'Cursos', link: '/courses' }, // <-- ¡CORREGIDO!
     { label: 'Instructores', link: '/instructores' },
     { label: 'Comunidad', link: '/comunidad' }
  ];

  /**
   * Cambia el modo oscuro añadiendo/quitando la clase 'dark' del <html>
   */
  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }

  /**
   * Navega a la página de login.
   * Esta función es llamada por el botón (click) en el HTML.
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }

  /**
   * Navega a la página de registro.
   * Esta función es llamada por el botón (click) en el HTML.
   */
  goToRegister() {
    this.router.navigate(['/register']);
  }

}

