import { Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { LoginComponent } from './auth/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
