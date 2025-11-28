package com.minilms.api.repository;

import com.minilms.api.entities.Curso;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {

    /**
     * Encuentra todos los cursos creados por un instructor específico.
     * Útil para el dashboard del instructor.
     */
    List<Curso> findByInstructorId(Long instructorId);

    /**
     * CORREGIDO: Encuentra todos los cursos que tienen un estado particular,
     * buscando por el campo 'codigo' de la entidad Estado relacionada.
     * Esencial para que los moderadores vean los cursos pendientes de aprobación
     * (ej. "PEND").
     */
    List<Curso> findByEstadoCodigo(String codigo);

    @Query("""
                SELECT c FROM Curso c
                WHERE LOWER(c.titulo) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(c.descripcion) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Curso> findCoursesBySearch(@Param("search") String search, Pageable pageable);

    List<Curso> findByCategoriaId(Long categoryId);

    @Query("""
            Select c from Curso c
            left join c.secciones s
            left join s.lecciones l
            where c.id = :id
            """)
    Optional<Curso> findDetailsById(@Param("id") Long id);

    @Query("""
            SELECT i.curso
            FROM Inscripcion i
            WHERE
                i.estudiante.id = :usuario_id
                """)
    List<Curso> findCoursesByEstudiante(@Param("usuario_id") Long usuarioId);

    /**
     * Count courses by category ID
     */
    long countByCategoriaId(Long categoriaId);
}
