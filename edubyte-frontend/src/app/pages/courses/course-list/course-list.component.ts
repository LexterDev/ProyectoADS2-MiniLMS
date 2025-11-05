import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <-- ¡IMPORTADO!

// Importamos los componentes que vamos a usar en esta página
import { CourseFiltersComponent, CourseFilterValues } from '../../../components/filters/course-filters/course-filters.component';
import { CourseCardComponent } from '../../../components/cards/course-card/course-card.component';

// Interfaz para la información de un curso
interface Course {
    id: string; // <-- ¡Esto es lo que necesitamos!
    imageUrl: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: 'gratis' | 'pago';
}

@Component({
    selector: 'app-course-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule, // <-- ¡AÑADIDO!
        CourseFiltersComponent, 
        CourseCardComponent    
    ],
    templateUrl: './course-list.component.html'
})
export class CourseListComponent {

    // (Tu lista de cursos y la lógica de 'applyFilters' se quedan exactamente igual)
    
    allCourses: Course[] = [
        { id: '1', imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/08/39/code-1868371_1280.jpg', title: 'Introducción a JavaScript', description: 'Aprende los fundamentos de JavaScript para el desarrollo web.', category: 'Desarrollo Web', level: 'principiante', price: 'gratis' },
        { id: '2', imageUrl: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png', title: 'Diseño UX para Principiantes', description: 'Crea interfaces de usuario intuitivas y atractivas.', category: 'Diseño UX/UI', level: 'principiante', price: 'pago' },
        // ... (etc.)
    ];

    filteredCourses: Course[] = [...this.allCourses];

    constructor() { }

    applyFilters(filterValues: CourseFilterValues): void {
        console.log('Aplicando filtros:', filterValues);
        // ... (lógica de filtrado)
    }
}