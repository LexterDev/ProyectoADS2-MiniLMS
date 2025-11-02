import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [
    CommonModule,
    RouterLink,        // <-- Para los enlaces del menuItems
    RouterLinkActive   // <-- Para marcar el enlace activo
  ],
  templateUrl: './navbar.component.html'
 
})
export class NavbarComponent {

  private router = inject(Router);
  

  menuItems = [
    { label: 'Inicio', link: '/' },
    { label: 'Cursos', link: '/cursos' },
    { label: 'Instructores', link: '/instructores' },
    { label: 'Comunidad', link: '/comunidad' }
  ];


  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }


  goToLogin() {
    this.router.navigate(['/login']);
  }


  goToRegister() {
    this.router.navigate(['/register']);
  }

}

