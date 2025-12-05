import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable, Subject, map, takeUntil } from 'rxjs';

interface MenuOption {
  label: string;
  route: string;
}

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
export class ProfileCardComponent implements OnInit {
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getUserInfo();
    console.log(this.menuOptions);
    console.log(this.userInformation);
  }

  menuOptions: MenuOption[] = [];
  userInformation: any = {};
  profileImageUrl: string = '';

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }


  getUserInfo() {
    const info = this.authService.getUserInfo();
    if (info) {
      this.userInformation = info;
      if(info.rol === 'INSTRUCTOR') {
        info.rol = 'INSTRUCTOR';
        this.menuOptions.push({ label: 'Dashboard', route: '/dashboard-instructor' });
        this.profileImageUrl = 'instructor-default.png';
      } else if(info.rol === 'ADMINISTRADOR') {
        info.rol = 'ADMINISTRADOR';
        this.menuOptions.push({ label: 'Dashboard', route: '/dashboard-admin' });
        this.profileImageUrl = 'admin-default.png';
      } else if(info.rol === 'ESTUDIANTE') {
        info.rol = 'ESTUDIANTE';
        this.menuOptions.push({ label: 'Dashboard', route: '/dashboard-student' });
        this.profileImageUrl = 'default-student.png';
      }
    }
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
