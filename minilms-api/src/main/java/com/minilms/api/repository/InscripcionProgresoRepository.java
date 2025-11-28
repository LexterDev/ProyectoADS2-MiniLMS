package com.minilms.api.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    /**
     * Suma el tiempo total dedicado en todas las lecciones de una inscripción.
     */
    @Query("SELECT COALESCE(SUM(ip.tiempoDedicado), 0) FROM InscripcionProgreso ip WHERE ip.inscripcion.id = :inscripcionId")
    Optional<Long> sumTiempoDedicadoByInscripcionId(@Param("inscripcionId") Long inscripcionId);

}
