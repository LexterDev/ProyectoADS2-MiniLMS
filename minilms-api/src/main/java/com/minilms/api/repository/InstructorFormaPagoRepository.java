package com.minilms.api.repository;

import com.minilms.api.entities.InstructorFormaPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstructorFormaPagoRepository extends JpaRepository<InstructorFormaPago, Long> {
    
    /**
     * Encuentra todas las formas de pago de un instructor específico.
     */
    List<InstructorFormaPago> findByInstructorUsuarioId(Long instructorId);
}
