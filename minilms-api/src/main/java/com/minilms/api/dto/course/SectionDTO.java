package com.minilms.api.dto.course;

import java.util.List;

import lombok.Data;

@Data
public class SectionDTO {
    private Long id;
    private String titulo;
    private Integer orden;
    private Integer duracionEstimada;
    private boolean visible = false;
    private String creadoEn;
    private String actualizadoEn;
    
    private Long cursoId;

    private List<LessonDTO> lecciones;

}
