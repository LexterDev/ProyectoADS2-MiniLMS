import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importamos los componentes que vamos a usar en esta página
// ¡RUTAS CORREGIDAS! (Cambiamos ../../ por ../../../)
import { CourseFiltersComponent, CourseFilterValues } from '../../../components/filters/course-filters/course-filters.component';
import { CourseCardComponent } from '../../../components/cards/course-card/course-card.component';

// Interfaz para la información de un curso (similar a la que pasamos a CourseCard)
interface Course {
    id: string;
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
        CourseFiltersComponent, // El componente de filtros
        CourseCardComponent     // El componente de tarjeta de curso
    ],
    templateUrl: './course-list.component.html'
})
export class CourseListComponent {

    // Lista completa de cursos (simulamos que viene de una API)
    allCourses: Course[] = [
        { id: '1', imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/08/39/code-1868371_1280.jpg', title: 'Introducción a JavaScript', description: 'Aprende los fundamentos de JavaScript para el desarrollo web.', category: 'Desarrollo Web', level: 'principiante', price: 'gratis' },
        { id: '2', imageUrl: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png', title: 'Diseño UX para Principiantes', description: 'Crea interfaces de usuario intuitivas y atractivas.', category: 'Diseño UX/UI', level: 'principiante', price: 'pago' },
        { id: '3', imageUrl: 'https://cdn.pixabay.com/photo/2016/09/24/04/09/digital-marketing-1691238_1280.jpg', title: 'SEO Avanzado y Estrategias', description: 'Optimiza tu web para motores de búsqueda y genera tráfico.', category: 'Marketing Digital', level: 'avanzado', price: 'pago' },
        { id: '4', imageUrl: 'https://cdn.pixabay.com/photo/2017/03/30/17/02/programming-2189179_1280.jpg', title: 'Machine Learning con Python', description: 'Explora algoritmos de ML y construye modelos predictivos.', category: 'Ciencia de Datos', level: 'intermedio', price: 'pago' },
        { id: '5', imageUrl: 'https://cdn.pixabay.com/photo/2016/03/09/10/37/startup-1246603_1280.jpg', title: 'Fundamentos de Emprendimiento', description: 'Lanza tu startup con éxito y escala tu negocio.', category: 'Negocios', level: 'principiante', price: 'gratis' },
        { id: '6', imageUrl: 'https://cdn.pixabay.com/photo/2016/06/13/18/25/people-1454553_1280.jpg', title: 'Inglés para Viajeros', description: 'Aprende frases clave y conversa con confianza.', category: 'Idiomas', level: 'principiante', price: 'gratis' },
        { id: '7', imageUrl: 'https://cdn.pixabay.com/photo/2017/03/24/13/46/coding-2171120_1280.jpg', title: 'Desarrollo Frontend con React', description: 'Construye interfaces de usuario modernas con React y Redux.', category: 'Desarrollo Web', level: 'intermedio', price: 'pago' },
        { id: '8', imageUrl: 'https://cdn.pixabay.com/photo/2017/07/03/17/36/graphic-design-2467885_1280.jpg', title: 'Sketch & Figma Masterclass', description: 'Domina las herramientas líderes de diseño UI/UX.', category: 'Diseño UX/UI', level: 'avanzado', price: 'pago' },
    ];

    // Lista de cursos filtrados que se mostrará en el HTML
    filteredCourses: Course[] = [...this.allCourses]; // Inicialmente muestra todos los cursos

    constructor() { }

    // Este método se llamará cuando el CourseFiltersComponent emita un cambio
    applyFilters(filterValues: CourseFilterValues): void {
        console.log('Aplicando filtros:', filterValues);

        // Filtramos la lista completa de cursos
        this.filteredCourses = this.allCourses.filter(course => {
            // 1. Filtro por búsqueda textual
            const matchesSearch = filterValues.search ?
                course.title.toLowerCase().includes(filterValues.search.toLowerCase()) ||
                course.description.toLowerCase().includes(filterValues.search.toLowerCase()) :
                true;

            // 2. Filtro por categoría
            const matchesCategory = filterValues.category && filterValues.category !== 'todos' ?
                course.category === filterValues.category :
                true;

            // 3. Filtro por nivel
            const matchesLevel = filterValues.level && filterValues.level !== 'todos' ?
                course.level === filterValues.level :
                true;

            // 4. Filtro por precio
            const matchesPrice = filterValues.price && filterValues.price !== 'todos' ?
                course.price === filterValues.price :
                true;

            // El curso debe coincidir con TODOS los filtros aplicados
            return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
        });
    }
}

