package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cursos_secciones")
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seccion_id")
    private Long id;

    @NotBlank @Size(max = 255)
    @Column(nullable = false)
    private String titulo;

    @NotNull @PositiveOrZero
    @Column(nullable = false)
    private Integer orden;
    
    @Column(name = "duracion_estimada")
    private Integer duracionEstimada; // En minutos

    @Column(nullable = false)
    private boolean visible = true;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", nullable = false)
    private Curso curso;
    
    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;
}

