import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { PaymentService } from '../../services/payment.service';
import { SnackbarService } from '../../services/snackbar.service';
import { PaymentMethod, ProcessPaymentRequest } from '../../models/payment.model';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private coursesService = inject(CoursesService);
  private paymentService = inject(PaymentService);
  private snackbarService = inject(SnackbarService);

  courseId!: number;
  course: any = null;
  paymentMethods: PaymentMethod[] = [];
  isLoading = false;
  isProcessing = false;
  selectedPaymentMethod: string = '';

  checkoutForm: FormGroup = this.fb.group({
    paymentMethod: ['', Validators.required],
    cardNumber: [''],
    cardHolderName: [''],
    expiryDate: [''],
    cvv: ['']
  });

  ngOnInit(): void {
    // Get course ID from route params
    this.route.queryParams.subscribe(params => {
      this.courseId = +params['courseId'];
      if (this.courseId) {
        this.loadCourse();
        this.loadPaymentMethods();
      } else {
        this.snackbarService.showError('ID de curso inválido');
        this.router.navigate(['/courses']);
      }
    });

    // Listen to payment method changes to show/hide card fields
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(value => {
      this.selectedPaymentMethod = value;
      this.updateCardValidation(value);
    });
  }

  loadCourse(): void {
    this.isLoading = true;
    this.coursesService.getCourseById(this.courseId.toString()).subscribe({
      next: (response: any) => {
        this.course = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.snackbarService.showError('Error al cargar el curso');
        this.isLoading = false;
        this.router.navigate(['/courses']);
      }
    });
  }

  loadPaymentMethods(): void {
    this.paymentService.getPaymentMethods().subscribe({
      next: (response: any) => {
        this.paymentMethods = response.data || [];
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
        this.snackbarService.showError('Error al cargar métodos de pago');
      }
    });
  }

  updateCardValidation(paymentMethod: string): void {
    const cardNumberControl = this.checkoutForm.get('cardNumber');
    const cardHolderNameControl = this.checkoutForm.get('cardHolderName');
    const expiryDateControl = this.checkoutForm.get('expiryDate');
    const cvvControl = this.checkoutForm.get('cvv');

    if (paymentMethod === 'TARJETA') {
      // Add validators for card payment
      cardNumberControl?.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(19)]);
      cardHolderNameControl?.setValidators([Validators.required]);
      expiryDateControl?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]);
      cvvControl?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(4)]);
    } else {
      // Remove validators for other payment methods
      cardNumberControl?.clearValidators();
      cardHolderNameControl?.clearValidators();
      expiryDateControl?.clearValidators();
      cvvControl?.clearValidators();
    }

    // Update validity
    cardNumberControl?.updateValueAndValidity();
    cardHolderNameControl?.updateValueAndValidity();
    expiryDateControl?.updateValueAndValidity();
    cvvControl?.updateValueAndValidity();
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    this.checkoutForm.patchValue({ cardNumber: formattedValue }, { emitEvent: false });
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.checkoutForm.patchValue({ expiryDate: value }, { emitEvent: false });
  }

  processPayment(): void {
    if (this.checkoutForm.invalid) {
      this.snackbarService.showError('Por favor, complete todos los campos requeridos');
      return;
    }

    this.isProcessing = true;

    const paymentRequest: ProcessPaymentRequest = {
      cursoId: this.courseId,
      formaPagoId: this.checkoutForm.value.paymentMethod,
      montoTotal: this.course.precio
    };

    // Add card details if payment method is card
    if (this.checkoutForm.value.paymentMethod === 'TARJETA') {
      paymentRequest.cardNumber = this.checkoutForm.value.cardNumber.replace(/\s/g, '');
      paymentRequest.cardHolderName = this.checkoutForm.value.cardHolderName;
      paymentRequest.expiryDate = this.checkoutForm.value.expiryDate;
      paymentRequest.cvv = this.checkoutForm.value.cvv;
    }

    this.paymentService.processPayment(paymentRequest).subscribe({
      next: (response: any) => {
        this.isProcessing = false;
        const payment = response.data;
        this.snackbarService.showSuccess('¡Pago procesado exitosamente! Bienvenido al curso.');

        // Navigate to payment confirmation or course page
        this.router.navigate(['/payment-confirmation'], {
          queryParams: {
            paymentId: payment.id,
            courseId: this.courseId
          }
        });
      },
      error: (error) => {
        this.isProcessing = false;
        const errorMessage = error.error?.message || 'Error al procesar el pago. Por favor, intente nuevamente.';
        this.snackbarService.showError(errorMessage);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/course-details', this.courseId]);
  }

  get totalAmount(): number {
    return this.course?.precio || 0;
  }

  get isCardPayment(): boolean {
    return this.selectedPaymentMethod === 'TARJETA';
  }
}
