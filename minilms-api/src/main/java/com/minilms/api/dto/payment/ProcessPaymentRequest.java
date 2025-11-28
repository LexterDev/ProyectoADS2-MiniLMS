package com.minilms.api.dto.payment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProcessPaymentRequest {

    @NotNull(message = "El ID del curso es requerido")
    private Long cursoId;

    @NotNull(message = "La forma de pago es requerida")
    private String formaPagoId;

    @NotNull(message = "El monto total es requerido")
    private BigDecimal montoTotal;

    // Simulated payment card info (not stored, just for validation)
    private String cardNumber;
    private String cardHolderName;
    private String expiryDate;
    private String cvv;
}
