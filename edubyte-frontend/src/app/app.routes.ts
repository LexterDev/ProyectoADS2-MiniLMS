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
        path: 'dashboard-instructor',
        component: DashboardComponent

    },
    {
        path: 'student/my-courses',
        component: MyCoursesComponent

    },
    {
        path: 'instructor/instructor-courses',
        component: InstructorCoursesComponent

    },
    {
        path: 'course-details/:id',
        component: CourseDetailsComponent
    },
    {
        path: 'instructor/add-section/:courseId',
        component: CourseSectionsComponent
    },
    {
        path: 'instructor/add-lesson/:courseId/:sectionId',
        component: CourseLessonsComponent
    },
    {
        path: 'lesson/:id',
        component: LessonPlayerComponent,
        title: 'Reproducir Lección - EduByte'
    }
];
