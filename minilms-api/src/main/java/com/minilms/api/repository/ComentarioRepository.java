package com.minilms.api.repository;

import com.minilms.api.entities.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {

    /**
     * Encuentra todos los comentarios de una lección, mostrando los más nuevos primero.
     * Ideal para cargar el foro o la sección de preguntas de una lección.
     */
    List<Comentario> findByLeccionIdOrderByFechaCreacionDesc(Long leccionId);
}