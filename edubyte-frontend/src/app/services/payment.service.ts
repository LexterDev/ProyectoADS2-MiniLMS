import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';
import { AuthService } from './auth.service';
import { PaymentMethod, Payment, ProcessPaymentRequest } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  /**
   * Get all available payment methods
   */
  getPaymentMethods(): Observable<any> {
    return this.http.get(API_ENDPOINTS.payments.getMethods);
  }

  /**
   * Process a payment for course enrollment
   */
  processPayment(paymentRequest: ProcessPaymentRequest): Observable<any> {
    return this.http.post(API_ENDPOINTS.payments.process, paymentRequest, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Get payment details by ID
   */
  getPaymentById(id: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.payments.getById(id), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Get payment by enrollment ID
   */
  getPaymentByEnrollment(inscripcionId: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.payments.getByEnrollment(inscripcionId), {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }

  /**
   * Get all payments made by the current user
   */
  getMyPayments(): Observable<any> {
    return this.http.get(API_ENDPOINTS.payments.getMyPayments, {
      headers: {
        Authorization: `Bearer ${this.authService.getToken()}`
      }
    });
  }
}
