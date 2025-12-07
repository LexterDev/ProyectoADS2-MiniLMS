import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isUserLoggedIn()) {
    return true;
  } else {
    // Si ya está logeado, redirigir según el rol
    const userRole = authService.getUserRole();
    
    switch(userRole) {
      case 'INSTRUCTOR':
        router.navigate(['/dashboard-instructor']);
        break;
      case 'ESTUDIANTE':
        router.navigate(['/dashboard-student']);
        break;
      case 'ADMINISTRADOR':
        router.navigate(['/admin/dashboard']);
        break;
      default:
        router.navigate(['/']);
    }
    
    return false;
  }
};