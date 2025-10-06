import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { IonButton, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { logoIonic } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-landing-menu',
  templateUrl: './landing-menu.component.html',
  styleUrls: ['./landing-menu.component.scss'],
  imports: [
    IonButton,
    IonHeader,
    IonToolbar,
    IonIcon,
    CommonModule
  ]
})
export class LandingMenuComponent  implements OnInit {

   menuItems = [
    { label: 'Home', route: '/home', active: true },
    { label: 'About Us', route: '/about' },
    { label: 'Courses', route: '/courses' },
    { label: 'Pages', route: '/pages' },
    { label: 'Blog', route: '/blog' },
    { label: 'Contact', route: '/contact' }
  ];

  isMenuOpen = false;

  constructor(private router: Router) {
    addIcons({ logoIonic });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.isMenuOpen = false; // Cerrar menú mobile después de navegación
  }

  createAccount() {
    this.router.navigate(['/create-account']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit() {}

  

}
