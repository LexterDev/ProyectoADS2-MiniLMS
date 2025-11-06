package com.minilms.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.minilms.api.entities.LeccionNota;

@Repository
public interface LeccionNotaRepository extends JpaRepository<LeccionNota, Long> {
    List<LeccionNota> findByUsuarioIdAndLeccionId(Long usuarioId, Long leccionId);
}
