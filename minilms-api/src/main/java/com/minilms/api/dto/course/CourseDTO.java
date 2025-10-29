package com.minilms.api.dto.course;

import java.math.BigDecimal;
import java.util.List;

import lombok.Data;

@Data
public class CourseDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private BigDecimal precio;
    private String estadoCodigo;
    private String estadoNombre;
    private Long instructorId;
    private String instructorNombre;
    private Long categoriaId;
    private String categoriaNombre;
    private String creadoEn;
    private String actualizadoEn;

    private List<SectionDTO> secciones;

}
