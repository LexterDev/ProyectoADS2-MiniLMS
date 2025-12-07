package com.minilms.api.dto.course;

import java.math.BigDecimal;
import java.util.List;

import com.minilms.api.dto.file.FileDTO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CourseCreationBatchDTO {

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 255, message = "El título no puede exceder 255 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 900, message = "La descripción no puede exceder 900 caracteres")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @PositiveOrZero(message = "El precio debe ser mayor o igual a cero")
    private BigDecimal precio;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoriaId;

    private FileDTO adjunto;

    @Valid
    private List<SectionCreationDTO> secciones;

    @Data
    public static class SectionCreationDTO {
        @NotBlank(message = "El título de la sección es obligatorio")
        @Size(max = 255, message = "El título de la sección no puede exceder 255 caracteres")
        private String titulo;

        @NotNull(message = "El orden es obligatorio")
        private Integer orden;

        private Integer duracionEstimada;

        @Valid
        private List<LessonCreationDTO> lecciones;
    }

    @Data
    public static class LessonCreationDTO {
        @NotBlank(message = "El título de la lección es obligatorio")
        @Size(max = 255, message = "El título de la lección no puede exceder 255 caracteres")
        private String titulo;

        @Size(max = 500, message = "La URL no puede exceder 500 caracteres")
        private String url;

        @Size(max = 20000, message = "El contenido no puede exceder 20000 caracteres")
        private String contenido;

        @NotNull(message = "El orden es obligatorio")
        private Integer orden;

        private String tipo; // VIDEO, LECTURA, INTRODUCCION, QUIZ, RECURSO
    }
}
