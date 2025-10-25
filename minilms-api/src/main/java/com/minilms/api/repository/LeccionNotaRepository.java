package com.minilms.api.repository;

import com.minilms.api.entities.LeccionNota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeccionNotaRepository extends JpaRepository<LeccionNota, Long> {
    List<LeccionNota> findByUsuarioUsuarioIdAndLeccionId(Long usuarioId, Long leccionId);
}
