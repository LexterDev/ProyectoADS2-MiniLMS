package com.minilms.api.repository;

import com.minilms.api.entities.Leccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeccionRepository extends JpaRepository<Leccion, Long> {

    /**
     * Encuentra todas las lecciones de una sección, ordenadas por el campo 'orden'.
     * Clave para mostrar el contenido de un módulo en el orden correcto.
     */
    List<Leccion> findBySeccionIdOrderByOrdenAsc(Long seccionId);

    @Query("""
            SELECT COUNT(l) FROM Leccion l WHERE l.seccion.curso.id = :cursoId
            """)
    Long countByCursoId(@Param("cursoId") Long cursoId);
}