package com.minilms.api.repository;

import com.minilms.api.entities.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    /**
     * Busca las notificaciones de un usuario, mostrando las más nuevas primero.
     */
    List<Notificacion> findByUsuarioIdOrderByCreadoEnDesc(Long usuarioId);
}
