package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.minilms.api.enums.LeccionTipoEnum;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cursos_lecciones", uniqueConstraints = {
        @UniqueConstraint(name = "leccion_uk_seccion_orden", columnNames = { "seccion_id", "orden" })
})
public class Leccion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leccion_id")
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String titulo;

    @Size(max = 500)
    @Column(name ="url", length = 500, nullable = true)
    private String url;

    @Size(max = 20000)
    @Column(nullable = true, name = "contenido", columnDefinition = "TEXT")
    private String contenido;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false, name = "orden")
    private Integer orden;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LeccionTipoEnum tipo = LeccionTipoEnum.VIDEO;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private boolean visible = true;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seccion_id", referencedColumnName = "seccion_id", nullable = false, foreignKey = @ForeignKey(name = "cursos_fk_leccion_id"))
    private Seccion seccion;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;
}
