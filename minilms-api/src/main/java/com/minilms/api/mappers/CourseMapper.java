package com.minilms.api.mappers;

import java.util.List;
import java.util.stream.Collectors;

import com.minilms.api.dto.CourseDTO;
import com.minilms.api.entities.Curso;

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

        dto.setCreadoEn(entity.getCreadoEn());
        dto.setActualizadoEn(entity.getActualizadoEn());

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

    public static Curso toEntity(CourseDTO dto) {
        if (dto == null) {
            return null;
        }

        Curso entity = new Curso();
        entity.setId(dto.getId());
        entity.setTitulo(dto.getTitulo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPrecio(dto.getPrecio());

        return entity;
    }
}