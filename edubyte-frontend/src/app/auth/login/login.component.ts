import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Para [formGroup]
    RouterLink            // Para [routerLink]
  ],
  templateUrl: './login.component.html'

})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  
  // Estado para el botón de mostrar/ocultar contraseña
  passwordFieldType: string = 'password';
  passwordIcon: string = 'visibility';

  constructor(private fb: FormBuilder) {
    // Esta es la lógica de formulario de tu compañero
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  // Getter para acceder fácilmente a los controles del formulario
  get f() {
    return this.loginForm.controls;
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    // Detener si el formulario es inválido
    if (this.loginForm.invalid) {
      return;
    }

    // --- Lógica de Autenticación ---
    console.log('Datos de inicio de sesión:', this.loginForm.value);

    // Simulación de un error de autenticación
    if (this.f['email'].value !== 'admin@edubyte.com' || this.f['password'].value !== 'password') {
      this.errorMessage = 'El correo electrónico o la contraseña son incorrectos.';
    } else {
      console.log('¡Inicio de sesión exitoso!');
    }
  }

  // Método para "Continuar con Google"
  loginWithGoogle() {
    this.errorMessage = null;
    console.log('Iniciando sesión con Google...');
  }

  // Método para cambiar la visibilidad de la contraseña
  togglePasswordVisibility() {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordIcon = 'visibility_off';
    } else {
      this.passwordFieldType = 'password';
      this.passwordIcon = 'visibility';
    }
  }
}

