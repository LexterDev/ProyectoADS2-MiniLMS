import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  token: string | null = null;
  tokenValid = false;
  checkingToken = true;

  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (this.token) {
        this.validateToken();
      } else {
        this.errorMessage = 'Token de recuperación no encontrado';
        this.checkingToken = false;
      }
    });
  }

  validateToken() {
    if (!this.token) {
      return;
    }

    this.authService.validateResetToken(this.token).subscribe({
      next: (response: any) => {
        this.tokenValid = response.data?.valid || false;
        if (!this.tokenValid) {
          this.errorMessage = 'El enlace de recuperación es inválido o ha expirado';
        }
        this.checkingToken = false;
      },
      error: (error) => {
        console.error('Error validating token:', error);
        this.errorMessage = 'Error al validar el token';
        this.tokenValid = false;
        this.checkingToken = false;
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (confirmPassword?.hasError('mismatch')) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  get f() {
    return this.resetPasswordForm.controls;
  }

  togglePasswordVisibility(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;
    this.successMessage = null;

    if (this.resetPasswordForm.invalid || !this.token) {
      return;
    }

    const nuevaClave = this.resetPasswordForm.get('password')?.value;

    this.authService.resetPassword(this.token, nuevaClave).subscribe({
      next: (response: any) => {
        this.successMessage = 'Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión.';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error resetting password:', error);
        this.errorMessage = error.error?.message || 'Error al restablecer la contraseña. Por favor, inténtalo de nuevo.';
      }
    });
  }
}
