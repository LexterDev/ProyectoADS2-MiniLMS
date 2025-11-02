package com.minilms.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.minilms.api.entities.InscripcionProgreso;

@Repository
public interface InscripcionProgresoRepository extends JpaRepository<InscripcionProgreso, Long> {

    Optional<InscripcionProgreso> findByInscripcionIdAndLeccionId(Long inscripcionId, Long leccionId);

    /**
     * Cuenta las lecciones que ha completado un estudiante
     * para una inscripción por curso específica.
     */
    long countByInscripcionIdAndCompletadoTrue(Long inscripcionId);

}
