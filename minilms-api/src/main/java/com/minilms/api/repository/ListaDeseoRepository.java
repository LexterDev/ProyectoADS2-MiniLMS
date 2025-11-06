package com.minilms.api.repository;

import com.minilms.api.entities.ListaDeseo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListaDeseoRepository extends JpaRepository<ListaDeseo, Long> {
    List<ListaDeseo> findByUsuarioId(Long usuarioId);
    boolean existsByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);
}
