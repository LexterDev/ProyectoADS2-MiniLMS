package com.minilms.api.repository;

import com.minilms.api.entities.CursoRevision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CursoRevisionRepository extends JpaRepository<CursoRevision, Long> {

    /**
     * Encuentra todas las revisiones para un curso específico.
     * Útil para ver el historial de moderación de un curso.
     * @param cursoId El ID del curso a buscar.
     * @return Una lista de revisiones.
     */
    List<CursoRevision> findByCursoId(Long cursoId);
}
