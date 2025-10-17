package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "pagos")
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Positive
    @Column(name = "monto_total", nullable = false)
    private BigDecimal montoTotal;

    @NotNull
    @Positive
    @Column(name = "comision_plataforma", nullable = false)
    private BigDecimal comisionPlataforma;

    @NotNull
    @Positive
    @Column(name = "monto_instructor", nullable = false)
    private BigDecimal montoInstructor;

    @Column(name = "id_transaccion_pasarela")
    private String idTransaccionPasarela;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String estado;
    
    @CreationTimestamp
    @Column(name = "fecha_pago", updatable = false)
    private LocalDateTime fechaPago;

    @NotNull
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inscripcion_id", nullable = false, unique = true)
    private Inscripcion inscripcion;
}