package com.minilms.api.dto.course;

import com.minilms.api.enums.LeccionTipoEnum;

import lombok.Data;

@Data
public class LessonDTO {
    private Long id;
    private String titulo;
    private String url;
    private String contenido;
    private Integer orden;
    private LeccionTipoEnum tipo = LeccionTipoEnum.VIDEO;
    private boolean visible = false;
    private String creadoEn;
    private String actualizadoEn;

    private Long seccionId;
}
