package com.minilms.api.entities; // Paquete corregido

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cursos")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 255)
    @Column(nullable = false)
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @PositiveOrZero(message = "El precio no puede ser negativo")
    @Column(nullable = false)
    private BigDecimal precio;

    @NotBlank(message = "El estado es obligatorio")
    @Column(nullable = false, length = 50)
    private String estado = "BORRADOR";

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @Column(name = "fecha_aprobacion")
    private LocalDateTime fechaAprobacion;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor; // CORREGIDO: Referencia a la clase User

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moderador_id")
    private User moderador; // CORREGIDO: Referencia a la clase User
}