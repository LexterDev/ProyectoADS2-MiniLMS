package com.minilms.api.repository;

import com.minilms.api.entities.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    /**
     * CORREGIDO: Encuentra todos los comentarios de una lección, buscando por el ID de la entidad Leccion.
     * Ordena los resultados por el campo 'creadoEn'.
     */
    List<Comentario> findByLeccionIdOrderByCreadoEnDesc(Long leccionId);
}

