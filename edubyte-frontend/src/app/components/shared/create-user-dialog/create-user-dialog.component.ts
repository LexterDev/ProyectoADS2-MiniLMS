import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.css'
})
export class CreateUserDialogComponent {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<CreateUserDialogComponent>);

  userForm: FormGroup;
  passwordFieldType: string = 'password';
  passwordIcon: string = 'visibility';

  roles = [
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Instructor', label: 'Instructor' },
    { value: 'Administrador', label: 'Administrador' }
  ];

  constructor() {
    this.userForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      clave: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['Estudiante', [Validators.required]]
    });
  }

  get f() {
    return this.userForm.controls;
  }

  togglePasswordVisibility(): void {
    if (this.passwordFieldType === 'password') {
      this.passwordFieldType = 'text';
      this.passwordIcon = 'visibility_off';
    } else {
      this.passwordFieldType = 'password';
      this.passwordIcon = 'visibility';
    }
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
