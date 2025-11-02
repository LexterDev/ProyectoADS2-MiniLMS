import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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

  constructor(private fb: FormBuilder) {
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

    // Si el formulario no es válido, detenemos la ejecución
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    // --- Lógica de recuperación ---
    // Aquí llamarías a tu servicio de autenticación
    console.log('Enviando solicitud de recuperación para:', this.f['email'].value);
    
    // Simulamos una respuesta exitosa
    // Por seguridad, no confirmes si el email existe o no.
    this.successMessage = 'Si existe una cuenta con este correo, recibirás un enlace para restablecer tu contraseña.';
    

  }
}

