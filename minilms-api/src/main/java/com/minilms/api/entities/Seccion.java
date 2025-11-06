package com.minilms.api.entities;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cursos_secciones", uniqueConstraints = {
        @UniqueConstraint(name = "seccion_uk_curso_orden", columnNames = { "curso_id", "orden" })
})
public class Seccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seccion_id")
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String titulo;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Integer orden;

    @Column(name = "duracion_estimada")
    private Integer duracionEstimada;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private boolean visible = true;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", referencedColumnName = "curso_id", nullable = false, foreignKey = @ForeignKey(name = "cursos_fk_seccion_id"))
    private Curso curso;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @OneToMany(mappedBy = "seccion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Leccion> lecciones;
}
