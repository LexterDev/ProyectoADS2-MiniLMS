package com.minilms.api.repository;

import com.minilms.api.entities.Seccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeccionRepository extends JpaRepository<Seccion, Long> {

    /**
     * Encuentra todas las secciones de un curso, ordenadas por el campo 'orden'.
     * Clave para mostrar el temario del curso en el orden correcto.
     */
    List<Seccion> findByCursoIdOrderByOrdenAsc(Long cursoId);
}