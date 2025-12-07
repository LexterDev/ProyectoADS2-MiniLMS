import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AdminService, AdminStats } from '../../../services/admin.service';
import { SnackbarService } from '../../../services/snackbar.service';

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {
  private router = inject(Router);
  private adminService = inject(AdminService);
  private snackbarService = inject(SnackbarService);

  loading = false;
  stats: AdminStats = {
    totalUsers: 0,
    totalCourses: 0,
    totalCategories: 0,
    activeEnrollments: 0,
    totalInstructors: 0,
    totalStudents: 0
  };

  quickActions: QuickAction[] = [
    {
      title: 'Gestión de Categorías',
      description: 'Administrar categorías de cursos con iconos y colores',
      icon: 'category',
      route: '/admin/categories',
      color: 'bg-purple-500'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Ver, activar o desactivar usuarios del sistema',
      icon: 'people',
      route: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Gestión de Cursos',
      description: 'Supervisar y administrar todos los cursos',
      icon: 'school',
      route: '/admin/courses',
      color: 'bg-green-500'
    },
    {
      title: 'Reportes',
      description: 'Ver estadísticas y reportes del sistema',
      icon: 'analytics',
      route: '/admin/reports',
      color: 'bg-orange-500'
    }
  ];

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading = true;
    this.adminService.getAdminStats().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.stats = response.data;
        } else {
          this.snackbarService.showError('Error al cargar estadísticas');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.snackbarService.showError('Error al cargar estadísticas del sistema');
        this.loading = false;
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
