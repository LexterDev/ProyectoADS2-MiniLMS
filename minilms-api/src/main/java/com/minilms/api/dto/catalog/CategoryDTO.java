package com.minilms.api.dto.catalog;

import lombok.Data;

@Data
public class CategoryDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String icono;
    private String color;
    private Short activa;
    private Integer cursosCount;
}
