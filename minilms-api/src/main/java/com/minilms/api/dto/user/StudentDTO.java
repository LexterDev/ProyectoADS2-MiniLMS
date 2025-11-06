package com.minilms.api.dto.user;

import lombok.Data;

@Data
public class StudentDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String correo;
}
