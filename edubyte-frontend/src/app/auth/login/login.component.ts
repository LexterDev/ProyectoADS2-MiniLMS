import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';


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

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
    ) {
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

  // Método para manejar el envío del formulario de login
onSubmit() {
  this.submitted = true;
  this.errorMessage = null;
  const correo = this.loginForm.get('email')?.value;
  const clave = this.loginForm.get('password')?.value;

  // Detener si el formulario es inválido
  if (this.loginForm.invalid) {
    return;
  }

  this.authService.login(correo, clave).subscribe({
    next: (response: any) => {
      if (!response.token) {
        this.errorMessage = 'Credenciales inválidas. Inténtalo de nuevo.';
      } else {
        // Guardar token y userInfo
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userInfo', JSON.stringify(response));
        
        // Obtener la URL a la que intentaba acceder originalmente
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        
        // Si hay returnUrl, redirigir ahí; si no, al dashboard según el rol
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else {
          // Redirigir según el rol
          switch(response.rol) {
            case 'ESTUDIANTE':
              this.router.navigate(['/dashboard-student']);
              break;
            case 'INSTRUCTOR':
              this.router.navigate(['/dashboard-instructor']);
              break;
            case 'ADMINISTRADOR':
              this.router.navigate(['/dashboard-admin']);
              break;
            default:
              this.router.navigate(['/']);
          }
        }
      }
    },
    error: (error: any) => {
      console.error('Error en el inicio de sesión:', error);
      this.errorMessage = 'Credenciales inválidas. Inténtalo de nuevo.';
    }
  });
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

