import { Component, Inject, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CoursesService } from '../../services/courses.service';
@Component({
  selector: 'app-enroll-dialog',
  imports: [CommonModule],
  templateUrl: './enroll-dialog.component.html',
  styleUrl: './enroll-dialog.component.css'
})
export class EnrollDialogComponent implements OnInit {

  courseInfo: any;
  coursePrice: number = 0;
  courseName: string = '';
  courseId: string = '';
  successMessage: string = '';
  constructor(
    public dialogRef: MatDialogRef<EnrollDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coursesService: CoursesService
  ) {
    this.courseInfo = data;
    this.courseName = this.courseInfo.courseName;
    this.coursePrice = this.courseInfo.coursePrice;
    this.courseId = this.courseInfo.courseId;
  }



  @Input() isOpen = true;

  @Input() isLoading = false;

  @Output() onConfirm = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  ngOnInit(): void {
    console.log('Course Info:', this.courseInfo);
  }


  closeDialog(): void {
    this.dialogRef.close();
  }


  /**
   * Confirmar inscripción
   */
  confirm(): void {

    console.log('Confirmar inscripción para el curso ID:', this.courseId);

    this.coursesService.enrollInCourse(+this.courseId).subscribe({
      next: (response: any) => {
        console.log('Inscripción exitosa:', response);
        this.successMessage = `Inscripción exitosa en ${this.courseName}!`;
        setTimeout(() => {
          this.onConfirm.emit({
            confirmed: true,
          });
        }, 2000);
      },
      error: (error: any) => {
        console.error('Error al inscribir:', error);
      }
    });
  }

  /**
   * Cancelar inscripción
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Cerrar modal al hacer clic en el overlay
   */
  closeOnOverlay(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cancel();
    }
  }

  /**
   * Formatear precio
   */
  get formattedPrice(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.coursePrice);
  }

}
