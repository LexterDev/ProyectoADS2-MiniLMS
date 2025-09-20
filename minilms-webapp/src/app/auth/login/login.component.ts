import { Component, AfterViewInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
// import * as particlesJS from 'particles.js/particles';
import { MatProgressSpinnerModule, ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatIcon
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;
  required: any;
  mode: ProgressSpinnerMode = 'indeterminate';
  color: string = 'secondary';
  loading: boolean = false;
  shouldShakeEmail: boolean = false;
  shouldShakePassword: boolean = false;
  loginFailed: any = {
    loginError: false,
    loginFailedMessage: 'Correo o contraseña incorrectos. Por favor, inténtelo de nuevo.',
  }

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.loginFailed.loginError = false;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          console.log(response);
          this.loading = true; // Set loading to true when the request starts
          if(response.error) {
            this.loading = false; // Set loading to false when the request fails
            
            console.error('Login failed', response.error);
            // Handle login error, e.g., show an error message
            this.loginFailed.loginError = true;            

          } else {
            this.loading = true; // Set loading to false when the request succeeds
            console.log('Login successful', response);
            // Handle successful login, e.g., redirect to another page or show a success message

            this.router.navigate(['/dashboard']);

          }
        },
        error: (error) => {
          this.loading = false; // Set loading to false when the request fails
          console.error('Login failed', error);
          this.loginFailed.loginError = false;
          // Handle login error, e.g., show an error message
        },
      }
      );
    } else {
      console.log('Form is invalid');
    }
  }


   onInputBlur() {
    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');
    if (emailControl && emailControl.invalid && (emailControl.dirty || emailControl.touched)) {
      this.shouldShakeEmail = true;

      // Detenemos la animación después de que termine (300ms es lo que dura la animación)
      setTimeout(() => {
        this.shouldShakeEmail = false;
      }, 300);
    } else if (passwordControl && passwordControl.invalid && (passwordControl.dirty || passwordControl.touched)) {
      this.shouldShakePassword = true;

      // Detenemos la animación después de que termine (300ms es lo que dura la animación)
      setTimeout(() => {
        this.shouldShakePassword = false;
      }, 300);
    }
  }


  redirecToRegister() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/register']);
    });
  }

}
