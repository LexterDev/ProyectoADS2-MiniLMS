package com.minilms.api.dto.course;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.minilms.api.dto.file.FileDTO;
import com.minilms.api.dto.inscription.InscriptionDTO;
import com.minilms.api.dto.user.InstructorDTO;
import com.minilms.api.dto.user.StudentDTO;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourseDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private BigDecimal precio;
    private String estadoCodigo;
    private String estadoNombre;
    private Long categoriaId;
    private String categoriaNombre;
    private String creadoEn;
    private String actualizadoEn;

    private FileDTO adjunto;
    private InscriptionDTO inscripcion;
    private InstructorDTO instructor;

    private List<SectionDTO> secciones;
    private List<StudentDTO> estudiantes;
    private List<ReviewDTO> resenas;

    // Review statistics
    private Double promedioCalificacion;
    private Long totalResenas;

}
