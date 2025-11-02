import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common'; // CommonModule incluye NgClass
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,        // <-- Incluye *ngIf, *ngFor, [ngClass], etc.
    ReactiveFormsModule, // <-- Para [formGroup]
    RouterLink           // <-- Para [routerLink]
  ],
  templateUrl: './register.component.html'

})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  passwordStrengthClass: string = ''; 

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: ['Estudiante'], // Valor por defecto
      terms: [false, [Validators.requiredTrue]] // El checkbox debe ser true
    }, {
      // Validador de grupo para comparar contraseñas
      validators: this.passwordMatchValidator
    });

    // Escuchamos los cambios en el campo de contraseña para actualizar el indicador
    this.f['password'].valueChanges.subscribe(value => {
      this.updatePasswordStrength(value);
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Validador personalizado para asegurar que las contraseñas coincidan
   */
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

  /**
   * Actualiza la variable de clase basada en la fortaleza de la contraseña
   */
  updatePasswordStrength(password: string) {
    if (!password) {
      this.passwordStrengthClass = '';
      return;
    }
    
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);
    
    let strength = 0;
    if (hasLetters) strength++;
    if (hasNumbers) strength++;
    if (hasSymbols) strength++;
    
    if (password.length < 8) {
      this.passwordStrengthClass = 'password-strength-weak';
    } else if (strength === 3) {
      this.passwordStrengthClass = 'password-strength-strong';
    } else if (strength === 2) {
      this.passwordStrengthClass = 'password-strength-medium';
    } else {
      this.passwordStrengthClass = 'password-strength-weak';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      // Imprimir errores para depuración
      Object.keys(this.f).forEach(key => {
        const controlErrors = this.f[key].errors;
        if (controlErrors != null) {
          console.log('Control:', key, ', Errores:', controlErrors);
        }
      });
      return;
    }

    console.log('Datos de registro:', this.registerForm.value);
    // ... aquí iría la llamada al servicio de API ...
  }

  registerWithGoogle() {
    this.errorMessage = null;
    console.log('Registrando con Google...');
  }
}

