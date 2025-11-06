import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// 1. Importamos la tarjeta que acabamos de crear
import { CourseCardComponent } from '../../cards/course-card/course-card.component';

// 2. Definimos una interfaz para la data del curso
interface Course {
  imageUrl: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-featured-courses',
  standalone: true,
  imports: [
    CommonModule,
    CourseCardComponent // 3. Añadimos la tarjeta a los imports
  ],
  templateUrl: './featured-courses.component.html'
  // ¡Sin styleUrl!
})
export class FeaturedCoursesComponent {

  // 4. Creamos un array de cursos de ejemplo
  featuredCourses: Course[] = [
    {
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNmQ9MVdwXfj9buUq7UnjzK8cLCpOoHzujOnCTQ9HaJtqe3Qoq2PCbzeJxv-OfxSEPYzZ8ZsVmwlCFrnOnqPeR3T_3uMZNFWdWfHagDXq2RMg2uyFNi7v45z92vy6LtauYCyoJVfsql3oaRZQml9H1rRGp0UVS2TwKOMlFnf2pPBPwgMJDQizt4FlvaCpKQGp3ZueymEn2J5LoXoWzVclEe0GGG1AmRY_N1NwxtWTMvWxxnWy-sQy5WohMT2n4Iu_cAiTEbGF_Qx0",
      title: "Desarrollo web completo",
      description: "Aprende a crear aplicaciones web modernas desde cero."
    },
    {
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA362_T9-3ZgbnPzyrOZrxzgch8gn8qVxSwVFKxM6m5k4MLA6zzuz7pcknEDDxiXNmxI5nPJRiUJvaQVc2UiF0j2zOUd0ErsFy5Ej0KOdLn7-RrxpWgVuosIEimx0Abuh_ioCqQNEX1RB-72a0eAsXC4bLyB307x0_QaMKV8AvaBcPhHvASLp8E-WwrVVr7URj3i0AL6niDtyKwnc0btd2b2CHtJ93xG5xOJ0H_DT4BqaxlD3CDXHYhuS9pIkgKotrDUWPaASsmlmM",
      title: "Diseño UX/UI avanzado",
      description: "Domina las herramientas y técnicas de diseño centradas en el usuario."
    },
    {
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCCQvHJYzHbFtRozxi60c371_3wlkdG2PybtXMF5YoA_7tDxCIdVNP5V0b6ZMsqMFJisGWoh1i6nkHqqkt3O1mdMRWnEX6z5tJOPgeQFAOVcY8AtEAFxus-4tCJsJ_V059CqbFEoAbFZQ9ocQY3KoWBBqeJkmmk9X7paQbiIwx_TY5G9kPlqGt1bEqO2V1TXnFirM98K1AsmuIoZT01zHvDvH1pXu8wjmPy3JtJfXnjCERDIk3jwHQ9AUFtkOcGq2WLAf9qeVs9Y4",
      title: "Marketing digital para principiantes",
      description: "Descubre las estrategias clave para impulsar tu negocio en línea."
    }
  ];
}

