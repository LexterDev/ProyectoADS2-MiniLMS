import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// Importa el componente del modal
import { ConfirmationModalComponent } from '../components/shared/confirmation-modal/confirmation-modal.component';

// --- ✅ CORRECCIÓN 1: (para error TS2305) ---
// Añadimos 'export' para que otros archivos puedan importar esta interfaz
export interface ModalData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  // --- ✅ CORRECCIÓN 2: (para error TS2339) ---
  // Este es el método 'open' que faltaba
  open(data: ModalData): MatDialogRef<ConfirmationModalComponent, boolean> {
    return this.dialog.open(ConfirmationModalComponent, {
      width: '400px',
      data: data, 
      panelClass: 'custom-dialog-container'
    });
  }
}