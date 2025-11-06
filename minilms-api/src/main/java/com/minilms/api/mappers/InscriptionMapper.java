package com.minilms.api.mappers;

import java.time.LocalDateTime;
import java.util.Optional;

import com.minilms.api.dto.course.CourseDTO;
import com.minilms.api.dto.inscription.InscriptionDTO;
import com.minilms.api.dto.inscription.InscriptionProgressDTO;
import com.minilms.api.entities.Inscripcion;
import com.minilms.api.entities.InscripcionProgreso;
import com.minilms.api.utils.LmsUtils;

public class InscriptionMapper {

    public static InscriptionDTO toDTO(Inscripcion entity) {
        if (entity == null) {
            return null;
        }

        InscriptionDTO dto = new InscriptionDTO();
        dto.setId(entity.getId());
        dto.setProgreso(entity.getProgreso());
        dto.setEstadoCodigo(entity.getEstado().getCodigo());
        dto.setEstadoNombre(entity.getEstado().getDescripcion());
        dto.setEstudianteId(entity.getEstudiante().getId());
        dto.setCursoId(entity.getCurso().getId());
        dto.setFechaInscripcion(LmsUtils.formatDateTime(entity.getCreadoEn()));
        dto.setActualizadoEn(LmsUtils.formatDateTime(entity.getActualizadoEn()));
        dto.setFechaInicioCurso(LmsUtils.formatDateTime(entity.getFechaInicioCurso()));
        dto.setFechaFinCurso(LmsUtils.formatDateTime(entity.getFechaFinCurso()));
        dto.setCompletado(entity.isCompletado());

        return dto;
    }

    public static Optional<Inscripcion> toEntity(InscriptionDTO dto) {
        if (dto == null) {
            return Optional.empty();
        }

        Inscripcion entity = new Inscripcion();
        entity.setProgreso(dto.getProgreso());
        entity.setCompletado(dto.isCompletado());

        return Optional.of(entity);
    }

    public static InscriptionProgressDTO toDTO(InscripcionProgreso entity) {
        if (entity == null) {
            return null;
        }

        InscriptionProgressDTO dto = new InscriptionProgressDTO();
        dto.setId(entity.getId());
        dto.setInscripcionId(entity.getInscripcion().getId());
        dto.setLeccionId(entity.getLeccion().getId());
        dto.setCursoId(entity.getLeccion().getSeccion().getCurso().getId());
        dto.setCompletado(entity.isCompletado());
        dto.setFechaCompletado(LmsUtils.formatDateTime(entity.getFechaCompletado()));
        dto.setNotaEvaluacion(entity.getNotaEvaluacion());
        dto.setProgresoCurso(entity.getInscripcion().getProgreso());

        return dto;
    }
    
    public static InscripcionProgreso toEntity(InscriptionProgressDTO dto) {
        if (dto == null) {
            return null;
        }

        InscripcionProgreso entity = new InscripcionProgreso();
        entity.setCompletado(dto.isCompletado());
        entity.setFechaCompletado(LocalDateTime.now());
        entity.setNotaEvaluacion(dto.getNotaEvaluacion());

        return entity;
    }

    public static CourseDTO toCourseDTO(Inscripcion entity) {
        if (entity == null) {
            return null;
        }
        CourseDTO dto = CourseMapper.toDTO(entity.getCurso());
        dto.setInscripcion(toDTO(entity));
        return dto;
    }

}
