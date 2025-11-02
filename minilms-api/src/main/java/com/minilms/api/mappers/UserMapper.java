package com.minilms.api.mappers;

import com.minilms.api.dto.user.InstructorDTO;
import com.minilms.api.entities.User;

public class UserMapper {

    public static InstructorDTO toDTO(User entity) {
        if (entity == null) {
            return null;
        }
        InstructorDTO dto = new InstructorDTO();
        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setApellido(entity.getApellido());
        dto.setCorreo(entity.getCorreo());
        return dto;
    }

}
