import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Testimonial {
  author: string;
  role: string;
  quote: string;
  imageUrl: string;
  rating: number;
  course: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html'
})
export class TestimonialsComponent {

  testimonials: Testimonial[] = [
    {
      author: 'Ana García',
      role: 'Desarrolladora Full Stack',
      quote: 'EduByte me ha ayudado a cambiar completamente mi carrera. Los cursos son excelentes y los instructores muy profesionales. ¡Ahora trabajo en mi empresa soñada!',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      rating: 5,
      course: 'Desarrollo Web Completo'
    },
    {
      author: 'Carlos López',
      role: 'Diseñador UX/UI',
      quote: 'La flexibilidad de EduByte es perfecta para mi estilo de vida. Puedo aprender a mi propio ritmo y desde cualquier lugar. La calidad del contenido es impresionante.',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      rating: 5,
      course: 'Diseño UX/UI Avanzado'
    },
    {
      author: 'Sofía Martínez',
      role: 'Marketing Manager',
      quote: 'Recomiendo EduByte a todos los que quieran adquirir nuevas habilidades. La calidad de los cursos es excepcional y los proyectos prácticos son muy útiles.',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      rating: 5,
      course: 'Marketing Digital'
    },
    {
      author: 'Miguel Fernández',
      role: 'Data Scientist',
      quote: 'Los cursos de Data Science son increíbles. Aprendí Python y Machine Learning desde cero y ahora trabajo en proyectos de IA. ¡Totalmente recomendado!',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      rating: 5,
      course: 'Python para Data Science'
    },
    {
      author: 'Laura Rodríguez',
      role: 'Fotógrafa Profesional',
      quote: 'Las técnicas que aprendí aquí transformaron completamente mi fotografía. Los instructores son verdaderos expertos en el campo.',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
      rating: 5,
      course: 'Fotografía Digital'
    },
    {
      author: 'Diego Sánchez',
      role: 'Emprendedor',
      quote: 'Los cursos de negocios me dieron las herramientas necesarias para lanzar mi startup. La comunidad de EduByte es increíble.',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      rating: 5,
      course: 'Emprendimiento y Negocios'
    }
  ];

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
