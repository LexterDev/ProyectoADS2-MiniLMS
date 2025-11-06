// sidebar-instructor.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar-instructor',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-instructor.component.html',
  styleUrls: ['./sidebar-instructor.component.css']
})
export class SidebarInstructorComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isSidebarOpen = false;
  userInformation = this.getUserInfo();

  getUserInfo() {
    return this.authService.getUserInfo();
  }
  
  instructor = {
    name: this.userInformation?.nombre || 'Instructor Nombre',
    role: this.userInformation?.rol || 'Instructor',
    avatar: this.userInformation?.avatar || 'instructor-default.png'
  };

  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard-instructor',
      active: true
    },
    {
      icon: 'courses',
      label: 'Mis Cursos',
      route: '/instructor/instructor-courses'
    },
    {
      icon: 'create',
      label: 'Crear Curso',
      route: '/courses/create'
    },
    {
      icon: 'messages',
      label: 'Mensajes/Q&A',
      route: '/instructor/messages'
    },
    {
      icon: 'analytics',
      label: 'Analytics',
      route: '/instructor/analytics'
    },
    {
      icon: 'income',
      label: 'Ingresos',
      route: '/instructor/income'
    },
    {
      icon: 'settings',
      label: 'Configuración',
      route: '/instructor/settings'
    }
  ];

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  logout(): void {
    this.authService.logout();
  }
}