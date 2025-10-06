import { Component, OnInit } from '@angular/core';
import { IonCol, IonGrid, IonRow, IonText } from '@ionic/angular/standalone';


@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss'],
  imports: [
    IonGrid,
    IonRow,
    IonCol,
    IonText
  ]
})
export class HeroSectionComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
