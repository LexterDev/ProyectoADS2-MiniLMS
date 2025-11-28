export interface Review {
  id?: number;
  calificacion: number;
  comentario?: string;
  cursoId: number;
  cursoTitulo?: string;
  usuarioId?: number;
  usuarioNombre?: string;
  usuarioApellido?: string;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface ReviewStats {
  averageRating: number;
  reviewCount: number;
}

export interface CreateReviewRequest {
  calificacion: number;
  comentario?: string;
  cursoId: number;
}

export interface UpdateReviewRequest {
  calificacion: number;
  comentario?: string;
}
