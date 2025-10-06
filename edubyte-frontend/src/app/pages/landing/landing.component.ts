import { Component, OnInit } from '@angular/core';

import { LandingMenuComponent } from 'src/app/components/landing-menu/landing-menu.component';
import { HeroSectionComponent } from 'src/app/components/hero-section/hero-section.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [
    LandingMenuComponent,
    HeroSectionComponent
  ]
})
export class LandingComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
