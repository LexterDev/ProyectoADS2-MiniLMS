import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// 1. Importamos todos los componentes de nuestra landing page
import { HeroComponent } from '../../components/landing/hero/hero.component';
import { StatsComponent } from '../../components/landing/stats/stats.component';
import { CategoriesComponent } from '../../components/landing/categories/categories.component';
import { FeaturedCoursesComponent } from '../../components/landing/featured-courses/featured-courses.component';
import { HowItWorksComponent } from '../../components/landing/how-it-works/how-it-works.component';
import { TestimonialsComponent } from '../../components/landing/testimonials/testimonials.component';
import { CtaComponent } from '../../components/landing/cta/cta.component'; // <-- ¡NUEVO!


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    StatsComponent,
    CategoriesComponent,
    FeaturedCoursesComponent,
    HowItWorksComponent,
    TestimonialsComponent,
    CtaComponent // <-- 2. Lo añadimos aquí
  ],
  templateUrl: './landing.component.html'
  // ¡Sin styleUrl!
})
export class LandingComponent {
  // ¡Perfecto que esté vacío!
  // Este es solo un componente "contenedor".
}

