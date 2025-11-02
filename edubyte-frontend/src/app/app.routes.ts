import { Routes } from '@angular/router';

// Páginas y componentes que usamos en las rutas
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

// ¡NUESTRO NUEVO COMPONENTE DE PÁGINA!
import { CourseListComponent } from './pages/courses/course-list/course-list.component'; 

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { 
    path: 'register', 
    component: RegisterComponent 
  },
  { 
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  
  // --- NUEVA RUTA AÑADIDA ---
  // Cuando alguien visite 'http://localhost:4200/courses'
  // Angular cargará el CourseListComponent.
  {
    path: 'courses',
    component: CourseListComponent
  }
];
