import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router'; // <-- 1. IMPORTANTE

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private router = inject(Router);
  

    // ¡Genial! Usaremos este array en el HTML
    menuItems = [
     { label: 'Inicio', link: '/' },
     { label: 'Cursos', link: '/cursos' },
     { label: 'Instructores', link: '/instructores' },
     { label: 'Comunidad', link: '/comunidad' }
    ];

   // Lo quitamos, ya que el estado lo manejará el propio HTML
   // isDarkMode = false; 

   toggleDarkMode() {
    // 3. Esta es la lógica importante:
    // Añade o quita la clase 'dark' del tag <html>
    // para que nuestro CSS pueda reaccionar.
    document.documentElement.classList.toggle('dark');
   }

   goToLogin() {
    this.router.navigate(['/login']);
   }

   goToRegister() {
    this.router.navigate(['/register']);
   }

}

