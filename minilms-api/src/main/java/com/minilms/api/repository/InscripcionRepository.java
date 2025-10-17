package com.minilms.api.repository;

import com.minilms.api.entities.Inscripcion;
import com.minilms.api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {

    /**
     * Busca una inscripción específica por estudiante y curso.
     * Sirve para saber si un usuario ya compró un curso.
     */
    Optional<Inscripcion> findByEstudianteIdAndCursoId(Long estudianteId, Long cursoId);

    /**
     * Encuentra todas las inscripciones de un estudiante.
     * Útil para la sección "Mis Cursos" del estudiante.
     */
    List<Inscripcion> findByEstudiante(User estudiante);
}