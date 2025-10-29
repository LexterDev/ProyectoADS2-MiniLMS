import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  passwordStrengthClass: string = ''; // Para el indicador de fortaleza

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      role: ['Estudiante'], // Valor por defecto
      terms: [false, Validators.requiredTrue] // El checkbox DEBE ser true
    }, {
      // Añadimos el validador personalizado a nivel de grupo
      validators: this.passwordMatchValidator 
    });

    // (Opcional pero recomendado) Escuchar cambios en la contraseña para el indicador
    this.password?.valueChanges.subscribe(value => {
      this.passwordStrengthClass = this.calculatePasswordStrength(value);
    });
  }

  /**
   * Validador personalizado para el grupo de formulario.
   * Comprueba si 'password' y 'confirmPassword' coinciden.
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    // Si los campos aún no existen, no hacer nada
    if (!password || !confirmPassword) {
      return null;
    }
    
    // Si 'confirmPassword' no ha sido tocado, no mostramos el error aún
    if (confirmPassword.pristine) {
      return null;
    }

    // Retorna un error 'passwordMismatch' si no coinciden
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  /**
   * Calcula la clase de CSS para el indicador de fortaleza.
   */
  calculatePasswordStrength(password: string): string {
    if (!password) {
      return ''; // Sin clase
    }
    if (password.length < 6) {
      return 'password-strength-weak';
    } else if (password.length < 10) {
      return 'password-strength-medium';
    } else {
      return 'password-strength-strong';
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    console.log('Formulario de registro enviado:', this.registerForm.value);
    // Aquí iría la lógica para llamar al servicio de registro
    // this.authService.register(this.registerForm.value).subscribe(...)
  }

  // --- Getters para acceso fácil en el HTML ---

  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get terms() { return this.registerForm.get('terms'); }
}