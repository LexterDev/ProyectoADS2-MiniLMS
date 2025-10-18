package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cursos_lecciones")
public class Leccion {

    public enum TipoLeccion { LECTURA, VIDEO, INTRODUCCION }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leccion_id")
    private Long id;

    @NotBlank @Size(max = 255)
    @Column(nullable = false)
    private String titulo;

    private String url;

    @NotNull @PositiveOrZero
    @Column(nullable = false)
    private Integer orden;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TipoLeccion tipo = TipoLeccion.VIDEO;

    @Column(nullable = false)
    private boolean visible = true;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", nullable = false)
    private Seccion seccion;
    
    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;
}

