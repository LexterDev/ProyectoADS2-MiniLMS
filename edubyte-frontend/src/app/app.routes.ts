import { Routes } from '@angular/router';

// Páginas y componentes que usamos en las rutas
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CourseListComponent } from './pages/courses/course-list/course-list.component';
import { DashboardStudentComponent } from './pages/dashboard-student/dashboard-student.component';

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
  {
    path: 'courses',
    component: CourseListComponent
  },
  {
    path: 'dashboard-student',
    component: DashboardStudentComponent
  }
];
