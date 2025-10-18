package com.minilms.api.repository;

import com.minilms.api.entities.LeccionRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeccionRecursoRepository extends JpaRepository<LeccionRecurso, Long> {
    List<LeccionRecurso> findByLeccionId(Long leccionId);
}
