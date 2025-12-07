package com.minilms.api.dto.course;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewDTO {

    private Long id;

    @NotNull(message = "La calificación es requerida")
    @Min(value = 1, message = "La calificación mínima es 1")
    @Max(value = 5, message = "La calificación máxima es 5")
    private Integer calificacion;

    @Size(max = 900, message = "El comentario no puede exceder 900 caracteres")
    private String comentario;

    @NotNull(message = "El ID del curso es requerido")
    private Long cursoId;

    private String cursoTitulo;

    private Long usuarioId;
    private String usuarioNombre;
    private String usuarioApellido;

    private String creadoEn;
    private String actualizadoEn;
}
