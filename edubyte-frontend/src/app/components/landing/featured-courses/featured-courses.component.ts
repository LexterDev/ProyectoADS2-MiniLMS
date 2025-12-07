import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Course {
  imageUrl: string;
  title: string;
  description: string;
  instructor: string;
  rating: number;
  studentsCount: number;
  price: number;
  category: string;
}

@Component({
  selector: 'app-featured-courses',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './featured-courses.component.html'
})
export class FeaturedCoursesComponent {

  currentSlide = 0;

  featuredCourses: Course[] = [
    {
      imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
      title: "Desarrollo Web Completo con Angular y Node.js",
      description: "Aprende a crear aplicaciones web modernas desde cero con las tecnologías más demandadas.",
      instructor: "Carlos Martínez",
      rating: 4.8,
      studentsCount: 1250,
      price: 59.99,
      category: "Programación"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
      title: "Diseño UX/UI Avanzado con Figma",
      description: "Domina las herramientas y técnicas de diseño centradas en el usuario para crear experiencias increíbles.",
      instructor: "Ana García",
      rating: 4.9,
      studentsCount: 890,
      price: 49.99,
      category: "Diseño"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      title: "Marketing Digital para Principiantes",
      description: "Descubre las estrategias clave para impulsar tu negocio en línea y alcanzar a tu audiencia ideal.",
      instructor: "Jorge López",
      rating: 4.7,
      studentsCount: 2100,
      price: 39.99,
      category: "Marketing"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
      title: "Python para Data Science y Machine Learning",
      description: "Conviértete en científico de datos dominando Python, análisis y algoritmos de machine learning.",
      instructor: "María Rodríguez",
      rating: 4.9,
      studentsCount: 1580,
      price: 69.99,
      category: "Data Science"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=600&h=400&fit=crop",
      title: "Fotografía Digital Profesional",
      description: "Aprende las técnicas profesionales de fotografía y edición para capturar imágenes impactantes.",
      instructor: "Pedro Sánchez",
      rating: 4.8,
      studentsCount: 720,
      price: 54.99,
      category: "Fotografía"
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
      title: "Emprendimiento y Gestión de Negocios",
      description: "Desarrolla las habilidades esenciales para lanzar y gestionar tu propio negocio exitoso.",
      instructor: "Laura Fernández",
      rating: 4.6,
      studentsCount: 1420,
      price: 44.99,
      category: "Negocios"
    }
  ];

  get visibleCourses(): Course[] {
    return this.featuredCourses.slice(this.currentSlide, this.currentSlide + 3);
  }

  get canGoNext(): boolean {
    return this.currentSlide < this.featuredCourses.length - 3;
  }

  get canGoPrev(): boolean {
    return this.currentSlide > 0;
  }

  nextSlide(): void {
    if (this.canGoNext) {
      this.currentSlide++;
    }
  }

  prevSlide(): void {
    if (this.canGoPrev) {
      this.currentSlide--;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}

