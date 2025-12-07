package com.minilms.api.mappers;

import com.minilms.api.dto.course.ReviewDTO;
import com.minilms.api.entities.Resena;
import com.minilms.api.utils.LmsUtils;

public class ReviewMapper {

    public static ReviewDTO toDTO(Resena entity) {
        if (entity == null) {
            return null;
        }

        ReviewDTO dto = new ReviewDTO();
        dto.setId(entity.getId());
        dto.setCalificacion(entity.getCalificacion());
        dto.setComentario(entity.getComentario());
        dto.setCursoId(entity.getCurso().getId());
        dto.setCursoTitulo(entity.getCurso().getTitulo());
        dto.setUsuarioId(entity.getUsuario().getId());
        dto.setUsuarioNombre(entity.getUsuario().getNombre());
        dto.setUsuarioApellido(entity.getUsuario().getApellido());
        dto.setCreadoEn(LmsUtils.formatDateTime(entity.getCreadoEn()));
        dto.setActualizadoEn(LmsUtils.formatDateTime(entity.getActualizadoEn()));

        return dto;
    }

    public static Resena toEntity(ReviewDTO dto) {
        if (dto == null) {
            return null;
        }

        Resena entity = new Resena();
        entity.setCalificacion(dto.getCalificacion());
        entity.setComentario(dto.getComentario());

        return entity;
    }
}
