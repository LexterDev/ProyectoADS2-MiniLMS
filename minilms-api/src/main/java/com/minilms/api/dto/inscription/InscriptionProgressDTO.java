package com.minilms.api.dto.inscription;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class InscriptionProgressDTO {

    private Long id;
    private Long inscripcionId;
    private Long cursoId;
    private Long leccionId;
    private boolean completado = false;
    private String fechaCompletado;
    private BigDecimal notaEvaluacion;
    private Integer progresoCurso;
    private Long tiempoDedicado; // Tiempo en segundos
    private String ultimaActualizacion;

}
