package com.minilms.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data; // IMPORT AÑADIDO

@Data // ¡ANOTACIÓN AÑADIDA! Esto crea getCodigo(), setCodigo(), etc.
@Entity
@Table(name = "estados")
public class Estado {

    @Id
    @NotBlank
    @Size(max = 10)
    @Column(length = 10, nullable = false)
    private String codigo;

    @NotBlank
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String descripcion;
}

