package com.minilms.api.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {

    private Long id;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @NotBlank(message = "La descripción es requerida")
    @Size(max = 500, message = "La descripción no puede exceder 500 caracteres")
    private String descripcion;

    @Size(max = 50, message = "El icono no puede exceder 50 caracteres")
    private String icono;

    @Size(max = 50, message = "El color no puede exceder 50 caracteres")
    private String color;

    private Short activa;

    private Integer cursosCount;
}
