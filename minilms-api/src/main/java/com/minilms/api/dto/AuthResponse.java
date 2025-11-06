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
    private String correo; // CORREGIDO: de email a correo
    private String rol;
    
    // CORREGIDO: El constructor ahora usa 'correo'
    public AuthResponse(String token, Long id, String nombre, String apellido, String correo, String rol) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.rol = rol;
    }

    // Constructor simple solo con el token, por si se necesita
    public AuthResponse(String token) {
        this.token = token;
    }
}

