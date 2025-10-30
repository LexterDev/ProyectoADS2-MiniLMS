import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/landing/hero/hero.component';
import { StatsComponent } from '../../components/landing/stats/stats.component';

// --- ¡Eventualmente añadiremos estos! ---
// import { CategoriesComponent } from '../../components/landing/categories/categories.component';
// import { FeaturedCoursesComponent } from '../../components/landing/featured-courses/featured-courses.component';
// import { HowItWorksComponent } from '../../components/landing/how-it-works/how-it-works.component';
// import { TestimonialsComponent } from '../../components/landing/testimonials/testimonials.component';
// import { CtaComponent } from '../../components/landing/cta/cta.component';


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,   // <-- ¡AHORA SÍ SE USA!
    StatsComponent   // <-- ¡AHORA SÍ SE USA!

    // CategoriesComponent,
    // FeaturedCoursesComponent,
    // HowItWorksComponent,
    // TestimonialsComponent,
    // CtaComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}

