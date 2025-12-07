import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../config/api-endpoints.config';

export interface Discount {
  id?: number;
  cursoId: number;
  cursoTitulo?: string;
  porcentajeDescuento: number;
  codigoPromocional?: string;
  fechaInicio: string;
  fechaFin: string;
  usosMaximos?: number;
  usosActuales?: number;
  activo: number;
}

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private http = inject(HttpClient);

  getAllDiscounts(): Observable<any> {
    return this.http.get(API_ENDPOINTS.discounts.getAll);
  }

  getDiscountById(id: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.discounts.getById(id));
  }

  getDiscountsByCourse(cursoId: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.discounts.getByCourse(cursoId));
  }

  createDiscount(discount: Discount): Observable<any> {
    return this.http.post(API_ENDPOINTS.discounts.create, discount);
  }

  updateDiscount(id: number, discount: Discount): Observable<any> {
    return this.http.put(API_ENDPOINTS.discounts.update(id), discount);
  }

  deleteDiscount(id: number): Observable<any> {
    return this.http.delete(API_ENDPOINTS.discounts.delete(id));
  }

  toggleStatus(id: number): Observable<any> {
    return this.http.patch(API_ENDPOINTS.discounts.toggleStatus(id), {});
  }

  validateCode(code: string, cursoId: number): Observable<any> {
    return this.http.get(API_ENDPOINTS.discounts.validateCode(code, cursoId));
  }
}
