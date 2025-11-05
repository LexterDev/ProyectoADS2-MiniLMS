import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ProfileCardComponent,
    MatButtonModule,
    MatIcon
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  // Inyectamos el AuthService para verificar el estado de autenticación
  private authService = inject(AuthService);

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

  isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  

}

