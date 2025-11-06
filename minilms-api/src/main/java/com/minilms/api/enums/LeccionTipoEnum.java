package com.minilms.api.enums;

public enum LeccionTipoEnum {
    LECTURA("LECTURA", "Contenido de lectura en texto"),
    VIDEO("VIDEO", "Contenido en formato de video"),
    INTRODUCCION("INTRODUCCION", "Lección introductoria del curso"),
    QUIZ("QUIZ", "Evaluación o cuestionario"),
    RECURSO("RECURSO", "Material descargable");

    private final String codigo;
    private final String descripcion;

    LeccionTipoEnum(String codigo, String descripcion) {
        this.codigo = codigo;
        this.descripcion = descripcion;
    }

    public String getCodigo() {
        return codigo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public static LeccionTipoEnum fromCodigo(String codigo) {
        for (LeccionTipoEnum tipo : values()) {
            if (tipo.getCodigo().equalsIgnoreCase(codigo)) {
                return tipo;
            }
        }
        throw new IllegalArgumentException("Tipo de lección no válido: " + codigo);
    }

    public boolean requiereUrl() {
        return this == VIDEO || this == RECURSO;
    }

    public boolean requiereContenido() {
        return this == LECTURA || this == INTRODUCCION;
    }
}