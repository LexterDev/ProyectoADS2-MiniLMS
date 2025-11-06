import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; 
import { ModalService } from '../../services/modal.service'; 
import { SnackbarService } from '../../services/snackbar.service';
import { ButtonComponent } from '../shared/button/button.component'; 

@Component({
  selector: 'app-enroll-button',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, 
    ButtonComponent
  ],
  templateUrl: './enroll-button.component.html',
})
export class EnrollButtonComponent implements OnInit {

  @Input() courseId: string = '';
  @Input() courseName: string = 'este curso';
  
  isEnrolled = false; 
  isLoading = false;

  constructor(
    private modalService: ModalService,
    private snackbarService: SnackbarService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  openConfirmationModal(): void {
    const modalData = {
      title: 'Confirmar Inscripción',
      message: `¿Estás seguro de que quieres inscribirte en el curso "${this.courseName}"?`,
      confirmText: 'Sí, Inscribirme',
      cancelText: 'Cancelar'
    };

    const modalRef = this.modalService.open(modalData);

    // --- ✅ ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
    // Cambiamos (confirmed: boolean) por (confirmed: boolean | undefined)
    modalRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      // Comprobamos que sea explícitamente 'true'
      if (confirmed === true) { 
        this.enrollUser();
      }
    });
  }

  private enrollUser(): void {
    this.isLoading = true; 
    console.log(`Inscribiendo al usuario en el curso: ${this.courseId}`);
    
    setTimeout(() => {
      this.isEnrolled = true;
      this.isLoading = false; 
      this.snackbarService.showSuccess(`¡Te has inscrito en "${this.courseName}"!`);
      this.router.navigate(['/my-courses']); 
    }, 1500); 
  }
}