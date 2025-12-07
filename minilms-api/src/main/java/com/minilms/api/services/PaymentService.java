package com.minilms.api.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.dto.payment.PaymentDTO;
import com.minilms.api.dto.payment.PaymentMethodDTO;
import com.minilms.api.dto.payment.ProcessPaymentRequest;
import com.minilms.api.entities.Curso;
import com.minilms.api.entities.Estado;
import com.minilms.api.entities.FormaPago;
import com.minilms.api.entities.Inscripcion;
import com.minilms.api.entities.Pago;
import com.minilms.api.entities.User;
import com.minilms.api.enums.EstadoEnum;
import com.minilms.api.mappers.PaymentMapper;
import com.minilms.api.repository.CursoRepository;
import com.minilms.api.repository.EstadoRepository;
import com.minilms.api.repository.FormaPagoRepository;
import com.minilms.api.repository.InscripcionRepository;
import com.minilms.api.repository.PagoRepository;
import com.minilms.api.utils.LmsUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService extends LmsUtils {

    private final PagoRepository pagoRepository;
    private final FormaPagoRepository formaPagoRepository;
    private final InscripcionRepository inscripcionRepository;
    private final CursoRepository cursoRepository;
    private final EstadoRepository estadoRepository;

    // Platform commission rate (15%)
    private static final BigDecimal COMMISSION_RATE = new BigDecimal("0.15");

    /**
     * Get all available payment methods
     */
    @Transactional(readOnly = true)
    public List<PaymentMethodDTO> getPaymentMethods() {
        return formaPagoRepository.findAll().stream()
                .map(PaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Process a payment for course enrollment (SIMULATED)
     * This simulates a real payment gateway without actual transactions
     */
    @Transactional
    public PaymentDTO processPayment(ProcessPaymentRequest request) {
        User student = getUserLoggedIn();

        // Validate course exists
        Curso curso = cursoRepository.findById(request.getCursoId())
                .orElseThrow(() -> new ApiException(
                        "No se encontró un curso con el id: " + request.getCursoId(),
                        HttpStatus.NOT_FOUND));

        // Validate payment method exists
        FormaPago formaPago = formaPagoRepository.findById(request.getFormaPagoId())
                .orElseThrow(() -> new ApiException(
                        "Forma de pago no válida: " + request.getFormaPagoId(),
                        HttpStatus.BAD_REQUEST));

        // Validate student is not already enrolled
        Optional<Inscripcion> existingEnrollment = inscripcionRepository
                .findByEstudianteIdAndCursoId(student.getId(), curso.getId());

        if (existingEnrollment.isPresent()) {
            throw new ApiException(
                    "Ya estás inscrito en este curso",
                    HttpStatus.CONFLICT);
        }

        // Validate amount matches course price
        if (curso.getPrecio().compareTo(request.getMontoTotal()) != 0) {
            throw new ApiException(
                    "El monto del pago no coincide con el precio del curso",
                    HttpStatus.BAD_REQUEST);
        }

        // Simulate payment validation
        validatePaymentDetails(request);

        // Calculate commission and instructor amount
        BigDecimal commission = request.getMontoTotal()
                .multiply(COMMISSION_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal instructorAmount = request.getMontoTotal()
                .subtract(commission)
                .setScale(2, RoundingMode.HALF_UP);

        // Create enrollment first
        Inscripcion inscripcion = createEnrollment(student, curso);

        // Create payment record
        Pago pago = new Pago();
        pago.setMontoTotal(request.getMontoTotal());
        pago.setComisionPlataforma(commission);
        pago.setMontoInstructor(instructorAmount);
        pago.setFormaPago(formaPago);
        pago.setInscripcion(inscripcion);

        // Simulate payment gateway transaction ID
        pago.setIdTransaccionPasarela(generateTransactionId());

        // Set payment status as completed (simulated success)
        Estado estadoCompletado = estadoRepository.findByCodigo("COMPLETADO")
                .orElseGet(() -> estadoRepository.findByCodigo(EstadoEnum.ACTIVO.getCodigo())
                        .orElseThrow(() -> new ApiException(
                                "Estado no encontrado",
                                HttpStatus.INTERNAL_SERVER_ERROR)));

        pago.setEstado(estadoCompletado);

        Pago savedPago = pagoRepository.save(pago);

        return PaymentMapper.toDTO(savedPago);
    }

    /**
     * Get payment details by enrollment ID
     */
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentByEnrollment(Long inscripcionId) {
        Pago pago = pagoRepository.findByInscripcionId(inscripcionId)
                .orElseThrow(() -> new ApiException(
                        "No se encontró un pago para esta inscripción",
                        HttpStatus.NOT_FOUND));

        return PaymentMapper.toDTO(pago);
    }

    /**
     * Get all payments for the logged-in student
     */
    @Transactional(readOnly = true)
    public List<PaymentDTO> getStudentPayments() {
        User student = getUserLoggedIn();
        List<Inscripcion> enrollments = inscripcionRepository.findByEstudiante(student);

        return enrollments.stream()
                .map(inscripcion -> pagoRepository.findByInscripcionId(inscripcion.getId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .map(PaymentMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get payment by ID
     */
    @Transactional(readOnly = true)
    public PaymentDTO getPaymentById(Long id) {
        Pago pago = pagoRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        "No se encontró el pago con id: " + id,
                        HttpStatus.NOT_FOUND));

        return PaymentMapper.toDTO(pago);
    }

    /**
     * Create enrollment after successful payment
     */
    private Inscripcion createEnrollment(User student, Curso curso) {
        Inscripcion inscripcion = new Inscripcion();
        inscripcion.setEstudiante(student);
        inscripcion.setCurso(curso);
        inscripcion.setProgreso(0);
        inscripcion.setCompletado(false);

        // Set enrollment status
        Estado estadoInscrito = estadoRepository.findByCodigo(EstadoEnum.INSCRITO.getCodigo())
                .orElseThrow(() -> new ApiException(
                        "Estado INSCRITO no encontrado",
                        HttpStatus.INTERNAL_SERVER_ERROR));

        inscripcion.setEstado(estadoInscrito);

        return inscripcionRepository.save(inscripcion);
    }

    /**
     * Simulate payment gateway validation
     * In a real system, this would call the actual payment gateway API
     */
    private void validatePaymentDetails(ProcessPaymentRequest request) {
        // Simulate basic validation
        if ("TARJETA".equals(request.getFormaPagoId())) {
            if (request.getCardNumber() == null || request.getCardNumber().length() < 13) {
                throw new ApiException(
                        "Número de tarjeta inválido",
                        HttpStatus.BAD_REQUEST);
            }
            if (request.getCvv() == null || request.getCvv().length() != 3) {
                throw new ApiException(
                        "CVV inválido",
                        HttpStatus.BAD_REQUEST);
            }
            // Simulate payment failure for testing (card number ending in 0000)
            if (request.getCardNumber().endsWith("0000")) {
                throw new ApiException(
                        "Pago rechazado. Por favor, intente con otra tarjeta",
                        HttpStatus.PAYMENT_REQUIRED);
            }
        }

        // Simulate random payment processing delay (0-2 seconds)
        try {
            Thread.sleep((long) (Math.random() * 2000));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Generate a simulated transaction ID
     */
    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 18).toUpperCase();
    }
}
