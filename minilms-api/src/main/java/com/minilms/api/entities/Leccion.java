package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size; // ✅ IMPORT AÑADIDO
import lombok.Data;

@Data
@Entity
@Table(name = "lecciones")
public class Leccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título de la lección es obligatorio")
    @Size(max = 255)
    @Column(nullable = false)
    private String titulo;

    @Column(name = "url_contenido")
    private String urlContenido;

    @NotNull(message = "El orden es obligatorio")
    @Column(nullable = false)
    private Integer orden;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    private Seccion seccion;
}
