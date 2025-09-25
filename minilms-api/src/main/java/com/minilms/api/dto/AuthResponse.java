package com.minilms.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    
    public AuthResponse(String token, Long id, String nombre, String apellido, String email, String rol) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
    }
}
