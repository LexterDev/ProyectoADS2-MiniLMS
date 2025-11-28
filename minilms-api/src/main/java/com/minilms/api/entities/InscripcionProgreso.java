package com.minilms.api.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "inscripciones_progreso", uniqueConstraints = {
        @UniqueConstraint(name = "inscripciones_progeso_uk_leccion", columnNames = { "inscripcion_id", "leccion_id" })
})
public class InscripcionProgreso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "progreso_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inscripcion_id", referencedColumnName = "inscripcion_id", nullable = false, foreignKey = @ForeignKey(name = "inscripciones_progeso_fk_inscripcion_id"))
    private Inscripcion inscripcion;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leccion_id", referencedColumnName = "leccion_id", nullable = false, foreignKey = @ForeignKey(name = "inscripciones_progeso_fk_leccion_id"))
    private Leccion leccion;

    @Column(name = "completado", nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private boolean completado = false;

    @Column(name = "fecha_completado")
    private LocalDateTime fechaCompletado;

    @Column(name = "nota_evaluacion", precision = 5, scale = 2)
    private BigDecimal notaEvaluacion;

    @Column(name = "tiempo_dedicado", columnDefinition = "BIGINT DEFAULT 0")
    private Long tiempoDedicado = 0L; // Tiempo en segundos

    @Column(name = "ultima_actualizacion")
    private LocalDateTime ultimaActualizacion;

}
