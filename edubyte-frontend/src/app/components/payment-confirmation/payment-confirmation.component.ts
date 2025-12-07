import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CoursesService } from '../../services/courses.service';
import { Payment } from '../../models/payment.model';

@Component({
  selector: 'app-payment-confirmation',
  imports: [CommonModule],
  templateUrl: './payment-confirmation.component.html',
  styleUrl: './payment-confirmation.component.css'
})
export class PaymentConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);
  private coursesService = inject(CoursesService);

  payment: Payment | null = null;
  courseTitle: string = '';
  loading: boolean = true;
  error: string = '';

  ngOnInit(): void {
    this.loadPaymentDetails();
  }

  loadPaymentDetails(): void {
    const paymentId = this.route.snapshot.queryParamMap.get('paymentId');
    const courseId = this.route.snapshot.queryParamMap.get('courseId');

    if (!paymentId) {
      this.error = 'No se encontró información del pago';
      this.loading = false;
      return;
    }

    this.paymentService.getPaymentById(Number(paymentId)).subscribe({
      next: (response) => {
        this.payment = response.data;

        // Load course details if courseId is available
        if (courseId) {
          this.loadCourseDetails(Number(courseId));
        } else if (this.payment?.cursoId) {
          this.loadCourseDetails(this.payment.cursoId);
        } else {
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error loading payment details:', err);
        this.error = 'No se pudo cargar la información del pago';
        this.loading = false;
      }
    });
  }

  loadCourseDetails(courseId: number): void {
    this.coursesService.getCourseById(courseId.toString()).subscribe({
      next: (response: any) => {
        this.courseTitle = response.data?.titulo || 'Curso';
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading course details:', err);
        this.courseTitle = this.payment?.cursoTitulo || 'Curso';
        this.loading = false;
      }
    });
  }

  goToCourse(): void {
    if (this.payment?.cursoId) {
      this.router.navigate(['/course-details', this.payment.cursoId]);
    }
  }

  goToMyCourses(): void {
    this.router.navigate(['/student/my-courses']);
  }

  printReceipt(): void {
    window.print();
  }

  downloadReceipt(): void {
    // Simple implementation - could be enhanced with PDF generation
    const receiptContent = this.generateReceiptText();
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recibo-${this.payment?.id || 'pago'}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private generateReceiptText(): string {
    if (!this.payment) return '';

    return `
=================================
    RECIBO DE PAGO - MINILMS
=================================

Fecha: ${new Date(this.payment.creadoEn || '').toLocaleString('es-ES')}
ID de Transacción: ${this.payment.idTransaccionPasarela}
ID de Pago: ${this.payment.id}

---------------------------------
DETALLES DEL CURSO
---------------------------------
Curso: ${this.courseTitle || this.payment.cursoTitulo || 'N/A'}
ID del Curso: ${this.payment.cursoId}

---------------------------------
INFORMACIÓN DEL PAGO
---------------------------------
Monto Total: $${this.payment.montoTotal?.toFixed(2)}
Método de Pago: ${this.payment.formaPagoNombre}
Estado: ${this.payment.estadoNombre}

---------------------------------
DETALLES DE LA TRANSACCIÓN
---------------------------------
Comisión de Plataforma: $${this.payment.comisionPlataforma?.toFixed(2)}
Monto al Instructor: $${this.payment.montoInstructor?.toFixed(2)}

=================================

Gracias por tu compra.
Este recibo es válido como comprobante de pago.

MiniLMS - Plataforma de Aprendizaje
    `.trim();
  }

  getPaymentMethodIcon(): string {
    if (!this.payment?.formaPagoId) return 'credit_card';

    switch (this.payment.formaPagoId) {
      case 'TARJETA':
        return 'credit_card';
      case 'PAYPAL':
        return 'account_balance_wallet';
      case 'TRANSFERENCIA':
        return 'account_balance';
      default:
        return 'payment';
    }
  }
}
