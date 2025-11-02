package com.minilms.api.dto.inscription;

import lombok.Data;

@Data
public class InscriptionDTO {

    private Long id;
    private Integer progreso = 0;
    private String estadoCodigo;
    private String estadoNombre;
    private Long estudianteId;
    private Long cursoId;
    private String fechaInscripcion;
    private String actualizadoEn;
    private String fechaInicioCurso;
    private String fechaFinCurso;
    private boolean completado = false;

}
