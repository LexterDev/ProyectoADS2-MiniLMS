import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button/button.component'; // (Asegúrate que la ruta es correcta)

// Esta importación ahora funcionará gracias a la Corrección 1
import { ModalData } from '../../../services/modal.service'; 

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, ButtonComponent],
  templateUrl: './confirmation-modal.component.html',
})
export class ConfirmationModalComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent, boolean>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}