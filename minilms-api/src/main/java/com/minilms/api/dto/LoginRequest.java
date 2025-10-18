package com.minilms.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    // CORREGIDO: Nombre del campo y mensaje de validación actualizados.
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo debe tener un formato válido")
    private String correo;
    
    // CORREGIDO: Nombre del campo y mensaje de validación actualizados.
    @NotBlank(message = "La clave es obligatoria")
    private String clave;
}

