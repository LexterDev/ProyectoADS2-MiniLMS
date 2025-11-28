package com.minilms.api.repository;

import com.minilms.api.entities.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    /**
     * Encuentra todas las reseñas asociadas a un curso específico.
     * Para mostrar las calificaciones y comentarios en la página del curso.
     */
    List<Resena> findByCursoId(Long cursoId);

    /**
     * Encuentra todas las reseñas de un usuario específico.
     */
    List<Resena> findByUsuarioId(Long usuarioId);

    /**
     * Encuentra una reseña específica de un usuario para un curso.
     * Útil para verificar si un usuario ya ha dejado una reseña.
     */
    Optional<Resena> findByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);

    /**
     * Calcula el promedio de calificaciones para un curso.
     */
    @Query("SELECT AVG(r.calificacion) FROM Resena r WHERE r.curso.id = :cursoId")
    Double findAverageRatingByCursoId(@Param("cursoId") Long cursoId);

    /**
     * Cuenta el número total de reseñas para un curso.
     */
    Long countByCursoId(Long cursoId);

    /**
     * Verifica si un usuario ya ha dejado una reseña para un curso.
     */
    boolean existsByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);
}