package com.minilms.api.mappers;

import com.minilms.api.dto.catalog.CategoryDTO;
import com.minilms.api.entities.Categoria;

public class CategoryMapper {

    public static CategoryDTO toDTO(Categoria entity) {
        if (entity == null) {
            return null;
        }

        CategoryDTO dto = new CategoryDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setIcono(entity.getIcono());
        dto.setColor(entity.getColor());
        dto.setActiva(entity.getActiva());
        dto.setCursosCount(0); // Will be set by service if needed

        return dto;
    }

    public static Categoria toEntity(CategoryDTO dto) {
        if (dto == null) {
            return null;
        }

        Categoria entity = new Categoria();
        entity.setId(dto.getId());
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setIcono(dto.getIcono());
        entity.setColor(dto.getColor());
        entity.setActiva(dto.getActiva() != null ? dto.getActiva() : (short) 1);

        return entity;
    }

}
