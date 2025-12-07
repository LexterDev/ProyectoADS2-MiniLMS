package com.minilms.api.dto.payment;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PaymentDTO {

    private Long id;

    @NotNull(message = "El monto total es requerido")
    @Positive(message = "El monto total debe ser positivo")
    private BigDecimal montoTotal;

    private BigDecimal comisionPlataforma;
    private BigDecimal montoInstructor;

    private String idTransaccionPasarela;

    @NotNull(message = "El ID de la forma de pago es requerido")
    private String formaPagoId;
    private String formaPagoNombre;

    private String estadoCodigo;
    private String estadoNombre;

    @NotNull(message = "El ID de la inscripción es requerido")
    private Long inscripcionId;

    private Long cursoId;
    private String cursoTitulo;
    private Long estudianteId;
    private String estudianteNombre;

    private String creadoEn;
    private String actualizadoEn;
}
