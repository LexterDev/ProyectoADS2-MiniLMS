import { Component, OnInit, Injectable, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Importamos los componentes que vamos a usar en esta página
import { CourseFiltersComponent, CourseFilterValues } from '../../../components/filters/course-filters/course-filters.component';
import { CourseCardComponent } from '../../../components/cards/course-card/course-card.component';
import { CoursesService } from '../../../services/courses.service';

// Interfaz para la información de un curso
interface Course {
    id: string;
    imageUrl: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    instructorImageUrl?: string;
    instructor?: string;
}

@Component({
    selector: 'app-course-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        CourseFiltersComponent, 
        CourseCardComponent
    ],
    templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {

    private coursesService = inject(CoursesService);

    newCCoursesList: Course[] = [];

    // Lista completa de cursos
    allCourses: Course[] = [];
    // Lista de cursos filtrados
    filteredCourses: Course[] = [...this.allCourses];

    constructor() { }

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
                course.price === Number(filterValues.price) :
                true;

            // El curso debe coincidir con TODOS los filtros aplicados
            return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
        });
    }

    getAllCourses(): void {
        this.coursesService.getAllCourses(0, 10).subscribe({
            next: (response: any) => {
                console.log('Datos recibidos de la API de cursos:', response);

                // Acceder a la ruta
                const coursesArray = response?.data?.content || [];

                if (!Array.isArray(coursesArray) || coursesArray.length === 0) {
                    console.warn('No se encontraron cursos');
                    this.allCourses = [];
                    this.filteredCourses = [];
                    return;
                }

                // Mapear los cursos
                this.allCourses = coursesArray.map((course: any) => ({
                    id: course.id?.toString() || '',
                    imageUrl: course.adjunto?.url || 'default-product-card.png',
                    title: course.titulo || 'Sin título',
                    description: course.descripcion || 'Sin descripción',
                    category: course.categoriaNombre || 'Sin categoría',
                    level: course.level || 'principiante',
                    price: course.precio,
                    instructorImageUrl: course.instructor?.foto || 'instructor-default.png',
                    instructor: course.instructor?.nombre || 'Sin instructor',
                }));

                // Asignar a filteredCourses DENTRO del subscribe
                this.filteredCourses = [...this.allCourses];

                console.log(`${this.allCourses.length} cursos cargados correctamente`);
                console.log('Cursos:', this.allCourses);
            },
            error: (error) => {
                console.error('Error al cargar cursos:', error);
                this.allCourses = [];
                this.filteredCourses = [];
            }
        });
    }

    ngOnInit(): void {
        this.getAllCourses();
    }
}