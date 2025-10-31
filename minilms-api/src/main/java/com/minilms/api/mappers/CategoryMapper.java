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

        return dto;
    }

}
