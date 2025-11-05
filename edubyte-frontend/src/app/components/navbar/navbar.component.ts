// src/app/components/navbar/navbar.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// 1. ✅ AÑADE LA IMPORTACIÓN AQUÍ
// (Ajusta la ruta si es diferente)
import { ProfileCardComponent } from '../profile-card/profile-card.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    // 2. ✅ AÑÁDELO AL ARRAY DE IMPORTS
    ProfileCardComponent 
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  // (El resto de tu código .ts va aquí...)
  // ...

  menuItems = [
    { label: 'Inicio', link: '/' },
    { label: 'Cursos', link: '/courses' },
    { label: 'Instructores', link: '/instructors' },
    { label: 'Comunidad', link: '/community' }
  ];

  constructor(private router: Router, private authService: AuthService) { }

  isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
  }
}