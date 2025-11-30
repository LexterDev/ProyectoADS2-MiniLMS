import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  resetToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Inicializamos el formulario con validaciones
    this.forgotPasswordForm = this.fb.group({
      // El campo 'email' es requerido y debe tener formato de email
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // Getter para acceder fácilmente a los controles del formulario en el template
  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.resetToken = null;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const correo = this.forgotPasswordForm.get('email')?.value;

    this.authService.forgotPassword(correo).subscribe({
      next: (response: any) => {
        this.successMessage = 'Se ha enviado un enlace de recuperación a tu correo electrónico.';

        // For development: show the token
        if (response.data && response.data.token) {
          this.resetToken = response.data.token;
          console.log('Reset token:', this.resetToken);
          console.log('Reset link:', `http://localhost:4200/auth/reset-password?token=${this.resetToken}`);
        }
      },
      error: (error) => {
        console.error('Error en forgot password:', error);
        this.errorMessage = 'Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.';
      }
    });
  }

  navigateToResetPassword() {
    if (this.resetToken) {
      this.router.navigate(['/auth/reset-password'], { queryParams: { token: this.resetToken } });
    }
  }
}

