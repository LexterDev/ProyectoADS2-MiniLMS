package com.minilms.api.repository;

import com.minilms.api.entities.Resena;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    /**
     * Encuentra todas las reseñas asociadas a un curso específico.
     * Para mostrar las calificaciones y comentarios en la página del curso.
     */
    List<Resena> findByCursoId(Long cursoId);
}