package com.minilms.api.repository;

import com.minilms.api.entities.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    
    /**
     * Busca un pago a través de su inscripción asociada.
     * Útil para obtener detalles de la transacción de una compra específica.
     */
    Optional<Pago> findByInscripcionId(Long inscripcionId);
}