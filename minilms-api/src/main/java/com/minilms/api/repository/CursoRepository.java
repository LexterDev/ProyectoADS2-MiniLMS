package com.minilms.api.repository;

import com.minilms.api.entities.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {

    /**
     * Encuentra todos los cursos creados por un instructor específico.
     * Útil para el dashboard del instructor.
     */
    List<Curso> findByInstructorId(Long instructorId);

    /**
     * Encuentra todos los cursos que tienen un estado particular.
     * Esencial para que los moderadores vean los cursos pendientes de aprobación.
     */
    List<Curso> findByEstado(String estado);
}