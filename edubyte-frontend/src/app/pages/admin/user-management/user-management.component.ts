import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { SnackbarService } from '../../../services/snackbar.service';
import { AdminService, User } from '../../../services/admin.service';
import { ConfirmationDialogComponent } from '../../../components/shared/confirmation-dialog/confirmation-dialog.component';
import { CreateUserDialogComponent } from '../../../components/shared/create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private dialog = inject(MatDialog);
  private snackbarService = inject(SnackbarService);
  private adminService = inject(AdminService);

  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  searchQuery = '';
  selectedRole = 'TODOS';

  roles = [
    { value: 'TODOS', label: 'Todos los Roles' },
    { value: 'Estudiante', label: 'Estudiantes' },
    { value: 'Instructor', label: 'Instructores' },
    { value: 'Administrador', label: 'Administradores' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.users = response.data;
          this.filteredUsers = [...this.users];
        } else {
          this.snackbarService.showError('Error al cargar usuarios');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.snackbarService.showError('Error al cargar la lista de usuarios');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchQuery ||
        user.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.apellido.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.correo.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesRole = this.selectedRole === 'TODOS' || user.rol.codigo === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  openCreateUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.createUser(result).subscribe({
          next: (response: any) => {
            if (response.data) {
              this.snackbarService.showSuccess('Usuario creado exitosamente');
              this.loadUsers(); // Reload the user list
            } else {
              this.snackbarService.showError('Error al crear el usuario');
            }
          },
          error: (error) => {
            console.error('Error creating user:', error);
            const errorMsg = error.error?.message || 'Error al crear el usuario';
            this.snackbarService.showError(errorMsg);
          }
        });
      }
    });
  }

  toggleUserStatus(user: User): void {
    const isActive = user.estado.codigo === 'ACT';
    const action = isActive ? 'desactivar' : 'activar';
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} Usuario`,
        message: `¿Estás seguro de que deseas ${action} a ${user.nombre} ${user.apellido}?`,
        confirmText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.toggleUserStatus(user.id).subscribe({
          next: (response: any) => {
            if (response.data) {
              user.estado = response.data.estado;
              const newIsActive = user.estado.codigo === 'ACT';
              this.snackbarService.showSuccess(
                `Usuario ${newIsActive ? 'activado' : 'desactivado'} exitosamente`
              );
            } else {
              this.snackbarService.showError('Error al actualizar el estado del usuario');
            }
          },
          error: (error) => {
            console.error('Error toggling user status:', error);
            this.snackbarService.showError('Error al cambiar el estado del usuario');
          }
        });
      }
    });
  }

  getRoleColor(rol: string): string {
    switch (rol) {
      case 'Administrador':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'Instructor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Estudiante':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  }

  getRoleLabel(rol: string): string {
    return rol;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
