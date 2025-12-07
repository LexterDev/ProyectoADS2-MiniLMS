export interface PaymentMethod {
  id: string;
  nombre: string;
}

export interface Payment {
  id?: number;
  montoTotal: number;
  comisionPlataforma?: number;
  montoInstructor?: number;
  idTransaccionPasarela?: string;
  formaPagoId: string;
  formaPagoNombre?: string;
  estadoCodigo?: string;
  estadoNombre?: string;
  inscripcionId?: number;
  cursoId?: number;
  cursoTitulo?: string;
  estudianteId?: number;
  estudianteNombre?: string;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface ProcessPaymentRequest {
  cursoId: number;
  formaPagoId: string;
  montoTotal: number;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}
