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
import { CourseDetailsComponent } from './pages/courses/course-details/course-details.component';
import { CourseSectionsComponent } from './pages/courses/course-sections/course-sections.component';
import { CourseLessonsComponent } from './pages/courses/course-lessons/course-lessons.component';
import { LessonPlayerComponent } from './pages/courses/course-lessons/lesson-player/lesson-player.component';

// Guards
import { authGuard } from './auth/auth.guard';
import { noAuthGuard } from './auth/no-auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: LandingComponent
    },
    // Rutas públicas (solo accesibles si NO estás logeado)
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [noAuthGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [noAuthGuard]
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        canActivate: [noAuthGuard]
    },

    // Rutas públicas (accesibles para todos)
    {
        path: 'courses',
        component: CourseListComponent
    },
    {
        path: 'course-details/:id',
        component: CourseDetailsComponent
    },

    // Rutas protegidas (requieren autenticación)
    {
        path: 'dashboard-student',
        component: MyCoursesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'student/my-courses',
        component: MyCoursesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'dashboard-instructor',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: 'instructor/instructor-courses',
        component: InstructorCoursesComponent,
        canActivate: [authGuard]
    },
    {
        path: 'courses/create',
        component: CourseCreateComponent,
        canActivate: [authGuard]
    },
    {
        path: 'instructor/add-section/:courseId',
        component: CourseSectionsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'instructor/add-lesson/:courseId/:sectionId',
        component: CourseLessonsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'lesson/:id/:courseId/:sectionId',
        component: LessonPlayerComponent,
        title: 'Reproducir Lección - EduByte',
        canActivate: [authGuard]
    }
];
