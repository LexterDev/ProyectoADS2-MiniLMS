import { Routes } from '@angular/router';

// Páginas y componentes que usamos en las rutas
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CourseListComponent } from './pages/courses/course-list/course-list.component';
import { DashboardStudentComponent } from './pages/dashboard-student/dashboard-student.component';
import { CourseCreateComponent } from './pages/courses/course-create/course-create.component';
import { DashboardComponent } from './pages/instructor/dashboard/dashboard.component';
import { MyCoursesComponent } from './pages/student/my-courses/my-courses.component';
import { InstructorCoursesComponent } from './pages/instructor/instructor-courses/instructor-courses.component';

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

    // --- RUTA DE LISTADO DE CURSOS ---
    {
        path: 'courses',
        component: CourseListComponent
    },

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
    },
    {
        path: 'courses/create',
        component: CourseCreateComponent

    },

     {
        path: 'instructor/dashboard',
        component: DashboardComponent

    },
    {
        path: 'student/my-courses',
        component: MyCoursesComponent

    },
    {
        path: 'instructor/instructor-courses',
        component: InstructorCoursesComponent

    }

];
