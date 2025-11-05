import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile-card',
  imports: [
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,

  ],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent {
  
  constructor(private authService: AuthService, private router: Router) {}

  userInformation: any = {
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    avatar: 'default-student.png',
    rol: 'Estudiante'
  };

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
