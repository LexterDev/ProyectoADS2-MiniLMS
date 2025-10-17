
package com.minilms.api.entities; // Paquete corregido

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "comentarios")
public class Comentario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario; // CORREGIDO: Referencia a la clase User

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leccion_id", nullable = false)
    private Leccion leccion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comentario parent;
}