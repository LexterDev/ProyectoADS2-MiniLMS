package com.minilms.api.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.payment.PaymentDTO;
import com.minilms.api.dto.payment.PaymentMethodDTO;
import com.minilms.api.dto.payment.ProcessPaymentRequest;
import com.minilms.api.services.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "https://minilms-frontend.onrender.com", "https://minilms-front.onrender.com"})
@RequiredArgsConstructor
@Tag(name = "Pagos", description = "Endpoints para la gestión de pagos y procesamiento de compras")
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(
        summary = "Obtener métodos de pago disponibles",
        description = "Obtiene la lista de todos los métodos de pago aceptados en la plataforma."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Lista de métodos de pago obtenida exitosamente"
        )
    })
    @GetMapping("/methods")
    public ResponseEntity<ApiResponse<List<PaymentMethodDTO>>> getPaymentMethods() {
        List<PaymentMethodDTO> methods = paymentService.getPaymentMethods();
        return ResponseHandler.success(
            methods,
            "Métodos de pago obtenidos exitosamente",
            HttpStatus.OK
        );
    }

    @Operation(
        summary = "Procesar pago de curso",
        description = "Procesa el pago de un curso y crea la inscripción del estudiante. Este es un proceso simulado que no realiza transacciones reales.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "Pago procesado exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "400",
            description = "Datos de pago inválidos"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "402",
            description = "Pago rechazado"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409",
            description = "El estudiante ya está inscrito en el curso"
        )
    })
    @PostMapping("/process")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<PaymentDTO>> processPayment(
            @Valid @RequestBody ProcessPaymentRequest request) {
        PaymentDTO payment = paymentService.processPayment(request);
        return ResponseHandler.success(
            payment,
            "Pago procesado exitosamente. ¡Bienvenido al curso!",
            HttpStatus.CREATED
        );
    }

    @Operation(
        summary = "Obtener detalles de un pago",
        description = "Obtiene los detalles completos de un pago específico.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Detalles del pago obtenidos exitosamente"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Pago no encontrado"
        )
    })
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentById(
            @Parameter(description = "ID del pago") @PathVariable Long id) {
        PaymentDTO payment = paymentService.getPaymentById(id);
        return ResponseHandler.success(
            payment,
            "Pago obtenido exitosamente",
            HttpStatus.OK
        );
    }

    @Operation(
        summary = "Obtener pago por inscripción",
        description = "Obtiene el pago asociado a una inscripción específica.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/enrollment/{inscripcionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentByEnrollment(
            @Parameter(description = "ID de la inscripción") @PathVariable Long inscripcionId) {
        PaymentDTO payment = paymentService.getPaymentByEnrollment(inscripcionId);
        return ResponseHandler.success(
            payment,
            "Pago obtenido exitosamente",
            HttpStatus.OK
        );
    }

    @Operation(
        summary = "Obtener mis pagos",
        description = "Obtiene todos los pagos realizados por el estudiante autenticado.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/my-payments")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getMyPayments() {
        List<PaymentDTO> payments = paymentService.getStudentPayments();
        return ResponseHandler.success(
            payments,
            "Pagos obtenidos exitosamente",
            HttpStatus.OK
        );
    }
}
