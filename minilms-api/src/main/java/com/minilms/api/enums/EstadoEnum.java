package com.minilms.api.enums;

public enum EstadoEnum {
    ACTIVO("ACT", "Activo"),
    INACTIVO("INA", "Inactivo"),
    BORRADOR("BOR", "Borrador"),
    EN_REVISION("REV", "En Revisión"),
    PUBLICADO("PUB", "Publicado");
    
    private final String codigo;
    private final String descripcion;
    
    EstadoEnum(String codigo, String descripcion) {
        this.codigo = codigo;
        this.descripcion = descripcion;
    }
    
    public String getCodigo() {
        return codigo;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public static EstadoEnum fromCodigo(String codigo) {
        for (EstadoEnum estado : values()) {
            if (estado.getCodigo().equalsIgnoreCase(codigo)) {
                return estado;
            }
        }
        throw new IllegalArgumentException("Estado no válido: " + codigo);
    }

}
