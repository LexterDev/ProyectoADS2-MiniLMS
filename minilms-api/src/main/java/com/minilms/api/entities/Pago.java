package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pago_id")
    private Long id;

    @NotNull @Positive
    @Column(name = "monto_total", nullable = false, precision = 6, scale = 2)
    private BigDecimal montoTotal;

    @NotNull @PositiveOrZero
    @Column(name = "comision_plataforma", nullable = false, precision = 6, scale = 2)
    private BigDecimal comisionPlataforma;

    @NotNull @Positive
    @Column(name = "monto_instructor", nullable = false, precision = 6, scale = 2)
    private BigDecimal montoInstructor;

    @Column(name = "id_transaccion_pasarela")
    private String idTransaccionPasarela;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "forma_pago_id", nullable = false)
    private FormaPago formaPago;
    
    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inscripcion_id", nullable = false, unique = true)
    private Inscripcion inscripcion;
    
    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;
}

