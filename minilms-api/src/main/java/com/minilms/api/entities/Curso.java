package com.minilms.api.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cursos", indexes = {
        @Index(name = "curso_idx_estado", columnList = "estado_id"),
        @Index(name = "curso_idx_instructor", columnList = "instructor_id"),
        @Index(name = "curso_idx_categoria", columnList = "categoria_id")
})
@SQLRestriction("eliminado = 0")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "curso_id")
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String titulo;

    @NotBlank
    @Size(max = 900)
    @Column(nullable = false, length = 900)
    private String descripcion;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal precio;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_id", referencedColumnName = "codigo", nullable = false, foreignKey = @ForeignKey(name = "cursos_fk_estado_id"))
    private Estado estado;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id", referencedColumnName = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "cursos_fk_instructor_id"))
    private User instructor;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", referencedColumnName = "categoria_id", nullable = false, foreignKey = @ForeignKey(name = "cursos_fk_categoria_id"))
    private Categoria categoria;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "eliminado", nullable = false, columnDefinition = "SMALLINT DEFAULT 0")
    private Short eliminado =0;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adjunto_id", referencedColumnName = "adjunto_id", foreignKey = @ForeignKey(name = "cursos_fk_adjunto_id"))
    private Adjunto adjunto;

    @OneToMany(mappedBy = "curso", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Seccion> secciones;
}
