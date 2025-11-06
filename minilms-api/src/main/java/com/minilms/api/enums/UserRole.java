package com.minilms.api.enums;

public enum UserRole {
    Estudiante("ESTUDIANTE"),
    Instructor("INSTRUCTOR"),
    Administrador("ADMINISTRADOR"),
    Moderador("MODERADOR");
    
    private final String codigo;
    
    UserRole(String codigo) {
        this.codigo = codigo;
    }
    
    public String getCodigo() {
        return codigo;
    }
}
