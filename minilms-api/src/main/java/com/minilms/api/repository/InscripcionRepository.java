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
     * CORREGIDO: Busca una inscripción específica por el ID del estudiante y el ID del curso.
     * Spring Data JPA entiende que debe buscar por la propiedad 'usuarioId' de la entidad 'estudiante'.
     */
    Optional<Inscripcion> findByEstudianteIdAndCursoId(Long estudianteId, Long cursoId);

    /**
     * Encuentra todas las inscripciones de un estudiante.
     * Útil para la sección "Mis Cursos" del estudiante.
     */
    List<Inscripcion> findByEstudiante(User estudiante);
}