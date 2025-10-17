package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size; // ✅ IMPORT AÑADIDO
import lombok.Data;

@Data
@Entity
@Table(name = "secciones")
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título de la sección es obligatorio")
    @Size(max = 255) // Esta línea ahora funcionará
    @Column(nullable = false)
    private String titulo;

    @NotNull(message = "El orden es obligatorio")
    @Column(nullable = false)
    private Integer orden;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;
}
