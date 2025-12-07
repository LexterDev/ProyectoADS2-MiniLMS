package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "descuentos")
public class Descuento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "descuento_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id", referencedColumnName = "curso_id", nullable = false)
    private Curso curso;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String nombre;

    @Size(max = 500)
    @Column(length = 500)
    private String descripcion;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("100.0")
    @Column(name = "porcentaje_descuento", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeDescuento;

    @Column(name = "codigo_promocional", unique = true, length = 50)
    private String codigoPromocional;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "usos_maximos")
    private Integer usosMaximos;

    @Column(name = "usos_actuales", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer usosActuales = 0;

    @Column(name = "activo", nullable = false, columnDefinition = "SMALLINT DEFAULT 1")
    private Short activo = 1;

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    public boolean isValid() {
        if (activo == 0) return false;

        LocalDateTime now = LocalDateTime.now();
        if (fechaInicio != null && now.isBefore(fechaInicio)) return false;
        if (fechaFin != null && now.isAfter(fechaFin)) return false;

        if (usosMaximos != null && usosActuales >= usosMaximos) return false;

        return true;
    }

    public BigDecimal calcularPrecioConDescuento(BigDecimal precioOriginal) {
        BigDecimal descuento = precioOriginal.multiply(porcentajeDescuento).divide(BigDecimal.valueOf(100));
        return precioOriginal.subtract(descuento);
    }
}
