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
@Table(name = "resenas")
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer calificacion;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private User estudiante;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;
}
