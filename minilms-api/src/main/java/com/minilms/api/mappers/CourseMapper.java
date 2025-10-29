package com.minilms.api.mappers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.minilms.api.dto.course.CourseDTO;
import com.minilms.api.dto.course.LessonDTO;
import com.minilms.api.dto.course.SectionDTO;
import com.minilms.api.entities.Curso;
import com.minilms.api.entities.Leccion;
import com.minilms.api.entities.Seccion;
import com.minilms.api.utils.LmsUtils;

public class CourseMapper {

    public static CourseDTO toDTO(Curso entity) {
        if (entity == null) {
            return null;
        }

        CourseDTO dto = new CourseDTO();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setPrecio(entity.getPrecio());

        if (entity.getEstado() != null) {
            dto.setEstadoCodigo(entity.getEstado().getCodigo());
            dto.setEstadoNombre(entity.getEstado().getDescripcion());
        }

        if (entity.getInstructor() != null) {
            dto.setInstructorId(entity.getInstructor().getId());
            dto.setInstructorNombre(entity.getInstructor().getNombre());
        }

        if (entity.getCategoria() != null) {
            dto.setCategoriaId(entity.getCategoria().getId());
            dto.setCategoriaNombre(entity.getCategoria().getNombre());
        }

        dto.setCreadoEn(LmsUtils.formatDateTime(entity.getCreadoEn()));
        dto.setActualizadoEn(LmsUtils.formatDateTime(entity.getActualizadoEn()));

        return dto;
    }

    public static List<CourseDTO> toListDTO(List<Curso> entities) {
        if (entities == null) {
            return null;
        }

        return entities.stream()
                .map(CourseMapper::toDTO)
                .collect(Collectors.toList());
    }

    public static Optional<Curso> toEntity(CourseDTO dto) {
        if (dto == null) {
            return Optional.empty();
        }

        Curso entity = new Curso();
        entity.setTitulo(dto.getTitulo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPrecio(dto.getPrecio());

        return Optional.of(entity);
    }

    public static CourseDTO toDetailsDTO(Curso entity) {

        CourseDTO dto = toDTO(entity);
        if (dto == null) {
            return null;
        }

        if (entity.getSecciones() != null) {
            dto.setSecciones(
                    entity.getSecciones().stream()
                            .map(CourseMapper::toSectionDTO)
                            .collect(Collectors.toList()));
        }

        return dto;
    }

    public static SectionDTO toSectionDTO(Seccion entity) {
        if (entity == null) {
            return null;
        }

        SectionDTO dto = new SectionDTO();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setOrden(entity.getOrden());
        dto.setDuracionEstimada(entity.getDuracionEstimada());
        dto.setVisible(entity.isVisible());
        dto.setCreadoEn(LmsUtils.formatDateTime(entity.getCreadoEn()));
        dto.setActualizadoEn(LmsUtils.formatDateTime(entity.getActualizadoEn()));
        dto.setCursoId(entity.getCurso().getId());

        if (entity.getLecciones() != null) {
            dto.setLecciones(
                    entity.getLecciones().stream()
                            .map(CourseMapper::toLessonDTO)
                            .collect(Collectors.toList()));
        }

        return dto;
    }

    public static LessonDTO toLessonDTO(Leccion entity) {
        if (entity == null) {
            return null;
        }

        LessonDTO dto = new LessonDTO();
        dto.setId(entity.getId());
        dto.setTitulo(entity.getTitulo());
        dto.setUrl(entity.getUrl());
        dto.setContenido(entity.getContenido());
        dto.setOrden(entity.getOrden());
        dto.setTipo(entity.getTipo());
        dto.setVisible(entity.isVisible());
        dto.setCreadoEn(LmsUtils.formatDateTime(entity.getCreadoEn()));
        dto.setActualizadoEn(LmsUtils.formatDateTime(entity.getActualizadoEn()));

        dto.setSeccionId(entity.getSeccion().getId());

        return dto;
    }

    public static Optional<Seccion> toSection(SectionDTO dto) {
        if (dto == null) {
            return Optional.empty();
        }

        Seccion entity = new Seccion();
        entity.setTitulo(dto.getTitulo());
        entity.setOrden(dto.getOrden());
        entity.setDuracionEstimada(0);
        entity.setVisible(dto.isVisible());

        return Optional.of(entity);
    }

    public static Optional<Leccion> toLesson(LessonDTO dto) {
        if (dto == null) {
            return Optional.empty();
        }

        Leccion entity = new Leccion();
        entity.setTitulo(dto.getTitulo());
        entity.setUrl(dto.getUrl());
        entity.setContenido(dto.getContenido());
        entity.setOrden(dto.getOrden());
        entity.setTipo(dto.getTipo());

        return Optional.of(entity);
    }
}