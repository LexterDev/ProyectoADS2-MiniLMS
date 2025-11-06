package com.minilms.api.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "inscripciones")
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inscripcion_id")
    private Long id;

    @NotNull
    @Min(0)
    @Max(100)
    @Column(name = "progreso", nullable = false)
    private Integer progreso = 0;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_id", referencedColumnName = "codigo", nullable = false, foreignKey = @ForeignKey(name = "inscripciones_fk_estado_id"))
    private Estado estado;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", referencedColumnName = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "inscripciones_fk_estudiante_id"))
    private User estudiante;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", referencedColumnName = "curso_id", nullable = false, foreignKey = @ForeignKey(name = "inscripciones_fk_curso_id"))
    private Curso curso;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    @Column(name = "fecha_inicio_curso", nullable = true)
    private LocalDateTime fechaInicioCurso;

    @Column(name = "fecha_fin_curso", nullable = true)
    private LocalDateTime fechaFinCurso;

    @Column(name = "completado", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private boolean completado = false;

    @OneToMany(mappedBy = "inscripcion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InscripcionProgreso> progresosLeccion = new ArrayList<>();
}
