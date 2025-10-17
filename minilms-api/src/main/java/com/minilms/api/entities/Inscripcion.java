package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min; // ✅ IMPORTS AÑADIDOS
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreationTimestamp
    @Column(name = "fecha_inscripcion", nullable = false, updatable = false)
    private LocalDateTime fechaInscripcion;

    @NotNull
    @Min(0)
    @Max(100)
    @Column(nullable = false)
    private Integer progreso = 0;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private User estudiante;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;
}
