import { Routes } from '@angular/router';

// Páginas y componentes que usamos en las rutas
import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CourseListComponent } from './pages/courses/course-list/course-list.component';
import { DashboardStudentComponent } from './pages/dashboard-student/dashboard-student.component';
import { CourseWizardComponent } from './pages/courses/course-wizard/course-wizard.component';
import { DashboardComponent } from './pages/instructor/dashboard/dashboard.component';
import { MyCoursesComponent } from './pages/student/my-courses/my-courses.component';
import { InstructorCoursesComponent } from './pages/instructor/instructor-courses/instructor-courses.component';
import { CourseDetailsComponent } from './pages/courses/course-details/course-details.component';
import { LessonPlayerComponent } from './pages/courses/course-lessons/lesson-player/lesson-player.component';
import { CoursePlayerComponent } from './pages/student/course-player/course-player.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PaymentConfirmationComponent } from './components/payment-confirmation/payment-confirmation.component';
import { CourseEditComponent } from './pages/instructor/course-edit/course-edit.component';
import { ManageCourseComponent } from './pages/instructor/manage-course/manage-course.component';
import { CategoryManagementComponent } from './pages/admin/category-management/category-management.component';

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
        path: 'student/course/:courseId/lesson/:lessonId',
        component: CoursePlayerComponent,
        title: 'Reproducir Curso - EduByte',
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
        component: CourseWizardComponent,
        title: 'Crear Curso - EduByte',
        canActivate: [authGuard]
    },
    {
        path: 'instructor/edit-course/:id',
        component: CourseEditComponent,
        title: 'Editar Curso - EduByte',
        canActivate: [authGuard]
    },
    {
        path: 'instructor/manage-course/:id',
        component: ManageCourseComponent,
        title: 'Gestionar Contenido - EduByte',
        canActivate: [authGuard]
    },
    {
        path: 'admin/categories',
        component: CategoryManagementComponent,
        title: 'Gestión de Categorías - EduByte',
        canActivate: [authGuard]
    },
    {
        path: 'lesson/:id/:courseId/:sectionId',
        component: LessonPlayerComponent,
        title: 'Reproducir Lección - EduByte',
        canActivate: [authGuard]
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        title: 'Checkout - EduByte',
        canActivate: [authGuard]
    },
    {
        path: 'payment-confirmation',
        component: PaymentConfirmationComponent,
        title: 'Confirmación de Pago - EduByte',
        canActivate: [authGuard]
    }
];
