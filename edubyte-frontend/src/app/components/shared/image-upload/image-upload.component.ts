import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importamos los servicios que este componente necesita
import { FileService } from '../../../services/file.service'; // (Ajusta la ruta si es necesario)
import { SnackbarService } from '../../../services/snackbar.service'; // (Ajusta la ruta si es necesario)

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent {
  
  // --- Entradas y Salidas ---
  /** URL de una imagen ya existente para mostrar (ej. al editar) */
  @Input() currentImageUrl: string | null = null;
  /** Emite la URL de la imagen subida cuando se completa */
  @Output() uploadComplete = new EventEmitter<string>();

  // --- Estados Internos ---
  fileToUpload: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  
  // Estados para Drag & Drop
  isDragging = false;
  
  // Estados de Carga (Tareas 4)
  isLoading = false;
  uploadProgress = 0;

  constructor(
    private fileService: FileService, // El servicio del Canvas
    private snackbarService: SnackbarService
  ) {}

  /**
   * Se llama cuando un archivo es seleccionado (clic o drop)
   */
  onFileSelected(event: any): void {
    let file: File | null = null;
    
    if (event.dataTransfer) {
      // Caso 1: Archivo viene de Drag & Drop
      file = event.dataTransfer.files[0];
    } else if (event.target) {
      // Caso 2: Archivo viene del <input> (clic)
      file = event.target.files[0];
    }
    
    this.handleFile(file);
  }

  /**
   * Valida el archivo y genera la vista previa
   */
  private handleFile(file: File | null): void {
    if (!file) {
      this.isDragging = false;
      return;
    }

    // 1. Validar que es una imagen
    if (!file.type.startsWith('image/')) {
      this.snackbarService.showError('Error: El archivo no es una imagen.');
      this.isDragging = false;
      return;
    }

    // 2. Guardar el archivo para subirlo
    this.fileToUpload = file;

    // 3. Generar Vista Previa (Preview)
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);

    this.isDragging = false;
  }

  /**
   * Inicia la subida del archivo al servicio
   */
  uploadFile(): void {
    if (!this.fileToUpload) return;

    this.isLoading = true;
    this.uploadProgress = 0;

    // Usamos el FileService que está en tu Canvas
    this.fileService.uploadImage(this.fileToUpload).subscribe({
      next: (event) => {
        // Actualiza la barra de progreso
        this.uploadProgress = event.progress;

        // Si 'url' existe, la subida terminó
        if (event.url) {
          this.isLoading = false;
          this.currentImageUrl = event.url; // Muestra la imagen final
          this.previewUrl = null;         // Limpia el preview
          this.fileToUpload = null;       // Limpia el archivo
          this.uploadComplete.emit(event.url); // ¡Emite la URL al padre!
          this.snackbarService.showSuccess('Imagen subida exitosamente.');
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.snackbarService.showError('Error al subir la imagen.');
        console.error(err);
      }
    });
  }

  /**
   * Limpia la selección y cancela la subida
   */
  clearSelection(): void {
    this.fileToUpload = null;
    this.previewUrl = null;
  }

  // --- Helpers para Drag & Drop ---
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.onFileSelected(event);
  }
}