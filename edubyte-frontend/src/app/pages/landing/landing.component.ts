import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/landing/hero/hero.component';
import { StatsComponent } from '../../components/landing/stats/stats.component';



@Component({
  selector: 'app-landing',
  imports: [NavbarComponent, HeroComponent, StatsComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

}
